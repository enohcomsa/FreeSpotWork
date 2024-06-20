import { Route } from '@angular/router';

export const scheduleRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        // canActivate:[]
        loadComponent: async () => {
          const mod = await import('./components/schedule.component');
          return mod.ScheduleComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
