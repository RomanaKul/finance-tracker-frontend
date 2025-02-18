import { Component, OnInit } from '@angular/core';
import { Indicator } from '../../models/indicator.model';
import { ActivatedRoute } from '@angular/router';
import { IndicatorService } from '../../services/indicator.service';
import { LayoutComponent } from '../../components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Dynamic } from '../../models/dynamic.model';
import { DynamicService } from '../../services/dynamic.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ValueDialogComponent } from '../../components/value-dialog/value-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-indicator-history',
  imports: [
    LayoutComponent,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './indicator-history.component.html',
  styleUrl: './indicator-history.component.css',
})
export class IndicatorHistoryComponent implements OnInit {
  indicator!: Indicator;
  dynamicValues: Dynamic[] = [];
  displayedColumns: string[] = ['date', 'value', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private indicatorService: IndicatorService,
    private dynamicService: DynamicService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const indicatorId = params['_id'];
      this.loadIndicator(indicatorId);
      this.loadIndicatorHistory(indicatorId);
    });
  }

  loadIndicator(indicatorId: string) {
    this.indicatorService.getIndicator(indicatorId).subscribe({
      next: (data) => {
        this.indicator = data;
      },
      error: (error) => {
        console.error('Error loading indicator:', error);
      },
    });
  }

  loadIndicatorHistory(indicatorId: string) {
    this.dynamicService.getDynamicsByIndicator(indicatorId).subscribe({
      next: (data) => {
        this.dynamicValues = data;
      },
      error: (error) => {
        console.error('Error loading indicator history:', error);
      },
    });
  }

  openDialog() {
    const dialogRef = this.dialogRef.open(ValueDialogComponent, {
      width: '70vw',
      maxWidth: 'none',
      data: {
        indicatorId: this.indicator._id,
        enterpriseId: this.indicator.enterpriseId,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.loadIndicatorHistory(data.indicator);
      }
    });
  }

  deleteValue(dynamic: Dynamic) {
    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete value ${dynamic.value}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dynamicService.deleteDynamic(dynamic._id!).subscribe({
          next: () => {
            this.loadIndicatorHistory(this.indicator._id as string);
            console.log(`Value "${dynamic.value}" deleted successfully`);
          },
          error: (error) => {
            console.error('Error deleting value:', error);
          },
        });
      }
    });
  }
}
