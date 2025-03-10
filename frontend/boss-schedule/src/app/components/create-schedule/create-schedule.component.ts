import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Schedule} from "../../models/schedule";
import {Subject, takeUntil} from "rxjs";
import {ScheduleService} from "../../services/schedule.service";
import {PresidiumService} from "../../services/presidium.service";
import {UniformService} from "../../services/uniform.service";
import {LocationService} from "../../services/location.service";
import moment from "moment";
import 'moment/locale/km';
//@ts-ignore
// import momentkh from "@thyrith/momentkh";
// momentkh(moment);
moment.locale("km")

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css'
})
export class CreateScheduleComponent implements OnInit {
  @ViewChild('scheduleInput') scheduleInput!: ElementRef;
  currentDate: string = '';
  isUpdateStatus=false;
  scheduleForm: FormGroup;
  submitted = false;
  isLoading = false;
  isUpdateMode = false;
  updateId: number | undefined = 0;
  schedules: Schedule[] = [];
  presidiums: any;
  uniforms: any;
  locations: any;
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Default page size
  totalPages: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private presidiumService: PresidiumService,
    private uniformService: UniformService,
    private locationService: LocationService
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
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0]; // Get the current date in yyyy-MM-dd format

    this.listAllSchedule(this.currentPage,this.pageSize);
    this.listAllPresidium();
    this.listAllUniform();
    this.listAllLocation()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.scheduleForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.scheduleForm.invalid) return;

    this.isLoading = true;
    const formValue = this.scheduleForm.value as Schedule;
    // console.log(formValue);

    if (this.isUpdateMode) {
      this.updateSchedule(formValue);
    } else {
      this.createSchedule(formValue);
    }
  }

  private createSchedule(schedule: Schedule): void {
    schedule.status = 'PENDING'
    this.scheduleService.createSchedule(schedule).subscribe({
      next: () => {
        this.resetForm();
        this.listAllSchedule(this.currentPage,this.pageSize);
      },
      error: error => this.handleError('Failed to create schedule', error),
      complete: () => this.isLoading = false
    });
  }

  private updateSchedule(schedule: Schedule): void {
    if (this.updateId != null) {
      schedule.id = this.updateId;
      schedule.status="PENDING";
      // If `isUpdateStatus` is true, toggle the status (or apply your logic here)
      if (this.isUpdateStatus) {
        // Example toggle: If status is 'ACTIVE' set to 'CANCELLED', and vice versa
        if (schedule.status === 'PENDING') {
          schedule.status = 'CANCELLED';
        } else if (schedule.status === 'CANCELLED') {
          schedule.status = 'PENDING';
        }
      }
    }

    this.scheduleService.updateSchedule(schedule).subscribe({
      next: () => {
        this.resetForm();
        this.listAllSchedule(this.currentPage,this.pageSize);
        this.isUpdateMode = false;
      },
      error: error => this.handleError('Failed to update schedule', error),
      complete: () => this.isLoading = false
    });
  }

  private listAllSchedule(page:number,size:number): void {
    this.scheduleService.listAllSchedules(page-1,size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.handleListResponse(data),
        error: error => this.handleError('Failed to fetch schedule', error)
      });
  }

  private handleListResponse(data: any): void {

    if (typeof data === 'string') {
      try {
        this.schedules = JSON.parse(data)
        // @ts-ignore
        this.schedules = this.schedules.sort((a, b) => b.sortOrder - a.sortOrder)
        // this.schedules=this.schedules.map((schedule:any) =>schedule.schedule)
        // console.log(this.schedules)
      } catch (error) {
        this.handleError('Error parsing JSON string', error);
      }
    } else if (Array.isArray(data)) {
      // console.log(data)
      this.schedules = data;
    } else {
      this.schedules=data.schedules
      this.totalRecords=data.totalItems;
      this.totalPages=data.totalPages;
      console.log(this.totalPages)
      console.log(this.totalRecords)
      // this.handleError('Unexpected data format', new Error('Invalid data format'));
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
    this.scheduleForm.get('presidium')?.setValue('');
    this.scheduleForm.get('uniform')?.setValue('');
    this.scheduleForm.get('location')?.setValue('');
  }

  onEditClick(id: any): void {
    this.isUpdateMode = true;
    const schedule = this.schedules.find(schedule => schedule.id === id);
    // console.log(schedule)
    if (schedule) {
      this.updateId = schedule.id;

      // Switch to English locale
      // Temporarily set locale to English only for this operation
      const currentLocale = moment.locale(); // Store the current locale
      moment.locale('en'); // Change to English

      // Ensure the date is in YYYY-MM-DD format (required by input[type="date"])
      const formattedDate = moment(schedule.date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
      const selectedPresidium = this.presidiums.find((item: { name: any; }) => item.name === schedule.presidium);
      const selectedLocation = this.locations.find((item: { name: any; }) => item.name === schedule.location);
      const selectedUniform = this.uniforms.find((item: { name: any; }) => item.name === schedule.uniform);


      // Patch values into the form
      this.scheduleForm.patchValue({
        date: formattedDate, // Correct format for input[type="date"]
        startTime: schedule.startTime,
        description: schedule.description,
        presidium: selectedPresidium.id,
        uniform: selectedUniform.id,
        location: selectedLocation.id

      });
      // Restore the original locale
      moment.locale(currentLocale);
    } else {
      this.handleError('Schedule not found', new Error('Schedule not found'));
    }
  }


  delete(id: any): void {
    this.isLoading = true;
    const schedule = this.schedules.find(gd => gd.id === id);
    if (schedule) {
      this.scheduleService.deleteSchedule(schedule).subscribe({
        next: () => {
          this.resetForm();
          this.listAllSchedule(this.currentPage,this.pageSize);
          this.isUpdateMode = false;
        },
        error: error => this.handleError('Failed to delete schedule ', error),
        complete: () => this.isLoading = false
      });
    } else {
      this.handleError('Schedule not found', new Error('Schedule not found'));
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
      next: data => this.presidiums = data,
      error: error => this.handleError('Failed to fetch presidium', error)
    })
  }

  private listAllUniform(): void {
    this.uniformService.listAllUniforms().subscribe({
      next: data => this.uniforms = data,
      error: error => this.handleError('Failed to fetch uniform', error)
    })
  }

  private listAllLocation(): void {
    this.locationService.listAllLocations().subscribe({
      next: data => this.locations = data,
      error: error => this.handleError('Failed to fetch location', error)
    })
  }

  convertToKhmerDate(date: string | undefined): string {
    // Check if the date is valid
    const parsedDate = moment(date, ["DD-MM-YYYY", "YYYY-MM-DD"], true);

    // If the date is valid, format it; otherwise, return an empty string or a fallback message
    if (parsedDate.isValid()) {
      return "ថ្ងៃ" + parsedDate.format("dddd") +
        " ទី" + parsedDate.format("DD") +
        " ខែ" + parsedDate.format("MMMM") +
        " ឆ្នាំ" + parsedDate.format("YYYY");
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


  // updateStatus(schedule: Schedule) {
  //   if (schedule) {
  //     // Toggle the update status
  //     this.isUpdateStatus = !this.isUpdateStatus;
  //
  //     // Store the current locale and temporarily switch to 'en' for consistent formatting
  //     const currentLocale = moment.locale(); // Store current locale
  //     moment.locale('en'); // Switch to English locale temporarily
  //
  //     this.updateId = schedule.id;
  //
  //     // Find the selected items based on their name and assign their IDs
  //     const selectedPresidium = this.presidiums.find((item: { name: any; }) => item.name === schedule.presidium);
  //     const selectedLocation = this.locations.find((item: { name: any; }) => item.name === schedule.location);
  //     const selectedUniform = this.uniforms.find((item: { name: any; }) => item.name === schedule.uniform);
  //
  //     // Ensure the selected items exist
  //     if (selectedPresidium && selectedLocation && selectedUniform) {
  //       schedule.presidium = selectedPresidium.id;
  //       schedule.uniform = selectedUniform.id;
  //       schedule.location = selectedLocation.id;
  //
  //       // Format the date into the proper format
  //       schedule.date = moment(schedule.date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
  //     }
  //
  //     // Restore the previous locale
  //     moment.locale(currentLocale);
  //
  //     // Now update the schedule
  //     this.updateSchedule(schedule);
  //   } else {
  //     this.handleError('Schedule not found', new Error('Schedule not found'));
  //   }
  // }
  updateStatus(schedule: Schedule): void {
    if (!schedule) {
      this.handleError('Schedule not found', new Error('Schedule not found'));
      return;
    }
    // Store current locale and switch to English for consistent formatting
    const currentLocale = moment.locale();
    moment.locale('en');
    // Toggle the update status
    this.isUpdateStatus = !this.isUpdateStatus;
    this.updateId = schedule.id;

    try {


      // Find selected items and map to their IDs
      const selectedPresidium = this.presidiums.find((item: { name: string | undefined; }) => item.name === schedule.presidium);
      const selectedLocation = this.locations.find((item: { name: string | undefined; }) => item.name === schedule.location);
      const selectedUniform = this.uniforms.find((item: { name: string | undefined; }) => item.name === schedule.uniform);

      // Validate all required selections exist
      if (!selectedPresidium || !selectedLocation || !selectedUniform) {
        throw new Error('Invalid selection: Presidium, Location, or Uniform not found');
      }

      // Create updated schedule object with proper IDs
      const updatedSchedule = {
        ...schedule,
        presidium: selectedPresidium.id,
        location: selectedLocation.id,
        uniform: selectedUniform.id,
        date: moment(schedule.date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD")
      };

      // Restore original locale
      moment.locale(currentLocale);

      // Update the schedule
      this.updateSchedule(updatedSchedule);
    } catch (error) {
      // Restore locale in case of error
      moment.locale(currentLocale);
      this.handleError('Failed to update schedule', error);
    }
  }
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.listAllSchedule(this.currentPage,this.pageSize);
  }
// Method to get the starting record number
  getStartRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

// Method to get the ending record number
  getEndRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }
  latinToKhmer(number: any, totalDigits: number = 2): string {
    const khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

    if (number == null || isNaN(number)) {
      return '';
    }

    // Convert the number to a string and pad it with leading zeros
    let numberStr = number.toString().padStart(totalDigits, '0');

    // Check if the input number is zero
    if (parseInt(numberStr) === 0) {
      return '';
    }

    // Convert each digit to Khmer numeral
    return numberStr.split('').map((digit: string) => {
      const khmerDigit = khmerNumbers[parseInt(digit)];
      return khmerDigit !== undefined ? khmerDigit : '';
    }).join('');
  }
}
