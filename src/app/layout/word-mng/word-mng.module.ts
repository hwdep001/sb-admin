import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WordMngRoutingModule } from './word-mng-routing.module';
import { WordMngComponent } from './word-mng.component';

@NgModule({
  imports: [
    CommonModule,
    WordMngRoutingModule,
    FormsModule
  ],
  declarations: [WordMngComponent]
})
export class WordMngModule { }
