using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ReenbitBookingSystem.Server.Data;
using ReenbitBookingSystem.Server.Models;
using Xunit;

namespace BookingSystem.Tests
{
    public class ConcurrencyTests
    {
        [Fact]
        [Trait("Category", "Concurrency")]
        public async Task BookSlot_10SimultaneousRequests_OnlyOneSucceeds()
        {
            var services = new ServiceCollection();
            string connectionString = "Server=(localdb)\\mssqllocaldb;Database=ReenbitBooking_TestDB;Trusted_Connection=True;MultipleActiveResultSets=true";

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            var serviceProvider = services.BuildServiceProvider();

            int slotId;
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                await context.Database.EnsureDeletedAsync();
                await context.Database.EnsureCreatedAsync();

                var room = new MeetingRoom { Name = "Test Room" };
                context.MeetingRooms.Add(room);
                await context.SaveChangesAsync();

                var slot = new BookingSlot
                {
                    MeetingRoomId = room.Id,
                    StartTime = DateTime.UtcNow,
                    EndTime = DateTime.UtcNow.AddHours(1)
                };
                context.BookingSlots.Add(slot);
                await context.SaveChangesAsync();

                slotId = slot.Id;
            }

            int numberOfRequests = 10;
            var tasks = new Task<bool>[numberOfRequests];

            for (int i = 0; i < numberOfRequests; i++)
            {
                string userId = $"User_{i}";
                tasks[i] = Task.Run(async () =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var slotToBook = await context.BookingSlots.FindAsync(slotId);

                    if (slotToBook == null || slotToBook.IsBooked)
                        return false;

                    slotToBook.IsBooked = true;
                    slotToBook.BookedByUserId = userId;

                    try
                    {
                        await context.SaveChangesAsync();
                        return true;
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        return false;
                    }
                });
            }

            var results = await Task.WhenAll(tasks);

            int successCount = results.Count(r => r == true);
            int failCount = results.Count(r => r == false);

            Assert.Equal(1, successCount);
            Assert.Equal(numberOfRequests - 1, failCount);

            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var finalSlot = await context.BookingSlots.FindAsync(slotId);

                Assert.True(finalSlot!.IsBooked);
                Assert.NotNull(finalSlot.BookedByUserId);
            }
        }
    }
}