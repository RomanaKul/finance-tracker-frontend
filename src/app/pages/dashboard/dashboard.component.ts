import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Enterprise } from '../../models/enterprise.model';
import { EnterpriseService } from '../../services/enterprise.service';
import { MatDialog } from '@angular/material/dialog';
import { EnterpriseDialogComponent } from '../../components/enterprise-dialog/enterprise-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    LayoutComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  enterprise: Enterprise = {
    name: '',
    bankDetails: '',
    contactPerson: '',
    phone: '',
  };
  selectedEnterprise: Enterprise | null = null;
  enterprises: Enterprise[] = [];
  displayedColumns: string[] = [
    'name',
    'bankDetails',
    'contactPerson',
    'phone',
    'actions',
  ];

  constructor(
    private enterpriseService: EnterpriseService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit() {
    this.loadEnterprises();
  }

  loadEnterprises() {
    this.enterpriseService.getEnterprises().subscribe({
      next: (data) => {
        this.enterprises = data;
      },
      error: (error) => {
        console.error('Error loading enterprises:', error);
      },
    });
  }

  openDialog(enterprise?: Enterprise) {
    const dialogRef = this.dialogRef.open(EnterpriseDialogComponent, {
      width: '70vw',
      maxWidth: 'none',
      data: { enterprise: enterprise ? { ...enterprise } : undefined },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.loadEnterprises();
      }
    });
  }

  editEnterprise(enterprise: Enterprise) {
    this.openDialog(enterprise);
  }

  deleteEnterprise(enterprise: Enterprise) {
    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${enterprise.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.enterpriseService.deleteEnterprise(enterprise._id!).subscribe({
          next: () => {
            this.loadEnterprises();
            console.log(`Enterprise "${enterprise.name}" deleted successfully`);
          },
          error: (err) => {
            console.log('Failed to delete enterprise: ', err);
          },
        });
      }
    });
  }
}
