import { TestBed } from '@angular/core/testing';

import { ProjectProgressService } from './project-progress.service';

describe('ProjectProgressService', () => {
  let service: ProjectProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
