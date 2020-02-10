import { Component, OnInit } from '@angular/core';
import {Message, MessageService} from '../shared/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  form: Message = {id: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(public messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.messageService.messages.find(value => value.id === id);
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
    this.messageService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.messageService.messages.length; i++) {
        if (this.messageService.messages[i].id === value.id) {
          this.messageService.messages[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.messageService.messages.push(value);
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
    this.messageService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
        for (let i = 0; i < this.messageService.messages.length; i++) {
          if (this.messageService.messages[i].id === id) {
            this.messageService.messages.splice(i, 1);
            break;
          }
        }
      }
    });

  }

}
