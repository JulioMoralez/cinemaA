import { Component, OnInit } from '@angular/core';
import {Order, OrderService} from '../shared/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  form: Order = {id: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const film = this.orderService.orders.find(value => value.id === id);
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
    this.orderService.addOrUpdate(this.form).subscribe(value => {
      this.confirmMessage = null;
      for (let i = 0; i < this.orderService.orders.length; i++) {
        if (this.orderService.orders[i].id === value.id) {
          this.orderService.orders[i] = value;
          this.confirmMessage = 'Данные фильма изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.orderService.orders.push(value);
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
    this.orderService.delete(id).subscribe(value => {
      if (value.id === -1) {
        this.errorMessage = 'Удаление не произведено';
        this.confirmMessage = null;
      } else {
        this.errorMessage = null;
        this.confirmMessage = 'Фильм удален';
        for (let i = 0; i < this.orderService.orders.length; i++) {
          if (this.orderService.orders[i].id === id) {
            this.orderService.orders.splice(i, 1);
            break;
          }
        }
      }
    });

  }

}
