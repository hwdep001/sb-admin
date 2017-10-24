import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecMngComponent } from './lec-mng.component';

const routes: Routes = [
    { path: '', component: LecMngComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LecMngRoutingModule { }
