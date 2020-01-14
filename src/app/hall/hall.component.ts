import { Component, OnInit } from '@angular/core';
import {Hall, HallService} from '../shared/hall.service';

@Component({
  selector: 'app-hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {

  form: Hall = {id: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private hallService: HallService) { }

  ngOnInit() {
    this.hallService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.hallService.halls.find(value => value.id === id);
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
    this.hallService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.hallService.halls.length; i++) {
        if (this.hallService.halls[i].id === value.id) {
          this.hallService.halls[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.hallService.halls.push(value);
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
    this.hallService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
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
