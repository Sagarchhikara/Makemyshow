# MakeMyShow - Movie Ticket Booking Website

MakeMyShow is a modern and responsive movie ticket booking website that allows users to browse movies, view details, and book tickets. This project is built with HTML, CSS, and vanilla JavaScript, focusing on a clean user interface and a smooth user experience.   fdrgrthdy

## Features

- **Responsive Design**: The website is fully responsive and works on all devices, from mobile phones to desktops.
- **Movie Listings**: Browse "Now Showing" and "Coming Soon" movie sections.
- **Interactive Slideshow**: A dynamic hero slideshow showcases featured movies.
- **Movie Search**: Users can search for movies by title or genre.
- **Booking System**: A multi-step booking process allows users to:
    - Select a movie time.
    - Choose the number of tickets.
    - Select seats from an interactive seat map.
    - View a booking summary.
- **Smooth Animations**: The UI includes smooth animations and transitions for a better user experience.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need a web browser to view the website. No special software is required.

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/your_username/your_repository.git
   ```
2. Navigate to the project directory:
   ```sh
   cd your_repository
   ```
3. Open the `html/index.html` file in your web browser.

## Usage

- **Browsing Movies**: Scroll through the "Now Showing" and "Coming Soon" sections to see the available movies.
- **Booking Tickets**: Click the "Book Now" button on any movie card to start the booking process.
- **Searching for Movies**: Use the search bar in the navigation to find movies by title or genre.

## Project Structure

```
.
├── css/
│   ├── booking.css
│   ├── payment.css
│   ├── signin.css
│   └── style.css
├── html/
│   ├── booking.html
│   ├── index.html
│   ├── payment-gateway.html
│   └── signin.html
├── images/
│   └── (movie posters and other images)
├── js/
│   ├── booking.js
│   └── script.js
└── README.md
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is unlicensed.

## Contact

# 🎬 MakeMyShow - Complete Dynamic Booking Flow

## 📊 Data Flow Architecture

```
HOME PAGE (index.html)
    ↓
    User clicks "Book Now" on any movie
    ↓
BOOKING PAGE (booking.html)
    ↓
    URL Parameters: ?movie=XXX&poster=YYY
    ↓
    Step 1: Select Showtime
    Step 2: Select Ticket Quantity
    Step 3: Select Seats
    ↓
PAYMENT PAGE (payment-gateway.html)
    ↓
    URL Parameters: ?movie=XXX&poster=YYY&time=ZZZ&seats=AAA&quantity=NNN
    ↓
    Complete Payment
    ↓
SUCCESS PAGE (index.html)
    ↓
    URL Parameters: ?payment=success&booking=BKXXX&movie=YYY&seats=ZZZ&amount=NNN
```

---

## 🔄 Complete Flow Breakdown

### **1. Movie Selection (index.html / script.js)**

**User Action:** Clicks "Book Now" on any movie card

**What Happens:**
```javascript
// In script.js - handleBookTicket function
const movieTitle = card.querySelector('h3')?.textContent;
const posterUrl = card.querySelector('.movie-poster img')?.src;

const params = new URLSearchParams();
params.append('movie', encodeURIComponent(movieTitle));
params.append('poster', encodeURIComponent(posterUrl));

window.location.href = `booking.html?${params.toString()}`;
```

**URL Example:**
```
booking.html?movie=F1%3A%20The%20Movie&poster=../images/f1%20movie.png
```

---

### **2. Booking Page (booking.html / booking.js)**

**Data Received:**
- `movie` - Movie title
- `poster` - Poster image URL

**User Actions:**
1. Select showtime (e.g., "6:30 PM")
2. Select ticket quantity (1-10)
3. Select exact seats (e.g., A1, A2, A3)
4. Click "Confirm Booking"

**What Happens:**
```javascript
// In booking.js - handleConfirmBooking function
const paymentParams = new URLSearchParams({
  movie: bookingState.movieTitle,          // "F1: The Movie"
  poster: bookingState.posterUrl,          // "../images/f1 movie.png"
  time: bookingState.time,                 // "6:30 PM"
  seats: bookingState.selectedSeats.join(', '), // "A1, A2, A3"
  quantity: bookingState.ticketQuantity.toString(), // "3"
  total: bookingState.totalPrice.toString()        // "450"
});

window.location.href = `payment-gateway.html?${paymentParams.toString()}`;
```

**URL Example:**
```
payment-gateway.html?movie=F1%3A%20The%20Movie&poster=../images/f1%20movie.png&time=6%3A30%20PM&seats=A1%2C%20A2%2C%20A3&quantity=3&total=450
```

---

### **3. Payment Page (payment-gateway.html / payment-gateway.js)**

**Data Received:**
- `movie` - Movie title
- `poster` - Poster URL
- `time` - Showtime
- `seats` - Selected seats
- `quantity` - Number of tickets

**Automatic Calculations:**
```javascript
// In payment-gateway.js - calculatePrices function
Ticket Price:      ₹150 × 3 = ₹450
Convenience Fee:   ₹30
Subtotal:          ₹480
GST (18%):         ₹86
-----------------------------------
TOTAL:             ₹566
```

**Dynamic Updates:**
- Movie title appears in header
- Poster displays correctly
- Showtime shows selected time
- Seats display as "A1, A2, A3"
- Quantity shows "3 × ₹150"
- Total calculates automatically

**Payment Processing:**
```javascript
// After successful payment
const bookingData = {
  bookingId: generateBookingId(),      // "BKLXYZ123ABC"
  movieTitle: "F1: The Movie",
  showtime: "6:30 PM",
  seats: "A1, A2, A3",
  quantity: 3,
  amount: 566,
  paymentMethod: "card",
  timestamp: "2025-10-23T10:30:00.000Z"
};

// Redirect with booking confirmation
window.location.href = `index.html?payment=success&booking=${bookingData.bookingId}&movie=${movieTitle}&seats=${seats}&amount=${amount}`;
```

---

## 🎯 Key Features

### ✅ **Fully Dynamic**
- All data flows through URL parameters
- No hardcoded values
- Works with any movie selected

### ✅ **Data Persistence**
- Movie details carry through entire flow
- Poster images maintain consistency
- Selected seats tracked accurately

### ✅ **Automatic Calculations**
```javascript
// Pricing formula
subtotal = quantity × ticketPrice
gst = (subtotal + convenienceFee) × 0.18
total = subtotal + convenienceFee + gst - discount
```

### ✅ **Promo Code System**
```javascript
MOVIE20   → 20% off
FIRST50   → ₹50 off
WELCOME10 → 10% off
WEEKEND25 → 25% off
FLAT100   → ₹100 off
```

### ✅ **Validation**
- Card number formatting & detection (Visa, MC, Amex, RuPay)
- Expiry date validation (checks if expired)
- CVV validation
- UPI ID format checking
- Seat selection limits

### ✅ **Smart UI Updates**
- Real-time price calculations
- Live seat selection counter
- Payment method switching
- Card type detection
- Processing animations

---

## 📝 Example Complete Flow

### **Step-by-Step Example:**

1. **User sees "War 2" on homepage**
   - Rating: ★ 7.8
   - Genre: Thriller • 128m

2. **Clicks "Book Now"**
   ```
   → Redirects to: booking.html?movie=War%202&poster=../images/war%202.jpg
   ```

3. **Booking Page Shows:**
   - Header: "Book Tickets for War 2"
   - Available showtimes
   - Ticket quantity selector
   - Seat map (10 rows × 12 seats)

4. **User Selects:**
   - Time: 9:00 PM
   - Quantity: 2 tickets
   - Seats: H5, H6

5. **Clicks "Confirm Booking"**
   ```
   → Redirects to: payment-gateway.html?movie=War%202&poster=../images/war%202.jpg&time=9%3A00%20PM&seats=H5%2C%20H6&quantity=2
   ```

6. **Payment Page Shows:**
   ```
   Movie:           War 2
   Poster:          [War 2 poster image]
   Date & Time:     9:00 PM
   Seats:           H5, H6
   Tickets:         2 × ₹150
   Convenience Fee: ₹30
   GST (18%):       ₹59
   ─────────────────────────
   TOTAL:           ₹389
   ```

7. **User Enters Promo Code:** `MOVIE20`
   ```
   Discount:        -₹66 (20% off)
   NEW TOTAL:       ₹323
   ```

8. **Completes Payment**
   ```
   → Payment Processing... (3 seconds)
   → Success! Booking ID: BKLX8K3ABC
   → Redirects to: index.html?payment=success&booking=BKLX8K3ABC&movie=War%202&seats=H5%
