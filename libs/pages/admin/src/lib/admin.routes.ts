import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        // canActivate:[]
        loadComponent: async () => {
          const mod = await import('./components/admin/admin.component');
          return mod.AdminComponent;
        },
      },
      { path: '**', redirectTo: '/' },
    ],
  },
];
