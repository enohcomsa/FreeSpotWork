import { type BookingResponseDTO } from '@free-spot/api-client';
import { type EventRegistrationBooking } from '@free-spot/event-registration/domain';

export function dtoToEventRegistrationBooking(dto: BookingResponseDTO): EventRegistrationBooking {
  if (!dto.id) {
    throw new Error('Booking id is required');
  }

  return {
    id: dto.id,
  };
}
