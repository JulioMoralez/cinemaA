import {Component, Input, OnInit} from '@angular/core';
import {Film} from '../../shared/film.service';
import * as prop from '../../shared/globals';

@Component({
  selector: 'app-film-form',
  templateUrl: './film-form.component.html',
  styleUrls: ['./film-form.component.scss']
})
export class FilmFormComponent implements OnInit {

  @Input() value: Film;
  public url = prop.springapp + '/img/';

  constructor() { }

  ngOnInit() {
  }

}
