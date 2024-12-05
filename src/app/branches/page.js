'use client';

import React, { useState, useEffect } from 'react';

const BranchesTable = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    BranchName: '',
    Address: '',
    Phone: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/branches');
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
  
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBranch((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newBranch.BranchName) errors.BranchName = 'Branch Name is required';
    if (!newBranch.Address) errors.Address = 'Address is required';
    if (!newBranch.Phone) {
      errors.Phone = 'Phone is required';
    } else if (!/^\d{11}$/.test(newBranch.Phone)) {
      errors.Phone = 'Phone must be 11 digits';
    }
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
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingBranch ? { ...newBranch, BranchID: editingBranch.BranchID } : newBranch),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        if (editingBranch) {
          setBranches((prevBranches) =>
            prevBranches.map((branch) =>
              branch.BranchID === editingBranch.BranchID ? { ...branch, ...newBranch } : branch
            )
          );
        } else {
          setBranches((prevBranches) => [
            ...prevBranches,
            {
              BranchID: result.BranchID,
              ...newBranch,
            },
          ]);
        }
  
        setNewBranch({ BranchName: '', Address: '', Phone: '' });
        setShowForm(false);
        setFormErrors({});
        setEditingBranch(null);
      } else {
        alert('Failed to save branch: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEdit = (branch) => {
    setNewBranch(branch);
    setEditingBranch(branch);
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Branches</h1>

      <div className="text-center mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingBranch(null);
            setNewBranch({ BranchName: '', Address: '', Phone: '' });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {showForm ? 'Cancel' : 'Add New Branch'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-700 rounded-lg shadow">
          <div className="mb-4">
            <label htmlFor="branchName" className="block text-gray-200 font-medium">
              Branch Name
            </label>
            <input
              type="text"
              id="branchName"
              name="BranchName"
              value={newBranch.BranchName}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            />
            {formErrors.BranchName && <p className="text-red-500 mt-2">{formErrors.BranchName}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-200 font-medium">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="Address"
              value={newBranch.Address}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            />
            {formErrors.Address && <p className="text-red-500 mt-2">{formErrors.Address}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-200 font-medium">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="Phone"
              value={newBranch.Phone}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-600 text-white rounded-lg"
              required
            />
            {formErrors.Phone && <p className="text-red-500 mt-2">{formErrors.Phone}</p>}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
          >
            {editingBranch ? 'Update Branch' : 'Add Branch'}
          </button>
        </form>
      )}

      <table className="min-w-full table-auto border-collapse text-left">
        <thead>
          <tr className="bg-gray-700 border-b-2 border-gray-600">
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Branch Name</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Address</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Phone</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch, index) => (
            <tr key={branch.BranchID || `${branch.BranchName}-${index}`} className="border-b border-gray-600 hover:bg-gray-700">
              <td className="px-6 py-4">{branch.BranchName}</td>
              <td className="px-6 py-4">{branch.Address}</td>
              <td className="px-6 py-4">{branch.Phone}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(branch)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchesTable;