import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class Place {
  constructor(
    public id: number,
  ) {}
}


@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  public url = 'http://localhost:8080/place';
  public place: Place;
  public places: Place[];

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<Place> {
    return this.http.get<Place>(this.url + '/' + id).pipe(tap(x => this.place = x));
  }

  getEs(): Observable<Place[]> {
    return this.http.get<Place[]>(this.url + 's/').pipe(tap(x => this.places = x));
  }

  delete(id: number): Observable<Place> {
    return this.http.delete<Place>(this.url + '/' + id);
  }

  addOrUpdate(place: Place) {
    return this.http.post<Place>(this.url + '/', place);
  }

}
