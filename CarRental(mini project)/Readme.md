# CarRental – Self Drive Car Booking Website

A responsive, front-end car rental web application that allows users to search for cars by city, view available vehicles, book self-drive cars, apply promo codes, and view booking history.  
This project is built using **HTML, CSS, JavaScript, and Bootstrap**, with **LocalStorage** used for data persistence.

-------------------------------------------------------------------------------------------------------------------------------------------

## Features

- City-based car search
- User authentication (login/logout)
- Car listing with price per day
- Car booking with date & time selection
- Automatic fare calculation (max 14 days)
- Promo codes and discounts
- Booking history per user
- Customer support page
- Fully responsive UI using Bootstrap

-------------------------------------------------------------------------------------------------------------------------------------------

## Pages Overview

- **login.html**  
  User login page with basic validation.

- **index.html**  
  Home page to select city and explore car rental services.

- **cars.html**  
  Displays available cars with images and per-day pricing.

- **booking.html**  
  Booking form to select trip dates, apply promo codes, and confirm booking.

- **history.html**  
  Shows logged-in user’s booking history.

- **support.html**  
  Customer support contact details.

-------------------------------------------------------------------------------------------------------------------------------------------

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Browser LocalStorage

-------------------------------------------------------------------------------------------------------------------------------------------

## How It Works
1. User selects a city on the home page.
2. Available cars are displayed with prices.
3. User logs in to proceed with booking.
4. Car details are stored in LocalStorage.
5. Booking fare is calculated based on duration.
6. Promo codes can be applied:
   - `TRIP10` – 10% off
   - `WEEKEND` – 5% off if weekend included
   - `ICICI15` – 15% off
7. Booking details are saved and shown in booking history.

-------------------------------------------------------------------------------------------------------------------------------------------

## Booking Rules

- Maximum booking duration: **14 days**
- Drop date & time must be after pickup
- Weekend discount applies only if Saturday or Sunday is included

-------------------------------------------------------------------------------------------------------------------------------------------

## Installation & Usage

1. Download or clone the project.
2. Keep all `.html` files and image assets in the same directory.
3. Open `index.html` in any modern browser.

-------------------------------------------------------------------------------------------------------------------------------------------

## Improvements Over Previous Version

- CSS improvement:
    - Upgraded from basic Bootstrap layout to a **modern, card-based UI**
    - Consistent color theme and branding across all pages
    - Improved spacing, typography, and responsiveness
    - Better visual hierarchy for forms, cards, and tables
- Booking Flow Enhancment:
    - Replaced simple “number of days” slider with **pickup & drop date and time**
    - Accurate day calculation using real date-time logic
    - Enforced **maximum booking limit of 14 days**
    - Prevents invalid bookings (drop before pickup)
- Promo code:
    - Added dynamic promo code support
    - Available codes: `TRIP10`, `WEEKEND`, `ICICI15`
    - Real-time validation and fare update
    - Discount shown separately before final fare
    - Promo applies only for valid date & time bookings
- Data storage:
    - Booking history is now **user-specific**, not global
    - Stores pickup/drop date and time instead of just days
    - Improved booking object structure for scalability
- Validation & Error Handling:
    - Field-level validation with visual feedback
    - Clear error messages for invalid inputs
    - Prevents incomplete or incorrect form submissions
- Navigation & Structure:
    - Added protected routes (redirects to login if not authenticated)
    - Cleaner navigation flow between pages
    - Improved booking history table with status badges

## Limitations

- No backend or real authentication
- Data is browser-specific (LocalStorage)
- No payment gateway integration

-------------------------------------------------------------------------------------------------------------------------------------------

## Future Enhancements

- Backend integration
- Database support
- Admin panel
- Payment gateway
- Booking cancellation feature