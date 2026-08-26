import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrl: './view-location.component.scss'
})
export class ViewLocationComponent {
  @Input() data;

  constructor(public sharedservice : SharedService, public activeModal : NgbActiveModal){}

  ngOnInit(): void {
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([this.data.latitude, this.data.longitude])
      .addTo(map)
      .openPopup();
      
      // .bindPopup(`<b>${this.data.checkoutData.city}, ${this.data.checkoutData.state}, ${this.data.checkoutData.country}</b>`)
  }

}
