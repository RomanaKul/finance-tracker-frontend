import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorHistoryComponent } from './indicator-history.component';

describe('IndicatorHistoryComponent', () => {
  let component: IndicatorHistoryComponent;
  let fixture: ComponentFixture<IndicatorHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
