import { Injectable } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private tokenService: TokenStorageService,
    private navCtrl: NavController) {}

    canActivate() {
      return this.checkAuth();
    }
    
    private checkAuth() {
    const authed = this.tokenService.getToken() != null;
    return authed || this.routeToLogin();
  }

  private routeToLogin(): boolean {
    this.navCtrl.navigateRoot('/login');
    return false;
  }
  
}
