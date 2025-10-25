import { motion } from 'framer-motion'
import { Beaker, Play, Pause, CheckCircle, Clock, TrendingUp, Users, Target } from 'lucide-react'
import { mockExperiments } from '../data/mockData'

const ROIExperiments = () => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="w-5 h-5 text-green-500" />
      case 'completed': return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'planning': return <Clock className="w-5 h-5 text-yellow-500" />
      default: return <Pause className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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
            <Beaker className="w-10 h-10 mr-3 text-blue-600" />
            Autonomous ROI Experiments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            AI-driven experimentation platform that continuously tests and optimizes 
            customer engagement strategies to maximize ROI.
          </p>
        </motion.div>

        {/* Experiment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {mockExperiments.map((experiment, index) => (
            <motion.div
              key={experiment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(experiment.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(experiment.status)}`}>
                    {experiment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {experiment.id}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {experiment.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {experiment.description}
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Users className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Participants</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {experiment.metrics.participants.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Target className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Conversion</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {experiment.metrics.conversionRate}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <TrendingUp className="w-4 h-4 mr-1 text-purple-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">ROI</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {experiment.metrics.roi}%
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <CheckCircle className="w-4 h-4 mr-1 text-indigo-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Confidence</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {experiment.metrics.confidence}%
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Start: {formatDate(experiment.startDate)}</span>
                    <span>End: {formatDate(experiment.endDate)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WOW Factor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-900 dark:text-primary-100">
              🚀 Autonomous Experimentation Engine
            </h2>
            <p className="text-lg text-primary-700 dark:text-primary-300 mb-8 max-w-3xl mx-auto">
              Our AI doesn't just predict - it learns and adapts. The system automatically 
              designs, launches, and optimizes experiments based on real-time customer behavior, 
              continuously improving ROI without human intervention.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Beaker className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary-900 dark:text-primary-100">
                  Auto-Design
                </h3>
                <p className="text-primary-700 dark:text-primary-300">
                  AI creates experiment hypotheses based on customer patterns
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary-900 dark:text-primary-100">
                  Smart Targeting
                </h3>
                <p className="text-primary-700 dark:text-primary-300">
                  Automatically selects optimal customer segments for testing
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary-900 dark:text-primary-100">
                  Continuous Optimization
                </h3>
                <p className="text-primary-700 dark:text-primary-300">
                  Real-time adjustments maximize ROI throughout experiment lifecycle
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ROIExperiments