import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  postData = {
    username: '',
    password: '',
  };
  passwordFieldType: string = 'password';
  showPassword: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }


  async login() {
    if (this.validateInputs()) {
      const body = {
        username: this.postData.username,
        password: this.postData.password,
      };
      console.log(body)
      await this.authService.login(body);
    }
  }

  validateInputs() {
    let username = this.postData.username.trim();
    let password = this.postData.password.trim();
    return (
      this.postData.username &&
      this.postData.password &&
      username.length > 0 &&
      password.length > 0
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

}
