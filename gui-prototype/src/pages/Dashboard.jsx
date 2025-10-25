import { motion } from 'framer-motion'
import { Users, AlertTriangle, TrendingDown, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { mockDashboardData } from '../data/mockData'

const Dashboard = () => {
  const { kpis, alerts, recentPredictions } = mockDashboardData

  const kpiCards = [
    { title: 'Total Customers', value: kpis.totalCustomers.toLocaleString(), icon: Users, color: 'blue' },
    { title: 'At-Risk Customers', value: kpis.atRiskCustomers.toLocaleString(), icon: AlertTriangle, color: 'red' },
    { title: 'SLA Breaches', value: kpis.slaBreaches, icon: Clock, color: 'orange' },
    { title: 'Churn Rate', value: `${kpis.churnRate}%`, icon: TrendingDown, color: 'red' },
    { title: 'Uplift Opportunities', value: kpis.upliftOpportunities.toLocaleString(), icon: DollarSign, color: 'green' },
    { title: 'Avg Resolution Time', value: `${kpis.avgResolutionTime}h`, icon: TrendingUp, color: 'blue' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📊'
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Strategic Operations Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Real-time insights into customer health, risk factors, and opportunities.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {kpi.value}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <kpi.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Alerts Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Recent Alerts
            </h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Predictions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
              Recent Predictions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-semibold text-sm">Customer</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">SLA Risk</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">Churn Risk</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">Uplift</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((prediction) => (
                    <tr
                      key={prediction.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-2 font-medium">{prediction.customer}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          prediction.slaRisk > 0.7 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          prediction.slaRisk > 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {Math.round(prediction.slaRisk * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          prediction.churnRisk > 0.7 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          prediction.churnRisk > 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {Math.round(prediction.churnRisk * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          prediction.uplift > 0.6 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          prediction.uplift > 0.3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {Math.round(prediction.uplift * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prediction.status)}`}>
                          {prediction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard