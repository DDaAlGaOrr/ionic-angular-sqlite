import { TestBed } from '@angular/core/testing';

import { ChecklistTaskFormService } from './checklist-task-form.service';

describe('ChecklistTaskFormService', () => {
  let service: ChecklistTaskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistTaskFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
