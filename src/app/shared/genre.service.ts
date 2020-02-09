import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import * as prop from './globals';

export class Genre {
  constructor(
    public id: number,
    public name: string,
    public check: boolean,
  ) {}
}


@Injectable({
  providedIn: 'root'
})
export class GenreService {

  public url = prop.springapp + '/genre';
  public genre: Genre = null;
  public genres: Genre[] = null;

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<Genre> {
    return this.http.get<Genre>(this.url + '/' + id).pipe(tap(x => this.genre = x));
  }

  getEs(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.url + 's/').pipe(tap(x => this.genres = x));
  }

  delete(id: number): Observable<Genre> {
    return this.http.delete<Genre>(this.url + '/' + id);
  }

  addOrUpdate(genre: Genre) {
    return this.http.post<Genre>(this.url + '/', genre);
  }

}
