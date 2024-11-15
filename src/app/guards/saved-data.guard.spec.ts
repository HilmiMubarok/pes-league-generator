import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { savedDataGuard } from './saved-data.guard';

describe('savedDataGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => savedDataGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
