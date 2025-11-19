import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';

const OrderConfirmation = () => {
  const { booking } = useContext(BookingContext);
  const { movie, time, seats, total } = booking;

  return (
    <section className="confirmation-section">
      <div className="container">
        <div className="confirmation-box">
          <h2>Booking Confirmed!</h2>
          <p>Your tickets for <strong>{movie}</strong> have been booked.</p>

          <div className="order-details">
            <div className="detail-item">
              <span>Time</span>
              <span>{time}</span>
            </div>
            <div className="detail-item">
              <span>Seats</span>
              <span>{seats.join(', ')}</span>
            </div>
            <div className="detail-item">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;
