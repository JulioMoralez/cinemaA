import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-schedule-time',
  templateUrl: './schedule-time.component.html',
  styleUrls: ['./schedule-time.component.scss']
})
export class ScheduleTimeComponent implements OnInit {

  @Input() time: number;

  constructor() { }

  ngOnInit() {
  }

}
