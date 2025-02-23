import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Enterprise } from '../../models/enterprise.model';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EnterpriseService } from '../../services/enterprise.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enterprise-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './enterprise-dialog.component.html',
  styleUrl: './enterprise-dialog.component.css',
})
export class EnterpriseDialogComponent {
  enterprise: Enterprise;
  displayedColumns: string[] = [
    'name',
    'bankDetails',
    'contactPerson',
    'phone',
  ];
  error = '';
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<EnterpriseDialogComponent>,
    private enterpriseService: EnterpriseService,
    @Inject(MAT_DIALOG_DATA) public data: { enterprise?: Enterprise }
  ) {
    this.isEditMode = !!data.enterprise;
    this.enterprise = this.isEditMode
      ? {
          _id: data.enterprise?._id ?? '',
          name: data.enterprise?.name ?? '',
          bankDetails: data.enterprise?.bankDetails ?? '',
          contactPerson: data.enterprise?.contactPerson ?? '',
          phone: data.enterprise?.phone ?? '',
        }
      : { name: '', bankDetails: '', contactPerson: '', phone: ''};
  }

  onSubmit() {
    this.error = '';
    if (
      !this.enterprise.name ||
      !this.enterprise.bankDetails ||
      !this.enterprise.contactPerson ||
      !this.enterprise.phone
    ) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    if (this.isEditMode) {
      this.enterpriseService.updateEnterprise(this.enterprise).subscribe({
        next: (data) => {
          console.log('Enterprise updated successfully: ', data);
          this.dialogRef.close(data);
        },
        error: (err) => {
          console.log('Error updating enterprise: ', err);
          this.error =
            'An error occurred while updating the enterprise. Please try again.';
        },
      });
    } else {
      this.enterpriseService.addEnterprise(this.enterprise).subscribe({
        next: (data) => {
          console.log('Enterprise added successfully: ', data);
          this.dialogRef.close(this.enterprise);
        },
        error: (err) => {
          console.log('Error adding enterprise: ', err);
          this.error =
            'An error occurred while adding the enterprise. Please try again.';
        },
      });
    }
  }
  onCancel() {
    this.dialogRef.close(this.enterprise);
  }
}
