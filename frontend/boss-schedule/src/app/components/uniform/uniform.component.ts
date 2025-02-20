import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Uniform} from "../../interfaces/uniform";
import {Subject, takeUntil} from "rxjs";
import {UniformService} from "../../services/uniform.service";

@Component({
  selector: 'app-uniform',
  templateUrl: './uniform.component.html',
  styleUrl: './uniform.component.css'
})
export class UniformComponent implements OnInit{
  @ViewChild('uniformInput') uniformInput!: ElementRef;

  uniformForm: FormGroup;
  submitted = false;
  isLoading = false;
  isUpdateMode = false;
  updateId: number | undefined = 0;
  uniforms: Uniform[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private uniformService: UniformService
  ) {
    this.uniformForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.listAllUniform();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.uniformForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.uniformForm.invalid) return;

    this.isLoading = true;
    const formValue = this.uniformForm.value as Uniform;
    console.log(formValue);

    if (this.isUpdateMode) {
      this.updateUniform(formValue);
    } else {
      this.createUniform(formValue);
    }
  }

  private createUniform(uniform: Uniform): void {
    this.uniformService.createUniform(uniform).subscribe({
      next: () => {
        this.resetForm();
        this.listAllUniform();
      },
      error: error => this.handleError('Failed to create uniform', error),
      complete: () => this.isLoading = false
    });
  }

  private updateUniform(uniform: Uniform): void {
    if (this.updateId != null) {
      uniform.id = this.updateId;
    }

    this.uniformService.updateUniform(uniform).subscribe({
      next: () => {
        this.resetForm();
        this.listAllUniform();
        this.isUpdateMode = false;
      },
      error: error => this.handleError('Failed to update uniform', error),
      complete: () => this.isLoading = false
    });
  }

  private listAllUniform(): void {
    this.uniformService.listAllUniforms()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => this.handleListResponse(data),
        error: error => this.handleError('Failed to fetch uniform', error)
      });
  }

  private handleListResponse(data: any): void {
    if (typeof data === 'string') {
      try {
        // console.log(data)
        this.uniforms = JSON.parse(data)
        // @ts-ignore
        this.uniforms=this.uniforms.sort((a,b)=>b.sortOrder-a.sortOrder)
        // this.uniforms=this.uniforms.map((uniform:any) =>uniform.uniform)
        // console.log(this.uniforms)
      } catch (error) {
        this.handleError('Error parsing JSON string', error);
      }
    } else if (Array.isArray(data)) {
      this.uniforms = data;
    } else {
      this.handleError('Unexpected data format', new Error('Invalid data format'));
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.isLoading = false;
  }

  private resetForm(): void {
    this.uniformForm.reset();
    this.submitted = false;
    setTimeout(() => this.uniformInput.nativeElement.focus(), 0);
  }

  onEditClick(id: any): void {
    this.isUpdateMode = true;
    const uniforms = this.uniforms.find(uniform => uniform.id === id);

    if (uniforms) {
      this.updateId = uniforms.id;
      this.uniformForm.patchValue({
        name: uniforms.name
      });
    } else {
      this.handleError('Skill not found', new Error('Skill not found'));
    }
  }

  delete(id: any): void {
    this.isLoading = true;
    const uniform = this.uniforms.find(gd => gd.id === id);

    if (uniform) {
      this.uniformService.deleteUniform(uniform).subscribe({
        next: () => {
          this.resetForm();
          this.listAllUniform();
          this.isUpdateMode = false;
        },
        error: error => this.handleError('Failed to update uniform skill', error),
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
    this.uniformForm.reset();
    setTimeout(() => this.uniformInput.nativeElement.focus(), 0);
    this.isUpdateMode = false;
  }
}
