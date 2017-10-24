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

    selectedSub: string;

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
        this.dirRef.child(`cats/${this.selectedSub}`).once('value', snapshot => {
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

    removeCat(catKey: string) {
        this.pathRef.child(`${this.selectedSub}/${catKey}`).remove()
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

    selectCat(cat: Category) {
        this.router.navigate(['lec-mng'], {queryParams: {
            subKey: this.selectedSub,
            catKey: cat.key
        }});
    }
}
