import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {

  isAuthenticated: boolean
  constructor(private tokenServie: TokenStorageService) {
    this.isAuthenticated = this.tokenServie.getToken() != null
  }

}
