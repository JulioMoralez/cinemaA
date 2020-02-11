import { Component, OnInit } from '@angular/core';
import {Schedule, ScheduleService} from '../shared/schedule.service';
import {Hall, HallService} from '../shared/hall.service';
import {FilmService} from '../shared/film.service';
import {MyDay, UtilService} from '../shared/util.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  form: Schedule = {id: null, film: null, hall: null, time: null, date: null, price: null};
  // editor: boolean;
  errorMessage: string;
  confirmMessage: string;
  myDays: Date[] = [];
  indexDay: number;
  hour: number;
  min: number;
  hours: number[] = [];
  mins: number[] = [];

  constructor(public scheduleService: ScheduleService,
              public hallService: HallService,
              public filmService: FilmService,
              public utilService: UtilService) { }

  ngOnInit() {
    this.scheduleService.getEs().subscribe();
    if (this.filmService.films === null) {
      this.filmService.getEs().subscribe(value => {
        if (value.length > 0) {
          this.form.film = value[0];
        }
      });
    } else {
      if (this.filmService.films.length > 0) {
        this.form.film = this.filmService.films[0];
      }
    }
    if (this.hallService.halls === null) {
      this.hallService.getEs().subscribe(value => {
        if (value.length > 0) {
          this.form.hall = value[0];
        }
      });
    } else {
      if (this.hallService.halls.length > 0) {
        this.form.hall = this.hallService.halls[0];
      }
    }
    if (this.utilService.myDays === null) {
      this.utilService.getDays().subscribe();
    }
    this.form.date = new Date();
    this.fillDays();
    for (let i = 10; i <= 23; i++) {
      this.hours.push(i);
    }
    this.hour = 10;
    for (let i = 0; i <= 55; i = i + 5) {
      this.mins.push(i);
    }
    this.min = 0;
  }

  openEditForm(id: number) {
    const schedule = this.scheduleService.schedules.find(value => value.id === id);
    this.form.id = schedule.id;
    this.form.film = schedule.film;
    this.form.hall = schedule.hall;
    this.form.price = schedule.price;
    this.form.time = schedule.time;
    this.hour = Math.floor(this.form.time / 60);
    this.min = this.form.time % 60;

    this.form.date = new Date(schedule.date);
    this.fillDays();
    if ((this.form.date < this.myDays[0]) && (this.form.date.getDay() !== this.myDays[0].getDay())) {
      this.myDays.unshift(schedule.date);
      this.indexDay = 0;
    } else if ((this.form.date > this.myDays[6])  && (this.form.date.getDay() !== this.myDays[6].getDay())) {
      this.myDays.push(schedule.date);
      this.indexDay = 7;
    }


    this.errorMessage = null;
    this.confirmMessage = null;
  }

  fillDays() {
    this.myDays = [];
    for (let i = 0; i < 7; i++) {
      const now = new Date();
      now.setDate(now.getDate() + i);
      this.myDays.push(now);
      if ((now.getFullYear() === this.form.date.getFullYear()) &&
        (now.getDate() === this.form.date.getDate()) &&
        (now.getMonth() === this.form.date.getMonth())) {
        this.indexDay = i;
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
    this.form.date = this.myDays[this.indexDay];
    this.form.time = Number(this.hour) * 60 + Number(this.min);
    this.scheduleService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.scheduleService.schedules.length; i++) {
        if (this.scheduleService.schedules[i].id === value.id) {
          this.confirmMessage = 'Данные сеанса изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.confirmMessage = 'Сеанс добавлен';
      }
      // обновляем все сеансы с сервера. Чтобы самомтоятельно не заполнять объекты film и hall в scheduleService.schedules
      this.scheduleService.getEs().subscribe();
    });
  }


  breakForm() {
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
        this.confirmMessage = 'Сеанс удален';
        this.form.id = null;
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
