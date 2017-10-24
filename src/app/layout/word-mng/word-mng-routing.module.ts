import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WordMngComponent } from './word-mng.component';

const routes: Routes = [
    { path: '', component: WordMngComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WordMngRoutingModule { }
