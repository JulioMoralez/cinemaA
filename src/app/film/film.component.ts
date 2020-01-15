import { Component, OnInit } from '@angular/core';
import {Film, FilmService} from '../shared/film.service';
import {GenreService} from '../shared/genre.service';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {

  filmForm: Film = {id: null, name: null, year: null, genres: null, length: null, picPath: null, rating: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  image1 = '//img//1.jpg';

  constructor(private filmService: FilmService, private genreService: GenreService) { }

  ngOnInit() {
    this.filmService.getEs().subscribe(value => console.log(value));
  }

  openEditForm(id: number) {
    const film = this.filmService.films.find(value => value.id === id);
    this.filmForm.id = film.id;
    this.filmForm.name = film.name;
    this.filmForm.year = film.year;
    this.filmForm.genres = film.genres;
    this.filmForm.length = film.length;
    this.filmForm.picPath = film.picPath;
    this.filmForm.rating = film.rating;
    this.editor = true;
    // if (this.genreService.genres === null) {
    //   this.genreService.getEs().subscribe(value => {
    //
    //   });
    // }
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  updateForm() {
    this.addOrUpdateForm();
  }

  addForm() {
    this.filmForm.id = null;
    this.addOrUpdateForm();
  }

  addOrUpdateForm() {
    this.filmService.addOrUpdate(this.filmForm).subscribe(value => {
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

}
