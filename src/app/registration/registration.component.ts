import { Component, OnInit } from '@angular/core';
import {User, UserService} from '../shared/user.service';
import {isNumber} from 'util';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private users: User[];
  private username = '';
  private name = '';
  private password = '';
  private confirmPassword = '';
  private email = '';
  private errorMessage = '';
  private confirmReg = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(value => this.users = value);
  }

  register() {
    if (!(this.username.trim().length)) {
      this.errorMessage = 'Введите логин';
      console.log(this.errorMessage);
      return;
    }
    if (this.users.find(value => value.username === this.username) !== undefined) {
      this.errorMessage = 'Пользователь существует';
      console.log(this.errorMessage);
      return;
    }
    if (this.password.length < 3) {
      this.errorMessage = 'Пароль меньше трех символов';
      console.log(this.errorMessage);
      return;
    }
    if (this.password.trim() !== this.confirmPassword.trim()) {
      this.errorMessage = 'Пароли не совпадают';
      console.log(this.errorMessage);
      return;
    }
    this.errorMessage = null;
    const user: User = {id: null, username: this.username, roles: null, email: this.email, name: this.name, password: this.password};
    this.userService.createOrUpdateUser(user).subscribe(value => {
      if (isNumber(value.id)) {
          this.confirmReg = 'Регистрация успешна, ' + value.username;
      }
    });
  }
}
