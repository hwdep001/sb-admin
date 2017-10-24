import { FileService } from './../../provider/file.service';
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

    fileName: string = null;
    words: Array<Word> = [];
    words_: Array<Word> = [];
    words_trash: Array<Word> = [];

    isEdit: boolean = false;


    items = [1, 2, 3, 4, 5];

    constructor(private activatedRoute: ActivatedRoute, private _file: FileService) {
        // this.items.valueChanges.subscribe(() => {
        //     this.postChangesToServer(this.items.value);
        //   });
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

    ////////////////////////////////////////////////////////////////

    startEdit() {
        this.isEdit = true;
        this.words_trash = [];
        this.words_ = this.words.map(x => Object.assign({}, x));
    }

    cancelEdit() {
        this.isEdit = false;
        this.words_trash = [];
    }

    async onFileChange(evt: any) {

        const dt: DataTransfer = <DataTransfer>(evt.target);
        
		if(dt.files.length == 1) {
            this.fileName = dt.files[0].name;
            const datas = await this._file.uploadExcel(dt.files[0]);
			datas.forEach(data => {
                this.words_.push(this.dataToWord(data));
            })
		} else {
			// this.words_ = [];
			// this.fileName = null;
        }   
    }

    //////////////////////////////////////////////////////////////////

    trashWord(index: number, word: Word) {
        this.words_.splice(index, 1);
        this.words_trash.push(word);
    }  
    
    saveWord() {
        let i: number = 1;
        let promises: Array<Promise<any>> = [];
		for(let word of this.words_) {
            word.num = i;
            word.subKey = this.subKey;
			word.catKey = this.cat.key
			word.catName = this.cat.name;
			word.lecKey = this.lec.key;
			word.lecName = this.lec.name; 
    
            let newWordRef  = null;
            if(word.key == null) {
                newWordRef = this.dirRef.child(`words/${this.subKey}/${this.cat.key}/${this.lec.key}`).push();
                word.key = newWordRef.key;
            } else {
                newWordRef = this.dirRef.child(`words/${this.subKey}/${this.cat.key}/${this.lec.key}/${word.key}`);
            }
            promises.push(
                newWordRef.set(word).then( () => {
                    this.pathRef.child(`${this.subKey}/${this.cat.key}/${this.lec.key}/${word.key}`).set({
                        ref: newWordRef.path["pieces_"].join("/"),
                        levels: {
                        true: true
                        }
                    });
                })
            );
			i++;
        }

        for(let word of this.words_trash) {
            promises.push(this.removeWord(word.key));
        }

        Promise.all(promises).then( () => {
            this.getWordList();
            this.isEdit = false;
        });
    }

    removeWord(wordKey: string): Promise<any> {
        return this.pathRef.child(`${this.subKey}/${this.cat.key}/${this.lec.key}/${wordKey}`).remove()
            .then( () => {
                console.log(wordKey + ": remove pathRef suc");
                this.dirRef.child(`words/${this.subKey}/${this.cat.key}/${this.lec.key}/${wordKey}`).remove()
                .then( () => {
                    console.log(wordKey + ": remove dirRef-words suc");
                });
            });
    }

    /////////////////////////////////////////////////////////////////

    dataToWord(data: Array<any>): Word {
        let word = new Word();

        word.head1 = data[0] == undefined? null: data[0];
        word.head2 = data[1] == undefined? null: data[1];
        word.body1 = data[2] == undefined? null: data[2];
        word.body2 = data[3] == undefined? null: data[3];

        return word;
    }

    wordToData(word: Word): Array<any> {
        return new Array<any>(word.head1, word.head2, word.body1, word.body2, word.key);
    }

    

}
