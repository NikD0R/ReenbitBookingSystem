using System.ComponentModel.DataAnnotations;

namespace ReenbitBookingSystem.Server.Models
{
    public class MeetingRoom
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public ICollection<BookingSlot> BookingSlots { get; set; } = new List<BookingSlot>();
    }
}
