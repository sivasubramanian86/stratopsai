import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Brain, TrendingUp, AlertTriangle, DollarSign, Loader } from 'lucide-react'
import { mockPredictions } from '../data/mockData'

const AIReasoning = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    priority: 'medium',
    severity: 'medium',
    customer_tier: 'standard',
    resolution_time_hours: 24,
    issue_category: 'technical'
  })
  
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.customer_id.trim()) {
      toast.error('Customer ID is required')
      return
    }

    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      const prediction = mockPredictions.generatePrediction(formData)
      setResults(prediction)
      toast.success('AI analysis completed successfully!')
    } catch (error) {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 0.7) return 'text-red-600 dark:text-red-400'
    if (probability >= 0.4) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getProbabilityBg = (probability) => {
    if (probability >= 0.7) return 'bg-red-100 dark:bg-red-900/20'
    if (probability >= 0.4) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-green-100 dark:bg-green-900/20'
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Brain className="w-10 h-10 mr-3 text-blue-600" />
            AI Reasoning Engine
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Analyze customer data and get AI-powered predictions for SLA breach risk, 
            churn propensity, and uplift opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold mb-6">Customer Analysis Input</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Customer ID *</label>
                <input
                  type="text"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  placeholder="e.g., CUST-12345"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority Level</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Issue Severity</label>
                  <select name="severity" value={formData.severity} onChange={handleChange} className="input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Tier</label>
                  <select name="customer_tier" value={formData.customer_tier} onChange={handleChange} className="input-field">
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Resolution Time (Hours)</label>
                  <input
                    type="number"
                    name="resolution_time_hours"
                    value={formData.resolution_time_hours}
                    onChange={handleChange}
                    min="1"
                    max="168"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issue Category</label>
                <select name="issue_category" value={formData.issue_category} onChange={handleChange} className="input-field">
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account Management</option>
                  <option value="feature">Feature Request</option>
                  <option value="integration">Integration</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze Customer
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold mb-6">AI Analysis Results</h2>
            
            {loading && (
              <div className="text-center py-12">
                <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                <p className="text-gray-600 dark:text-gray-400">
                  AI models are processing your request...
                </p>
              </div>
            )}

            {!loading && !results && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Submit the form to get AI-powered insights about your customer.</p>
              </div>
            )}

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Customer:</strong> {results.customer_id} | 
                    <strong> Mode:</strong> {results.mode} | 
                    <strong> Timestamp:</strong> {new Date(results.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* SLA Breach Risk */}
                  <div className={`p-4 rounded-lg ${getProbabilityBg(results.predictions.sla_breach_risk.probability)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <h3 className="font-semibold">SLA Breach Risk</h3>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {results.predictions.sla_breach_risk.confidence} confidence
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${getProbabilityColor(results.predictions.sla_breach_risk.probability)}`}>
                      {Math.round(results.predictions.sla_breach_risk.probability * 100)}%
                    </div>
                  </div>

                  {/* Churn Propensity */}
                  <div className={`p-4 rounded-lg ${getProbabilityBg(results.predictions.churn_propensity.probability)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        <h3 className="font-semibold">Churn Risk</h3>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {results.predictions.churn_propensity.confidence} confidence
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${getProbabilityColor(results.predictions.churn_propensity.probability)}`}>
                      {Math.round(results.predictions.churn_propensity.probability * 100)}%
                    </div>
                  </div>

                  {/* Uplift Potential */}
                  <div className={`p-4 rounded-lg ${getProbabilityBg(results.predictions.uplift_potential.probability)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        <h3 className="font-semibold">Upsell Potential</h3>
                      </div>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {results.predictions.uplift_potential.confidence} confidence
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${getProbabilityColor(results.predictions.uplift_potential.probability)}`}>
                      {Math.round(results.predictions.uplift_potential.probability * 100)}%
                    </div>
                  </div>
                </div>

                {/* Narrative */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-primary-500">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Strategic Insights
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {results.narrative}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AIReasoning