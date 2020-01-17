import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Schedule, ScheduleService} from '../shared/schedule.service';

@Component({
  selector: 'app-select-place',
  templateUrl: './schedule-place.component.html',
  styleUrls: ['./schedule-place.component.scss']
})
export class SchedulePlaceComponent implements OnInit {

  private scheduleId: string;
  private schedule: Schedule;

  constructor(private route: ActivatedRoute, private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.scheduleId = this.route.snapshot.paramMap.get('id');
    // if (this.scheduleService.schedulesToday === null) {
    //   this.scheduleService.getE(this.scheduleId).subscribe(value => console.log(value));
    // }

    this.scheduleService.getSchedulePlace(this.scheduleId).subscribe();
  }

  selectPlace(i: number, j: number) {
    this.scheduleService.selectPlace(this.scheduleId, i, j).subscribe();
  }
}
