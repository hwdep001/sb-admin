import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatMngRoutingModule } from './cat-mng-routing.module';
import { CatMngComponent } from './cat-mng.component';

import { SortablejsModule } from 'angular-sortablejs'

@NgModule({
  imports: [
    CommonModule,
    CatMngRoutingModule,
    FormsModule,
    SortablejsModule
  ],
  declarations: [CatMngComponent]
})
export class CatMngModule { }
