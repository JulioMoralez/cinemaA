import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import * as prop from './globals';

export class Hall {
  constructor(
    public id: number,
    public name: string,
    public row: number,
    public place: number,
  ) {}
}


@Injectable({
  providedIn: 'root'
})
export class HallService {

  public url = prop.springapp + '/hall';
  public hall: Hall = null;
  public halls: Hall[] = null;

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<Hall> {
    return this.http.get<Hall>(this.url + '/' + id).pipe(tap(x => this.hall = x));
  }

  getEs(): Observable<Hall[]> {
    return this.http.get<Hall[]>(this.url + 's/').pipe(tap(x => this.halls = x));
  }

  delete(id: number): Observable<Hall> {
    return this.http.delete<Hall>(this.url + '/' + id);
  }

  addOrUpdate(hall: Hall) {
    console.log(hall);
    return this.http.post<Hall>(this.url + '/', hall);
  }

}
