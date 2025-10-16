import {Component, OnDestroy, OnInit} from '@angular/core';
import moment from "moment";
import 'moment/locale/km';
import {ScheduleService} from "../../services/schedule.service";
import {Subject, takeUntil} from "rxjs";
import {WebSocketService} from "../../services/websocket.service";
import {FrontScheduleService} from "../../services/front-schedule.service";

// Assuming Schedule interface looks something like this
interface Schedule {
  date: string;
  startTime: string;
  description: string;
  presidium: string;
  uniform: string;
  location: string;
}

moment.locale("km")

@Component({
  selector: 'app-schedule-front',
  templateUrl: './schedule-front.component.html',
  styleUrl: './schedule-front.component.css'
})
export class ScheduleFrontComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  currentDate = '';
  intervalId: any;
  isLoading: boolean | undefined;
  schedules: any;
  todaySchedules: Schedule[] = [];
  upcomingSchedules: Schedule[] = [];
  private destroy$ = new Subject<void>();

  constructor(private frontScheduleService: FrontScheduleService, private webSocketService: WebSocketService) {
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
    const parsedDate = moment();
    this.currentDate = "ថ្ងៃ" + parsedDate.format("dddd") +
      " ទី" + parsedDate.format("DD") +
      " ខែ" + parsedDate.format("MMMM") +
      " ឆ្នាំ" + parsedDate.format("YYYY");
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    this.updatePendingToComplete();

    this.webSocketService.getScheduleUpdates()
      .subscribe((update: any) => {
        console.log('Received update:', update.type);
        if (update.type=== 'zoomUpdate') {
          console.log('Zoom message:', update);
          this.updateZoom(update.level);
        } else {
          this.listAllSchedule();
        }
      });

  }

  private updateZoom(level: number): void {
    console.log("Applying zoom:", level);
    (document.body.style as any).zoom = `${level}%`;
    // document.body.style.transformOrigin = 'top left';
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = moment().format("HH:mm:ss")// Format the time as needed
  }

  private listAllSchedule(): void {
    this.frontScheduleService.listAllPendingSchedules()
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
        this.isLoading = false;
      } catch (error) {
        this.handleError('Error parsing JSON string', error);
      }
    } else if (Array.isArray(data)) {
      this.schedules = data;
      this.splitSchedules(this.schedules);
      this.isLoading = false;
    } else {
      this.handleError('Unexpected data format', new Error('Invalid data format'));
      this.isLoading = false;
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
      let formattedTime = parsedTime.format("hh:mm A"); // Format the time into 12-hour format with AM/PM

      // Replace AM/PM with Khmer equivalents
      formattedTime = formattedTime.replace("ល្ងាច", "រសៀល")
      return formattedTime;
    } else {
      return "Invalid Time"; // Fallback message for invalid times
    }
  }


  private updatePendingToComplete(): void {
    this.isLoading = true;
    this.frontScheduleService.updatePendingToComplete()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.listAllSchedule()
        },
        error: error => this.listAllSchedule()
      });
  }

// Logic to split schedules
  private splitSchedules(allSchedules: any) {
    moment.locale('en');
    const today = moment().format('DD-MM-YYYY');
    const tomorrow = moment().add(1, 'days').format('DD-MM-YYYY');
    this.todaySchedules = allSchedules.filter((s: { date: string | number | Date; }) => {
      return s.date === today;
    });
    this.upcomingSchedules = allSchedules.filter((s: { date: string | number | Date; }) => {
      return s.date ===tomorrow;
    });
    moment.locale('km');
  }
}
