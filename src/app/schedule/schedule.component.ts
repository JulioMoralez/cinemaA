import { Component, OnInit } from '@angular/core';
import {Schedule, ScheduleService} from '../shared/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  form: Schedule = {id: null, film: null, hall: null, time: null, date: null, price: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.scheduleService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.scheduleService.schedules.find(value => value.id === id);
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
    this.scheduleService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.scheduleService.schedules.length; i++) {
        if (this.scheduleService.schedules[i].id === value.id) {
          this.scheduleService.schedules[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.scheduleService.schedules.push(value);
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
    this.scheduleService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
        for (let i = 0; i < this.scheduleService.schedules.length; i++) {
          if (this.scheduleService.schedules[i].id === id) {
            this.scheduleService.schedules.splice(i, 1);
            break;
          }
        }
      }
    });

  }

}
