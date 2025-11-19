import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { IMAGE_BASE_URL } from '../api/tmdb';
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

              {activeMethod === 'upi' && (
                <div className="method-content">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input type="text" className="form-input" placeholder="yourname@upi" />
                    <p className="input-hint">Enter your UPI ID (e.g., 9876543210@paytm)</p>
                  </div>
                  <div className="upi-apps">
                    <p className="upi-label">Or pay using</p>
                    <div className="upi-options">
                      <button className="upi-option">
                        <img src="/icons8-google-pay.svg" alt="Google Pay" className="payment-logo" />
                        <span>Google Pay</span>
                      </button>
                      <button className="upi-option">
                        <img src="/icons8-paypal-48.png" alt="PayPal" className="payment-logo" />
                        <span>PayPal</span>
                      </button>
                      <button className="upi-option">
                        <img src="/icons8-apple-pay-30.png" alt="Apple Pay" className="payment-logo" />
                        <span>Apple Pay</span>
                      </button>
                      <button className="upi-option">
                        <img src="/google-pay_6124998.png" alt="UPI" className="payment-logo" />
                        <span>UPI</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeMethod === 'wallet' && (
                <div className="method-content">
                  <div className="wallet-options">
                    <button className="wallet-option">
                      <div className="wallet-icon">
                        <img src="/icons8-google-pay.svg" alt="Google Pay" />
                      </div>
                      <div className="wallet-info">
                        <span className="wallet-name">Google Pay</span>
                        <span className="wallet-balance">Balance: ₹2,450</span>
                      </div>
                    </button>
                    <button className="wallet-option">
                      <div className="wallet-icon">
                        <img src="/icons8-paypal-48.png" alt="PayPal" />
                      </div>
                      <div className="wallet-info">
                        <span className="wallet-name">PayPal</span>
                        <span className="wallet-balance">Balance: ₹1,200</span>
                      </div>
                    </button>
                    <button className="wallet-option">
                      <div className="wallet-icon">
                        <img src="/icons8-apple-pay-30.png" alt="Apple Pay" />
                      </div>
                      <div className="wallet-info">
                        <span className="wallet-name">Apple Pay</span>
                        <span className="wallet-balance">Balance: ₹850</span>
                      </div>
                    </button>
                    <button className="wallet-option">
                      <div className="wallet-icon">
                        <img src="/icons8-amazon-pay-32.png" alt="Amazon Pay" />
                      </div>
                      <div className="wallet-info">
                        <span className="wallet-name">Amazon Pay</span>
                        <span className="wallet-balance">Balance: ₹3,100</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {activeMethod === 'netbanking' && (
                <div className="method-content">
                  <div className="form-group">
                    <label>Select Your Bank</label>
                    <select className="form-input">
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="canara">Canara Bank</option>
                      <option value="union">Union Bank of India</option>
                      <option value="idbi">IDBI Bank</option>
                      <option value="yes">Yes Bank</option>
                      <option value="indusind">IndusInd Bank</option>
                    </select>
                  </div>
                  <div className="netbanking-info">
                    <p>You will be redirected to your bank's secure login page</p>
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
                <img src={movie?.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder.jpg'} alt={movie?.title} />
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