import { Component, OnInit } from '@angular/core';
import {Hall, HallService} from '../shared/hall.service';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {

  form: Hall = {id: null, name: null, row: null, place: null};
  // editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(public hallService: HallService) { }

  ngOnInit() {
    this.hallService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.hallService.halls.find(value => value.id === id);
    this.form.id = film.id;
    this.form.name = film.name;
    this.form.row = film.row;
    this.form.place = film.place;
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
    this.hallService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.hallService.halls.length; i++) {
        if (this.hallService.halls[i].id === value.id) {
          this.hallService.halls[i] = value;
          this.confirmMessage = 'Данные зала изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.hallService.halls.push(value);
        this.confirmMessage = 'Зал добавлен';
      }
    });
  }


  breakForm() {
    this.errorMessage = null;
    this.confirmMessage = null;
  }

  delete(id: number) {
    this.hallService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Зал удален';
        this.form.id = null;
        for (let i = 0; i < this.hallService.halls.length; i++) {
          if (this.hallService.halls[i].id === id) {
            this.hallService.halls.splice(i, 1);
            break;
          }
        }
      }
    });

  }

}
