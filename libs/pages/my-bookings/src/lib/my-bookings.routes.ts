import { Route } from '@angular/router';

export const myBookingsRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () => {
      const mod = await import('@free-spot/my-bookings/feature');
      return mod.MyBookings;
    },
  },
];
