import { Component, OnInit } from '@angular/core';
import {ScheduleService} from '../shared/schedule.service';
import {UtilService} from '../shared/util.service';
import {FilmService} from '../shared/film.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {

  constructor(private scheduleService: ScheduleService, private utilService: UtilService, private filmService: FilmService) { }

  ngOnInit() {
    this.scheduleService.getScheduleWeek().subscribe();
    this.utilService.getDays().subscribe();

  }

  selectDay(day: number, dayOfWeek: number) {
    this.scheduleService.getSchedulesToday(day);
    this.filmService.getFilmsDay(dayOfWeek.toString()).subscribe();
  }
}
