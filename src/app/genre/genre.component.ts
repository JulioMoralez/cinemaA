import { Component, OnInit } from '@angular/core';
import {Genre, GenreService} from '../shared/genre.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

  form: Genre = {id: null, name: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private genreService: GenreService) { }

  ngOnInit() {
    this.genreService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.genreService.genres.find(value => value.id === id);
    this.form.id = film.id;
    this.editor = true;
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  updateForm() {
    this.addOrUpdateForm();
  }

  addForm() {
    this.form.id = null;
    this.addOrUpdateForm();
  }

  addOrUpdateForm() {
    this.genreService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.genreService.genres.length; i++) {
        if (this.genreService.genres[i].id === value.id) {
          this.genreService.genres[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.genreService.genres.push(value);
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
    this.genreService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
        for (let i = 0; i < this.genreService.genres.length; i++) {
          if (this.genreService.genres[i].id === id) {
            this.genreService.genres.splice(i, 1);
            break;
          }
        }
      }
    });

  }

}
