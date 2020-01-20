import { Component, OnInit } from '@angular/core';
import {ScheduleService} from '../shared/schedule.service';
import {UtilService} from '../shared/util.service';
import {Film, FilmService} from '../shared/film.service';
import {Genre, GenreService} from '../shared/genre.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {

  selectedDay: number;
  bestToday: Film[] = [];
  filmsWithGenreFilter: Film[] = [];
  genres: Genre[] = [];

  constructor(private scheduleService: ScheduleService,
              private utilService: UtilService,
              private filmService: FilmService,
              private genreService: GenreService) { }

  ngOnInit() {
    const d = new Date();
    this.scheduleService.getScheduleWeek().subscribe(value => this.selectDay(d.getDate(), d.getDay()));
    this.utilService.getDays().subscribe();
    this.genreService.getEs().subscribe(value => {
      this.genres = value;
      this.genres.forEach(value1 => value1.check = false);
    });
  }

  getFilmsTodayWithGenreFilter(filmToday: Film[]) {
    this.filmsWithGenreFilter = [];
    let genresLocal: Genre[] = [];
    for (let i = 0; i < this.genres.length; i++) {
      if (this.genres[i].check === true) {
        genresLocal.push(this.genres[i]);
      }
    }
    if (genresLocal.length === 0) {
      this.filmsWithGenreFilter = filmToday;
    } else {
      for (let i = 0; i < filmToday.length ; i++) {
        for (let j = 0; j < genresLocal.length; j++) {
          if (filmToday[i].genres.find(value => value.id === genresLocal[j].id)) {
            this.filmsWithGenreFilter.push(filmToday[i]);
            break;
          }
        }
      }
    }
    this.bestToday = this.filmsWithGenreFilter.sort((a, b) => b.rating - a.rating).slice(0, 3);

  }

  selectDay(day: number, dayOfWeek: number) {
    this.scheduleService.getSchedulesToday(day);
    this.selectedDay = dayOfWeek;
    if (this.filmService.filmsDay[dayOfWeek] === undefined) {
        this.filmService.getFilmsDay(dayOfWeek).subscribe(value => this.getFilmsTodayWithGenreFilter(value));
    } else {
      this.getFilmsTodayWithGenreFilter(this.filmService.filmsDay[dayOfWeek]);
    }

  }

  changeGenre(genre: Genre) {
    genre.check = !genre.check;
    this.getFilmsTodayWithGenreFilter(this.filmService.filmsDay[this.selectedDay]);
  }
}
