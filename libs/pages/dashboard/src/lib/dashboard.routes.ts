import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: async () => {
          const mod = await import('./components/dashboard/dashboard.component');
          return mod.DashboardComponent;
        },
      },
      {
        path: 'floor/:floorName',
        loadComponent: async () => {
          const mod = await import('./components/floor-details/floor-details.component');
          return mod.FloorDetailsComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
