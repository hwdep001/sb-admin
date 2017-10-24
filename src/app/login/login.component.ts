import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import * as firebase from 'firebase'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    user;

    constructor(public router: Router) {
        this.onAuthStateChanged();
    }

    ngOnInit() {
    }


    onAuthStateChanged() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user;
            if(user) {
                this.router.navigate(['dashboard']);
            }
        });
    }

    onLoggedin() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    onSignOut() {
        firebase.auth().signOut();
    }

}
