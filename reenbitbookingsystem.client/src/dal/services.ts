import api from './api';
import type { MeetingRoom } from '../types/room';

export const loginUser = async (credentials: Record<string, string>) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export const registerUser = async (credentials: Record<string, string>) => {
    const response = await api.post('/api/auth/register', credentials);
    return response.data;
};

export const getRooms = async () => {
    const response = await api.get<MeetingRoom[]>('/api/rooms');
    return response.data;
};

export const bookSlotById = async (slotId: number) => {
    const response = await api.post(`/api/slots/${slotId}/book`);
    return response.data;
};