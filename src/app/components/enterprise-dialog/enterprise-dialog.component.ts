import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
  enterprise: Enterprise = {
    name: '',
    bankDetails: '',
    contactPerson: '',
    phone: '',
  };
  displayedColumns: string[] = [
    'name',
    'bankDetails',
    'contactPerson',
    'phone',
  ];
  error = '';

  constructor(
    public dialogRef: MatDialogRef<EnterpriseDialogComponent>,
    private enterpriseService: EnterpriseService
  ) {}

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
  onCancel() {
    this.dialogRef.close(this.enterprise);
  }
}
