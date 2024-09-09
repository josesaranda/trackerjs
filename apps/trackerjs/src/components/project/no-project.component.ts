import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-no-project-component',
  template: `
    <div class="h-full w-full flex items-center justify-center">
      <h2 class="!text-xl">
        There are no projects yet. Click on + to add your first project
      </h2>
    </div>
  `,
})
export class NoProjectComponent {}
