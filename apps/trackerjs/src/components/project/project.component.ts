import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProjectService } from '../../services/project.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskComponent } from '../task/add-task.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { Task, TimeTrack } from '../../models/project';

@Component({
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatDialogModule,
    MatExpansionModule,
    AsyncPipe,
    DatePipe,
    MatDividerModule,
  ],
  selector: 'app-project-component',
  template: `
    <mat-toolbar class="gap-2 !bg-slate-200">
      @if(project$ | async; as project) {
      <span class="!text-sm">Project:</span
      ><span class="font-mono !text-md">{{ project.name }}</span>
      }
      <span class="spacer"></span>
      <span class="!text-lg">Time tracked: {{ totalTime }}</span>
      <button mat-raised-button (click)="onClickAddTask()">
        <mat-icon>add</mat-icon>
        <span>Add task</span>
      </button>
    </mat-toolbar>
    <div class="p-4">
      <h3 class="!text-lg">Tasks:</h3>
      <mat-accordion>
        @for (task of tasks; track task.id; let index = $index) {
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title> {{ task.name }} </mat-panel-title>
            <mat-panel-description>
              <span class="mr-4 flex justify-center items-start gap-2">
                <mat-icon>access_time</mat-icon> {{ task.totalTime }}</span
              >
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p class="font-bold">Time:</p>
          <div class="flex justify-start items-center flex-wrap gap-2">
            @for(time of task.time; track time;) {
            <ul class="my-2 p-2 bg-slate-100 rounded-md">
              <li class="flex justify-between items-center gap-1">
                <span class="text-slate-400 font-bold">start:</span>
                {{ time.start | date : 'medium' }}
              </li>
              <li class="flex justify-between items-center gap-1">
                <span class="text-slate-400 font-bold">end:</span>
                {{ time.end | date : 'medium' }}
              </li>
            </ul>
            }
          </div>
          <mat-action-row>
            @if(!task.time[0]?.start || (task.time[0]?.start &&
            task.time[0]?.end)){
            <button mat-flat-button (click)="onClickStartTimer(task.id)">
              <mat-icon>start</mat-icon>
              <span>Start timer</span>
            </button>
            } @else {
            <button mat-flat-button (click)="onClickEndTimer(task.id)">
              <mat-icon>stop</mat-icon>
              <span>End timer</span>
            </button>
            }
            <button mat-button (click)="onClickDeleteTask(task.id)">
              <mat-icon>delete</mat-icon>
              <span>Delete task</span>
            </button>
          </mat-action-row>
        </mat-expansion-panel>
        }
      </mat-accordion>
    </div>
  `,
  styles: `
    .spacer {
      flex: 1 1 auto;
    }
  `,
})
export class ProjectComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  project$ = this.projectService.project$;
  tasks?: (Task & { totalTime: string })[];
  totalTime?: string;

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.projectService.projectInfo$.subscribe((projectInfo) => {
      this.tasks = projectInfo.tasks.map((task) => {
        return { ...task, totalTime: this.getTotalTime(task.time) };
      });
      this.totalTime = this.getTotalTime(
        this.tasks.flatMap((task) => task.time)
      );
    });
  }

  getTotalTime(time: TimeTrack[]) {
    let totalTime = 0;
    time
      .filter((t) => !!t.end)
      .forEach((t) => {
        totalTime += t.end! - t.start;
      });

    totalTime = Math.round(totalTime / 1000);
    const [hours, minutes, seconds] = new Date(totalTime * 1000)
      .toISOString()
      .slice(11, 19)
      .split(':');
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  onClickAddTask() {
    this.dialog.open(AddTaskComponent, { width: '600px' });
  }

  onClickDeleteTask(taskId: string) {
    this.projectService.deleteTaskOfCurrentProject(taskId);
  }

  onClickStartTimer(taskId: string) {
    this.projectService.addStartTimerOfCurrentTask(taskId);
  }

  onClickEndTimer(taskId: string) {
    this.projectService.addEndTimerOfCurrentTask(taskId);
  }
}
