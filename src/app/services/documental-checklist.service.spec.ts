import { TestBed } from '@angular/core/testing';

import { DocumentalChecklistService } from './documental-checklist.service';

describe('DocumentalChecklistService', () => {
  let service: DocumentalChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentalChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
