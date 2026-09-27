# Reenbit Booking System

Full-stack застосунок для бронювання переговорних кімнат у реальному часі.

## 🚀 Технологічний стек
- **Backend:** ASP.NET Core (.NET 10), Entity Framework Core, SQL Server, ASP.NET Core Identity.
- **Frontend:** React, Vite, Tailwind CSS v4, Axios.
- **Real-time:** SignalR (вбудований для локальної розробки, підготовлений до Azure SignalR Service).
- **Concurrency:** Optimistic Concurrency Control (RowVersion).

## ⚙️ Як запустити локально

1. Клонуйте репозиторій.
2. Переконайтеся, що у вас встановлено .NET 10 SDK та Node.js.
3. Відкрийте рішення у Visual Studio.
4. Налаштуйте **Multiple Startup Projects**:
   - `ReenbitBookingSystem.Server` (Action: Start)
   - `reenbitbookingsystem.client` (Action: Start)
5. Змініть профіль запуску для бекенду на **http** (порт 5039).
6. Натисніть **Start**. База даних створиться автоматично, і буде створено тестового адміністратора:
   - **Email:** `admin@reenbit.com`
   - **Пароль:** `Admin123!`

## ☁️ Cloud Readiness (Deployment Strategy)
Проект повністю підготовлений до деплою в екосистемі **Microsoft Azure**:
- **App Service:** Клієнтська частина (Vite build) та бекенд налаштовані для розгортання як єдиний артефакт.
- **Azure SignalR Service:** У `Program.cs` додано інтеграцію через `.AddAzureSignalR()`. Для активації достатньо додати `Azure:SignalR:ConnectionString` у змінні середовища Azure.
- **SQL Database:** EF Core міграції готові до застосування на Azure SQL.
*(Примітка: Фізичний деплой на Azure не виконувався через відсутність активної підписки. Моя попередня підписка Azure for Students була скасована через початок непередбачених платних нарахувань, а створити новий безкоштовний акаунт система наразі не дозволяє. Тим не менш, архітектура та кодова база проекту повністю підготовлені до розгортання в середовищі Azure).*