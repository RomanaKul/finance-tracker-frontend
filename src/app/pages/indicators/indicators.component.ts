import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Indicator } from '../../models/indicator.model';
import { IndicatorService } from '../../services/indicator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { EnterpriseService } from '../../services/enterprise.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IndicatorDialogComponent } from '../../components/indicator-dialog/indicator-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { DynamicService } from '../../services/dynamic.service';

@Component({
  selector: 'app-indicators',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    LayoutComponent,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './indicators.component.html',
  styleUrl: './indicators.component.css',
})
export class IndicatorsComponent implements OnInit {
  indicators: Indicator[] = [];
  enterpriseId = '';
  enterpriseName = '';
  displayedColumns: string[] = [
    'name',
    'importance',
    'unit',
    'date',
    'value',
    'actions',
  ];

  dateControl = new FormControl(new Date());
  indicatorForms: { [key: string]: FormGroup } = {};

  constructor(
    private route: ActivatedRoute,
    private indicatorService: IndicatorService,
    private enterpriseService: EnterpriseService,
    private dialogRef: MatDialog,
    private router: Router,
    private dynamicService: DynamicService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.enterpriseId = params['enterpriseId'];
      this.loadIndicators();
      this.loadEnterprise();
    });
  }

  loadIndicators() {
    this.indicatorService.getIndicators(this.enterpriseId).subscribe({
      next: (data) => {
        this.indicators = data;
        this.indicatorForms = {};
        this.indicators.forEach((indicator) => {
          this.indicatorForms[indicator._id!] = new FormGroup({
            date: new FormControl<Date | null>(new Date()),
            value: new FormControl<number | null>(null),
          });
        });
      },
      error: (error) => {
        console.error('Error loading indicators:', error);
      },
    });
  }

  loadEnterprise() {
    this.enterpriseService.getEnterprise(this.enterpriseId).subscribe({
      next: (data) => {
        this.enterpriseName = data.name;
      },
      error: (error) => {
        console.error('Error loading enterprises:', error);
      },
    });
  }

  openIndicatorForm(indicator?: Indicator) {
    const dialogRef = this.dialogRef.open(IndicatorDialogComponent, {
      width: '60vw',
      maxWidth: 'none',
      data: { indicator, enterpriseId: this.enterpriseId },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.loadIndicators();
      }
    });
  }

  editIndicator(indicator: Indicator) {
    this.openIndicatorForm(indicator);
  }

  deleteIndicator(indicator: Indicator) {
    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${indicator.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.indicatorService.deleteIndicator(indicator._id!).subscribe({
          next: () => {
            this.loadIndicators();
            console.log(`Indicator "${indicator.name}" deleted successfully`);
          },
          error: (error) => {
            console.error('Error deleting indicator:', error);
          },
        });
      }
    });
  }

  openHistory(indicatorId: string) {
    this.router.navigate([`/indicator-history/${indicatorId}`]);
  }

  addValue(indicator: Indicator) {
    const form = this.indicatorForms[indicator._id!];
    if (form && form.valid) {
      const newValue = {
        indicator: indicator._id!,
        enterprise: this.enterpriseId,
        date: form.get('date')!.value,
        value: form.get('value')!.value,
      };

      this.dynamicService.addDynamic(newValue).subscribe({
        next: () => {
          console.log(`Value "${newValue.value}" added successfully`);
          form.reset({ date: new Date() });
          this.loadIndicators();
        },
        error: (error) => {
          console.error('Error adding value:', error);
        },
      });
    }
  }

  getFormControl(indicatorId: string, controlName: string): FormControl {
    return this.indicatorForms[indicatorId]?.get(controlName) as FormControl;
  }
}
