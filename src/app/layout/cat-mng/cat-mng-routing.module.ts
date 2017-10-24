import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatMngComponent } from './cat-mng.component';

const routes: Routes = [
    { path: '', component: CatMngComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatMngRoutingModule { }
