using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReenbitBookingSystem.Server.Data;
using ReenbitBookingSystem.Server.DTOs;
using ReenbitBookingSystem.Server.Models;

namespace ReenbitBookingSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _context.MeetingRooms
                .Include(r => r.BookingSlots)
                .ToListAsync();
            return Ok(rooms);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDto dto)
        {
            var room = new MeetingRoom { Name = dto.Name };
            _context.MeetingRooms.Add(room);
            await _context.SaveChangesAsync();
            return Ok(room);
        }

        [HttpPost("{roomId}/slots")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddSlot(int roomId, [FromBody] CreateSlotDto dto)
        {
            var room = await _context.MeetingRooms.FindAsync(roomId);
            if (room == null) return NotFound("Кімнату не знайдено.");

            var slot = new BookingSlot
            {
                MeetingRoomId = roomId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.BookingSlots.Add(slot);
            await _context.SaveChangesAsync();
            return Ok(slot);
        }
    }
}