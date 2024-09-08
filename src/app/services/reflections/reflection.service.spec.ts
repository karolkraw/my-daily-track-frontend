import { TestBed } from '@angular/core/testing';

import { ReflectionsService } from './reflection.service';

describe('ReflectionsService', () => {
  let service: ReflectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReflectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
