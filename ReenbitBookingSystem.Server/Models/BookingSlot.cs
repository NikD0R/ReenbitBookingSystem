using System.ComponentModel.DataAnnotations;

namespace ReenbitBookingSystem.Server.Models
{
    public class BookingSlot
    {
        public int Id { get; set; }
        public int MeetingRoomId { get; set; }
        public MeetingRoom? MeetingRoom { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsBooked { get; set; } = false;
        public string? BookedByUserId { get; set; }

        [Timestamp]
        public byte[]? RowVersion { get; set; }
    }
}