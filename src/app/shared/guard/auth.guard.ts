import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import * as firebase from 'firebase'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
