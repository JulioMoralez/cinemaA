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
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;
  myDays: Date[] = [];
  indexDay: number;
  hour: number;
  min: number;
  hours: number[] = [];
  mins: number[] = [];

  constructor(private scheduleService: ScheduleService,
              private hallService: HallService,
              private filmService: FilmService,
              private utilService: UtilService) { }

  ngOnInit() {
    this.scheduleService.getEs().subscribe();
    if (this.hallService.halls === null) {
      this.hallService.getEs().subscribe();
    }
    if (this.filmService.films === null) {
      this.filmService.getEs().subscribe();
    }
    if (this.utilService.myDays === null) {
      this.utilService.getDays().subscribe();
    }
    for (let i = 10; i <= 23; i++) {
      this.hours.push(i);
    }
    for (let i = 0; i <= 55; i = i + 5) {
      this.mins.push(i);
    }
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
    if ((this.form.date < this.myDays[0]) && (this.form.date.getDay() !== this.myDays[0].getDay())) {
      this.myDays.unshift(schedule.date);
      this.indexDay = 0;
    } else if ((this.form.date > this.myDays[6])  && (this.form.date.getDay() !== this.myDays[6].getDay())) {
      this.myDays.push(schedule.date);
      this.indexDay = 7;
    }


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
    this.form.date = this.myDays[this.indexDay];
    this.form.time = Number(this.hour) * 60 + Number(this.min);
    console.log(this.hour);
    console.log(this.min);
    console.log(this.form.time);
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
