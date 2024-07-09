import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: async () => {
          const mod = await import('./components/admin/admin.component');
          return mod.AdminComponent;
        },
      },
      {
        path: 'group/:groupNameSig',
        loadComponent: async () => {
          const mod = await import('./components/group/group.component');
          return mod.GroupComponent;
        },
      },
      {
        path: 'building/:groupNameSig',
        loadComponent: async () => {
          const mod = await import('./components/admin-building-detail/admin-building-detail.component');
          return mod.AdminBuildingDetailComponent;
        },
      },
      {
        path: 'building/:groupNameSig/:floorNameSig',
        loadComponent: async () => {
          const mod = await import('./components/admin-floor-detail/admin-floor-detail.component');
          return mod.AdminFloorDetailComponent;
        },
      },
      {
        path: 'building/:groupNameSig/:floorNameSig/:roomNameSig',
        loadComponent: async () => {
          const mod = await import('./components/admin-room-detail/admin-room-detail.component');
          return mod.AdminRoomDetailComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
