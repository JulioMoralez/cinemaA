import { Component, OnInit } from '@angular/core';
import {Film, FilmService} from '../shared/film.service';
import {Genre, GenreService} from '../shared/genre.service';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {

  form: Film = {id: null, name: null, year: null, genres: null, length: null, picPath: null, rating: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  image1 = '//img//1.jpg';

  constructor(private filmService: FilmService, private genreService: GenreService) { }

  ngOnInit() {
    this.filmService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.filmService.films.find(value => value.id === id);
    this.form.id = film.id;
    this.form.name = film.name;
    this.form.year = film.year;
    this.form.length = film.length;
    this.form.picPath = film.picPath;
    this.form.rating = film.rating;
    this.editor = true;
    if (this.genreService.genres === null) {
      this.genreService.getEs().subscribe(value => {
        this.genreService.genres = value;
        this.fillGenres(film.genres);
      });
    } else {
      this.fillGenres(film.genres);
    }
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  private fillGenres(genres: Genre[]) {
    this.form.genres = this.genreService.genres;
    for (let i = 0; i < this.form.genres.length; i++) {
      if ((genres.find(value => value.id === this.form.genres[i].id) !== undefined) ) {
        this.form.genres[i].check = true;
      } else {
        this.form.genres[i].check = false;
      }
    }
  }

  onChangeGenre(id: number, check: boolean) {
    for (let i = 0; i < this.form.genres.length; i++) {
      if (this.form.genres[i].id === id) {
        this.form.genres[i].check = !check;
      }
    }

  }

  updateForm() {
    this.addOrUpdateForm();
  }

  addForm() {
    this.form.id = null;
    this.addOrUpdateForm();
  }

  addOrUpdateForm() {
    const genresTemp = [];
    for (let i = 0; i < this.form.genres.length; i++) {
      if (this.form.genres[i].check === true) {
        genresTemp.push(this.form.genres[i]);
      }
    }
    this.form.genres = genresTemp;
    this.filmService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.filmService.films.length; i++) {
        if (this.filmService.films[i].id === value.id) {
          this.filmService.films[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.filmService.films.push(value);
        this.confirmMessage = 'Фильм добавлен';
      }
    });
    this.editor = false;
  }


  breakForm() {
    this.editor = false;
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  delete(id: number) {
    this.filmService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
        for (let i = 0; i < this.filmService.films.length; i++) {
          if (this.filmService.films[i].id === id) {
            this.filmService.films.splice(i, 1);
            break;
          }
        }
      }
    });

  }

  fileSelected(event) {
    this.filmService.fileSelected(event);
  }

  upload(id: number) {
    this.filmService.upload(id);
  }
}
