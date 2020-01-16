import { Component, OnInit } from '@angular/core';
import {ScheduleService} from '../shared/schedule.service';
import {UtilService} from '../shared/util.service';
import {Film, FilmService} from '../shared/film.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {

  selectedDay: number;
  bestToday: Film[] = [];

  constructor(private scheduleService: ScheduleService, private utilService: UtilService, private filmService: FilmService) { }

  ngOnInit() {
    this.scheduleService.getScheduleWeek().subscribe();
    this.utilService.getDays().subscribe();

  }

  getBestToday(filmToday: Film[]) {
    this.bestToday = filmToday.sort((a, b) => b.rating - a.rating).slice(0, 2);

  }

  selectDay(day: number, dayOfWeek: number) {
    this.scheduleService.getSchedulesToday(day);
    this.selectedDay = dayOfWeek;
    if (this.filmService.filmsDay[dayOfWeek] === undefined) {
        this.filmService.getFilmsDay(dayOfWeek).subscribe(value => this.getBestToday(value));
    } else {
      this.getBestToday(this.filmService.filmsDay[dayOfWeek]);
    }

  }
}
