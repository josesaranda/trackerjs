import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
  ],
  selector: 'app-add-project-component',
  template: `<div class="p-4">
    <h2 class="!text-xl">New project</h2>
    <mat-dialog-content>
      <form [formGroup]="form" (submit)="onSubmit()">
        <mat-form-field class="w-full">
          <mat-label>Project name</mat-label>
          <input
            matInput
            placeholder="My new awesome project"
            formControlName="name"
          />
        </mat-form-field>
        <div class="text-right">
          <button type="submit" mat-button>Submit</button>
        </div>
      </form>
    </mat-dialog-content>
  </div>`,
})
export class AddProjectComponent {
  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
  });
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);

  constructor(private readonly dialogRef: DialogRef) {}

  onSubmit() {
    const name = this.form.controls['name'].value!;
    if (!this.projectService.isProject(name)) {
      const project = this.projectService.addProject(name);
      this.projectService.setSelectedProject(project!.id);
      this.dialogRef.close();
      this.router.navigate([project!.id]);
    }
  }
}
