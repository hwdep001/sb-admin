import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecMngComponent } from './lec-mng.component';

describe('LecMngComponent', () => {
  let component: LecMngComponent;
  let fixture: ComponentFixture<LecMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
