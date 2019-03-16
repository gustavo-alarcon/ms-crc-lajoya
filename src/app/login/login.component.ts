import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "../core/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isAuth: boolean = false;
  element: any;
  visibility: boolean = true;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['',[
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  checkAuth() {
    this.auth.emailLogin(this.email.value, this.password.value);
  }

  goToDashboard() {
    this.router.navigateByUrl('/main');
  }

  showPassword(): void{
    this.element = document.getElementById("pass");
    if(this.element.getAttribute("type") === "password") {
      this.element.setAttribute("type","text");
      this.visibility = false;
    } else {
      this.element.setAttribute("type","password");
      this.visibility = true;
    }
  }

}
