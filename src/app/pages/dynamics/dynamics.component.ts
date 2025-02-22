import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../components/layout/layout.component';
import { Enterprise } from '../../models/enterprise.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnterpriseService } from '../../services/enterprise.service';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../components/chart/chart.component';
import { Dynamic } from '../../models/dynamic.model';
import { Indicator } from '../../models/indicator.model';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CurrencyRateService } from '../../services/currency-rate.service';

@Component({
  selector: 'app-dynamics',
  imports: [
    LayoutComponent,
    CommonModule,
    ChartComponent,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './dynamics.component.html',
  styleUrl: './dynamics.component.css',
})
export class DynamicsComponent implements OnInit {
  enterprise: Enterprise | null = null;
  indicators: Indicator[] = [];
  dynamicsMap: Map<string, Dynamic[]> = new Map();

  selectedIndicator: Indicator | null = null;

  valueArr: number[] = [];
  dateArr: string[] = [];
  originalValueArr: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private enterpriseService: EnterpriseService,
    private currencyRateService: CurrencyRateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const enterpriseId = params['enterpriseId'];
      this.resetData();
      this.loadEnterpriseData(enterpriseId);
    });
  }

  resetData(): void {
    this.enterprise = null;
    this.indicators = [];
    this.dynamicsMap.clear();
    this.selectedIndicator = null;
    this.valueArr = [];
    this.dateArr = [];
    this.originalValueArr = [];
  }

  loadEnterpriseData(enterpriseId: string): void {
    forkJoin({
      enterprise: this.enterpriseService.getEnterprise(enterpriseId),
      indicators: this.enterpriseService.getEnterpriseIndicators(enterpriseId),
    }).subscribe({
      next: ({ enterprise, indicators }) => {
        this.enterprise = enterprise;
        this.indicators = indicators;
        if (indicators.length > 0) {
          this.selectIndicatorById(indicators[0]._id as string);
        }
      },
      error: (error) => console.error('Error loading enterprise data:', error),
    });
  }

  selectIndicator(event: any): void {
    const indicatorId = event.value;
    this.selectIndicatorById(indicatorId);
  }

  selectIndicatorById(indicatorId: string): void {
    const selectedIndicator = this.indicators.find(
      (ind) => ind._id === indicatorId
    );
    if (selectedIndicator) {
      this.selectedIndicator = selectedIndicator;
      this.loadIndicatorDynamics(indicatorId);
    }
  }

  loadIndicatorDynamics(indicatorId: string): void {
    this.enterpriseService.getIndicatorDynamics(indicatorId).subscribe({
      next: (dynamics) => {
        this.dynamicsMap.set(indicatorId, dynamics);
        this.updateChartData();
      },
      error: (error) =>
        console.error('Error loading indicator dynamics:', error),
    });
  }

  updateChartData(): void {
    if (this.selectedIndicator) {
      const dynamics =
        this.dynamicsMap.get(this.selectedIndicator._id as string) || [];
      dynamics.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      this.dateArr = dynamics.map((d) => new Date(d.date).toLocaleDateString());
      this.valueArr = dynamics.map((d) => d.value);
      this.originalValueArr = [...this.valueArr];

      this.dateArr = [...this.dateArr];
      this.valueArr = [...this.valueArr];
    }
  }

  convertCurrency(newCurrency: string): void {
    const currencyFrom = this.selectedIndicator?.unit;
    const currencyTo = newCurrency;

    if (this.selectedIndicator) {
      if (currencyFrom === currencyTo) {
        this.valueArr = [...this.originalValueArr];
        return;
      }

      const dynamics =
        this.dynamicsMap.get(this.selectedIndicator._id as string) || [];
      dynamics.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const convertedDynamics = dynamics.map((d) => {
        const date = new Date(d.date);
        const formattedDate = date.toLocaleDateString('en-CA');

        return this.currencyRateService.getCurrencyRate(formattedDate).pipe(
          map((currencyRate) => {
            const rates = currencyRate.rates;
            const fromRates = rates[currencyFrom as keyof typeof rates];
            const conversionRate =
              fromRates[currencyTo as keyof typeof fromRates];

            return {
              date: d.date,
              value: d.value * conversionRate,
            };
          })
        );
      });

      forkJoin(convertedDynamics).subscribe((results) => {
        this.dateArr = results.map((d) =>
          new Date(d.date).toLocaleDateString()
        );
        this.valueArr = results.map((d) => d.value);
      });
    }

    console.log('currencyFrom', currencyFrom);
    console.log('currencyTo', currencyTo);
  }
}
