import React, { useState } from 'react';

const CustomerForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    priority: 'medium',
    severity: 'medium',
    customer_tier: 'standard',
    resolution_time_hours: 24,
    issue_category: 'technical'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Transform form data to match API expectations
    const apiPayload = {
      customer_id: formData.customer_id,
      metrics: {
        sla_score: getSLAScore(formData.priority, formData.severity),
        usage_trend: getUsageTrend(formData.customer_tier),
        support_tickets: getSupportTickets(formData.severity),
        contract_value: getContractValue(formData.customer_tier),
        tenure_months: getTenureMonths(formData.customer_tier)
      }
    };

    onSubmit(apiPayload);
  };

  // Helper functions to convert form inputs to metrics
  const getSLAScore = (priority, severity) => {
    const scores = {
      'low-low': 0.9, 'low-medium': 0.8, 'low-high': 0.7,
      'medium-low': 0.7, 'medium-medium': 0.6, 'medium-high': 0.5,
      'high-low': 0.5, 'high-medium': 0.4, 'high-high': 0.3
    };
    return scores[`${priority}-${severity}`] || 0.6;
  };

  const getUsageTrend = (tier) => {
    const trends = { 'premium': 0.2, 'standard': 0.0, 'basic': -0.1 };
    return trends[tier] || 0.0;
  };

  const getSupportTickets = (severity) => {
    const tickets = { 'low': 1, 'medium': 3, 'high': 8 };
    return tickets[severity] || 3;
  };

  const getContractValue = (tier) => {
    const values = { 'premium': 100000, 'standard': 50000, 'basic': 25000 };
    return values[tier] || 50000;
  };

  const getTenureMonths = (tier) => {
    const tenure = { 'premium': 36, 'standard': 18, 'basic': 6 };
    return tenure[tier] || 18;
  };

  return (
    <div className="form-card">
      <h2>Customer Analysis</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customer_id">Customer ID *</label>
          <input
            type="text"
            id="customer_id"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            required
            placeholder="e.g., CUST-12345"
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority Level</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="severity">Issue Severity</label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="customer_tier">Customer Tier</label>
          <select
            id="customer_tier"
            name="customer_tier"
            value={formData.customer_tier}
            onChange={handleChange}
          >
            <option value="basic">Basic</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="resolution_time_hours">Expected Resolution (Hours)</label>
          <input
            type="number"
            id="resolution_time_hours"
            name="resolution_time_hours"
            value={formData.resolution_time_hours}
            onChange={handleChange}
            min="1"
            max="168"
          />
        </div>

        <div className="form-group">
          <label htmlFor="issue_category">Issue Category</label>
          <select
            id="issue_category"
            name="issue_category"
            value={formData.issue_category}
            onChange={handleChange}
          >
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="account">Account Management</option>
            <option value="feature">Feature Request</option>
            <option value="integration">Integration</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Customer'}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;