document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));

    if (!bookingDetails) {
        // Redirect to home if no booking details are found
        window.location.href = 'index.html';
        return;
    }

    // Populate booking summary
    document.getElementById('summary-movie-title').textContent = bookingDetails.movieTitle;
    document.getElementById('summary-time').textContent = bookingDetails.time;
    document.getElementById('summary-seats').textContent = bookingDetails.selectedSeats.join(', ');
    document.getElementById('summary-total').textContent = `₹${bookingDetails.totalPrice}`;

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            processPayment();
        }
    });

    function validateForm() {
        // Basic validation for card number, expiry, and CVV
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const cardHolder = document.getElementById('card-holder').value;

        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            showNotification('Please enter a valid 16-digit card number.', 'error');
            return false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            showNotification('Please enter a valid expiry date in MM/YY format.', 'error');
            return false;
        }
        if (!/^\d{3}$/.test(cvv)) {
            showNotification('Please enter a valid 3-digit CVV.', 'error');
            return false;
        }
        if (cardHolder.trim() === '') {
            showNotification('Please enter the card holder name.', 'error');
            return false;
        }
        return true;
    }

    function processPayment() {
        const payButton = document.querySelector('#payment-form button[type="submit"]');
        payButton.textContent = 'Processing...';
        payButton.disabled = true;

        setTimeout(() => {
            showNotification('Payment successful! Redirecting to homepage...', 'success');
            localStorage.removeItem('bookingDetails'); // Clear booking details after successful payment
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }, 2000);
    }
});

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
