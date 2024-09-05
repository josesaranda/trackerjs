import {
  ActivatedRouteSnapshot,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ProjectComponent } from '../components/project/project.component';
import { inject } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { NoProjectComponent } from '../components/project/no-project.component';

export const appRoutes: Route[] = [
  {
    path: 'no-project',
    loadComponent: () => NoProjectComponent,
  },
  {
    path: ':id',
    canActivate: [
      (route: ActivatedRouteSnapshot) => {
        const projectService = inject(ProjectService);
        const router = inject(Router);

        if (projectService.isProject(route.params['id'])) {
          return true;
        } else {
          return router.createUrlTree(['']);
        }
      },
    ],
    loadComponent: () => ProjectComponent,
  },
  {
    path: '**',
    redirectTo: () => {
      const projectService = inject(ProjectService);
      if (projectService.projects$.value.length === 0) return 'no-project';
      else return projectService.project$.value.id;
    },
  },
];
