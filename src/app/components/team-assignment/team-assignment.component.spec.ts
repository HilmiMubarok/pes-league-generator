import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAssignmentComponent } from './team-assignment.component';

describe('TeamAssignmentComponent', () => {
  let component: TeamAssignmentComponent;
  let fixture: ComponentFixture<TeamAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamAssignmentComponent]
    });
    fixture = TestBed.createComponent(TeamAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
