using System.ComponentModel.DataAnnotations;

namespace ReenbitBookingSystem.Server.DTOs
{
    public class CreateRoomDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }

    public class CreateSlotDto
    {
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
    }
}
