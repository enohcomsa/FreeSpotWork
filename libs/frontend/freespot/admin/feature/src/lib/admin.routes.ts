import { Route } from '@angular/router';
import { GroupComponent } from '@free-spot/admin-academic-structure/feature';
import {
  AdminBuildingDetailComponent,
  AdminFloorDetailComponent,
  AdminRoomDetailComponent,
} from '@free-spot/admin-university-map/feature';

export const adminRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: async () => {
          const mod = await import('./admin/admin.component');
          return mod.AdminComponent;
        },
      },
      {
        path: 'group/:groupIdSig',
        component: GroupComponent,
      },
      {
        path: 'building/:buildingIdSig',
        component: AdminBuildingDetailComponent,
      },
      {
        path: 'building/:buildingIdSig/:floorIdSig',
        component: AdminFloorDetailComponent,
      },
      {
        path: 'building/:buildingIdSig/:floorIdSig/:roomIdSig',
        component: AdminRoomDetailComponent,
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
