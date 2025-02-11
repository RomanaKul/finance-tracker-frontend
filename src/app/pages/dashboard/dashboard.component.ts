import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Enterprise } from '../../models/enterprise.model';
import { EnterpriseService } from '../../services/enterprise.service';
import { MatDialog } from '@angular/material/dialog';
import { EnterpriseDialogComponent } from '../../components/enterprise-dialog/enterprise-dialog.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule,
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

  openDialog() {
    const dialogRef = this.dialogRef.open(EnterpriseDialogComponent, {
      width: '70vw',
      maxWidth: 'none',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.loadEnterprises();
      }
    });
  }

  editEnterprise(enterprise: Enterprise) {
    console.log('Edit enterprise:', enterprise);
  }

  deleteEnterprise(enterprise: Enterprise) {
    console.log('Delete enterprise:', enterprise);
  }
}
