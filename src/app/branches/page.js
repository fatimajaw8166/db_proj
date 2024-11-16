
'use client'; // This is the directive to mark this file as a client component

import React, { useState, useEffect } from 'react';

const BranchesTable = () => {
  // State to manage branches data
  const [branches, setBranches] = useState([]);
  
  // State for managing form input values
  const [newBranch, setNewBranch] = useState({
    BranchName: '',
    Address: '',
    Phone: '',
  });
  
  // State to manage form visibility
  const [showForm, setShowForm] = useState(false);

  // Fetch branches from the backend when the component mounts
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
  }, []);  // Make sure the dependency array is empty to only fetch once when the component mounts
  

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBranch((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission (adding new branch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newBranch.BranchName || !newBranch.Address || !newBranch.Phone) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBranch),
      });

      const result = await response.json();

      if (response.ok) {
        // Add the new branch to the list
        setBranches((prevBranches) => [
          ...prevBranches,
          {
            BranchID: result.BranchID,
            ...newBranch,
          },
        ]);

        // Reset the form fields
        setNewBranch({ BranchName: '', Address: '', Phone: '' });
        setShowForm(false); // Close the form
      } else {
        alert('Failed to add branch: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Branches</h1>

      {/* Add New Branch Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {showForm ? 'Cancel' : 'Add New Branch'}
        </button>
      </div>

      {/* Form for adding a new branch */}
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
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300"
          >
            Add Branch
          </button>
        </form>
      )}

      {/* Table displaying branches */}
      <table className="min-w-full table-auto border-collapse text-left">
        <thead>
          <tr className="bg-gray-700 border-b-2 border-gray-600">
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Branch Name</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Address</th>
            <th className="px-6 py-4 text-lg font-medium text-gray-200">Phone</th>
          </tr>
        </thead>
        <tbody>
        {branches.map((branch, index) => (
    <tr key={branch.BranchID || `${branch.BranchName}-${index}`} className="border-b border-gray-600 hover:bg-gray-700">
      <td className="px-6 py-4">{branch.BranchName}</td>
      <td className="px-6 py-4">{branch.Address}</td>
      <td className="px-6 py-4">{branch.Phone}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default BranchesTable;
