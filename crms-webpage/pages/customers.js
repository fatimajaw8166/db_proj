// pages/customers.js
import axios from 'axios';
import { useEffect, useState } from 'react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/customers')
            .then(response => setCustomers(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Customers</h1>
            <ul>
                {customers.map(customer => (
                    <li key={customer.CustomerID}>{customer.FirstName} {customer.LastName}</li>
                ))}
            </ul>
        </div>
    );
};

export default Customers;