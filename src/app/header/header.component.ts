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
      this.userService.getUser(id).subscribe();
    }
  }

  login() {
    this.authService.authenticate(this.username, this.password).subscribe();
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }

  register() {
    this.router.navigate(['/registration']);
  }
}
