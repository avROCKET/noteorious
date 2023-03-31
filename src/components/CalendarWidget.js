import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './CustomCalendar.css';

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());
  const [displayCalendar, setDisplayCalendar] = useState(true);

  const onChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleResize = () => {
    if (window.innerWidth <= 767) {
      setDisplayCalendar(false);
    } else {
      setDisplayCalendar(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize(); // Call handleResize on initial render

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='calendarContainer' style={{ display: displayCalendar ? 'flex' : 'none' }}>
      <Calendar
        onChange={onChange}
        value={date}
      />
    </div>
  );
};

export default CalendarWidget;
