import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from "../core/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  
  email = new FormControl();
  password = new FormControl();

  isAuth: boolean = false;
  element: any;
  visibility: boolean = true;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
  }

  checkAuth() {
    this.auth.emailLogin(this.email.value, this.password.value);
  }

  goToDashboard() {
    this.router.navigateByUrl('/main');
  }

}
