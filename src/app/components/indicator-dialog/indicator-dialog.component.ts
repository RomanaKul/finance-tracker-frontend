import { Component, Inject } from '@angular/core';
import { Indicator } from '../../models/indicator.model';
import { IndicatorService } from '../../services/indicator.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-indicator-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './indicator-dialog.component.html',
  styleUrl: './indicator-dialog.component.css',
})
export class IndicatorDialogComponent {
  indicator: Indicator;
  displayedColumns: string[] = ['name', 'importance', 'unit'];
  error = '';
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<IndicatorDialogComponent>,
    private indicatorService: IndicatorService,
    @Inject(MAT_DIALOG_DATA) public data: { enterpriseId: string, indicator?: Indicator }
  ) {
    this.isEditMode = !!data.indicator;
    this.indicator = this.isEditMode
      ? {
        _id: data.indicator?._id ?? '',
        name: data.indicator?.name ?? '',
        importance: data.indicator?.importance ?? 0,
        unit: data.indicator?.unit ?? '',
        enterpriseId: data.indicator?.enterpriseId ?? data.enterpriseId
        }
      : {
        name: '',
        importance: 0,
        unit: '',
        enterpriseId: data.enterpriseId
      }
  }

  onSubmit() {
    this.error = '';
    if (
      !this.indicator.name ||
      !this.indicator.importance ||
      !this.indicator.unit
    ) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    if (this.isEditMode) {
      this.indicatorService.updateIndicator(this.indicator).subscribe({
        next: (data) => {
          console.log('Indicator updated successfully: ', data);
          this.dialogRef.close(this.indicator);
        },
        error: (err) => {
          console.log('Error updating indicator: ', err);
          this.error =
            'An error occurred while updating the indicator. Please try again.';
        },
      });
    } else {
      this.indicatorService.addIndicator(this.indicator).subscribe({
        next: (data) => {
          console.log('Indicator added successfully: ', data);
          this.dialogRef.close(this.indicator);
        },
        error: (err) => {
          console.log('Error adding indicator: ', err);
          this.error =
            'An error occurred while adding the indicator. Please try again.';
        },
      });
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
