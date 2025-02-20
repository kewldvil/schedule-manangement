import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Schedule} from "../../models/schedule";
import {Subject, takeUntil} from "rxjs";
import {ScheduleService} from "../../services/schedule.service";
import {PresidiumService} from "../../services/presidium.service";

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css'
})
export class CreateScheduleComponent implements OnInit {
  @ViewChild('scheduleInput') scheduleInput!: ElementRef;

  scheduleForm: FormGroup;
  submitted = false;
  isLoading = false;
  isUpdateMode = false;
  updateId: number | undefined = 0;
  schedules: Schedule[] = [];
  presidiums: any;
  uniforms: any;
  locations: any;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private presidiumService: PresidiumService
  ) {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      description: ['', Validators.required],
      presidium: ['', Validators.required],
      uniform: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listAllSchedule();
    this.listAllPresidium();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.scheduleForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.scheduleForm.invalid) return;

    this.isLoading = true;
    const formValue = this.scheduleForm.value as Schedule;
    console.log(formValue);

    if (this.isUpdateMode) {
      this.updateSchedule(formValue);
    } else {
      this.createSchedule(formValue);
    }
  }

  private createSchedule(schedule: Schedule): void {
    this.scheduleService.createSchedule(schedule).subscribe({
      next: () => {
        this.resetForm();
        this.listAllSchedule();
      },
      error: error => this.handleError('Failed to create schedule', error),
      complete: () => this.isLoading = false
    });
  }

  private updateSchedule(schedule: Schedule): void {
    if (this.updateId != null) {
      schedule.id = this.updateId;
    }

    this.scheduleService.updateSchedule(schedule).subscribe({
      next: () => {
        this.resetForm();
        this.listAllSchedule();
        this.isUpdateMode = false;
      },
      error: error => this.handleError('Failed to update schedule', error),
      complete: () => this.isLoading = false
    });
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
        this.schedules=this.schedules.sort((a,b)=>b.sortOrder-a.sortOrder)
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

  private resetForm(): void {
    this.scheduleForm.reset();
    this.submitted = false;
    setTimeout(() => this.scheduleInput.nativeElement.focus(), 0);
  }

  onEditClick(id: any): void {
    this.isUpdateMode = true;
    const schedules = this.schedules.find(schedule => schedule.id === id);

    if (schedules) {
      this.updateId = schedules.id;
      this.scheduleForm.patchValue({
        date: schedules.date
      });
    } else {
      this.handleError('Skill not found', new Error('Skill not found'));
    }
  }

  delete(id: any): void {
    this.isLoading = true;
    const schedule = this.schedules.find(gd => gd.id === id);

    if (schedule) {
      this.scheduleService.deleteSchedule(schedule).subscribe({
        next: () => {
          this.resetForm();
          this.listAllSchedule();
          this.isUpdateMode = false;
        },
        error: error => this.handleError('Failed to update schedule skill', error),
        complete: () => this.isLoading = false
      });
    } else {
      this.handleError('Skill not found', new Error('Skill not found'));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancelEdit() {
    this.scheduleForm.reset();
    setTimeout(() => this.scheduleInput.nativeElement.focus(), 0);
    this.isUpdateMode = false;
  }
  private listAllPresidium(): void {
    this.presidiumService.listAllPresidiums().subscribe({
      next: data => this.presidiums=data,
      error: error => this.handleError('Failed to fetch presidium', error)
    })

  }
}
