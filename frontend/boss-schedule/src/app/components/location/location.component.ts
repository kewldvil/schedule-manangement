import {Component, ElementRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Location} from "../../interfaces/location";
import {Subject, takeUntil} from "rxjs";
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  @ViewChild('locationInput') locationInput!: ElementRef;

  locationForm: FormGroup;
  submitted = false;
  isLoading = false;
  isUpdateMode = false;
  updateId: number | undefined = 0;
  locations: Location[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listAllLocation();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.locationForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.locationForm.invalid) return;

    this.isLoading = true;
    const formValue = this.locationForm.value as Location;
    console.log(formValue);

    if (this.isUpdateMode) {
      this.updateLocation(formValue);
    } else {
      this.createLocation(formValue);
    }
  }

  private createLocation(location: Location): void {
    this.locationService.createLocation(location).subscribe({
      next: () => {
        this.resetForm();
        this.listAllLocation();
      },
      error: error => this.handleError('Failed to create location', error),
      complete: () => this.isLoading = false
    });
  }

  private updateLocation(location: Location): void {
    if (this.updateId != null) {
      location.id = this.updateId;
    }

    this.locationService.updateLocation(location).subscribe({
      next: () => {
        this.resetForm();
        this.listAllLocation();
        this.isUpdateMode = false;
      },
      error: error => this.handleError('Failed to update location', error),
      complete: () => this.isLoading = false
    });
  }

  private listAllLocation(): void {
    this.locationService.listAllLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.handleListResponse(data),
        error: error => this.handleError('Failed to fetch location', error)
      });
  }

  private handleListResponse(data: any): void {
    if (typeof data === 'string') {
      try {
        // console.log(data)
        this.locations = JSON.parse(data)
        // @ts-ignore
        this.locations=this.locations.sort((a,b)=>b.sortOrder-a.sortOrder)
        // this.locations=this.locations.map((location:any) =>location.location)
        // console.log(this.locations)
      } catch (error) {
        this.handleError('Error parsing JSON string', error);
      }
    } else if (Array.isArray(data)) {
      this.locations = data;
    } else {
      this.handleError('Unexpected data format', new Error('Invalid data format'));
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.isLoading = false;
  }

  private resetForm(): void {
    this.locationForm.reset();
    this.submitted = false;
    setTimeout(() => this.locationInput.nativeElement.focus(), 0);
  }

  onEditClick(id: any): void {
    this.isUpdateMode = true;
    const locations = this.locations.find(location => location.id === id);

    if (locations) {
      this.updateId = locations.id;
      this.locationForm.patchValue({
        name: locations.name
      });
    } else {
      this.handleError('Skill not found', new Error('Skill not found'));
    }
  }

  delete(id: any): void {
    this.isLoading = true;
    const location = this.locations.find(gd => gd.id === id);

    if (location) {
      this.locationService.deleteLocation(location).subscribe({
        next: () => {
          this.resetForm();
          this.listAllLocation();
          this.isUpdateMode = false;
        },
        error: error => this.handleError('Failed to update location skill', error),
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
    this.locationForm.reset();
    setTimeout(() => this.locationInput.nativeElement.focus(), 0);
    this.isUpdateMode = false;
  }
}
