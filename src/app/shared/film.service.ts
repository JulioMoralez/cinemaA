import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class Genre {
  constructor(
    public id: number,
    public name: string,
  ) {}
}

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

  public film: Film;
  public movies: Film[];

  constructor(private http: HttpClient) { }


  getFilm(id: string): Observable<Film> {
    return this.http.get<Film>('http://localhost:8080/film/' + id).pipe(tap(x => this.film = x));
  }

  getMovies(): Observable<Film[]> {
    return this.http.get<Film[]>('http://localhost:8080/movies/').pipe(tap(x => this.movies = x));
  }

  deleteFilm(id: number): Observable<Film> {
    return this.http.delete<Film>('http://localhost:8080/film/' + id);
  }

  addOrUpdateFilm(film: Film) {
    // if (film.id !== null) {
    //   return this.http.post<Film>('http://localhost:8080/film/' + film.id, film);
    // } else {
      return this.http.post<Film>('http://localhost:8080/film/', film);
    // }
  }

}
