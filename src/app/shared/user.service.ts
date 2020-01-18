import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export interface Role {
  name: string;
  runame: string;
  check: boolean;
}

export class User {

  constructor(
    public id: number,
    public username: string,
    public name: string,
    public roles: Role[],
    public password: string,
    public emailConfirmed: boolean,
    public verifyCode: string,
    public email: string) { }


}

export interface UserAuth {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: User = null;
  public url = 'http://localhost:8080/user';

   constructor(private http: HttpClient) { }


  getUser(id: string): Observable<User> {
     return this.http.get<User>(this.url + '/' + id).pipe(tap(x => this.user = x));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 's/');
  }


  createOrUpdateUser(user: User) {
     if (user.id !== null) {
      return this.http.post<User>(this.url + '/' + user.id, user);
    } else {
      return this.http.post<User>(this.url + '/', user);
    }
  }

  verifyEmail(id: number): Observable<User> {
    const user: User = {
      id,
      verifyCode: null,
      emailConfirmed: null,
      name: null,
      roles: null,
      username: null,
      password: null,
      email: null
    };
    return this.http.post<User>(this.url + '/sendemail', user);
  }

  confirmCode(id: number, verifyCode: string): Observable<User> {
     if (verifyCode === undefined) {
       verifyCode = '';
     }
     const user: User = {
       id,
       verifyCode,
       emailConfirmed: null,
       name: null,
       roles: null,
       username: null,
       password: null,
       email: null
     };
     return this.http.post<User>(this.url + '/confirm', user);
  }
}
