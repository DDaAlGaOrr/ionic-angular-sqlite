import { TestBed } from '@angular/core/testing';

import { TaskChecklistService } from './task-checklist.service';

describe('TaskChecklistService', () => {
  let service: TaskChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
