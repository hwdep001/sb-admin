import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WordMngRoutingModule } from './word-mng-routing.module';
import { WordMngComponent } from './word-mng.component';

import { SortablejsModule } from 'angular-sortablejs'

@NgModule({
  imports: [
    CommonModule,
    WordMngRoutingModule,
    FormsModule,
    SortablejsModule
  ],
  declarations: [WordMngComponent]
})
export class WordMngModule { }
