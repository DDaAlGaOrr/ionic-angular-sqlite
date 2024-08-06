import { TestBed } from '@angular/core/testing';

import { UvLightModalService } from './uv-light-modal.service';

describe('UvLightModalService', () => {
  let service: UvLightModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UvLightModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
