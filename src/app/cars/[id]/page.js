// src/app/cars/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const CarDetails = () => {
  const [car, setCar] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [globalData, setGlobalData] = useState({ carModels: [], branches: [], customers: [], employees: [] });
  const [rentalDetails, setRentalDetails] = useState({
    customerId: '',
    employeeId: '',
    rentalDate: '',
    returnDate: '',
    totalAmount: '',
  });
  const [maintenanceDetails, setMaintenanceDetails] = useState({
    maintenanceDate: '',
    description: '',
    cost: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCar(data.car);
          setFeedback(data.feedback);
          if (data.car.Status === 'Rented') {
            const rentalResponse = await fetch(`/api/rent/${id}`);
            const rentalData = await rentalResponse.json();
            if (rentalResponse.ok) {
              setRentalDetails(rentalData);
            }
          } else if (data.car.Status === 'Maintenance') {
            const maintenanceResponse = await fetch(`/api/maintenance/${id}`);
            const maintenanceData = await maintenanceResponse.json();
            if (maintenanceResponse.ok) {
              setMaintenanceDetails(maintenanceData);
            }
          }
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Failed to fetch car details');
      }
    };

    const fetchGlobalData = async () => {
      try {
        const response = await fetch('/api/global');
        const data = await response.json();
        setGlobalData(data);
      } catch (error) {
        console.error('Failed to fetch global data:', error);
      }
    };

    fetchCarDetails();
    fetchGlobalData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRentalDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!rentalDetails.customerId) errors.customerId = 'Customer is required';
    if (!rentalDetails.employeeId) errors.employeeId = 'Employee is required';
    if (!rentalDetails.rentalDate) errors.rentalDate = 'Rental Date is required';
    if (!rentalDetails.returnDate) errors.returnDate = 'Return Date is required';
    if (!rentalDetails.totalAmount) errors.totalAmount = 'Total Amount is required';
    return errors;
  };

  const handleRentCar = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId: id, ...rentalDetails }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/home');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to rent car');
    }
  };

  const handleTakeOutOfMaintenance = async () => {
    try {
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Available' }),
      });

      const result = await response.json();

      if (response.ok) {
        setCar((prevCar) => ({ ...prevCar, Status: 'Available' }));
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update car status');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFeedbackSubmit = async (feedbackDetails) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId: id, ...feedbackDetails }),
      });

      const result = await response.json();

      if (response.ok) {
        setFeedback((prevFeedback) => [...prevFeedback, result]);
        handleCloseModal();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to submit feedback');
    }
  };

  const getModelName = (modelID) => {
    const model = globalData.carModels.find((model) => model.ModelID === modelID);
    return model ? `${model.Make} ${model.Model}` : 'Unknown Model';
  };

  const getBranchName = (branchID) => {
    const branch = globalData.branches.find((branch) => branch.BranchID === branchID);
    return branch ? branch.BranchName : 'Unknown Branch';
  };

  const getCustomerName = (customerID) => {
    const customer = globalData.customers.find((customer) => customer.CustomerID === customerID);
    return customer ? `${customer.FirstName} ${customer.LastName}` : 'Unknown Customer';
  };

  const getEmployeeName = (employeeID) => {
    const employee = globalData.employees.find((employee) => employee.EmployeeID === employeeID);
    return employee ? `${employee.FirstName} ${employee.LastName}` : 'Unknown Employee';
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">{getModelName(car.ModelID)}</h1>
      <p className="text-center mb-6">License Plate: {car.LicensePlate}</p>
      <p className="text-center mb-6">Status: {car.Status}</p>
      <p className="text-center mb-6">Branch: {getBranchName(car.BranchID)}</p>

      {car.Status === 'Available' && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Rent this Car</h2>
          <form onSubmit={handleRentCar} className="mb-6">
            <div className="mb-4">
              <label htmlFor="customerId" className="block text-gray-200 font-medium">Customer</label>
              <select
                id="customerId"
                name="customerId"
                value={rentalDetails.customerId}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select Customer</option>
                {globalData.customers.map((customer) => (
                  <option key={customer.CustomerID} value={customer.CustomerID}>
                    {customer.FirstName} {customer.LastName}
                  </option>
                ))}
              </select>
              {formErrors.customerId && <p className="text-red-500 mt-2">{formErrors.customerId}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="employeeId" className="block text-gray-200 font-medium">Employee</label>
              <select
                id="employeeId"
                name="employeeId"
                value={rentalDetails.employeeId}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select Employee</option>
                {globalData.employees.map((employee) => (
                  <option key={employee.EmployeeID} value={employee.EmployeeID}>
                    {employee.FirstName} {employee.LastName}
                  </option>
                ))}
              </select>
              {formErrors.employeeId && <p className="text-red-500 mt-2">{formErrors.employeeId}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="rentalDate" className="block text-gray-200 font-medium">Rental Date</label>
              <input
                type="date"
                id="rentalDate"
                name="rentalDate"
                value={rentalDetails.rentalDate}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
                required
              />
              {formErrors.rentalDate && <p className="text-red-500 mt-2">{formErrors.rentalDate}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="returnDate" className="block text-gray-200 font-medium">Return Date</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={rentalDetails.returnDate}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
                required
              />
              {formErrors.returnDate && <p className="text-red-500 mt-2">{formErrors.returnDate}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="totalAmount" className="block text-gray-200 font-medium">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={rentalDetails.totalAmount}
                onChange={handleChange}
                className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
                required
              />
              {formErrors.totalAmount && <p className="text-red-500 mt-2">{formErrors.totalAmount}</p>}
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
            >
              Rent Car
            </button>
          </form>
        </>
      )}

      {car.Status === 'Rented' && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Rental Details</h2>
          <div className="mb-4">
            <p className="text-gray-200">Customer: {getCustomerName(rentalDetails.customerId)}</p>
            <p className="text-gray-200">Employee: {getEmployeeName(rentalDetails.employeeId)}</p>
            <p className="text-gray-200">Rental Date: {rentalDetails.rentalDate}</p>
            <p className="text-gray-200">Return Date: {rentalDetails.returnDate}</p>
            <p className="text-gray-200">Total Amount: {rentalDetails.totalAmount}</p>
          </div>
        </>
      )}

      {car.Status === 'Maintenance' && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Maintenance Details</h2>
          <div className="mb-4">
            <p className="text-gray-200">Maintenance Date: {maintenanceDetails.maintenanceDate}</p>
            <p className="text-gray-200">Description: {maintenanceDetails.description}</p>
            <p className="text-gray-200">Cost: {maintenanceDetails.cost}</p>
            <button
              onClick={handleTakeOutOfMaintenance}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Take Out of Maintenance
            </button>
          </div>
        </>
      )}

      <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
      <button
        onClick={handleOpenModal}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 mb-4"
      >
        Add Feedback
      </button>
      {feedback.length > 0 ? (
        feedback.map((fb) => (
          <div key={fb.FeedbackID} className="mb-4 p-4 bg-gray-700 rounded-lg shadow">
            <p className="text-gray-200">{fb.Comments}</p>
            <p className="text-yellow-500">Rating: {fb.Rating}</p>
          </div>
        ))
      ) : (
        <p>No feedback available for this car.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFeedbackSubmit} />
    </div>
  );
};

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [feedbackDetails, setFeedbackDetails] = useState({
    comments: '',
    rating: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedbackDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Add Feedback</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="comments" className="block text-gray-200 font-medium">Comments</label>
            <textarea
              id="comments"
              name="comments"
              value={feedbackDetails.comments}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-200 font-medium">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={feedbackDetails.rating}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              min="1"
              max="5"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarDetails;