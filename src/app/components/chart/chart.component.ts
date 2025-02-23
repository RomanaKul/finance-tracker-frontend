import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('myChart', { static: true })
  chartRef!: ElementRef<HTMLCanvasElement>;
  myChart: Chart | null = null;
  @Input() labels: string[] = [];
  @Input() data: number[] = [];

  constructor() {}

  ngAfterViewInit() {
    this.createChart();
  }
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['labels'] || changes['data']) && this.myChart) {
      this.updateChart();
    }
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Value',
              data: this.data,
              borderColor: '#4b79c3',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }

  private updateChart() {
    if (this.myChart) {
      this.myChart.data.labels = this.labels;
      this.myChart.data.datasets[0].data = this.data;

      this.myChart.update();
    }
  }
}
