import { Component, OnInit } from '@angular/core';
import {Film, FilmService} from '../shared/film.service';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {

  filmFrom: Film = {id: null, name: null, year: null, genres: null, length: null, picPath: null, rating: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private filmService: FilmService) { }

  ngOnInit() {
    this.filmService.getMovies().subscribe();
  }

  getFilm() {
    this.filmService.getMovies().subscribe(value => console.log(value));
  }

  updateFilmForm(id: number) {
    const film = this.filmService.movies.find(value => value.id === id);
    this.filmFrom.id = film.id;
    this.filmFrom.name = film.name;
    this.filmFrom.year = film.year;
    this.filmFrom.genres = film.genres;
    this.filmFrom.length = film.length;
    this.filmFrom.picPath = film.picPath;
    this.filmFrom.rating = film.rating;
    this.editor = true;
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  updateFilm() {
    this.addOrUpdateFilm();
  }

  addFilm() {
    this.filmFrom.id = null;
    this.addOrUpdateFilm();
  }

  addOrUpdateFilm() {
    this.filmService.addOrUpdateFilm(this.filmFrom).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.filmService.movies.length; i++) {
        if (this.filmService.movies[i].id === value.id) {
          this.filmService.movies[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.filmService.movies.push(value);
        this.confirmMessage = 'Фильм добавлен';
      }
    });
    this.editor = false;
  }


  breakFilm() {
    this.editor = false;
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  delete(id: number) {
    this.filmService.deleteFilm(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
        for (let i = 0; i < this.filmService.movies.length; i++) {
          if (this.filmService.movies[i].id === id) {
            this.filmService.movies.splice(i, 1);
            break;
          }
        }
      }
    });

  }

}
