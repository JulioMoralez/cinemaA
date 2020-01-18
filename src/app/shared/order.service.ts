import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {User} from './user.service';
import {Schedule} from './schedule.service';
import {Place} from './place.service';


export class OrderConfirmDto {
  constructor(
    public userId: number,
    public scheduleId: number,
    public places: number[][],
  ) {
  }
}

export class Order {
  constructor(
    public id: number,
    public user: User,
    public schedule: Schedule,
    public places: Place[],
    public key: string,
    public orderTime: Date,
    public price: number,
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

  orderConfirm(orderConfirm: OrderConfirmDto): Observable<OrderConfirmDto> {
    return this.http.post<OrderConfirmDto>(this.url + '/confirm', orderConfirm);
  }

  findByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.url + '/user/' + userId);
  }

}
