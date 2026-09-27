# Project Context: Meeting Room Booking System

## Overview
This is a test task for Reenbit. It is a booking system for a limited set of resources (meeting rooms). The system guarantees that a time slot is never double-booked using strict concurrency control and reflects booking status to all users in real-time.

## Tech Stack
- **Backend:** ASP.NET Core (C#)
- **Database:** Azure SQL Database (via Entity Framework Core)
- **Real-time Communication:** Azure SignalR Service
- **Frontend:** React

## Build & Run Commands
- **Restore dependencies:** `dotnet restore`
- **Build the project:** `dotnet build`
- **Run the backend:** `dotnet run --project ReenbitBookingSystem.Server`
- **Run concurrency tests:** `dotnet test --filter "Category=Concurrency"`

## Strict AI Coding Guidelines

### 1. Concurrency Control (CRITICAL)
- **Rule:** A naive "check if free, then insert" is STRICTLY FORBIDDEN.
- **Implementation:** When handling booking requests, you must use explicit concurrency control. 
- *Recommendation:* Use Optimistic Concurrency with a `RowVersion` (Timestamp) in Entity Framework Core, OR use database-level transactional locking (`SERIALIZABLE` isolation level).
- **Conflict Handling:** If two requests arrive simultaneously, exactly one must succeed. The other must return a clean, clear conflict response (e.g., HTTP 409 Conflict), NEVER a 500 Server Error or silent overwrite.

### 2. Real-Time Updates (SignalR)
- **Rule:** The system must use Azure SignalR Service.
- **Implementation:** Whenever a booking state changes (created, cancelled), broadcast an event (e.g., `SlotStatusChanged`) to all connected clients immediately. Do not rely on client-side polling.

### 3. Repository & Commits
- **Rule:** Follow atomic commit principles.
- **Implementation:** Make small, logical commits. Each commit message MUST include a short description of *what* changed and *why*. 
  - *Example:* "feat: implement optimistic concurrency for booking to prevent double-booking".

### 4. Custom Skills / Helpers
- When generating tests, always include at least one test method that uses `Task.WhenAll` to fire 5-10 simultaneous requests at the exact same time slot to prove concurrency control works perfectly.

### 5. Authorization & Roles (Role-based model)
- **Rule:** Implement user authentication with two roles: Admin and Regular User.
- **Implementation:** Admins can create, edit, remove resources, and view all bookings. Regular users can only view schedules and book available slots. Ensure endpoints are properly secured with [Authorize(Roles = "...")]. 

### 6. Code Quality & Documentation
- **Rule:** Code must be well-documented and suitable for review.
- **Implementation:** Add concise XML comments for public APIs, controllers, and complex business logic (especially around the concurrency implementation).