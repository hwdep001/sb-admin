import { Word } from './../../model/Word';
import { Category } from './../../model/Category';
import { Lecture } from './../../model/Lecture';
import { CommonUtil } from './../../utils/commonUtil';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';

@Component({
    selector: 'app-word-mng',
    templateUrl: './word-mng.component.html',
    styleUrls: ['./word-mng.component.scss']
})
export class WordMngComponent implements OnInit {

    dirRef: firebase.database.Reference;
    pathRef: firebase.database.Reference;

    subKey: string;
    cat: Category = new Category();
    lec: Lecture = new Lecture();
    words: Array<Word>;

    constructor(private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.dirRef = firebase.database().ref("word/dir");
        this.pathRef = firebase.database().ref("word/path");

        this.subKey = this.activatedRoute.snapshot.queryParams['subKey'];
        const catKey = this.activatedRoute.snapshot.queryParams['catKey'];
        const lecKey = this.activatedRoute.snapshot.queryParams['lecKey'];

        this.getCat(catKey);
        this.getLec(catKey, lecKey).then( () => {
            this.getWordList();
        });
    }

    ngOnDestroy() {}

    getCat(catKey: string): Promise<any> {
        const ref = this.dirRef.child(`cats/${this.subKey}/${catKey}`).once('value', snapshot => {
            this.cat = snapshot.val();
        });
        return ref;
    }

    getLec(catKey: string, lecKey: string): Promise<any> {
        const ref = this.dirRef.child(`lecs/${this.subKey}/${catKey}/${lecKey}`).once('value', snapshot => {
            this.lec = snapshot.val();
        });
        return ref;
    }

    getWordList() {
        let words = new Array<Word>();
        this.dirRef.child(`words/${this.subKey}/${this.cat.key}/${this.lec.key}`)
        .orderByChild('num').once('value', snapshot => {
            snapshot.forEach(subSnap => {
                words.push(subSnap.val());
                return false;
            }); 

            this.words = words;
        });
    }

    removeWord(wordKey: string) {
        this.pathRef.child(`${this.subKey}/${this.cat.key}/${this.lec.key}/${wordKey}`).remove()
        .then( () => {
            console.log(wordKey + ": remove pathRef suc");
            this.dirRef.child(`words/${this.subKey}/${this.cat.key}/${this.lec.key}/${wordKey}`).remove()
            .then( () => {
                console.log(wordKey + ": remove dirRef-words suc");
            });
        });
    }

}
