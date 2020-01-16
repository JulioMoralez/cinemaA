import {Component, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Genre} from './genre.service';

export class MyDay {
  constructor(
    public dayOfWeek: number,
    public dayOfMonth: number,
    public year: number,
    public dayOfWeekName: string,
    public monthName: string,
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public url = 'http://localhost:8080/util';
  public myDays: MyDay[] = null;

  constructor( private http: HttpClient) {

  }

  getDays(): Observable<MyDay[]> {
    return this.http.get<MyDay[]>(this.url + '/days').pipe(tap(x => this.myDays = x));
  }

  formatDate(date: Date) {
    let s = date.getFullYear().toString() + '-';
    const mm = date.getMonth() + 1;
    if (mm < 10) {  s = s + '0'; }
    s = s + mm.toString() + '-';
    const dd = date.getDate();
    if (dd < 10) { s = s + '0'; }
    s = s + dd.toString();

    return s;
  }

  compareDate(date1: Date, date2: Date): boolean {
    return ((date1.getFullYear() === date2.getFullYear()) &&
      (date1.getMonth() === date2.getMonth()) &&
      (date1.getDate() === date2.getDate()));
  }

}
