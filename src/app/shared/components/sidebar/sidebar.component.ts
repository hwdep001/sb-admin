import { Router } from '@angular/router';
import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    constructor(public router: Router){

    }

    isActive = false;
    showMenu = '';
    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    signOut() {
        firebase.auth().signOut().then( () => {
            this.router.navigate(['login']);
        });
    }
}
