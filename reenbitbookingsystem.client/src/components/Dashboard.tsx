import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { getRooms, bookSlotById } from '../dal/services';
import type { MeetingRoom } from '../types/room';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
    const [rooms, setRooms] = useState<MeetingRoom[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchRooms();

        const connection = new HubConnectionBuilder()
            .withUrl('/bookingHub')
            .withAutomaticReconnect()
            .build();

        connection.on("SlotStatusChanged", (slotId: number, isBooked: boolean) => {
            setRooms(prevRooms => prevRooms.map(room => ({
                ...room,
                bookingSlots: room.bookingSlots.map(slot =>
                    slot.id === slotId ? { ...slot, isBooked } : slot
                )
            })));
        });

        connection.start().catch(() => setError('Не вдалося підключитися до сервера для оновлень у реальному часі.'));

        return () => { connection.stop(); };
    }, []);

    const fetchRooms = async () => {
        try {
            setError('');
            const data = await getRooms();
            setRooms(data);
        } catch (err) {
            setError('Не вдалося завантажити список кімнат. Перевірте з\'єднання.');
        }
    };

    const bookSlot = async (slotId: number) => {
        try {
            setError('');
            await bookSlotById(slotId);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError(err.response.data.message || 'Цей слот щойно забронював хтось інший.');
                fetchRooms();
            } else {
                setError('Виникла помилка при спробі забронювати слот.');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Система бронювання</h1>
                <button
                    onClick={onLogout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition"
                >
                    Вийти
                </button>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex justify-between items-center">
                    <p className="text-red-700 font-medium">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="text-red-500 hover:text-red-800 font-bold ml-4"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {rooms.map(room => (
                    <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{room.name}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {room.bookingSlots.map(slot => (
                                <button
                                    key={slot.id}
                                    disabled={slot.isBooked}
                                    onClick={() => bookSlot(slot.id)}
                                    className={`p-4 rounded-lg flex flex-col items-center justify-center border-2 transition-all duration-200
                                        ${slot.isBooked
                                            ? 'bg-red-50 border-red-200 text-red-600 cursor-not-allowed opacity-75'
                                            : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:shadow-md cursor-pointer'
                                        }`}
                                >
                                    <span className="font-bold text-lg">
                                        {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="text-sm font-medium mt-1">
                                        {slot.isBooked ? 'Зайнято' : 'Вільно'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {rooms.length === 0 && !error && (
                    <div className="text-center p-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                        Немає доступних кімнат. Додайте їх через панель адміністратора.
                    </div>
                )}
            </div>
        </div>
    );
}