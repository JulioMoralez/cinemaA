import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Genre} from './genre.service';



export class Film {

  constructor(
    public id: number,
    public name: string,
    public year: number,
    public picPath: string,
    public length: number,
    public rating: number,
    public genres: Genre[]) { }
}


@Injectable({
  providedIn: 'root'
})
export class FilmService {

  public url = 'http://localhost:8080/film';
  public film: Film;
  public films: Film[];
  public filmsDay: Film[];

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<Film> {
    return this.http.get<Film>(this.url + '/' + id).pipe(tap(x => this.film = x));
  }

  getEs(): Observable<Film[]> {
    return this.http.get<Film[]>(this.url + 's/').pipe(tap(x => this.films = x));
  }

  delete(id: number): Observable<Film> {
    return this.http.delete<Film>(this.url + '/' + id);
  }

  addOrUpdate(film: Film) {
      return this.http.post<Film>(this.url + '/', film);
  }

  getFilmsDay(day: string): Observable<Film[]> {
    return this.http.get<Film[]>(this.url + 's/day/' + day).pipe(tap(x => {
      this.filmsDay = x;
      console.log('1');
      console.log(x);
      console.log('2');
    }));
  }

}
