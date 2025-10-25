import { Link } from 'react-router-dom'
import { ArrowRight, Brain, TrendingUp, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Reasoning',
      description: 'Advanced machine learning models predict SLA breaches, churn risk, and uplift opportunities with high accuracy.'
    },
    {
      icon: TrendingUp,
      title: 'ROI Experiments',
      description: 'Autonomous experimentation framework that continuously optimizes customer engagement strategies.'
    },
    {
      icon: Shield,
      title: 'Risk Mitigation',
      description: 'Proactive identification of at-risk customers with actionable insights for retention strategies.'
    },
    {
      icon: Zap,
      title: 'Real-time Insights',
      description: 'Live dashboard with instant alerts and recommendations for strategic decision making.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Strategic
              <span className="block text-blue-200">Operations Platform</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Predict SLA breaches, analyze churn risk, and identify uplift opportunities 
              with cutting-edge artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/ai-reasoning" 
                className="btn-primary bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center"
              >
                Try AI Reasoning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/dashboard" 
                className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Revolutionize Your Operations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Harness the power of AI to transform customer relationships and drive business growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience the future of strategic operations with our AI-powered platform.
            </p>
            <Link 
              to="/ai-reasoning" 
              className="btn-primary inline-flex items-center justify-center text-lg px-8 py-3"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home