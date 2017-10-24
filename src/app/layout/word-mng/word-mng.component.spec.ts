import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordMngComponent } from './word-mng.component';

describe('WordMngComponent', () => {
  let component: WordMngComponent;
  let fixture: ComponentFixture<WordMngComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordMngComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
