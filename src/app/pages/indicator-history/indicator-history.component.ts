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

@Component({
  selector: 'app-indicator-history',
  imports: [LayoutComponent, CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './indicator-history.component.html',
  styleUrl: './indicator-history.component.css',
})
export class IndicatorHistoryComponent implements OnInit {
  indicator!: Indicator;
  dynamicValues: Dynamic[] = []
  displayedColumns: string[] = ["date", "value", "actions"];

  constructor(
    private route: ActivatedRoute,
    private indicatorService: IndicatorService,
    private dynamicService: DynamicService,
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
        this.dynamicValues = data
      },
      error: (error) => {
        console.error("Error loading indicator history:", error)
      },
    })
  }
}
