import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../common/app.constants';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  isTypePassword: boolean = true;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUser: any;
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  public alertButtons = ['OK'];

  constructor(private authService: AuthService, 
    private tokenStorage: TokenStorageService, 
    private route: ActivatedRoute,
    private router: Router, 
    private userService: UserService) { }

  ngOnInit() {
    this.initForm()
    const token: string = this.route.snapshot.queryParamMap.get('token');
    const error: string = this.route.snapshot.queryParamMap.get('error');
      if (this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        this.currentUser = this.tokenStorage.getUser();
      }
      else if(token){
        this.tokenStorage.saveToken(token);
        this.userService.getCurrentUser().subscribe({
          next: data => {
            this.login(data);
          },
          error: err => {
            this.errorMessage = err.error.message;
            this.isLoginFailed = true;
          }

        });
      }
      else if(error){
        this.errorMessage = error;
        this.isLoginFailed = true;
      }
    }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('', 
        {validators: [Validators.required, Validators.email]}
      ),
      password: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(6)]}
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit(): void {
    this.authService.login(this.form.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.login(data.user);
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  login(user): void {
    this.tokenStorage.saveUser(user);
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.currentUser = this.tokenStorage.getUser();
    this.router.navigate(['/tabs/tab1']);
  }
  
}
