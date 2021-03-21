import { TestBed } from '@angular/core/testing';

import { ExclusiveAlertService } from './exclusive-alert.service';

describe('ExclusiveAlertService', () => {
  let service: ExclusiveAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExclusiveAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
