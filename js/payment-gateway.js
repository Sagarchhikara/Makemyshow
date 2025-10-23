// ========== PAYMENT GATEWAY CONFIGURATION ==========
const PAYMENT_CONFIG = {
  ticketPrice: 150,
  convenienceFee: 30,
  gstRate: 0.18,
  processingDelay: 3000,
  successRate: 0.9,
  promoCodes: {
    'MOVIE20': { type: 'percentage', value: 0.2, description: '20% off' },
    'FIRST50': { type: 'fixed', value: 50, description: '₹50 off' },
    'WELCOME10': { type: 'percentage', value: 0.1, description: '10% off' },
    'WEEKEND25': { type: 'percentage', value: 0.25, description: '25% off' },
    'FLAT100': { type: 'fixed', value: 100, description: '₹100 off' }
  }
};

// ========== STATE MANAGEMENT ==========
const paymentState = {
  movieTitle: '',
  posterUrl: '',
  showtime: '',
  seats: [],
  quantity: 0,
  ticketPrice: PAYMENT_CONFIG.ticketPrice,
  convenienceFee: PAYMENT_CONFIG.convenienceFee,
  subtotal: 0,
  gst: 0,
  discount: 0,
  total: 0,
  currentMethod: 'card',
  isProcessing: false,
  appliedPromoCode: null
};

// ========== DOM ELEMENTS ==========
const elements = {
  summaryPoster: null,
  movieTitle: null,
  movieName: null,
  showtime: null,
  seats: null,
  quantity: null,
  gst: null,
  total: null,
  payButtonText: null,
  methodTabs: null,
  methodContents: null,
  cardNumber: null,
  cardholderName: null,
  expiryDate: null,
  cvv: null,
  upiId: null,
  bankSelect: null,
  promoCode: null,
  payButton: null,
  applyPromoBtn: null,
  upiOptions: null,
  walletOptions: null,
  cardLogos: null
};

// ========== INITIALIZATION ==========

function initPaymentGateway() {
  console.log('🎬 Initializing Payment Gateway...');
  cacheElements();
  loadBookingDetails();
  initPaymentMethods();
  initFormFormatting();
  initEventListeners();
  console.log('✅ Payment Gateway initialized successfully');
}

function cacheElements() {
  elements.summaryPoster = document.getElementById('summary-poster');
  elements.movieTitle = document.getElementById('payment-movie-title');
  elements.movieName = document.getElementById('payment-movie-name');
  elements.showtime = document.getElementById('payment-time');
  elements.seats = document.getElementById('payment-seats');
  elements.quantity = document.getElementById('payment-quantity');
  elements.gst = document.getElementById('payment-gst');
  elements.total = document.getElementById('payment-total');
  elements.payButtonText = document.getElementById('pay-button-text');
  elements.methodTabs = document.querySelectorAll('.method-tab');
  elements.methodContents = document.querySelectorAll('.method-content');
  elements.cardNumber = document.getElementById('card-number');
  elements.cardholderName = document.getElementById('cardholder-name');
  elements.expiryDate = document.getElementById('expiry-date');
  elements.cvv = document.getElementById('cvv');
  elements.upiId = document.getElementById('upi-id');
  elements.bankSelect = document.getElementById('bank-select');
  elements.promoCode = document.getElementById('promo-code');
  elements.payButton = document.querySelector('.pay-button');
  elements.applyPromoBtn = document.querySelector('.apply-btn');
  elements.upiOptions = document.querySelectorAll('.upi-option');
  elements.walletOptions = document.querySelectorAll('.wallet-option');
  elements.cardLogos = document.querySelectorAll('.card-logo');
}

// ========== BOOKING DATA LOADING ==========

function loadBookingDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Extract all parameters from URL
  paymentState.movieTitle = decodeURIComponent(urlParams.get('movie') || 'Movie');
  paymentState.posterUrl = decodeURIComponent(urlParams.get('poster') || '../images/f1 movie.png');
  paymentState.showtime = decodeURIComponent(urlParams.get('time') || 'Not selected');
  
  const seatsParam = urlParams.get('seats');
  paymentState.seats = seatsParam ? decodeURIComponent(seatsParam).split(', ').filter(s => s) : [];
  paymentState.quantity = parseInt(urlParams.get('quantity')) || paymentState.seats.length || 1;
  
  console.log('📋 Booking Details Loaded:', {
    movie: paymentState.movieTitle,
    time: paymentState.showtime,
    seats: paymentState.seats,
    quantity: paymentState.quantity
  });
  
  calculatePrices();
  updateSummaryUI();
  
  // Show warning if no booking data
  if (!urlParams.get('movie')) {
    showNotification('⚠️ No booking data found. Please book tickets first.', 'error', 5000);
  }
}

function calculatePrices() {
  paymentState.subtotal = paymentState.quantity * paymentState.ticketPrice;
  paymentState.gst = Math.round((paymentState.subtotal + paymentState.convenienceFee) * PAYMENT_CONFIG.gstRate);
  paymentState.total = paymentState.subtotal + paymentState.convenienceFee + paymentState.gst - paymentState.discount;
  
  console.log('💰 Prices Calculated:', {
    subtotal: paymentState.subtotal,
    convenienceFee: paymentState.convenienceFee,
    gst: paymentState.gst,
    discount: paymentState.discount,
    total: paymentState.total
  });
}

function updateSummaryUI() {
  // Update poster
  if (elements.summaryPoster && paymentState.posterUrl) {
    elements.summaryPoster.src = paymentState.posterUrl;
    elements.summaryPoster.alt = `${paymentState.movieTitle} Poster`;
  }
  
  // Update movie title (both locations)
  if (elements.movieTitle) elements.movieTitle.textContent = paymentState.movieTitle;
  if (elements.movieName) elements.movieName.textContent = paymentState.movieTitle;
  
  // Update showtime
  if (elements.showtime) elements.showtime.textContent = paymentState.showtime;
  
  // Update seats
  if (elements.seats) {
    const seatsText = paymentState.seats.length > 0 ? paymentState.seats.join(', ') : 'Not selected';
    elements.seats.textContent = seatsText;
  }
  
  // Update quantity
  if (elements.quantity) {
    elements.quantity.textContent = `${paymentState.quantity} × ₹${paymentState.ticketPrice}`;
  }
  
  // Update GST
  if (elements.gst) elements.gst.textContent = `₹${paymentState.gst}`;
  
  // Update total
  if (elements.total) elements.total.textContent = `₹${paymentState.total}`;
  if (elements.payButtonText) elements.payButtonText.textContent = `Pay ₹${paymentState.total}`;
}

// ========== PAYMENT METHODS ==========

function initPaymentMethods() {
  elements.methodTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const method = this.getAttribute('data-method');
      switchPaymentMethod(method);
    });
  });
  
  elements.upiOptions.forEach(option => {
    option.addEventListener('click', function() {
      selectUPIOption(this);
    });
  });
  
  elements.walletOptions.forEach(option => {
    option.addEventListener('click', function() {
      selectWalletOption(this);
    });
  });
}

function switchPaymentMethod(method) {
  paymentState.currentMethod = method;
  
  elements.methodTabs.forEach(tab => tab.classList.remove('active'));
  document.querySelector(`[data-method="${method}"]`).classList.add('active');
  
  elements.methodContents.forEach(content => content.classList.remove('active'));
  document.getElementById(`${method}-method`).classList.add('active');
  
  console.log('💳 Switched to payment method:', method);
}

function selectUPIOption(option) {
  elements.upiOptions.forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
  
  const upiApp = option.getAttribute('data-upi');
  console.log('📱 Selected UPI app:', upiApp);
}

function selectWalletOption(option) {
  elements.walletOptions.forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
  
  const wallet = option.getAttribute('data-wallet');
  console.log('👛 Selected wallet:', wallet);
}

// ========== FORM FORMATTING ==========

function initFormFormatting() {
  if (elements.cardNumber) {
    elements.cardNumber.addEventListener('input', formatCardNumber);
  }
  
  if (elements.expiryDate) {
    elements.expiryDate.addEventListener('input', formatExpiryDate);
  }
  
  if (elements.cvv) {
    elements.cvv.addEventListener('input', formatCVV);
  }
}

function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
  let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
  if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
  e.target.value = formattedValue;
  detectCardType(value);
}

function formatExpiryDate(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  e.target.value = value;
}

function formatCVV(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
}

function detectCardType(cardNumber) {
  elements.cardLogos.forEach(logo => {
    logo.style.opacity = '0.5';
    logo.style.transform = 'scale(1)';
  });
  
  if (cardNumber.startsWith('4')) {
    highlightCardLogo(0); // Visa
  } else if (cardNumber.startsWith('5') || cardNumber.startsWith('2')) {
    highlightCardLogo(1); // Mastercard
  } else if (cardNumber.startsWith('3')) {
    highlightCardLogo(2); // Amex
  } else if (cardNumber.startsWith('6') || cardNumber.startsWith('8')) {
    highlightCardLogo(3); // RuPay
  }
}

function highlightCardLogo(index) {
  if (elements.cardLogos[index]) {
    elements.cardLogos[index].style.opacity = '1';
    elements.cardLogos[index].style.transform = 'scale(1.1)';
  }
}

// ========== PROMO CODE ==========

function applyPromoCode() {
  const code = elements.promoCode.value.trim().toUpperCase();
  
  if (!code) {
    showNotification('Please enter a promo code', 'error');
    return;
  }
  
  const promo = PAYMENT_CONFIG.promoCodes[code];
  
  if (!promo) {
    showNotification('Invalid promo code', 'error');
    return;
  }
  
  const subtotalWithFee = paymentState.subtotal + paymentState.convenienceFee;
  
  if (promo.type === 'percentage') {
    paymentState.discount = Math.round(subtotalWithFee * promo.value);
  } else if (promo.type === 'fixed') {
    paymentState.discount = Math.min(promo.value, subtotalWithFee - 50);
  }
  
  paymentState.appliedPromoCode = code;
  calculatePrices();
  updateSummaryUI();
  
  showNotification(`🎉 Promo code applied! ${promo.description}`, 'success');
  console.log('🎟️ Promo code applied:', code, 'Discount:', paymentState.discount);
}

// ========== PAYMENT VALIDATION ==========

function validatePaymentForm() {
  switch(paymentState.currentMethod) {
    case 'card':
      return validateCardForm();
    case 'upi':
      return validateUPIForm();
    case 'wallet':
      return validateWalletForm();
    case 'netbanking':
      return validateNetBankingForm();
    default:
      return false;
  }
}

function validateCardForm() {
  const cardNumber = elements.cardNumber.value.replace(/\s/g, '');
  const cardholderName = elements.cardholderName.value.trim();
  const expiryDate = elements.expiryDate.value;
  const cvv = elements.cvv.value;
  
  if (!cardNumber || cardNumber.length < 13) {
    showNotification('Please enter a valid card number', 'error');
    return false;
  }
  if (!cardholderName) {
    showNotification('Please enter cardholder name', 'error');
    return false;
  }
  if (!expiryDate || expiryDate.length !== 5) {
    showNotification('Please enter a valid expiry date (MM/YY)', 'error');
    return false;
  }
  if (!cvv || cvv.length < 3) {
    showNotification('Please enter a valid CVV', 'error');
    return false;
  }
  
  const [month, year] = expiryDate.split('/');
  const expiryDateObj = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  if (expiryDateObj < now) {
    showNotification('Card has expired', 'error');
    return false;
  }
  
  return true;
}

function validateUPIForm() {
  const upiId = elements.upiId.value.trim();
  const selectedOption = document.querySelector('.upi-option.selected');
  
  if (!upiId && !selectedOption) {
    showNotification('Please enter UPI ID or select a UPI app', 'error');
    return false;
  }
  if (upiId && !upiId.includes('@')) {
    showNotification('Please enter a valid UPI ID (e.g., name@upi)', 'error');
    return false;
  }
  return true;
}

function validateWalletForm() {
  const selectedWallet = document.querySelector('.wallet-option.selected');
  if (!selectedWallet) {
    showNotification('Please select a wallet', 'error');
    return false;
  }
  return true;
}

function validateNetBankingForm() {
  const selectedBank = elements.bankSelect.value;
  if (!selectedBank) {
    showNotification('Please select your bank', 'error');
    return false;
  }
  return true;
}

// ========== PAYMENT PROCESSING ==========

async function processPayment() {
  if (paymentState.isProcessing) {
    console.log('⏳ Payment already processing');
    return;
  }
  
  if (!validatePaymentForm()) {
    return;
  }
  
  paymentState.isProcessing = true;
  updatePayButtonState(true);
  
  try {
    console.log('💳 Processing payment...', {
      method: paymentState.currentMethod,
      amount: paymentState.total,
      movie: paymentState.movieTitle,
      seats: paymentState.seats.join(', ')
    });
    
    await simulatePaymentProcessing();
    
    const isSuccess = Math.random() < PAYMENT_CONFIG.successRate;
    
    if (isSuccess) {
      handlePaymentSuccess();
    } else {
      throw new Error('Payment declined');
    }
  } catch (error) {
    handlePaymentFailure(error);
  }
}

function simulatePaymentProcessing() {
  return new Promise(resolve => {
    setTimeout(resolve, PAYMENT_CONFIG.processingDelay);
  });
}

function handlePaymentSuccess() {
  console.log('✅ Payment successful!');
  showNotification('🎉 Payment successful! Redirecting to confirmation...', 'success');
  
  const bookingData = {
    bookingId: generateBookingId(),
    movieTitle: paymentState.movieTitle,
    posterUrl: paymentState.posterUrl,
    showtime: paymentState.showtime,
    seats: paymentState.seats.join(', '),
    quantity: paymentState.quantity,
    amount: paymentState.total,
    paymentMethod: paymentState.currentMethod,
    timestamp: new Date().toISOString()
  };
  
  console.log('📝 Booking confirmed:', bookingData);
  
  // Store booking data for confirmation page
  const bookingParams = new URLSearchParams({
    payment: 'success',
    booking: bookingData.bookingId,
    movie: encodeURIComponent(bookingData.movieTitle),
    seats: encodeURIComponent(bookingData.seats),
    amount: bookingData.amount
  });
  
  setTimeout(() => {
    window.location.href = `index.html?${bookingParams.toString()}`;
  }, 2000);
}

function handlePaymentFailure(error) {
  console.error('❌ Payment failed:', error);
  showNotification('❌ Payment failed. Please try again.', 'error');
  
  paymentState.isProcessing = false;
  updatePayButtonState(false);
}

function updatePayButtonState(processing) {
  if (!elements.payButton || !elements.payButtonText) return;
  
  if (processing) {
    elements.payButton.disabled = true;
    elements.payButton.classList.add('processing');
    elements.payButtonText.textContent = 'Processing...';
  } else {
    elements.payButton.disabled = false;
    elements.payButton.classList.remove('processing');
    elements.payButtonText.textContent = `Pay ₹${paymentState.total}`;
  }
}

function generateBookingId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BK${timestamp}${random}`.toUpperCase();
}

// ========== EVENT LISTENERS ==========

function initEventListeners() {
  if (elements.applyPromoBtn) {
    elements.applyPromoBtn.addEventListener('click', applyPromoCode);
  }
  
  if (elements.promoCode) {
    elements.promoCode.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromoCode();
      }
    });
  }
  
  if (elements.payButton) {
    elements.payButton.addEventListener('click', processPayment);
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !paymentState.isProcessing) {
      const activeElement = document.activeElement;
      if (activeElement.id === 'promo-code') {
        applyPromoCode();
      } else if (!activeElement.classList.contains('form-input')) {
        processPayment();
      }
    }
  });
  
  window.addEventListener('beforeunload', (e) => {
    if (paymentState.isProcessing) {
      e.preventDefault();
      e.returnValue = 'Payment is being processed. Are you sure you want to leave?';
      return e.returnValue;
    }
  });
}

// ========== NOTIFICATION SYSTEM ==========

function showNotification(message, type = 'info', duration = 3000) {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.classList.add('notification', `notification-${type}`);
  notification.textContent = message;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    backgroundColor: '#1f1f1f',
    color: '#ffffff',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    zIndex: '1000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    maxWidth: '300px',
    wordWrap: 'break-word'
  });
  
  if (type === 'error') {
    notification.style.borderColor = '#e50914';
    notification.style.backgroundColor = '#2a0a0a';
  } else if (type === 'success') {
    notification.style.borderColor = '#22c55e';
    notification.style.backgroundColor = '#0a2a0a';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// ========== GLOBAL FUNCTIONS ==========

window.applyPromo = applyPromoCode;
window.processPayment = processPayment;

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', initPaymentGateway);