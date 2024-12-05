// src/app/cars/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const Cars = () => {
  const [globalData, setGlobalData] = useState({});
  const [newCar, setNewCar] = useState({
    ModelID: '',
    LicensePlate: '',
    Status: 'Available',
    BranchID: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      const response = await fetch('/api/global');
      const data = await response.json();
      setGlobalData(data);
      console.log(data);
    };

    fetchGlobalData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newCar.ModelID) errors.ModelID = 'Model is required';
    if (!newCar.LicensePlate) errors.LicensePlate = 'License Plate is required';
    if (!newCar.BranchID) errors.BranchID = 'Branch is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCar ? { ...newCar, CarID: editingCar.CarID } : newCar),
      });

      const result = await response.json();

      if (response.ok) {
        if (editingCar) {
          setGlobalData((prevData) => ({
            ...prevData,
            cars: prevData.cars.map((car) =>
              car.CarID === editingCar.CarID ? { ...car, ...newCar } : car
            ),
          }));
        } else {
          setGlobalData((prevData) => ({
            ...prevData,
            cars: [
              ...prevData.cars,
              {
                CarID: result.CarID,
                ...newCar,
              },
            ],
          }));
        }

        setNewCar({ ModelID: '', LicensePlate: '', Status: 'Available', BranchID: '' });
        setShowForm(false);
        setFormErrors({});
        setEditingCar(null);
      } else {
        alert('Failed to save car: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const handleEdit = (car) => {
    setNewCar(car);
    setEditingCar(car);
    setShowForm(true);
  };

  const getModelName = (modelID) => {
    const model = globalData.carModels?.find((model) => model.ModelID === modelID);
    return model ? `${model.Make} ${model.Model}` : 'Unknown Model';
  };

  const getBranchName = (branchID) => {
    const branch = globalData.branches?.find((branch) => branch.BranchID === branchID);
    return branch ? branch.BranchName : 'Unknown Branch';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Cars</h1>

      <div className="text-center mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCar(null);
            setNewCar({ ModelID: '', LicensePlate: '', Status: 'Available', BranchID: '' });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {showForm ? 'Cancel' : 'Add New Car'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-700 rounded-lg shadow">
          <div className="mb-4">
            <label htmlFor="modelID" className="block text-gray-200 font-medium">
              Model
            </label>
            <select
              id="modelID"
              name="ModelID"
              value={newCar.ModelID}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            >
              <option value="">Select Model</option>
              {globalData.carModels?.map((model) => (
                <option key={model.ModelID} value={model.ModelID}>
                  {model.Make} {model.Model}
                </option>
              ))}
            </select>
            {formErrors.ModelID && <p className="text-red-500 mt-2">{formErrors.ModelID}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="licensePlate" className="block text-gray-200 font-medium">
              License Plate
            </label>
            <input
              type="text"
              id="licensePlate"
              name="LicensePlate"
              value={newCar.LicensePlate}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            />
            {formErrors.LicensePlate && <p className="text-red-500 mt-2">{formErrors.LicensePlate}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-200 font-medium">
              Status
            </label>
            <select
              id="status"
              name="Status"
              value={newCar.Status}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            >
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="branchID" className="block text-gray-200 font-medium">
              Branch
            </label>
            <select
              id="branchID"
              name="BranchID"
              value={newCar.BranchID}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            >
              <option value="">Select Branch</option>
              {globalData.branches?.map((branch) => (
                <option key={branch.BranchID} value={branch.BranchID}>
                  {branch.BranchName}
                </option>
              ))}
            </select>
            {formErrors.BranchID && <p className="text-red-500 mt-2">{formErrors.BranchID}</p>}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
          >
            {editingCar ? 'Update Car' : 'Add Car'}
          </button>
        </form>
      )}

      <table className="min-w-full table-auto border-collapse text-left">
        <thead>
          <tr className="bg-gray-700 border-b-2 border-gray-600">
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Model</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">License Plate</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Status</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Branch</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {globalData.cars?.map((car, index) => (
            <tr key={car.CarID || `${car.Model}-${index}`} className="border-b border-gray-600 hover:bg-gray-700">
              <td className="px-6 py-4">{getModelName(car.ModelID)}</td>
              <td className="px-6 py-4">{car.LicensePlate}</td>
              <td className="px-6 py-4">{car.Status}</td>
              <td className="px-6 py-4">{getBranchName(car.BranchID)}</td>
              <td className="px-6 py-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(car)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <Link href={`/cars/${car.CarID}`} legacyBehavior>
                  <a className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300">
                    View Details
                  </a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cars;