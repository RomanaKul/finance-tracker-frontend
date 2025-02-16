import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorDialogComponent } from './indicator-dialog.component';

describe('IndicatorDialogComponent', () => {
  let component: IndicatorDialogComponent;
  let fixture: ComponentFixture<IndicatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
