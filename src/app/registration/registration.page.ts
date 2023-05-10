import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  signupForm: FormGroup;
  isTypePassword: boolean = true;
  isLoading: boolean = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isAlertOpen = false;
  public alertButtons = ['OK'];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = new FormGroup({
      displayName: new FormControl('', 
        {validators: [Validators.required]}
      ),
      email: new FormControl('', 
        {validators: [Validators.required, Validators.email]}
      ),
      password: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(6)]}
      ),
      matchingPassword: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(6)]}
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  onSubmit(): void {
    this.isLoading = true;
    console.log("FORM:: " + JSON.stringify(this.signupForm.value))
    this.authService.register(this.signupForm.value).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.errorMessage = 'Registration successful. Please Login'
        this.isLoading = false;
        this.isAlertOpen = true;
        this.signupForm.reset();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.isSuccessful = false;
        this.isLoading = false;
        this.isAlertOpen = true;
      }
    );
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
    if (this.isSuccessful === true) {
      this.router.navigate(['/login'])
    }
  }

}
