import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Film} from './film.service';

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

   constructor(private http: HttpClient) { }


  getUser(id: string): Observable<User> {
     return this.http.get<User>('http://localhost:8080/user/' + id).pipe(tap(x => this.user = x));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8080/users/');
  }


  createOrUpdateUser(user: User) {
     if (user.id !== null) {
      return this.http.post<User>('http://localhost:8080/user/' + user.id, user);
    } else {
      return this.http.post<User>('http://localhost:8080/user/', user);
    }
  }

}
