import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: async () => {
          const mod = await import('@free-spot/home/feature');
          return mod.HomeComponent;
        },
      },
      {
        path: 'floor/:floorNameSig',
        loadComponent: async () => {
          const mod = await import('./components/floor-details/floor-details.component');
          return mod.FloorDetailsComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
