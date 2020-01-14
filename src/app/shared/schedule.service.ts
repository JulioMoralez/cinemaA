import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class Schedule {
  constructor(
    public id: number,
  ) {}
}


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public url = 'http://localhost:8080/schedule';
  public schedule: Schedule;
  public schedules: Schedule[];

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(this.url + '/' + id).pipe(tap(x => this.schedule = x));
  }

  getEs(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.url + 's/').pipe(tap(x => this.schedules = x));
  }

  delete(id: number): Observable<Schedule> {
    return this.http.delete<Schedule>(this.url + '/' + id);
  }

  addOrUpdate(schedule: Schedule) {
    return this.http.post<Schedule>(this.url + '/', schedule);
  }

}
