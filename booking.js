// ========== BOOKING VARIABLES ==========
let bookingState = {
  movieTitle: '',
  time: '',
  ticketQuantity: 1,
  selectedSeats: [],
  totalPrice: 0,
};

const TICKET_PRICE = 150; // Price per ticket

// ========== BOOKING DOM ELEMENTS ==========
const bookingMovieTitle = document.getElementById('booking-movie-title');
const bookingSteps = document.querySelectorAll('.booking-step');
const timeSlots = document.querySelectorAll('.time-slot');
const quantityMinusBtn = document.getElementById('quantity-minus');
const quantityPlusBtn = document.getElementById('quantity-plus');
const quantityDisplay = document.getElementById('quantity-display');
const confirmQuantityBtn = document.getElementById('confirm-quantity-btn');
const seatMap = document.getElementById('seat-map');
const summaryMovieTitle = document.getElementById('summary-movie-title');
const summaryTime = document.getElementById('summary-time');
const summarySeats = document.getElementById('summary-seats');
const summaryTotal = document.getElementById('summary-total');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');

// ========== BOOKING FLOW ==========

function initBooking() {
  // Get movie title from URL
  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get('movie');
  if (movieTitle) {
    bookingState.movieTitle = decodeURIComponent(movieTitle);
  }

  if(bookingMovieTitle) bookingMovieTitle.textContent = `Book Tickets for ${bookingState.movieTitle}`;
  if(summaryMovieTitle) summaryMovieTitle.textContent = bookingState.movieTitle;

  timeSlots.forEach(slot => slot.addEventListener('click', handleTimeSelection));
  if(quantityMinusBtn) quantityMinusBtn.addEventListener('click', () => handleQuantityChange(-1));
  if(quantityPlusBtn) quantityPlusBtn.addEventListener('click', () => handleQuantityChange(1));
  if(confirmQuantityBtn) confirmQuantityBtn.addEventListener('click', handleConfirmQuantity);
  if(confirmBookingBtn) confirmBookingBtn.addEventListener('click', handleConfirmBooking);
  
  resetBookingFlow();
}

function goToStep(stepNumber) {
  bookingSteps.forEach((step, index) => {
    step.classList.toggle('active', index + 1 === stepNumber);
  });
}

function resetBookingFlow() {
    goToStep(1);
    bookingState.time = '';
    bookingState.ticketQuantity = 1;
    bookingState.selectedSeats = [];
    updateQuantityDisplay();
    updateBookingSummary();
    timeSlots.forEach(slot => slot.classList.remove('selected'));
    if(confirmBookingBtn) confirmBookingBtn.disabled = true;
    if (seatMap) {
      seatMap.innerHTML = '';
    }
}

function handleTimeSelection(e) {
  const selectedTime = e.target.dataset.time;
  bookingState.time = selectedTime;
  
  timeSlots.forEach(slot => slot.classList.remove('selected'));
  e.target.classList.add('selected');
  
  updateBookingSummary();
  goToStep(2);
}

function handleQuantityChange(change) {
  const newQuantity = bookingState.ticketQuantity + change;
  if (newQuantity >= 1 && newQuantity <= 10) {
    bookingState.ticketQuantity = newQuantity;
    updateQuantityDisplay();
  }
}

function updateQuantityDisplay() {
  if(quantityDisplay) quantityDisplay.textContent = bookingState.ticketQuantity;
  if(quantityMinusBtn) quantityMinusBtn.disabled = bookingState.ticketQuantity === 1;
  if(quantityPlusBtn) quantityPlusBtn.disabled = bookingState.ticketQuantity === 10;
}

function handleConfirmQuantity() {
  generateSeatMap();
  updateBookingSummary();
  goToStep(3);
}

function generateSeatMap() {
    if (!seatMap) return;
    seatMap.innerHTML = '';
    const bookedSeats = ['A5', 'B6', 'C7', 'H2', 'F10']; 
    
    for (let i = 0; i < 10; i++) {
        const rowChar = String.fromCharCode(65 + i);
        const rowLabel = document.createElement('div');
        rowLabel.classList.add('row-label');
        rowLabel.textContent = rowChar;
        seatMap.appendChild(rowLabel);

        for (let j = 1; j <= 12; j++) {
            const seat = document.createElement('div');
            const seatId = `${rowChar}${j}`;
            seat.classList.add('seat');
            seat.dataset.seatId = seatId;
            
            if (bookedSeats.includes(seatId)) {
                seat.classList.add('booked');
            } else {
                seat.addEventListener('click', handleSeatSelection);
            }
            seatMap.appendChild(seat);
        }
    }
}

function handleSeatSelection(e) {
    const seat = e.target;
    if (!seat.classList.contains('seat') || seat.classList.contains('booked')) return;
    
    const seatId = seat.dataset.seatId;
    const isSelected = seat.classList.contains('selected');

    if (isSelected) {
        bookingState.selectedSeats = bookingState.selectedSeats.filter(s => s !== seatId);
        seat.classList.remove('selected');
    } else {
        if (bookingState.selectedSeats.length < bookingState.ticketQuantity) {
            bookingState.selectedSeats.push(seatId);
            seat.classList.add('selected');
        } else {
            showNotification(`You can only select ${bookingState.ticketQuantity} seats.`, 'error');
        }
    }
    updateBookingSummary();
}

function updateBookingSummary() {
    if(summaryMovieTitle) summaryMovieTitle.textContent = bookingState.movieTitle || 'N/A';
    if(summaryTime) summaryTime.textContent = bookingState.time || 'N/A';
    
    const seatsText = bookingState.selectedSeats.sort().join(', ') || 'N/A';
    if(summarySeats) summarySeats.textContent = seatsText;

    bookingState.totalPrice = bookingState.selectedSeats.length * TICKET_PRICE;
    if(summaryTotal) summaryTotal.textContent = `₹${bookingState.totalPrice}`;

    if(confirmBookingBtn) confirmBookingBtn.disabled = bookingState.selectedSeats.length !== bookingState.ticketQuantity || bookingState.ticketQuantity === 0;
}

function handleConfirmBooking() {
    // Save booking state to local storage to pass to the payment page
    localStorage.setItem('bookingDetails', JSON.stringify(bookingState));

    // Redirect to the payment page
    window.location.href = 'payment.html';
}

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

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  initBooking();
});
