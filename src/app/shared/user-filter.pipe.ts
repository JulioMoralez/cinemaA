import {Pipe, PipeTransform} from '@angular/core';
import {User} from './user.service';

@Pipe({
  name: 'userFilter'
})


export class UserFilterPipe implements PipeTransform {
  transform(users: User[], searchString: string = ''): User[] {
    if (!searchString.trim()) {
      return users;
    }
    return users.filter(user => user.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

}
