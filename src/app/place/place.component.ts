import { Component, OnInit } from '@angular/core';
import {Place, PlaceService} from '../shared/place.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {

  form: Place = {id: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private placeService: PlaceService) { }

  ngOnInit() {
    this.placeService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.placeService.places.find(value => value.id === id);
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
    this.placeService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.placeService.places.length; i++) {
        if (this.placeService.places[i].id === value.id) {
          this.placeService.places[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.placeService.places.push(value);
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
    this.placeService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
        for (let i = 0; i < this.placeService.places.length; i++) {
          if (this.placeService.places[i].id === id) {
            this.placeService.places.splice(i, 1);
            break;
          }
        }
      }
    });

  }

}
