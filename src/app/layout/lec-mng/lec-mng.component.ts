import { Category } from './../../model/Category';
import { Lecture } from './../../model/Lecture';
import { CommonUtil } from './../../utils/commonUtil';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
    selector: 'app-lec-mng',
    templateUrl: './lec-mng.component.html',
    styleUrls: ['./lec-mng.component.scss']
})
export class LecMngComponent implements OnInit {

    dirRef: firebase.database.Reference;
    pathRef: firebase.database.Reference;

    subKey: string;
    cat: Category = new Category();
    lecs: Array<Lecture>;
    lecs_: Array<Lecture>;
    lecs_trash: Array<Lecture>;

    isEdit: boolean = false;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.dirRef = firebase.database().ref("word/dir");
        this.pathRef = firebase.database().ref("word/path");

        this.subKey = this.activatedRoute.snapshot.queryParams['subKey'];
        const catKey = this.activatedRoute.snapshot.queryParams['catKey'];

        this.getCat(catKey).then( () => {
            this.getLecList();
        });
    }

    ngOnDestroy() {}

    getCat(catKey: string): Promise<any> {
        const ref = this.dirRef.child(`cats/${this.subKey}/${catKey}`).once('value', snapshot => {
            this.cat = snapshot.val();
        });
        return ref;
    }

    getLecList() {
        let lecs = new Array<Lecture>();
        this.dirRef.child(`lecs/${this.subKey}/${this.cat.key}`)
        .orderByChild('num').once('value', snapshot => {
            snapshot.forEach(subSnap => {
                lecs.push(subSnap.val());
                return false;
            });

            this.lecs = lecs;
        });
    }

    addLec(newLecName: string) {
        if(newLecName.isEmpty()) {
            return;
        }
        
        const newRef = this.dirRef.child(`lecs/${this.subKey}/${this.cat.key}`);
        this.dirRef.child(`lecs/${this.subKey}/${this.cat.key}`)
        .orderByChild("name").equalTo(newLecName).once('value', snapshot => {
            if(snapshot.exists()) {
                alert("중복");
            } else {
                const newRef = this.dirRef.child(`lecs/${this.subKey}/${this.cat.key}`).push();
                newRef.set(new Lecture({
                    key: newRef.key,
                    name: newLecName,
                    num: this.lecs.length+1
                })).then( () => {
                    this.getLecList();
                });
            }
        });
    }

    selectLec(lec: Lecture) {
        this.router.navigate(['word-mng'], {queryParams: {
            subKey: this.subKey,
            catKey: this.cat.key,
            lecKey: lec.key
        }});
    }

    //////////////////////////////////////////////////////////////

    startEdit() {
        this.isEdit = true;
        this.lecs_trash = [];
        this.lecs_ = this.lecs.map(x => Object.assign({}, x));
    }

    cancelEdit() {
        this.isEdit = false;
        this.lecs_trash = [];
    }

    /////////////////////////////////////////////////////////////////

    trashLec(index: number, lec: Lecture) {
        this.lecs_.splice(index, 1);
        this.lecs_trash.push(lec);
    }  

    saveLec() {
        let i: number = 1;
        let promises: Array<Promise<any>> = [];

        for(let lec_ of this.lecs_) {
            let flag = 0; // 0: 변경X, 1: num만 변경, 2: name만 변경, 3: 둘 다 변경
            lec_.num = i;
            for(let lec of this.lecs) {
                if(lec.key == lec_.key) {
                    if(lec.name != lec_.name && lec.num != lec_.num) {
                        promises.push(this.updateCat(lec_, true));
                    } else if(lec.name != lec_.name) {
                        promises.push(this.updateCat(lec_, false));
                    } else if(lec.num != lec_.num) {
                        promises.push(this.dirRef.child(`lecs/${this.subKey}/${this.cat.key}/${lec_.key}`).update({
                            num: lec_.num
                        }));
                    }
                    break;
                }
            }
            i++;
        }

        for(let lec of this.lecs_trash) {
            promises.push(this.removeLec(lec.key));
        }

        Promise.all(promises).then( () => {
            this.getLecList();
            this.isEdit = false;
        });
    }

    updateCat(lec: Lecture, isNumChange: boolean): Promise<any> {
        let promises: Array<Promise<any>> = Array<Promise<any>>();
        let updateData: CustomObject = {
            name: lec.name
        }
        if(isNumChange) {
            updateData.num = lec.num;
        }
        this.dirRef.child(`lecs/${this.subKey}/${this.cat.key}/${lec.key}`).update(updateData)
        .then( () => {
            this.dirRef.child(`words/${this.subKey}/${this.cat.key}/${lec.key}`).once('value', snapshot => {
                snapshot.forEach(wordSnap => {
                    promises.push(wordSnap.ref.update({
                        lecName: lec.name
                    }));
                    return false;
                })
            });
        });

        return Promise.all(promises).then();
    }

    removeLec(lecKey: string): Promise<any> {
        return this.pathRef.child(`${this.subKey}/${this.cat.key}/${lecKey}`).remove()
        .then( () => {
            console.log(lecKey + ": remove pathRef suc");
            this.dirRef.child(`words/${this.subKey}/${this.cat.key}/${lecKey}`).remove()
            .then( () => {
                console.log(lecKey + ": remove dirRef-words suc");
                this.dirRef.child(`lecs/${this.subKey}/${this.cat.key}/${lecKey}`).remove()
                .then( () => {
                    console.log(lecKey + ": remove dirRef-lecs suc");
                    this.getLecList();
                });
            });
        });
    }
}
