import { Route } from '@angular/router';
import { FloorDetailsComponent } from '@free-spot/university-map/feature';

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
    component: FloorDetailsComponent,
  },
];
