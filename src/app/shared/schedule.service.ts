import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Film} from './film.service';
import {Hall} from './hall.service';
import {formatDate} from '@angular/common';
import {UtilService} from './util.service';
import {UserService} from './user.service';

export class Schedule {
  constructor(
    public id: number,
    public film: Film,
    public hall: Hall,
    public time: number,
    public date: Date,
    public price: number
  ) {}
}

export class PlacesInHallDto {
  constructor(
    public userId: number,
    public scheduleId: number,
    public row: number,
    public place: number,
    public maxRow: number,
    public maxPlace: number,
    public placesForSchedule: number[][],
  ) {
  }
}


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public url = 'http://localhost:8080/schedule';
  public schedule: Schedule = null;
  public schedules: Schedule[] = null;
  public schedulesToday: Schedule[] = null;

  public placesForSchedule: number[][] = null;

  constructor(private http: HttpClient, private utilService: UtilService, private userService: UserService) { }


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

  getScheduleWeek(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.url + 's/week').pipe(tap(x => {
      this.schedules = x;
      const now = new Date();
      this.schedulesToday = x.filter(e => {
        return this.utilService.compareDate(new Date(e.date), now);
      });
    }));
  }


  getSchedulesToday(day: number) {
    this.schedulesToday = this.schedules.filter(e => {
      return new Date(e.date).getDate() === day;
    });
  }

  selectPlace(param: PlacesInHallDto): Observable<PlacesInHallDto> {
      return this.http.post<PlacesInHallDto>(this.url + '/placeselect/', param);
  }

}
