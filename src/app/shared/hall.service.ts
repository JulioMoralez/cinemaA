import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class Hall {
  constructor(
    public id: number,
  ) {}
}


@Injectable({
  providedIn: 'root'
})
export class HallService {

  public url = 'http://localhost:8080/hall';
  public hall: Hall;
  public halls: Hall[];

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
    return this.http.post<Hall>(this.url + '/', hall);
  }

}
