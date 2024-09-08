import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAreaComponent } from './section-area.component';

describe('SectionAreaComponent', () => {
  let component: SectionAreaComponent;
  let fixture: ComponentFixture<SectionAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
