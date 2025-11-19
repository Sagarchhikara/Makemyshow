import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';

const Payment = () => {
  const { booking } = useContext(BookingContext);
  const { movie, time, seats, total } = booking || {};
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

    if (validCodes[promoCode]) {
      setDiscount(total * validCodes[promoCode]);
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

  const totalAfterDiscount = (total || 0) - discount;
  const gst = totalAfterDiscount * 0.18;
  const finalTotal = totalAfterDiscount + gst;

  return (
    <section className="payment-section">
      <div className="container">
        <div className="payment-container">
          <div className="payment-form">
            <Link to="/booking" className="back-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
              Back to Booking
            </Link>
            <h2 className="payment-title">Complete Your Payment</h2>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h4>Select Payment Method</h4>
              <div className="method-tabs">
                <button className={`method-tab ${activeMethod === 'card' ? 'active' : ''}`} onClick={() => handleMethodChange('card')}>Card</button>
                <button className={`method-tab ${activeMethod === 'upi' ? 'active' : ''}`} onClick={() => handleMethodChange('upi')}>UPI</button>
                <button className={`method-tab ${activeMethod === 'wallet' ? 'active' : ''}`} onClick={() => handleMethodChange('wallet')}>Wallet</button>
              </div>

              {activeMethod === 'card' && (
                <div className="method-content">
                  <input type="text" className="form-input" placeholder="Card Number" />
                  <input type="text" className="form-input" placeholder="Cardholder Name" />
                  <div className="form-row">
                    <input type="text" className="form-input" placeholder="MM/YY" />
                    <input type="text" className="form-input" placeholder="CVV" />
                  </div>
                </div>
              )}
               {activeMethod === 'upi' && (
                <div className="method-content">
                  <input type="text" className="form-input" placeholder="yourname@upi" />
                </div>
              )}

              {activeMethod === 'wallet' && (
                <div className="method-content">
                 <select className="form-input" id="bank-select">
                    <option value="">Choose your wallet</option>
                    <option value="paytm">Paytm</option>
                    <option value="mobikwik">MobiKwik</option>
                    <option value="freecharge">FreeCharge</option>
                    <option value="amazon">Amazon Pay</option>
                  </select>
                </div>
              )}
            </div>

            <button className="pay-button" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
            </button>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-item">
              <span>Movie</span>
              <span>{movie || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span>Time</span>
              <span>{time || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span>Seats</span>
              <span>{(seats || []).join(', ')}</span>
            </div>
            <div className="summary-item">
              <span>Tickets</span>
              <span>{(seats || []).length}</span>
            </div>
            <hr />
            <div className="summary-item">
              <span>Subtotal</span>
              <span>₹{(total || 0).toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="promo-section">
              <div className="promo-input-group">
                <input
                  type="text"
                  className="promo-input"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="apply-btn" onClick={handleApplyPromo}>Apply</button>
              </div>
            </div>
            {promoError && <p className="promo-error">{promoError}</p>}

            {discount > 0 && (
              <div className="summary-item discount">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            )}

            <hr />
            <div className="summary-item total">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;