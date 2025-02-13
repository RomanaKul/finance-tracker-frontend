import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Indicator } from '../../models/indicator.model';
import { IndicatorService } from '../../services/indicator.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { EnterpriseService } from '../../services/enterprise.service';

@Component({
  selector: 'app-indicators',
  imports: [MatTableModule, MatIconModule, MatButtonModule, LayoutComponent],
  templateUrl: './indicators.component.html',
  styleUrl: './indicators.component.css',
})
export class IndicatorsComponent implements OnInit {
  indicators: Indicator[] = [];
  enterpriseId = '';
  enterpriseName = '';
  displayedColumns: string[] = ['name', 'importance', 'unit', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private indicatorService: IndicatorService,
    private enterpriseService: EnterpriseService
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
    //   const dialogRef = this.dialog.open(IndicatorFormComponent, {
    //     width: "400px",
    //     data: { indicator, enterpriseId: this.enterpriseId },
    //   })
    //   dialogRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //       this.loadIndicators()
    //     }
    //   })
  }

  editIndicator(indicator: Indicator) {
    // this.openIndicatorForm(indicator)
  }

  deleteIndicator(indicator: Indicator) {
    // if (confirm(`Are you sure you want to delete ${indicator.name}?`)) {
    //   this.indicatorService.deleteIndicator(indicator._id!).subscribe({
    //     next: () => {
    //       this.loadIndicators()
    //     },
    //     error: (error) => {
    //       console.error("Error deleting indicator:", error)
    //     },
    //   })
    // }
  }
}
