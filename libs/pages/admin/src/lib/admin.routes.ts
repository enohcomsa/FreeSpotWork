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
      { path: '**', redirectTo: '/' },
    ],
  },
];
