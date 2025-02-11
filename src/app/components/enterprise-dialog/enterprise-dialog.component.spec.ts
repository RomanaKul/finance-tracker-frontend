import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseDialogComponent } from './enterprise-dialog.component';

describe('EnterpriseDialogComponent', () => {
  let component: EnterpriseDialogComponent;
  let fixture: ComponentFixture<EnterpriseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterpriseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterpriseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
