import { Route } from '@angular/router';

export const myBookingsRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () => {
      const mod = await import('./my-bookings/my-bookings');
      return mod.MyBookings;
    },
  },
];
