import { TestBed } from '@angular/core/testing';

import { ContractsTypeService } from './contracts-type.service';

describe('ContractsTypeService', () => {
  let service: ContractsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
