import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlacesInHallDto, Schedule, ScheduleService} from '../shared/schedule.service';
import {UserService} from '../shared/user.service';
import {OrderConfirmDto, OrderService} from '../shared/order.service';
import {WebsocketService} from '../shared/websocket.service';
import {Hall} from '../shared/hall.service';

export class PlaceSimple {
  row: number;
  place: number;
}

@Component({
  selector: 'app-select-place',
  templateUrl: './schedule-place.component.html',
  styleUrls: ['./schedule-place.component.scss']
})
export class SchedulePlaceComponent implements OnInit, OnDestroy {

  scheduleId: string;
  schedule: Schedule = null;
  placesForSchedule: number[][];
  ticketCount: number;
  price: number;
  places: PlaceSimple[] = [];
  errorMessage: string;
  confirm: number; // = -1 событие клик на место, = 1 событи клик на кнопку купить билеты
  hall: Hall;
  testText: string;

  constructor(public route: ActivatedRoute,
              public scheduleService: ScheduleService,
              public userService: UserService,
              public orderService: OrderService,
              public websocketService: WebsocketService) { }

  ngOnInit() {
    this.scheduleId = this.route.snapshot.paramMap.get('id');
    this.websocketService.setSchedulePlaceComponent(this);
    this.websocketService._connect();
  }

  ngOnDestroy(): void {
    this.websocketService._disconnect();
  }

  selectPlace(i: number, j: number, confirm: number) {
    this.errorMessage = '';
    this.confirm = confirm;
    if (this.schedule === null) {
      this.scheduleService.getE(this.scheduleId).subscribe(value => {
        this.selectPlaceAfterFindSchedule(this.scheduleId, i, j, value);
      });
    } else {
      this.selectPlaceAfterFindSchedule(this.scheduleId, i , j, this.schedule);
    }
  }

  selectPlaceAfterFindSchedule(scheduleId: string, i: number, j: number, schedule: Schedule) {
    this.schedule = schedule;
    this.hall = schedule.hall;
    const userId = this.userService.user === null ? -1 : this.userService.user.id;
    const param: PlacesInHallDto = {
      userId,
      scheduleId: Number(scheduleId),
      row: i,
      place: j,
      maxRow: this.hall.row,
      maxPlace: this.hall.place,
      placesForSchedule: [],
    };
    this.websocketService._send(param);
    }

  orderConfirm() {
    const userId = this.userService.user === null ? -1 : this.userService.user.id;
    const param: OrderConfirmDto = {
      userId,
      scheduleId: this.schedule.id,
      places: [],
    };
    this.orderService.orderConfirm(param).subscribe(value => {
      console.log(value);
      this.selectPlace(-1, -1, -1);
    });
  }

  connect() {
    this.websocketService._connect();
  }

  disconnect() {
    this.websocketService._disconnect();
  }

  sendMessage() {
    this.selectPlace(-1, -1, -1);
    // this.websocketService._send(this.testText);
  }

  calcTicket() {
    let verifyOrder = true;
    this.ticketCount = 0;
    if (this.confirm === -1) {
      this.places = [];
    }
    console.log(this.confirm);
    for (let row = 0; row < this.hall.row; row++) {
      for (let place = 0; place < this.hall.place; place++) {
        if (this.placesForSchedule[row][place] === 1) {
          const selectedPlace: PlaceSimple = {row, place};
          if (this.confirm === 1) { // нажата кнопка заказа.Нужно перепроверить, что время брони мест не вышла
            if (this.places[this.ticketCount].row !== row || this.places[this.ticketCount].place !== place) {
              verifyOrder = false;
            }
          } else {
            this.places.push(selectedPlace);
          }
          this.ticketCount++;
        }
      }
    }
    this.price = this.ticketCount * this.schedule.price;
    console.log(this.places);
    if (this.confirm === 1) {
      if ((verifyOrder === true) && (this.ticketCount > 0)) {
        this.orderConfirm();
      } else {  // в случае неудачной проверки - время брони вышло, а пользователь остался на странице
        this.errorMessage = 'Время брони вышло';
        this.ticketCount = 0;
        this.places = [];
        for (let row = 0; row < this.hall.row; row++) {  // заново считаем число выбранных мест
          for (let place = 0; place < this.hall.place; place++) {
            if (this.placesForSchedule[row][place] === 1) {
              const selectedPlace: PlaceSimple = {row, place};
              this.places.push(selectedPlace);
              this.ticketCount++;
            }
          }
        }
      }
    }
  }
}
