import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/auth.service';
import {UserService} from '../shared/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    const id = (sessionStorage.getItem('id'));
    if (id !== null) {
      console.log('AuthService1');
      this.userService.getUser(id).subscribe(value => console.log(value));
    } else {
      console.log('AuthService2');
    }
  }

  login() {
    this.authService.authenticate(this.username, this.password).subscribe();

  }

  logout() {
    this.authService.logOut();
  }

  register() {
    console.log('sd');
    this.router.navigate(['/registration']);
  }
}
