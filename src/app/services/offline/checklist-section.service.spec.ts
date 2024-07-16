import { TestBed } from '@angular/core/testing';

import { ChecklistSectionService } from './checklist-section.service';

describe('ChecklistSectionService', () => {
  let service: ChecklistSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
