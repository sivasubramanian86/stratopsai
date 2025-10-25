import { motion } from 'framer-motion'
import { Users, Award, Code, Zap } from 'lucide-react'

const About = () => {
  const team = [
    {
      name: 'Alex Chen',
      role: 'AI/ML Engineer',
      bio: 'Former AWS SageMaker specialist with 8+ years in machine learning and predictive analytics.',
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah Johnson',
      role: 'Full-Stack Developer',
      bio: 'React and Node.js expert with experience building scalable enterprise applications.',
      avatar: '👩‍💻'
    },
    {
      name: 'Mike Rodriguez',
      role: 'DevOps Engineer',
      bio: 'AWS certified architect specializing in serverless infrastructure and CI/CD pipelines.',
      avatar: '👨‍🔧'
    },
    {
      name: 'Emily Davis',
      role: 'Product Designer',
      bio: 'UX/UI designer focused on creating intuitive interfaces for complex data systems.',
      avatar: '👩‍🎨'
    }
  ]

  const achievements = [
    { icon: Award, title: 'Best AI Innovation', description: 'Hackathon 2024 Winner' },
    { icon: Code, title: 'Open Source', description: '100% Open Source Codebase' },
    { icon: Zap, title: 'Real-time Processing', description: 'Sub-second AI Predictions' },
    { icon: Users, title: 'Enterprise Ready', description: 'Scalable Architecture' }
  ]

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">About StratOpsAI</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Born from a hackathon vision to revolutionize strategic operations through 
            artificial intelligence and predictive analytics.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
              To empower businesses with AI-driven insights that predict customer behavior, 
              prevent churn, and identify growth opportunities. We believe that every customer 
              interaction contains valuable signals that, when properly analyzed, can transform 
              business outcomes and drive sustainable growth.
            </p>
          </div>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">System Architecture</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <div className="text-center">
              <div className="inline-block bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mb-4">
                <h3 className="font-bold text-lg mb-2">📊 Data Ingestion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kinesis Streams</p>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="w-px h-12 bg-gray-400"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                  <h3 className="font-bold text-lg mb-2">🧠 SLA Breach Model</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">SageMaker Endpoint</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                  <h3 className="font-bold text-lg mb-2">📈 Churn Predictor</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">SageMaker Endpoint</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                  <h3 className="font-bold text-lg mb-2">💰 Uplift Model</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">SageMaker Endpoint</p>
                </div>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="w-px h-12 bg-gray-400"></div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mb-4">
                <h3 className="font-bold text-lg mb-2">🤖 AI Reasoning Engine</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lambda + Bedrock Claude</p>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="w-px h-12 bg-gray-400"></div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-lg mb-2">🌐 Strategic Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">API Gateway + React Frontend</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Key Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hackathon Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="card mt-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-100">
              🏆 Hackathon Journey
            </h2>
            <p className="text-lg text-blue-700 dark:text-blue-300 leading-relaxed max-w-4xl mx-auto">
              StratOpsAI was conceived during a 48-hour hackathon where our team identified 
              the critical gap between reactive customer service and proactive strategic operations. 
              We envisioned a platform that could predict customer behavior before issues arise, 
              enabling businesses to act strategically rather than reactively. What started as 
              a weekend project has evolved into a comprehensive AI platform that's reshaping 
              how enterprises approach customer relationship management.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About