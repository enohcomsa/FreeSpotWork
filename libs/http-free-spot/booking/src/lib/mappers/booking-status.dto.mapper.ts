import { BookingStatus } from "@free-spot-domain/booking";
import { BookingStatusDTO } from "@free-spot/api-client";

export const dtoToBookingStatus = (dto: BookingStatusDTO): BookingStatus => dto as unknown as BookingStatus;
export const BookingStatusToDto = (value: BookingStatus): BookingStatusDTO => value as unknown as BookingStatusDTO;
