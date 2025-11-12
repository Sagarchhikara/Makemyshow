import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    movie: null,
    time: null,
    seats: [],
    total: 0,
  });

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
