import React from 'react';

const ResultsPanel = ({ results, loading, error }) => {
  if (loading) {
    return (
      <div className="results-card">
        <div className="loading">
          <h3>🤖 Analyzing customer data...</h3>
          <p>Please wait while our AI models process the information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-card">
        <div className="error">
          <h3>❌ Analysis Failed</h3>
          <p>{error}</p>
          <p>Please check your API configuration and try again.</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-card">
        <h3>📊 AI Analysis Results</h3>
        <p>Submit the form to get AI-powered insights about your customer.</p>
      </div>
    );
  }

  const getProbabilityClass = (probability) => {
    if (probability >= 0.7) return 'high';
    if (probability >= 0.4) return 'medium';
    return 'low';
  };

  const formatProbability = (probability) => {
    return `${Math.round(probability * 100)}%`;
  };

  return (
    <div className="results-card">
      <h3>📊 AI Analysis Results</h3>
      <p><strong>Customer:</strong> {results.customer_id}</p>

      <div className="predictions">
        {results.predictions.sla_breach_risk && !results.predictions.sla_breach_risk.error && (
          <div className="prediction-item">
            <h4>SLA Breach Risk</h4>
            <div className={`probability ${getProbabilityClass(results.predictions.sla_breach_risk.probability)}`}>
              {formatProbability(results.predictions.sla_breach_risk.probability)}
            </div>
            <div className="confidence">
              {results.predictions.sla_breach_risk.confidence} confidence
            </div>
          </div>
        )}

        {results.predictions.churn_propensity && !results.predictions.churn_propensity.error && (
          <div className="prediction-item">
            <h4>Churn Risk</h4>
            <div className={`probability ${getProbabilityClass(results.predictions.churn_propensity.probability)}`}>
              {formatProbability(results.predictions.churn_propensity.probability)}
            </div>
            <div className="confidence">
              {results.predictions.churn_propensity.confidence} confidence
            </div>
          </div>
        )}

        {results.predictions.uplift_potential && !results.predictions.uplift_potential.error && (
          <div className="prediction-item">
            <h4>Upsell Potential</h4>
            <div className={`probability ${getProbabilityClass(results.predictions.uplift_potential.probability)}`}>
              {formatProbability(results.predictions.uplift_potential.probability)}
            </div>
            <div className="confidence">
              {results.predictions.uplift_potential.confidence} confidence
            </div>
          </div>
        )}
      </div>

      {results.narrative && (
        <div className="narrative">
          <h3>🎯 Strategic Insights</h3>
          <p>{results.narrative}</p>
        </div>
      )}

      {/* Show errors for individual predictions */}
      {Object.entries(results.predictions).some(([_, pred]) => pred.error) && (
        <div className="error">
          <h4>⚠️ Partial Results</h4>
          <p>Some AI models are currently unavailable. Results may be incomplete.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;