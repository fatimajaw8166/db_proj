// src/app/cars/page.js
'use client';

import { useEffect, useState } from 'react';

const Cars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
      console.log(data);
    };

    fetchCars();
  }, []);

  return (
    <div>
      <h1>Cars</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.CarID}>
            {car.Model} - {car.LicensePlate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cars;