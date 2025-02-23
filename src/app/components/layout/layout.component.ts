import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Enterprise } from '../../models/enterprise.model';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { EnterpriseService } from '../../services/enterprise.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  selectedEnterprise: Enterprise | null = null;
  enterprises: Enterprise[] = [];
  selectedDestination: string = 'indicators';

  constructor(
    private router: Router,
    private enterpriseService: EnterpriseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.enterpriseService.getEnterprises().subscribe((data) => {
      this.enterprises = data;
    });
  }

  onEnterpriseSelect(enterprise: Enterprise) {
    this.selectedEnterprise = enterprise;
    this.router.navigate([`/${this.selectedDestination}/${enterprise._id}`], {
      queryParamsHandling: 'preserve',
      skipLocationChange: false,
      replaceUrl: false,
    });
  }

  setDestination(destination: string) {
    this.selectedDestination = destination;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
