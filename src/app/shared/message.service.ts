import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class Message {
  constructor(
    public id: number,
  ) {}
}



@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public url = 'http://localhost:8080/message';
  public message: Message;
  public messages: Message[];

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<Message> {
    return this.http.get<Message>(this.url + '/' + id).pipe(tap(x => this.message = x));
  }

  getEs(): Observable<Message[]> {
    return this.http.get<Message[]>(this.url + 's/').pipe(tap(x => this.messages = x));
  }

  delete(id: number): Observable<Message> {
    return this.http.delete<Message>(this.url + '/' + id);
  }

  addOrUpdate(message: Message) {
    return this.http.post<Message>(this.url + '/', message);
  }

}
