import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlacesInHallDto, Schedule, ScheduleService} from '../shared/schedule.service';
import {UserService} from '../shared/user.service';
import {OrderConfirmDto, OrderService} from '../shared/order.service';
import {WebsocketService} from '../shared/websocket.service';

export class PlaceSimple {
  row: number;
  place: number;
}

@Component({
  selector: 'app-select-place',
  templateUrl: './schedule-place.component.html',
  styleUrls: ['./schedule-place.component.scss']
})
export class SchedulePlaceComponent implements OnInit {

  private scheduleId: string;
  private schedule: Schedule = null;
  private placesForSchedule: number[][];
  private ticketCount: number;
  private price: number;
  private places: PlaceSimple[] = [];
  private errorMessage: string;
  testText: string;

  constructor(private route: ActivatedRoute,
              private scheduleService: ScheduleService,
              private userService: UserService,
              private orderService: OrderService,
              private websocketService: WebsocketService) { }

  ngOnInit() {
    this.scheduleId = this.route.snapshot.paramMap.get('id');
    this.websocketService._connect();
    this.selectPlace(-1, -1, -1);
  }

  selectPlace(i: number, j: number, confirm: number) {
    this.errorMessage = '';
    if (this.schedule === null) {
      this.scheduleService.getE(this.scheduleId).subscribe(value => {
        this.selectPlaceAfterFindSchedule(this.scheduleId, i, j, confirm, value);
      });
    } else {
      this.selectPlaceAfterFindSchedule(this.scheduleId, i , j, confirm, this.schedule);
    }
  }

  selectPlaceAfterFindSchedule(scheduleId: string, i: number, j: number, confirm: number, schedule: Schedule) {
    this.schedule = schedule;
    const hall = schedule.hall;
    const userId = this.userService.user === null ? -1 : this.userService.user.id;
    const param: PlacesInHallDto = {
      userId,
      scheduleId: Number(scheduleId),
      row: i,
      place: j,
      maxRow: hall.row,
      maxPlace: hall.place,
      placesForSchedule: [],
    };
    let verifyOrder = true;
    this.ticketCount = 0;
    if (confirm === -1) {
      this.places = [];
    }
    this.websocketService._send(param);
    // this.scheduleService.selectPlace(param).subscribe(value => {
    //   this.placesForSchedule = value.placesForSchedule;
    //   for (let row = 0; row < hall.row; row++) {
    //     for (let place = 0; place < hall.place; place++) {
    //       if (this.placesForSchedule[row][place] === 1) {
    //         const selectedPlace: PlaceSimple = {row, place};
    //         if (confirm === 1) { // нажата кнопка заказа.Нужно перепроверить, что время брони мест не вышла
    //           if (this.places[this.ticketCount].row !== row || this.places[this.ticketCount].place !== place) {
    //             verifyOrder = false;
    //           }
    //         } else {
    //           this.places.push(selectedPlace);
    //         }
    //         this.ticketCount++;
    //       }
    //     }
    //   }
    //   this.price = this.ticketCount * this.schedule.price;
    //   console.log(this.places);
    //   if (confirm === 1) {
    //     if ((verifyOrder === true) && (this.ticketCount > 0)) {
    //       this.orderConfirm();
    //     } else {  // в случае неудачной проверки - время брони вышло, а пользователь остался на странице
    //       this.errorMessage = 'Время брони вышло';
    //       this.ticketCount = 0;
    //       this.places = [];
    //       for (let row = 0; row < hall.row; row++) {  // заново считаем число выбранных мест
    //         for (let place = 0; place < hall.place; place++) {
    //           if (this.placesForSchedule[row][place] === 1) {
    //             const selectedPlace: PlaceSimple = {row, place};
    //             this.places.push(selectedPlace);
    //             this.ticketCount++;
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
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
}
