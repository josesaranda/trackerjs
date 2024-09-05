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
  selector: 'app-add-task-component',
  template: `<div class="p-4">
    <h2 class="!text-xl">New task</h2>
    <mat-dialog-content>
      <form [formGroup]="form" (submit)="onSubmit()">
        <mat-form-field class="w-full">
          <mat-label>Task name</mat-label>
          <input
            matInput
            placeholder="My new awesome task"
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
export class AddTaskComponent {
  form = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
  });
  private readonly projectService = inject(ProjectService);

  constructor(private readonly dialogRef: DialogRef) {}

  onSubmit() {
    const name = this.form.controls['name'].value!;
    if (!this.projectService.isTaskInCurrentProject(name)) {
      this.projectService.addTaskInCurrentProject(name);
      this.dialogRef.close();
    }
  }
}
