import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueDialogComponent } from './value-dialog.component';

describe('ValueDialogComponent', () => {
  let component: ValueDialogComponent;
  let fixture: ComponentFixture<ValueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
