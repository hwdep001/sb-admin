import { Router } from '@angular/router';
import { Subject } from './../../model/Subject';
import { Category } from './../../model/Category';
import { CommonUtil } from './../../utils/commonUtil';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
    selector: 'app-cat-mng',
    templateUrl: './cat-mng.component.html',
    styleUrls: ['./cat-mng.component.scss']
})
export class CatMngComponent implements OnInit {

    dirRef: firebase.database.Reference;
    pathRef: firebase.database.Reference;

    subs: Array<Subject>;
    cats: Array<Category>;
    cats_: Array<Category>;
    cats_trash: Array<Category>;

    selectedSub: string;

    isEdit: boolean = false;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.dirRef = firebase.database().ref("word/dir");
        this.pathRef = firebase.database().ref("word/path");
        this.getSubList();
    }

    getSubList() {
        let subs = new Array<Subject>();
        this.dirRef.child("subs").once('value', snapshot => {
            snapshot.forEach(subSnap => {
                subs.push(subSnap.val());
                return false;
            }); 

            if(subs.length > 0) {
                this.selectedSub = subs[0].key;
                this.getCatList();
            }
            this.subs = subs;
        });
    }

    getCatList() {
        let cats = new Array<Category>();
        this.dirRef.child(`cats/${this.selectedSub}`).orderByChild('num')
        .once('value', snapshot => {
            snapshot.forEach(catSnap => {
                cats.push(catSnap.val());
                return false;
            });

            this.cats = cats;
        });
    }

    addCat(newCatName: string) {
        if(newCatName.isEmpty()) {
            return;
        }
        
        this.dirRef.child(`cats/${this.selectedSub}`).orderByChild("name").equalTo(newCatName).once('value', snapshot => {
            if(snapshot.exists()) {
                alert("중복");
            } else {
                const newRef = this.dirRef.child(`cats/${this.selectedSub}`).push();
                newRef.set(new Category({
                    key: newRef.key,
                    name: newCatName,
                    num: this.cats.length+1
                })).then( () => {
                    this.getCatList();
                });
            }
        })
    }

    selectCat(cat: Category) {
        this.router.navigate(['lec-mng'], {queryParams: {
            subKey: this.selectedSub,
            catKey: cat.key
        }});
    }

    //////////////////////////////////////////////////////////////

    startEdit() {
        this.isEdit = true;
        this.cats_trash = [];
        this.cats_ = this.cats.map(x => Object.assign({}, x));
    }

    cancelEdit() {
        this.isEdit = false;
        this.cats_trash = [];
    }

    /////////////////////////////////////////////////////////////////

    trashCat(index: number, cat: Category) {
        this.cats_.splice(index, 1);
        this.cats_trash.push(cat);
    }  

    saveCat() {
        let i: number = 1;
        let promises: Array<Promise<any>> = [];

        for(let cat_ of this.cats_) {
            let flag = 0; // 0: 변경X, 1: num만 변경, 2: name만 변경, 3: 둘 다 변경
            cat_.num = i;
            for(let cat of this.cats) {
                if(cat.key == cat_.key) {
                    if(cat.name != cat_.name && cat.num != cat_.num) {
                        promises.push(this.updateCat(cat_, true));
                    } else if(cat.name != cat_.name) {
                        promises.push(this.updateCat(cat_, false));
                    } else if(cat.num != cat_.num) {
                        promises.push(this.dirRef.child(`cats/${this.selectedSub}/${cat_.key}`).update({
                            num: cat_.num
                        }));
                    }
                    break;
                }
            }
            i++;
        }

        for(let cat of this.cats_trash) {
            promises.push(this.removeCat(cat.key));
        }

        Promise.all(promises).then( () => {
            this.getCatList();
            this.isEdit = false;
        });
    }

    updateCat(cat: Category, isNumChange: boolean): Promise<any> {
        let promises: Array<Promise<any>> = Array<Promise<any>>();
        let updateData: CustomObject = {
            name: cat.name
        }
        if(isNumChange) {
            updateData.num = cat.num;
        }
        this.dirRef.child(`cats/${this.selectedSub}/${cat.key}`).update(updateData)
        .then( () => {
            this.dirRef.child(`words/${this.selectedSub}/${cat.key}`).once('value', snapshot => {
                snapshot.forEach(lecSnap => {
                    lecSnap.ref.once('value', subSnapshot => {
                        subSnapshot.forEach(wordSnap => {
                            promises.push(wordSnap.ref.update({
                                catName: cat.name
                            }));
                            return false;
                        })
                    });
                    return false;
                })
            });
        });

        return Promise.all(promises).then();
    }

    removeCat(catKey: string): Promise<any> {
        return this.pathRef.child(`${this.selectedSub}/${catKey}`).remove()
        .then( () => {
            console.log(catKey + ": remove pathRef suc");
            this.dirRef.child(`words/${this.selectedSub}/${catKey}`).remove()
            .then( () => {
                console.log(catKey + ": remove dirRef-words suc");
                this.dirRef.child(`lecs/${this.selectedSub}/${catKey}`).remove()
                .then( () => {
                    console.log(catKey + ": remove dirRef-lecs suc");
                    this.dirRef.child(`cats/${this.selectedSub}/${catKey}`).remove()
                    .then( () => {
                        console.log(catKey + ": remove dirRef-cats suc");
                        this.getCatList();
                    });
                });
            });
        });
    }
}
