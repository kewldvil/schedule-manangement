import {Component, OnDestroy, OnInit} from '@angular/core';
import moment from "moment";
import 'moment/locale/km';
import {ScheduleService} from "../../services/schedule.service";
import {Subject, takeUntil} from "rxjs";
import {WebsocketService} from "../../services/websocket.service";
moment.locale("km")
@Component({
  selector: 'app-schedule-front',
  templateUrl: './schedule-front.component.html',
  styleUrl: './schedule-front.component.css'
})
export class ScheduleFrontComponent implements OnInit,OnDestroy{
  currentTime:string='';
  currentDate='';
  intervalId: any;
  isLoading: boolean | undefined;
  schedules:any;
  private destroy$ = new Subject<void>();
  constructor(private scheduleService:ScheduleService,private webSocketService:WebsocketService) {
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.updateTime();
    const parsedDate=moment()
    this.currentDate="ថ្ងៃ" + parsedDate.format("dddd") +
      " ទី" + parsedDate.format("DD") +
      " ខែ" + parsedDate.format("MMMM") +
      " ឆ្នាំ" + parsedDate.format("YYYY");
    // Update the time every second
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    this.listAllSchedule();
    this.webSocketService.getScheduleUpdates().subscribe((schedule) => {
      console.log("Received schedule update:", schedule);
      this.listAllSchedule();
    });

  }
  private updateTime(): void {
    const now = new Date();
    this.currentTime =moment().format("HH:mm:ss")// Format the time as needed
  }
  private listAllSchedule(): void {
    this.scheduleService.listAllSchedules()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.handleListResponse(data),
        error: error => this.handleError('Failed to fetch schedule', error)
      });
  }

  private handleListResponse(data: any): void {
    if (typeof data === 'string') {
      try {
        // console.log(data)
        this.schedules = JSON.parse(data)
        // @ts-ignore
        this.schedules = this.schedules.sort((a, b) => b.sortOrder - a.sortOrder)
        // this.schedules=this.schedules.map((schedule:any) =>schedule.schedule)
        // console.log(this.schedules)
      } catch (error) {
        this.handleError('Error parsing JSON string', error);
      }
    } else if (Array.isArray(data)) {
      this.schedules = data;
    } else {
      this.handleError('Unexpected data format', new Error('Invalid data format'));
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.isLoading = false;
  }
  convertToKhmerDate(date: string | undefined) {
    // Check if the date is valid
    const parsedDate = moment(date, ["DD-MM-YYYY", "YYYY-MM-DD"], true);

    // If the date is valid, format it; otherwise, return an empty string or a fallback message
    if (parsedDate.isValid()) {
      return ["ថ្ងៃ" + parsedDate.format("dddd"),
        " ទី" + parsedDate.format("DD") +
        " ខែ" + parsedDate.format("MMMM") +
        " ឆ្នាំ" + parsedDate.format("YYYY")];
    } else {
      return "Invalid Date"; // Fallback message for invalid dates
    }
  }


  convertToKhmerTime(time: string | undefined): string {
    // Parse the time using the format HH:mm:ss
    const parsedTime = moment(time, "HH:mm:ss", true);

    // Check if the time is valid
    if (parsedTime.isValid()) {
      return parsedTime.format("hh:mm A"); // Format the time into 12-hour format with AM/PM
    } else {
      return "Invalid Time"; // Fallback message for invalid times
    }
  }

}
