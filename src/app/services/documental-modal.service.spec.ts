import { TestBed } from '@angular/core/testing';

import { DocumentalModalService } from './documental-modal.service';

describe('DocumentalModalService', () => {
  let service: DocumentalModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentalModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
