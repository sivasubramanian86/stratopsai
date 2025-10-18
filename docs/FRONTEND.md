# StratOpsAI Frontend Architecture

## Overview

The StratOpsAI frontend is a React application that provides a user-friendly interface for interacting with the AI-powered strategic operations platform. It connects to the backend API deployed via CloudFormation Stack 2.

## Architecture

```
React App → API Gateway → Lambda Function → SageMaker + Bedrock
    ↓
Customer Form → JSON Payload → AI Analysis → Results Display
```

## Components

### App.js (Main Container)
- Manages global state for API results, loading, and errors
- Handles API communication with the backend
- Orchestrates data flow between form and results components

### CustomerForm.js (Input Component)
- Collects user inputs: priority, severity, customer tier, resolution time, issue category
- Transforms form data into API-compatible format
- Maps business inputs to ML model features:
  - Priority + Severity → SLA Score
  - Customer Tier → Usage Trend, Contract Value, Tenure
  - Severity → Support Tickets count

### ResultsPanel.js (Output Component)
- Displays AI predictions with color-coded risk levels
- Shows confidence scores for each prediction
- Renders narrative insights from Bedrock Claude
- Handles partial results when some models fail

## Data Flow

### 1. Form Input Transformation
```javascript
// User selects: Priority=High, Severity=Medium, Tier=Premium
// Transforms to:
{
  customer_id: "CUST-12345",
  metrics: {
    sla_score: 0.4,        // High priority + Medium severity
    usage_trend: 0.2,      // Premium tier (growing usage)
    support_tickets: 3,    // Medium severity
    contract_value: 100000, // Premium tier
    tenure_months: 36      // Premium tier (long tenure)
  }
}
```

### 2. API Communication
```javascript
const response = await fetch(`${process.env.REACT_APP_API_URL}/ai/reasoning`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

### 3. Results Processing
```javascript
// API returns:
{
  customer_id: "CUST-12345",
  predictions: {
    sla_breach_risk: { probability: 0.75, confidence: "high" },
    churn_propensity: { probability: 0.45, confidence: "medium" },
    uplift_potential: { probability: 0.65, confidence: "high" }
  },
  narrative: "Customer shows high SLA risk..."
}
```

## Environment Configuration

### Development (.env)
```
REACT_APP_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/dev
```

### Production (Amplify Environment Variables)
```
REACT_APP_API_URL=https://xyz789.execute-api.us-east-1.amazonaws.com/prod
```

## Styling Strategy

### CSS Architecture
- **Global styles**: `index.css` with CSS Grid and Flexbox layouts
- **Component-specific**: Inline styles for dynamic content (risk colors)
- **Responsive design**: Mobile-first approach with CSS Grid breakpoints
- **Color coding**: Red (high risk), Yellow (medium), Green (low)

### Design Principles
- **Minimal UI**: Clean, focused interface for hackathon demos
- **Visual hierarchy**: Clear separation between input and output sections
- **Accessibility**: Proper labels, contrast ratios, keyboard navigation
- **Loading states**: Visual feedback during API calls

## Error Handling

### Network Errors
```javascript
try {
  const response = await fetch(apiUrl, options);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
} catch (err) {
  setError(err.message);
}
```

### Partial API Failures
- Individual SageMaker endpoints may fail
- Frontend displays available predictions
- Shows warning for missing data
- Graceful degradation maintains usability

### Validation
- Required fields: Customer ID
- Input constraints: Resolution time (1-168 hours)
- Form validation prevents invalid submissions

## Performance Considerations

### Bundle Size Optimization
- Minimal dependencies (React, Axios only)
- No heavy UI libraries
- Tree shaking enabled via Create React App
- Build size target: < 10MB

### API Optimization
- Single API call per analysis
- No polling or real-time updates
- Client-side caching of results
- Debounced form submissions

### Loading Experience
- Immediate feedback on form submission
- Loading states with descriptive messages
- Progressive result display
- Error recovery options

## Integration with Backend

### API Contract Alignment
The frontend expects the exact API format defined in `/docs/API.md`:

```javascript
// Request format
{
  customer_id: string,
  metrics: {
    sla_score: number,
    usage_trend: number,
    support_tickets: number,
    contract_value: number,
    tenure_months: number
  }
}

// Response format
{
  customer_id: string,
  predictions: { ... },
  narrative: string,
  timestamp: string
}
```

### Environment Synchronization
- Development frontend → Development API (Stack 2 dev)
- Production frontend → Production API (Stack 2 prod)
- Automatic endpoint discovery via CloudFormation outputs

## Local Development

### Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```bash
# Update .env with your API endpoint
REACT_APP_API_URL=https://your-api-gateway-url.com/dev
```

### Testing
```bash
npm test              # Run unit tests
npm run build         # Test production build
```

## Deployment Integration

### Amplify Build Process
1. **Pre-build**: `npm ci` (install dependencies)
2. **Build**: `npm run build` (create production bundle)
3. **Deploy**: Upload to Amplify hosting
4. **Environment**: Inject `REACT_APP_API_URL` from CloudFormation

### Continuous Deployment
- Push to `develop` → Deploy to dev environment
- Push to `main` → Deploy to production environment
- Automatic builds triggered by GitHub webhooks
- Build status visible in Amplify console

This architecture provides a clean separation between frontend presentation and backend AI logic, enabling independent development and deployment while maintaining tight integration for the end-user experience.