import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';

const Payment = () => {
  const { booking } = useContext(BookingContext);
  const { movie, time, seats, total } = booking;
  const [activeMethod, setActiveMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

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

  const totalAfterDiscount = total - discount;
  const gst = totalAfterDiscount * 0.18;
  const finalTotal = totalAfterDiscount + gst;

  return (
    <section className="payment-section">
      <div className="container">
        <Link to="/booking" className="back-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Back to Booking
        </Link>

        <div className="payment-container">
          {/* Payment Form */}
          <div className="payment-form">
            <div className="payment-header">
              <h2 className="payment-title">Complete Payment</h2>
              <div className="secure-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 7V12C3 16.97 6.84 21.25 12 22C17.16 21.25 21 16.97 21 12V7L12 2Z"/>
                </svg>
                Secure Payment
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <div className="method-tabs">
                <button className={`method-tab ${activeMethod === 'card' ? 'active' : ''}`} onClick={() => handleMethodChange('card')}>Card</button>
                <button className={`method-tab ${activeMethod === 'upi' ? 'active' : ''}`} onClick={() => handleMethodChange('upi')}>UPI</button>
                <button className={`method-tab ${activeMethod === 'wallet' ? 'active' : ''}`} onClick={() => handleMethodChange('wallet')}>Wallet</button>
                <button className={`method-tab ${activeMethod === 'netbanking' ? 'active' : ''}`} onClick={() => handleMethodChange('netbanking')}>Net Banking</button>
              </div>

              {/* Credit/Debit Card */}
              <div className={`method-content ${activeMethod === 'card' ? 'active' : ''}`} id="card-method">
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-input" placeholder="1234 5678 9012 3456" maxLength="19" id="card-number" />
                  <div className="card-logos">
                    <div className="card-logo">VISA</div>
                    <div className="card-logo">MC</div>
                    <div className="card-logo">AMEX</div>
                    <div className="card-logo">RuPay</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input type="text" className="form-input" placeholder="John Doe" id="cardholder-name" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input type="text" className="form-input" placeholder="MM/YY" maxLength="5" id="expiry-date" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input type="text" className="form-input" placeholder="123" maxLength="3" id="cvv" />
                  </div>
                </div>
              </div>

              {/* UPI */}
              <div className={`method-content ${activeMethod === 'upi' ? 'active' : ''}`} id="upi-method">
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input type="text" className="form-input" placeholder="yourname@upi" id="upi-id" />
                </div>
                <div className="upi-options">
                  <div className="upi-option" data-upi="gpay">
                    <div className="upi-icon">G</div>
                    <span>Google Pay</span>
                  </div>
                  <div className="upi-option" data-upi="phonepe">
                    <div className="upi-icon">P</div>
                    <span>PhonePe</span>
                  </div>
                  <div className="upi-option" data-upi="paytm">
                    <div className="upi-icon">P</div>
                    <span>Paytm</span>
                  </div>
                  <div className="upi-option" data-upi="bhim">
                    <div className="upi-icon">B</div>
                    <span>BHIM</span>
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div className={`method-content ${activeMethod === 'wallet' ? 'active' : ''}`} id="wallet-method">
                <div className="wallet-grid">
                  <div className="wallet-option" data-wallet="paytm">Paytm</div>
                  <div className="wallet-option" data-wallet="mobikwik">MobiKwik</div>
                  <div className="wallet-option" data-wallet="freecharge">FreeCharge</div>
                  <div className="wallet-option" data-wallet="amazon">Amazon Pay</div>
                </div>
              </div>

              {/* Net Banking */}
              <div className={`method-content ${activeMethod === 'netbanking' ? 'active' : ''}`} id="netbanking-method">
                <div className="form-group">
                  <label className="form-label">Select Bank</label>
                  <select className="form-input" id="bank-select">
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="yes">Yes Bank</option>
                    <option value="indusind">IndusInd Bank</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="security-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7V12C3 16.97 6.84 21.25 12 22C17.16 21.25 21 16.97 21 12V7L12 2Z"/>
              </svg>
              Your payment information is encrypted and secure
            </div>
          </div>

          {/* Payment Summary */}
          <div className="payment-summary">
            <div className="summary-header">
              <div className="movie-poster-small">
                <img src="" alt="Movie Poster" id="summary-poster" />
              </div>
              <h3 id="payment-movie-title">{movie}</h3>
            </div>

            <div className="summary-item">
              <span className="summary-label">Movie</span>
              <span className="summary-value" id="payment-movie-name">{movie}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Date & Time</span>
              <span className="summary-value" id="payment-time">{time}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Seats</span>
              <span className="summary-value" id="payment-seats">{seats.join(', ')}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tickets</span>
              <span className="summary-value" id="payment-quantity">{seats.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Convenience Fee</span>
              <span className="summary-value" id="payment-convenience-fee">₹0</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">GST (18%)</span>
              <span className="summary-value" id="payment-gst">₹{gst.toFixed(2)}</span>
            </div>

            <div className="promo-section">
              <label className="form-label">Promo Code</label>
              <div className="promo-input-group">
                <input
                  type="text"
                  className="promo-input"
                  placeholder="Enter code"
                  id="promo-code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="button" className="apply-btn" onClick={handleApplyPromo}>Apply</button>
              </div>
              {promoError && <p className="promo-error">{promoError}</p>}
            </div>

            {discount > 0 && (
              <div className="summary-item">
                <span className="summary-label">Discount</span>
                <span className="summary-value" id="payment-discount">- ₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-item">
              <span className="summary-label">Total Amount</span>
              <span className="summary-value" id="payment-total">₹{finalTotal.toFixed(2)}</span>
            </div>

            <button className="pay-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7V12C3 16.97 6.84 21.25 12 22C17.16 21.25 21 16.97 21 12V7L12 2Z"/>
              </svg>
              <span id="pay-button-text">Pay ₹{finalTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
