import { Component, OnInit } from '@angular/core';
import {User, UserService} from '../shared/user.service';
import {Film} from '../shared/film.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: User[];
  form: User = {id: null, username: null, roles: null, name: null,
    email: null, emailConfirmed: null, password: null, verifyCode: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(value => this.users = value);
  }

  updateForm() {
    this.userService.createOrUpdateUser(this.form).subscribe(value => {
      this.userService.getUsers().subscribe(value1 => this.users = value1);
    });
    this.editor = false;
  }

  breakForm() {
    this.editor = false;
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  openEditForm(id: any) {
    const user = this.users.find(value => value.id === id);
    this.form.id = user.id;
    this.form.name = user.name;
    this.form.username = user.username;
    this.form.roles = [];
    for (let i = 0; i < user.roles.length; i++) {
      this.form.roles.push(Object.assign({}, user.roles[i]));
    }
    this.form.email = user.email;
    this.form.verifyCode = user.verifyCode;
    this.form.password = user.password;
    this.form.emailConfirmed = user.emailConfirmed;
    this.editor = true;
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  onChangeRole(name: string, check: boolean) {
    for (let i = 0; i < this.form.roles.length; i++) {
      if (this.form.roles[i].name === name) {
        this.form.roles[i].check = !check;
      }
    }
  }
}
