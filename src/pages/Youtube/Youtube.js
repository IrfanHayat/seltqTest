import React, { useState } from 'react';
import axios from 'axios';

function Youtube() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/stripe/create-checkout-session',{userId:'6662feeb3875bee172fcb122'});
      // Handle response, redirect user to checkout URL, etc.
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/cancel-subscription');
      // Handle response, show confirmation message, etc.
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/delete-subscription');
      // Handle response, show confirmation message, etc.
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
      <button onClick={handleCancelSubscription} disabled={loading}>
        {loading ? 'Loading...' : 'Cancel Subscription'}
      </button>
      <button onClick={handleDeleteSubscription} disabled={loading}>
        {loading ? 'Loading...' : 'Delete Subscription'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Youtube;
