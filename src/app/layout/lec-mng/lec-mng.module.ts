import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LecMngRoutingModule } from './lec-mng-routing.module';
import { LecMngComponent } from './lec-mng.component';

import { SortablejsModule } from 'angular-sortablejs'

@NgModule({
  imports: [
    CommonModule,
    LecMngRoutingModule,
    FormsModule,
    SortablejsModule
  ],
  declarations: [LecMngComponent]
})
export class LecMngModule { }
