import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ProjectService } from '../services/project.service';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../components/project/add-project.component';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    AsyncPipe,
    RouterModule,
    MatDividerModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  opened = !window.matchMedia('(max-width: 768px)').matches;

  form: FormGroup;
  projects$ = this.projectService.projects$;

  constructor() {
    this.form = new FormGroup({
      project: new FormControl(''),
    });
  }

  ngOnInit() {
    this.form.controls['project'].valueChanges.subscribe(([value]) => {
      if (value) {
        this.projectService.setSelectedProject(value);
        this.router.navigate([value]);
      }
    });

    const mql = window.matchMedia('(max-width: 768px)');
    mql.addEventListener('change', (e) => {
      console.log('changes', e.matches);
      this.opened = !e.matches;
    });
  }

  onClickAddProject() {
    this.dialog.open(AddProjectComponent, { width: '600px' });
  }
}
