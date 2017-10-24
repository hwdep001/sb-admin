import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMngComponent } from './cat-mng.component';

describe('CatMngComponent', () => {
  let component: CatMngComponent;
  let fixture: ComponentFixture<CatMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
