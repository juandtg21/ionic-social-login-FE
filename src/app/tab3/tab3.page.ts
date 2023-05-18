import { Component, Renderer2 } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  constructor(private renderer: Renderer2, 
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
    private router: Router) {}

  currentUser: any;
  
  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
  }

  onToggleColorTheme(event) {
    if(event.detail.checked) {
      this.renderer.setAttribute(document.body, 'color-theme', 'dark')
    } else {
      this.renderer.setAttribute(document.body, 'color-theme', 'light')
    }
  }

  logout(): void {
    this.userService.logout(this.tokenStorageService.getUser().id).subscribe({
      next: () => {
        this.tokenStorageService.signOut();
        this.router.navigate(['/login']).then(() => {
          window.location.reload();
        });
      },
      error: err => {
        console.error("Update user status failed: ", err);
      }
    });
  
  }
}
