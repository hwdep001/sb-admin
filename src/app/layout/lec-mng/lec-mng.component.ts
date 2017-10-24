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

    removeLec(lecKey: string) {
        this.pathRef.child(`${this.subKey}/${this.cat.key}/${lecKey}`).remove()
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

    selectLec(lec: Lecture) {
        this.router.navigate(['word-mng'], {queryParams: {
            subKey: this.subKey,
            catKey: this.cat.key,
            lecKey: lec.key
        }});
    }
}
