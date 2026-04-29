import { Route } from '@angular/router';

export const homeRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () => {
      const mod = await import('./home/home.component');
      return mod.HomeComponent;
    },
  },
  {
    path: 'building/:buildingId/floor/:floorName',
    loadComponent: async () => {
      const mod = await import('@free-spot/university-map/feature');
      return mod.FloorDetailsComponent;
    },
  },
];
