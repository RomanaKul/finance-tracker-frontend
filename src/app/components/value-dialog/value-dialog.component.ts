import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DynamicService } from '../../services/dynamic.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-value-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './value-dialog.component.html',
  styleUrl: './value-dialog.component.css',
})
export class ValueDialogComponent {
  displayedColumns: string[] = ['date', 'value'];
  error = '';
  valueForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ValueDialogComponent>,
    private dynamicService: DynamicService,
    @Inject(MAT_DIALOG_DATA)
    public data: { indicatorId: string; enterpriseId: string }
  ) {
    this.valueForm = new FormGroup({
      date: new FormControl<Date | null>(new Date(), Validators.required),
      value: new FormControl<number | null>(null, Validators.required),
    });
  }

  onSubmit() {
    this.error = '';

    const form = this.valueForm;
    if (this.valueForm.valid) {
      const newValue = {
        indicator: this.data.indicatorId,
        enterprise: this.data.enterpriseId,
        date: form.get('date')!.value,
        value: form.get('value')!.value,
      };

      this.dynamicService.addDynamic(newValue).subscribe({
        next: (data) => {
          console.log('Value added successfully: ', data);
          this.dialogRef.close(data);
        },
        error: (err) => {
          console.log('Error adding value: ', err);
          this.error =
            'An error occurred while adding the value. Please try again.';
        },
      });
    } else {
      this.error = 'Please fill in all required fields.';
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
