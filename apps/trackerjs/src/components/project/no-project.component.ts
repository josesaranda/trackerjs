import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from './add-project.component';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  selector: 'app-no-project-component',
  template: `
    <div class="h-full w-full flex items-center justify-center gap-2 flex-col">
      <h2 class="!text-xl">There are no projects yet.</h2>
      <button mat-flat-button (click)="onClickAddProject()">
        Add your first project
      </button>
    </div>
  `,
})
export class NoProjectComponent {
  private readonly dialog = inject(MatDialog);

  onClickAddProject() {
    this.dialog.open(AddProjectComponent, { width: '600px' });
  }
}
