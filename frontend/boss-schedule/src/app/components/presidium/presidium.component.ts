import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Presidium} from "../../interfaces/presidium";
import {Subject, takeUntil} from "rxjs";
import {PresidiumService} from "../../services/presidium.service";

@Component({
  selector: 'app-presidium',
  templateUrl: './presidium.component.html',
  styleUrl: './presidium.component.css'
})
export class PresidiumComponent implements OnInit{
  @ViewChild('presidiumInput') presidiumInput!: ElementRef;

  presidiumForm: FormGroup;
  submitted = false;
  isLoading = false;
  isUpdateMode = false;
  updateId: number | undefined = 0;
  presidiums: Presidium[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private presidiumService: PresidiumService
  ) {
    this.presidiumForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listAllPresidium();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.presidiumForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.presidiumForm.invalid) return;

    this.isLoading = true;
    const formValue = this.presidiumForm.value as Presidium;
    console.log(formValue);

    if (this.isUpdateMode) {
      this.updatePresidium(formValue);
    } else {
      this.createPresidium(formValue);
    }
  }

  private createPresidium(presidium: Presidium): void {
    this.presidiumService.createPresidium(presidium).subscribe({
      next: () => {
        this.resetForm();
        this.listAllPresidium();
      },
      error: error => this.handleError('Failed to create presidium', error),
      complete: () => this.isLoading = false
    });
  }

  private updatePresidium(presidium: Presidium): void {
    if (this.updateId != null) {
      presidium.id = this.updateId;
    }

    this.presidiumService.updatePresidium(presidium).subscribe({
      next: () => {
        this.resetForm();
        this.listAllPresidium();
        this.isUpdateMode = false;
      },
      error: error => this.handleError('Failed to update presidium', error),
      complete: () => this.isLoading = false
    });
  }

  private listAllPresidium(): void {
    this.presidiumService.listAllPresidiums()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.handleListResponse(data),
        error: error => this.handleError('Failed to fetch presidium', error)
      });
  }

  private handleListResponse(data: any): void {
    if (typeof data === 'string') {
      try {
        // console.log(data)
        this.presidiums = JSON.parse(data)
        // @ts-ignore
        this.presidiums=this.presidiums.sort((a,b)=>b.sortOrder-a.sortOrder)
        // this.presidiums=this.presidiums.map((presidium:any) =>presidium.presidium)
        // console.log(this.presidiums)
      } catch (error) {
        this.handleError('Error parsing JSON string', error);
      }
    } else if (Array.isArray(data)) {
      this.presidiums = data;
    } else {
      this.handleError('Unexpected data format', new Error('Invalid data format'));
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.isLoading = false;
  }

  private resetForm(): void {
    this.presidiumForm.reset();
    this.submitted = false;
    setTimeout(() => this.presidiumInput.nativeElement.focus(), 0);
  }

  onEditClick(id: any): void {
    this.isUpdateMode = true;
    const presidiums = this.presidiums.find(presidium => presidium.id === id);

    if (presidiums) {
      this.updateId = presidiums.id;
      this.presidiumForm.patchValue({
        name: presidiums.name
      });
    } else {
      this.handleError('Skill not found', new Error('Skill not found'));
    }
  }

  delete(id: any): void {
    this.isLoading = true;
    const presidium = this.presidiums.find(gd => gd.id === id);

    if (presidium) {
      this.presidiumService.deletePresidium(presidium).subscribe({
        next: () => {
          this.resetForm();
          this.listAllPresidium();
          this.isUpdateMode = false;
        },
        error: error => this.handleError('Failed to update presidium skill', error),
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
    this.presidiumForm.reset();
    setTimeout(() => this.presidiumInput.nativeElement.focus(), 0);
    this.isUpdateMode = false;
  }
}
