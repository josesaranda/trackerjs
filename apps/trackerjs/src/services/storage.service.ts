import { Injectable } from '@angular/core';
import { Project, ProjectInfo } from '../models/project';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly PROJECTS_KEY = 'projects';
  private readonly PROJECT_PREFIX_KEY = 'project-';

  saveProjects(projects: Project[]): void {
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
  }

  saveProjectInfo(project: Project): void {
    const projectInfo: ProjectInfo = {
      id: project.id,
      name: project.name,
      tasks: [],
    };
    localStorage.setItem(
      this.PROJECT_PREFIX_KEY + project.id,
      JSON.stringify(projectInfo)
    );
  }

  saveFullProjectInfo(projectInfo: ProjectInfo): void {
    localStorage.setItem(
      this.PROJECT_PREFIX_KEY + projectInfo.id,
      JSON.stringify(projectInfo)
    );
  }

  getProjectInfo(projectId: string): ProjectInfo {
    return JSON.parse(
      localStorage.getItem(this.PROJECT_PREFIX_KEY + projectId) || '{}'
    );
  }

  getProjects(): Project[] {
    return JSON.parse(localStorage.getItem(this.PROJECTS_KEY) || '[]');
  }
}
