import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import '../css/payment.css';

const Payment = () => {
  const { booking } = useContext(BookingContext);
  const { movie, time, seats } = booking || {};
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  const handleMethodChange = (method) => {
    setActiveMethod(method);
  };

  const handleApplyPromo = () => {
    const validCodes = {
      'SAVE10': 0.1,
      'MOVIEWAVE20': 0.2,
    };

    const subtotal = (seats ? seats.length * 150 : 0);
    if (validCodes[promoCode]) {
      setDiscount(subtotal * validCodes[promoCode]);
      setPromoError('');
    } else {
      setDiscount(0);
      setPromoError('Invalid promo code');
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/confirmation');
    }, 2000); // Simulate 2-second processing time
  };

  const ticketPrice = 150;
  const convenienceFee = 30;
  const subtotal = (seats ? seats.length * ticketPrice : 0);
  const totalAfterDiscount = subtotal - discount;
  const gst = (totalAfterDiscount + convenienceFee) * 0.18;
  const finalTotal = totalAfterDiscount + convenienceFee + gst;

  return (
    <section className="payment-section">
      <div className="container">
        <header className="payment-header">
            <Link to="/" className="header-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#FF0000"/>
                  <path d="M16 4L28 16L16 28L4 16L16 4Z" fill="white"/>
                  <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="#FF0000"/>
              </svg>
              <span>MovieWave</span>
            </Link>
        </header>

        <div className="payment-container">
          {/* Left Column: Payment Form */}
          <div className="payment-form">
            <h2 className="payment-title">Complete Payment</h2>
            <div className="secure-payment-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="9,12 11,14 15,10" />
              </svg>
              Secure Payment
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <div className="method-tabs">
                <button className={`method-tab ${activeMethod === 'card' ? 'active' : ''}`} onClick={() => handleMethodChange('card')}>Card</button>
                <button className={`method-tab ${activeMethod === 'upi' ? 'active' : ''}`} onClick={() => handleMethodChange('upi')}>UPI</button>
                <button className={`method-tab ${activeMethod === 'wallet' ? 'active' : ''}`} onClick={() => handleMethodChange('wallet')}>Wallet</button>
                <button className={`method-tab ${activeMethod === 'netbanking' ? 'active' : ''}`} onClick={() => handleMethodChange('netbanking')}>Net Banking</button>
              </div>

              {activeMethod === 'card' && (
                <div className="method-content">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" className="form-input" placeholder="1234 5678 9012 3456" />
                    <div className="card-logos">
                      <span>VISA</span>
                      <span>MC</span>
                      <span>AMEX</span>
                      <span>RuPay</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" className="form-input" placeholder="John Doe" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" className="form-input" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" className="form-input" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="secure-info-badge">
                Your payment information is encrypted and secure
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="order-summary">
            <div className="movie-poster">
                <img src={movie?.posterURL} alt={movie?.title} />
            </div>
            <h4 className="summary-title">{movie?.title || "Movie"}</h4>

            <div className="summary-details">
                <div className="summary-item">
                    <span>Movie</span>
                    <span>{movie?.title || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <span>Date & Time</span>
                    <span>{time || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <span>Seats</span>
                    <span>{(seats || []).join(', ') || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <span>Tickets</span>
                    <span>{seats ? `${seats.length} × ₹${ticketPrice}` : 'N/A'}</span>
                </div>
                <div className="summary-item">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                </div>
            </div>

            <div className="promo-section">
              <input
                type="text"
                className="promo-input"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button className="apply-btn" onClick={handleApplyPromo}>Apply</button>
            </div>

            {promoError && <p className="promo-error">{promoError}</p>}
            {discount > 0 && (
              <div className="summary-item discount">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="total-amount">
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            <button className="pay-button" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;