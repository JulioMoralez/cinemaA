import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Role, User, UserService} from '../shared/user.service';
import {isPresentationRole} from 'codelyzer/util/isPresentationRole';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  searchString = '';
  private userForm: User = {id: null, username: null, roles: null, email: null, name: null, password: null};
  private editor = false;
  private rolesForm = [false, false, false];

  constructor(private userService: UserService) { }
  ngOnInit() {

  }


  updateUserForm() {
    this.userForm.id = this.userService.user.id;
    this.userForm.username = this.userService.user.username;
    this.userForm.roles = this.userService.user.roles;
    this.userForm.email = this.userService.user.email;
    this.userForm.name = this.userService.user.name;
    for (let i = 0; i < this.userForm.roles.length; i++) {
      this.rolesForm[i] = this.userForm.roles[i].check;
    }
    this.editor = true;
  }

  updateUser() {
    this.userService.createOrUpdateUser(this.userForm).subscribe();
    this.editor = false;
  }

  onChange(name: string, check: boolean) {
    this.userForm.roles.find(value => value.name === name).check = !check;
  }


  breakUser() {
    for (let i = 0; i < this.userForm.roles.length; i++) {
       this.userForm.roles[i].check = this.rolesForm[i];
    }
    this.editor = false;
  }
}
