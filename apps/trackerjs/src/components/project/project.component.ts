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
import { TitleService } from '../../services/title.service';

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
      <span class="!text-base md:!text-lg">{{ project.name }}</span>
      }
      <span class="spacer"></span>
      <div class="flex justify-center items-center gap-2">
        <mat-icon>access_time</mat-icon>
        <span class="!text-base md:!text-lg">{{ totalTime }}</span>
      </div>
      <button
        class="!hidden md:!flex"
        mat-raised-button
        (click)="onClickAddTask()"
      >
        <mat-icon>add</mat-icon>
        <span>Add task</span>
      </button>
      <button
        class="inline-block md:!hidden"
        mat-icon-button
        (click)="onClickAddTask()"
      >
        <mat-icon>add</mat-icon>
      </button>
    </mat-toolbar>
    <div class="p-4">
      <h3 class="!text-lg">Tasks:</h3>
      <mat-accordion>
        @for (task of tasks; track task.id; let index = $index) {
        <mat-expansion-panel
          [class.animation-highlight]="
            task.time[0]?.start && !task.time[0]?.end
          "
        >
          <mat-expansion-panel-header
            class="!border-b-[1px] !border-solid !rounded-b-none !border-b-[var(--mat-expansion-actions-divider-color)]"
          >
            <mat-panel-title>
              <div class="w-[24px] h-[24px] mr-2">
                @if(task.time[0]?.start && !task.time[0]?.end){
                <mat-icon class="animation-rotate">autorenew</mat-icon>
                } @else {
                <mat-icon>notes</mat-icon>
                }
              </div>
              {{ task.name }}
            </mat-panel-title>
            <mat-panel-description>
              <span class="mr-4 flex justify-center items-start gap-2">
                <mat-icon>access_time</mat-icon> {{ task.totalTime }}</span
              >
            </mat-panel-description>
          </mat-expansion-panel-header>

          <p class="font-bold !mt-4">Time:</p>
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

    .animation-highlight {
      animation: blink 4.5s linear infinite;
    }

    .animation-rotate {
      animation: spin 2.5s linear infinite;
    }

    @keyframes blink {
      0%, 100% {@apply bg-slate-100;}
      50% {@apply bg-slate-300;}
    }

    @keyframes spin { 
    100% { 
        -webkit-transform: rotate(360deg); 
        transform:rotate(360deg); 
    } 
}
  `,
})
export class ProjectComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly titleService = inject(TitleService);
  project$ = this.projectService.project$;
  tasks?: (Task & { totalTime: string })[];
  totalTime?: string;

  interval: any;

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.projectService.projectInfo$.subscribe((projectInfo) => {
      this.tasks = projectInfo.tasks.map((task) => {
        return {
          ...task,
          totalTime: this.getTotalTime(task.time),
        };
      });

      this.totalTime = this.getTotalTime(
        this.tasks.flatMap((task) => task.time)
      );

      if (this.tasks.flatMap((task) => task.time).some((t) => !t.end)) {
        this.notifyTitle();
      } else {
        this.resetTitle();
      }
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

  private notifyTitle() {
    let ok = true;
    this.interval = setInterval(() => {
      if (ok) {
        this.titleService.setTitleName('Task in progress');
      } else {
        this.titleService.resetTitleName();
      }
      ok = !ok;
    }, 1000);
  }

  private resetTitle() {
    clearInterval(this.interval);
    this.titleService.resetTitleName();
  }

  onClickEndTimer(taskId: string) {
    this.projectService.addEndTimerOfCurrentTask(taskId);
    this.resetTitle();
  }
}
