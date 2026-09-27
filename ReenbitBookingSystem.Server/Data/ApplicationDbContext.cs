using Microsoft.EntityFrameworkCore;
using ReenbitBookingSystem.Server.Models;

namespace ReenbitBookingSystem.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<MeetingRoom> MeetingRooms { get; set; }
        public DbSet<BookingSlot> BookingSlots { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<BookingSlot>()
                .Property(b => b.RowVersion)
                .IsRowVersion();
        }
    }
}