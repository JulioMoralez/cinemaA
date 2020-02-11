import {Pipe, PipeTransform} from '@angular/core';
import {Film} from './film.service';

@Pipe({
  name: 'filmFilter'
})
export class FilmFilterPipe implements PipeTransform {
  transform(films: Film[], searchName: string = '', searchYear: string = ''): Film[] {

    if (searchName.trim()) {
      films = films.filter(film => {
        if (film.name === null) {
          return false;
        }
        return film.name.toLocaleLowerCase().indexOf(searchName.trim().toLocaleLowerCase()) !== -1;
      });
    }
    if (searchYear.trim()) {
      films = films.filter(film => {
        if (film.year === null) {
          return false;
        }
        return film.year.toString().indexOf(searchYear.trim().toLocaleLowerCase()) !== -1;
      });
    }
    return films;
  }

}
