import React, { useState, useEffect } from 'react';
import moment from 'moment';

const DateTimeComponent = () => {
  const [currentDateTime, setCurrentDateTime] = useState(moment().format('MMMM Do YYYY, h:mm:ss A.'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(moment().format('MMMM Do YYYY, h:mm:ss A.'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className='Title'>Today</h2>
      <p className='datetime'>{currentDateTime}</p>
    </div>
  );
};

export default DateTimeComponent;