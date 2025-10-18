import React, { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/ai/reasoning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>StratOpsAI</h1>
        <p>AI-powered strategic operations platform for customer insights</p>
      </header>

      <main className="main-content">
        <CustomerForm onSubmit={handleFormSubmit} loading={loading} />
        <ResultsPanel results={results} loading={loading} error={error} />
      </main>
    </div>
  );
}

export default App;