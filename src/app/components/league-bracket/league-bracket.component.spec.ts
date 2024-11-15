import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueBracketComponent } from './league-bracket.component';

describe('LeagueBracketComponent', () => {
  let component: LeagueBracketComponent;
  let fixture: ComponentFixture<LeagueBracketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeagueBracketComponent]
    });
    fixture = TestBed.createComponent(LeagueBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
