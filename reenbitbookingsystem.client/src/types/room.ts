import type { BookingSlot } from "./slot";

export interface MeetingRoom {
    id: number;
    name: string;
    bookingSlots: BookingSlot[];
}
