import { TestBed } from '@angular/core/testing';

import { SubsidiaryClientService } from './subsidiary-client.service';

describe('SubsidiaryClientService', () => {
  let service: SubsidiaryClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubsidiaryClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
