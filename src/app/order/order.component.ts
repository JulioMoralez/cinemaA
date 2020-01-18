import { Component, OnInit } from '@angular/core';
import {Order, OrderService} from '../shared/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  form: Order = {id: null, user: null, schedule: null, places: null, key: null, orderTime: null, price: null};
  editor: boolean;
  errorMessage: string;
  confirmMessage: string;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getEs().subscribe();
  }

  openEditForm(id: number) {
    const order = this.orderService.orders.find(value => value.id === id);
    this.form.id = order.id;
    this.form.user = order.user;
    this.form.schedule = order.schedule;
    this.form.places = order.places;
    this.form.key = order.key;
    this.form.orderTime = order.orderTime;
    this.form.price = order.price;
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
          this.confirmMessage = 'Данные заказа изменены';
        }
      }
      if (this.confirmMessage === null) {
        this.orderService.orders.push(value);
        this.confirmMessage = 'Заказ добавлен';
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
        this.confirmMessage = 'Заказ удален';
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
