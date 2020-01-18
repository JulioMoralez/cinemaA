import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Role, User, UserService} from '../shared/user.service';
import {isPresentationRole} from 'codelyzer/util/isPresentationRole';
import {Order, OrderService} from '../shared/order.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  searchString = '';
  private userForm: User = {id: null, username: null, roles: null, email: null, name: null, password: null, verifyCode: null, emailConfirmed: null};
  private editor = false;
  private rolesForm = [false, false, false];
  private orders: Order[] = null;
  private order: Order = null;
  private showOrder = false;
  private verifyCode: string;
  errorMessage: string;
  confirmMessage: string;

  constructor(private userService: UserService,
              private orderService: OrderService) { }

  ngOnInit() {
    this.confirmMessage = '';
    this.errorMessage = '';
    if (this.userService.user === null) {
      const id = (sessionStorage.getItem('id'));
      if (id !== null) {
        this.userService.getUser(id).subscribe(value => {
          this.orderService.findByUser(value.id.toString()).subscribe(value1 => this.orders = value1);
        });
      }
    } else {
      this.orderService.findByUser(this.userService.user.id.toString()).subscribe(value => {
        this.orders = value;
        console.log(value);
      });
    }
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

  viewOrder(id: number) {
    this.showOrder = true;
    this.order = this.orders.find(value => value.id === id);
  }

  verifyEmail() {
    this.userService.verifyEmail(this.userService.user.id).subscribe(value => {
      if (value.id === this.userService.user.id) {
        this.confirmMessage = 'Письмо отправлено';
        this.errorMessage = '';
      } else {
        this.confirmMessage = '';
        this.errorMessage = 'Письмо не отправлено';
      }
    });
  }

  confirmCode() {
    this.userService.confirmCode(this.userService.user.id, this.verifyCode).subscribe(value => {
      if (value.id === this.userService.user.id) {
        this.userService.user.emailConfirmed = true;
        this.confirmMessage = 'Почта подтверждена';
        this.errorMessage = '';
      } else {
        this.confirmMessage = '';
        this.errorMessage = 'Неверный код';
      }
    });
  }
}
