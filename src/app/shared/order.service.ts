import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Film} from './film.service';

export class Order {
  constructor(
    public id: number,
  ) {}
}


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public url = 'http://localhost:8080/order';
  public order: Order = null;
  public orders: Order[] = null;

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<Order> {
    return this.http.get<Order>(this.url + '/' + id).pipe(tap(x => this.order = x));
  }

  getEs(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url + 's/').pipe(tap(x => this.orders = x));
  }

  delete(id: number): Observable<Order> {
    return this.http.delete<Order>(this.url + '/' + id);
  }

  addOrUpdate(order: Order) {
    return this.http.post<Order>(this.url + '/', order);
  }

}
