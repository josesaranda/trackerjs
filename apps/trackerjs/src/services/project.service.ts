import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project, ProjectInfo, Task } from '../models/project';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly storageService = inject(StorageService);
  projects$ = new BehaviorSubject<Project[]>(this.storageService.getProjects());
  project$ = new BehaviorSubject<Project>(this.projects$.value[0]);
  projectInfo$ = new BehaviorSubject<ProjectInfo>(
    this.storageService.getProjectInfo(this.projects$.value[0]?.id)
  );

  setSelectedProject(id: string) {
    const project = this.projects$.value.find((project) => project.id === id);
    if (project) {
      this.project$.next(project);
      const projectInfo = this.storageService.getProjectInfo(project.id);
      this.projectInfo$.next(projectInfo);
    }
  }

  addProject(name: string) {
    const id = name.toLowerCase().replace(/ /g, '-');
    if (!this.isProject(id)) {
      const project = { name, id };
      const projects = [project, ...this.projects$.value];
      this.projects$.next(projects);
      this.storageService.saveProjects(projects);
      this.storageService.saveProjectInfo(project);
      return project;
    } else {
      return undefined;
    }
  }

  isProject(name: string) {
    const id = name.toLowerCase().replace(/ /g, '-');
    return this.projects$.value.findIndex((project) => project.id === id) >= 0;
  }

  isTaskInCurrentProject(taskName: string) {
    const taskId = taskName.toLowerCase().replace(/ /g, '-');
    if (!this.projectInfo$.value) return true;
    else
      return (
        this.projectInfo$.value.tasks.findIndex((task) => task.id === taskId) >=
        0
      );
  }

  addTaskInCurrentProject(taskName: string) {
    const taskId = taskName.toLowerCase().replace(/ /g, '-');
    const task: Task = { id: taskId, name: taskName, time: [] };
    const tasks = [task, ...this.projectInfo$.value.tasks];
    const projectInfo = this.projectInfo$.value;
    projectInfo.tasks = tasks;
    this.projectInfo$.next(projectInfo);
    this.storageService.saveFullProjectInfo(projectInfo);
  }

  deleteTaskOfCurrentProject(taskId: string) {
    const projectInfo = this.projectInfo$.value;
    const taskIndex = projectInfo.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      projectInfo.tasks.splice(taskIndex, 1);
      this.projectInfo$.next(projectInfo);
      this.storageService.saveFullProjectInfo(projectInfo);
    }
  }

  addStartTimerOfCurrentTask(taskId: string) {
    const projectInfo = this.projectInfo$.value;
    const taskIndex = projectInfo.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      projectInfo.tasks[taskIndex].time.unshift({ start: Date.now() });
      this.projectInfo$.next(projectInfo);
      this.storageService.saveFullProjectInfo(projectInfo);
    }
  }

  addEndTimerOfCurrentTask(taskId: string) {
    const projectInfo = this.projectInfo$.value;
    const taskIndex = projectInfo.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      projectInfo.tasks[taskIndex].time[0].end = Date.now();
      this.projectInfo$.next(projectInfo);
      this.storageService.saveFullProjectInfo(projectInfo);
    }
  }
}
