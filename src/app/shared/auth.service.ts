import {Component, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User, UserService} from './user.service';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor( private httpClient: HttpClient, private userService: UserService) {

  }


  authenticate(username, password): Observable<User> {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    return this.httpClient.get<User>('http://localhost:8080/validateLogin', {headers}).pipe(
      tap(
        userData => {
          sessionStorage.setItem('id', userData.id.toString());
          this.userService.getUser(userData.id.toString()).subscribe(value => this.userService.user = value);
          return userData;
        }
      )
    );
  }


  isUserLoggedIn() {
    const user = sessionStorage.getItem('id');
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('id');
    this.userService.user = null;
    this.userService.isAdmin = false;
    this.userService.isModerator = false;
    this.userService.isUser = false;
  }

}
