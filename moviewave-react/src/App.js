import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Booking from './components/Booking';
import Payment from './components/Payment';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { BookingProvider } from './context/BookingContext';
import './css/style.css';
import './css/booking.css';
import './css/payment.css';
import './css/signin.css';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </Router>
    </BookingProvider>
  );
}

export default App;
