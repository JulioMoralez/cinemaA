import {Injectable, NgModule} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Genre} from './genre.service';
import * as prop from './globals';



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

  public url = prop.springapp + '/film';
  public film: Film = null;
  public films: Film[] = null;
  public filmsDay: Film[][] = [];
  private selectedFile: File = null;

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

  getFilmsDay(day: number): Observable<Film[]> {
    return this.http.get<Film[]>(this.url + 's/day/' + day).pipe(tap(x => {
      this.filmsDay[day] = x;
    }));
  }

  fileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
    console.log(this.selectedFile);
  }

  upload(id: number) {
    const fd = new FormData();
    fd.append('id', id.toString());
    fd.append('image', this.selectedFile, this.selectedFile.name);
    console.log(fd);
    this.http.post(this.url + '/img', fd).subscribe(value => console.log(value));
  }

}
