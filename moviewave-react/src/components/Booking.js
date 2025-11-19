import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';

const SEAT_ROWS = 6;
const SEAT_COLS = 8;
const bookedSeats = ['A3', 'B5', 'C1', 'D8']; // Mock booked seats

const Booking = () => {
  const { setBooking } = useContext(BookingContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { movie } = location.state || { movie: { title: 'F1: The Movie', ticketPrice: 250 } };

  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Recalculate total price whenever selected seats change
    const newTotalPrice = selectedSeats.length * (movie.ticketPrice || 150);
    setTotalPrice(newTotalPrice);
    setBooking({
      movie: movie,
      time: selectedTime,
      seats: selectedSeats,
      total: newTotalPrice,
    });
  }, [selectedSeats, movie, selectedTime, setBooking]);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(2); // Move to ticket selection
  };

  const handleQuantityChange = (amount) => {
    setTicketQuantity((prev) => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (newQuantity > 10) return 10;
      return newQuantity;
    });
  };

  const handleConfirmQuantity = () => {
    setSelectedSeats([]); // Reset seats when quantity changes
    setStep(3); // Move to seat selection
  };

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        // If seat is already selected, unselect it
        return prev.filter((s) => s !== seatId);
      } else {
        // If not selected, add it, but only if we haven't reached the ticket quantity limit
        if (prev.length < ticketQuantity) {
          return [...prev, seatId];
        }
        return prev;
      }
    });
  };

  const renderSeatMap = () => {
    let seats = [];
    for (let i = 0; i < SEAT_ROWS; i++) {
      const row = String.fromCharCode(65 + i); // A, B, C...
      for (let j = 1; j <= SEAT_COLS; j++) {
        const seatId = `${row}${j}`;
        let seatClass = 'seat available';
        if (bookedSeats.includes(seatId)) {
          seatClass = 'seat booked';
        } else if (selectedSeats.includes(seatId)) {
          seatClass = 'seat selected';
        }

        seats.push(
          <div
            key={seatId}
            className={seatClass}
            onClick={() => !bookedSeats.includes(seatId) && handleSeatSelect(seatId)}
          >
            {seatId}
          </div>
        );
      }
    }
    return seats;
  };

  const isBookingConfirmedEnabled = selectedSeats.length === ticketQuantity && ticketQuantity > 0;

  const handleConfirmBooking = () => {
    navigate('/payment');
  };

  return (
    <section id="booking" className="section booking-section">
      <div className="container">
        <div className="booking-header">
          <Link to="/" className="btn btn-outline" id="back-to-movies">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Back to Movies
          </Link>
          <h2 id="booking-movie-title" className="section-title">Book Tickets for {movie.title}</h2>
        </div>

        <div className="booking-flow">
          {/* Step 1: Showtime */}
          <div className={`booking-step ${step === 1 ? 'active' : ''}`} id="step-1-time">
            <h3>Select Showtime</h3>
            <div className="time-slots">
              {['12:00 PM', '3:00 PM', '6:30 PM', '9:00 PM'].map(time => (
                <button key={time} className="time-slot" onClick={() => handleTimeSelect(time)}>{time}</button>
              ))}
            </div>
          </div>

          {/* Step 2: Tickets */}
          <div className={`booking-step ${step === 2 ? 'active' : ''}`} id="step-2-tickets">
            <h3>Select Number of Tickets</h3>
            <div className="ticket-quantity">
              <button id="quantity-minus" className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={ticketQuantity <= 1}>-</button>
              <span id="quantity-display">{ticketQuantity}</span>
              <button id="quantity-plus" className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={ticketQuantity >= 10}>+</button>
            </div>
            <p className="ticket-help">You can select up to 10 tickets.</p>
            <button id="confirm-quantity-btn" className="btn btn-primary" onClick={handleConfirmQuantity}>Select Seats</button>
          </div>

          {/* Step 3: Seat Selection */}
          <div className={`booking-step ${step === 3 ? 'active' : ''}`} id="step-3-seats">
            <div className="seat-selection-layout">
              <div className="seat-map-container">
                <div className="screen">SCREEN</div>
                <div id="seat-map" className="seat-map">{renderSeatMap()}</div>
                <div className="seat-legend">
                  <div className="legend-item"><div className="seat available"></div><span>Available</span></div>
                  <div className="legend-item"><div className="seat selected"></div><span>Selected</span></div>
                  <div className="legend-item"><div className="seat booked"></div><span>Booked</span></div>
                </div>
              </div>
              <div className="booking-summary-container">
                <h3>Booking Summary</h3>
                <div id="booking-summary" className="booking-summary">
                  <p><strong>Movie:</strong> <span id="summary-movie-title">{movie.title}</span></p>
                  <p><strong>Time:</strong> <span id="summary-time">{selectedTime}</span></p>
                  <p><strong>Seats:</strong> <span id="summary-seats">{selectedSeats.join(', ') || 'N/A'}</span></p>
                  <p><strong>Total:</strong> <span id="summary-total">₹{totalPrice}</span></p>
                </div>
                <button id="confirm-booking-btn" className="btn btn-primary btn-full" disabled={!isBookingConfirmedEnabled} onClick={handleConfirmBooking}>
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
