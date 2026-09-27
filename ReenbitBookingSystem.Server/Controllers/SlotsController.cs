using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ReenbitBookingSystem.Server.Data;
using ReenbitBookingSystem.Server.Hubs;
using System.Security.Claims;

namespace ReenbitBookingSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SlotsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<BookingHub> _hubContext;

        public SlotsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public SlotsController(ApplicationDbContext context, IHubContext<BookingHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("{slotId}/book")]
        public async Task<IActionResult> BookSlot(int slotId)
        {
            var slot = await _context.BookingSlots.FindAsync(slotId);

            if (slot == null)
            {
                return NotFound("Слот не знайдено.");
            }

            if (slot.IsBooked)
            {
                return BadRequest("Слот вже заброньований.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            slot.IsBooked = true;
            slot.BookedByUserId = userId;

            try
            {
                await _context.SaveChangesAsync();

                await _hubContext.Clients.All.SendAsync("SlotStatusChanged", slotId, true);

                return Ok(new { message = "Успішно заброньовано!" });
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status409Conflict, new
                {
                    message = "Конфлікт: Цей слот щойно забронював хтось інший. Спробуйте оновити розклад."
                });
            }
        }
    }
}
