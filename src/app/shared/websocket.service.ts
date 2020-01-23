import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {PlacesInHallDto} from './schedule.service';
import {UserService} from './user.service';
import {SchedulePlaceComponent} from '../schedule-place/schedule-place.component';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public placesInHallDto: PlacesInHallDto = null;
  public placesForSchedule: number[][] = [];

  webSocketEndPoint = 'http://localhost:8080/ws';
  topic = '/topic/placeselectws';
  stompClient: any;
  private schedulePlaceComponent: SchedulePlaceComponent;

  constructor(private userService: UserService) {
  }

  setSchedulePlaceComponent(schedulePlaceComponent: SchedulePlaceComponent) {
    this.schedulePlaceComponent = schedulePlaceComponent;
  }

  _connect() {
    console.log('Initialize WebSocket Connection');
    const ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const this2 = this;
    this2.stompClient.connect({}, function(frame) {
      this2.schedulePlaceComponent.selectPlace(-1, -1, -1);
      this2.stompClient.subscribe(this2.topic, function(sdkEvent) {
        this2.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _send(message) {
    this.stompClient.send('/app/placeselectws', {}, JSON.stringify(message));
  }

  onMessageReceived(message) {
    this.placesInHallDto = JSON.parse(message.body);
    const places: number[][] = this.placesInHallDto.placesForSchedule;
    const tempUserId = this.userService.user === null ? -1 : this.userService.user.id;
    // проверяем, сообщение от текущего пользователя ил нет
    if (tempUserId !== this.placesInHallDto.userId) {
      for (let i = 0; i < this.placesInHallDto.maxRow; i++) {
        for (let j = 0; j < this.placesInHallDto.maxPlace; j++) {
          if (places[i][j] === 1) {
            places[i][j] = 2;
          } else if (places[i][j] === 2) {
            places[i][j] = 1;
          }
        }
      }
    }
    this.schedulePlaceComponent.placesForSchedule = places;
    this.schedulePlaceComponent.calcTicket();
  }

}
