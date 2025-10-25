// Mock data for AI predictions and responses
export const mockPredictions = {
  generatePrediction: (customerData) => {
    const { priority, severity, customer_tier, resolution_time_hours, issue_category } = customerData
    
    // Simulate AI logic based on inputs
    const slaScore = getSLAScore(priority, severity)
    const usageTrend = getUsageTrend(customer_tier)
    const supportTickets = getSupportTickets(severity)
    
    // Generate realistic predictions with some randomness
    const slaBreachRisk = Math.max(0.1, Math.min(0.9, 1.0 - slaScore + (Math.random() - 0.5) * 0.2))
    const churnPropensity = Math.max(0.1, Math.min(0.9, 0.5 - usageTrend + supportTickets * 0.05 + (Math.random() - 0.5) * 0.2))
    const upliftPotential = Math.max(0.1, Math.min(0.9, slaScore + usageTrend * 0.5 + (Math.random() - 0.5) * 0.2))
    
    return {
      customer_id: customerData.customer_id,
      predictions: {
        sla_breach_risk: {
          probability: Number(slaBreachRisk.toFixed(3)),
          confidence: getConfidence(slaBreachRisk)
        },
        churn_propensity: {
          probability: Number(churnPropensity.toFixed(3)),
          confidence: getConfidence(churnPropensity)
        },
        uplift_potential: {
          probability: Number(upliftPotential.toFixed(3)),
          confidence: getConfidence(upliftPotential)
        }
      },
      narrative: generateNarrative(customerData.customer_id, slaBreachRisk, churnPropensity, upliftPotential),
      mode: 'simulation',
      timestamp: new Date().toISOString()
    }
  }
}

// Helper functions
const getSLAScore = (priority, severity) => {
  const scores = {
    'low-low': 0.9, 'low-medium': 0.8, 'low-high': 0.7,
    'medium-low': 0.7, 'medium-medium': 0.6, 'medium-high': 0.5,
    'high-low': 0.5, 'high-medium': 0.4, 'high-high': 0.3
  }
  return scores[`${priority}-${severity}`] || 0.6
}

const getUsageTrend = (tier) => {
  const trends = { 'premium': 0.2, 'standard': 0.0, 'basic': -0.1 }
  return trends[tier] || 0.0
}

const getSupportTickets = (severity) => {
  const tickets = { 'low': 1, 'medium': 3, 'high': 8 }
  return tickets[severity] || 3
}

const getConfidence = (probability) => {
  if (Math.abs(probability - 0.5) > 0.3) return 'high'
  if (Math.abs(probability - 0.5) > 0.15) return 'medium'
  return 'low'
}

const generateNarrative = (customerId, slaRisk, churnRisk, upliftPotential) => {
  let narrative = `Customer ${customerId} analysis: `
  
  if (slaRisk > 0.7) {
    narrative += "🚨 HIGH SLA breach risk detected. Immediate attention required. "
  } else if (slaRisk > 0.5) {
    narrative += "⚠️ Moderate SLA risk. Monitor closely. "
  } else {
    narrative += "✅ Low SLA risk. Performance within acceptable range. "
  }
  
  if (churnRisk > 0.7) {
    narrative += "🔴 HIGH churn probability. Implement retention strategy immediately. "
  } else if (churnRisk > 0.5) {
    narrative += "🟡 Elevated churn risk. Consider proactive engagement. "
  } else {
    narrative += "🟢 Low churn risk. Customer appears stable. "
  }
  
  if (upliftPotential > 0.6) {
    narrative += "💰 Strong upsell opportunity identified. "
  } else if (upliftPotential > 0.4) {
    narrative += "📈 Moderate uplift potential. "
  } else {
    narrative += "📊 Limited uplift opportunity at this time. "
  }
  
  const priority = Math.max(slaRisk, churnRisk) > 0.7 ? 'HIGH' : 
                  Math.max(slaRisk, churnRisk) > 0.5 ? 'MEDIUM' : 'LOW'
  narrative += `Priority: ${priority}`
  
  return narrative
}

// Mock dashboard data
export const mockDashboardData = {
  kpis: {
    totalCustomers: 12847,
    atRiskCustomers: 1284,
    slaBreaches: 23,
    churnRate: 5.2,
    upliftOpportunities: 847,
    avgResolutionTime: 4.2
  },
  
  alerts: [
    {
      id: 1,
      type: 'critical',
      title: 'High SLA Breach Risk',
      message: 'Customer CUST-9847 showing 89% SLA breach probability',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Churn Risk Alert',
      message: '15 customers moved to high churn risk category',
      timestamp: '15 minutes ago'
    },
    {
      id: 3,
      type: 'info',
      title: 'Uplift Opportunity',
      message: 'New upsell opportunities identified for premium tier',
      timestamp: '1 hour ago'
    }
  ],
  
  recentPredictions: [
    { id: 1, customer: 'CUST-1001', slaRisk: 0.23, churnRisk: 0.15, uplift: 0.78, status: 'low' },
    { id: 2, customer: 'CUST-1002', slaRisk: 0.67, churnRisk: 0.45, uplift: 0.34, status: 'medium' },
    { id: 3, customer: 'CUST-1003', slaRisk: 0.89, churnRisk: 0.72, uplift: 0.12, status: 'high' },
    { id: 4, customer: 'CUST-1004', slaRisk: 0.34, churnRisk: 0.28, uplift: 0.65, status: 'low' },
    { id: 5, customer: 'CUST-1005', slaRisk: 0.56, churnRisk: 0.61, uplift: 0.43, status: 'medium' }
  ]
}

// Mock ROI experiments data
export const mockExperiments = [
  {
    id: 1,
    name: 'Proactive Outreach Campaign',
    status: 'running',
    description: 'Testing proactive customer outreach for high churn risk segments',
    metrics: {
      participants: 1250,
      conversionRate: 23.4,
      roi: 340,
      confidence: 94
    },
    startDate: '2024-01-15',
    endDate: '2024-02-15'
  },
  {
    id: 2,
    name: 'Premium Tier Upsell',
    status: 'completed',
    description: 'Targeted upselling campaign for customers with high uplift potential',
    metrics: {
      participants: 890,
      conversionRate: 18.7,
      roi: 280,
      confidence: 97
    },
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  {
    id: 3,
    name: 'SLA Recovery Protocol',
    status: 'planning',
    description: 'Automated intervention for customers at risk of SLA breaches',
    metrics: {
      participants: 0,
      conversionRate: 0,
      roi: 0,
      confidence: 0
    },
    startDate: '2024-02-01',
    endDate: '2024-03-01'
  }
]