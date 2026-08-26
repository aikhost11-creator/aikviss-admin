import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() pageName: string;
  @Input() icon: string;

  crumbs: { name: string; url?: string; active?: boolean }[] = [];

  constructor(private router: Router, public sharedservice: SharedService) {
  }

  ngOnInit(): void {
  }
}