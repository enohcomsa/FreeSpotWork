import { Route } from '@angular/router';

export const scheduleRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: async () => {
          const mod = await import('./academic-schedule/academic-schedule.component');
          return mod.AcademicScheduleComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
