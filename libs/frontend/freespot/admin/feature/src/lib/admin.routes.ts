import { Route } from '@angular/router';

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
        loadComponent: async () => {
          const mod = await import('@free-spot/admin-academic-structure/feature');
          return mod.GroupComponent;
        },
      },
      {
        path: 'building/:buildingIdSig',
        loadComponent: async () => {
          const mod = await import('@free-spot/admin-university-map/feature');
          return mod.AdminBuildingDetailComponent;
        },
      },
      {
        path: 'building/:buildingIdSig/:floorIdSig',
        loadComponent: async () => {
          const mod = await import('@free-spot/admin-university-map/feature');
          return mod.AdminFloorDetailComponent;
        },
      },
      {
        path: 'building/:buildingIdSig/:floorIdSig/:roomIdSig',
        loadComponent: async () => {
          const mod = await import('@free-spot/admin-university-map/feature');
          return mod.AdminRoomDetailComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
