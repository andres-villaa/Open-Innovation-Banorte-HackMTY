# CFOlytics

**AI-Powered Financial Analysis Dashboard for Small Business Forecasting**

CFOlytics is a proof-of-concept dashboard that leverages artificial intelligence and machine learning to help small business owners analyze and predict revenue and expense trends. By combining interactive data visualization with conversational AI, CFOlytics enables non-technical users to gain actionable financial insights through natural language queries.

---

## Features

- **📊 Interactive Financial Dashboard** - Real-time visualization of revenue and expense data with interactive charts and metrics
- **🤖 AI-Powered Financial Analysis** - Ask natural language questions about your financial data and receive intelligent insights powered by OpenAI
- **📈 Predictive Forecasting** - Time-series forecasting using Facebook's Prophet model to predict future revenue and expense trends
- **🔄 Automated Workflows** - n8n integration for seamless data processing and workflow automation
- **💼 Multi-Entity Support** - Analyze financial data across multiple business entities with easy switching
- **📱 Responsive Design** - Modern, intuitive UI built with React and Tailwind CSS

---

## Architecture

<img width="1476" height="319" alt="image" src="https://github.com/user-attachments/assets/580f6351-3dce-464f-8785-0dd1dbc7fca4" />


```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js/React)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard | Charts | Metrics | AI Assistant        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────────┐
    │ Prophet │    │ OpenAI   │    │ n8n Workflows│
    │ Models  │    │ LLM API  │    │ Automation   │
    └─────────┘    └──────────┘    └──────────────┘
         │
         ▼
    ┌─────────────┐
    │ Sample Data │
    │ (CSV Files) │
    └─────────────┘
```

---

## Tech Stack

### Frontend
- **Next.js 16** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Interactive data visualization
- **Radix UI** - Accessible component library
- **React Hook Form** - Form state management
- **AI SDK** - Integration with OpenAI API

### Machine Learning & AI
- **Facebook Prophet** - Time-series forecasting (pre-trained models)
- **OpenAI API** - Large Language Model integration

### Integrations
- **n8n** - Workflow automation platform
- **OpenAI** - AI-powered financial analysis

---

## Setup & Installation

### Prerequisites
- Node.js 18+ and pnpm
- OpenAI API key

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create environment variables** (`.env.local`):
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run development server:**
   ```bash
   pnpm dev
   ```

   The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Usage Guide

### Dashboard Navigation

1. **Select Entity** - Use the entity selector to switch between different business entities
2. **View Metrics** - Monitor key financial metrics at a glance
3. **Analyze Charts** - Interact with time-series charts to explore trends
4. **Ask Questions** - Use the AI Assistant to query your financial data

### AI Assistant Examples

Ask questions like:
- "What is the trend of my revenue over the last year?"
- "Compare revenue growth between entities"
- "What are the key expense drivers?"

### Sample Data

The application includes pre-loaded sample financial datasets for demonstration purposes. These datasets contain 3 years of monthly revenue and expense data across multiple business entities (E001-E050).

---

## Project Structure

```
├── app/                      # Next.js application
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Dashboard page
├── components/              # React components
│   ├── ai-assistant.tsx     # LLM chat interface
│   ├── charts-section.tsx   # Data visualization
│   ├── dashboard-header.tsx # Header component
│   ├── metrics-grid.tsx     # KPI metrics display
│   └── sidebar.tsx          # Navigation sidebar
├── models/                  # Pre-trained Prophet models
│   └── Prophet_model/       # Serialized model files
├── SHARE/                   # Sample financial datasets
│   └── Data_3/              # CSV data files
├── package.json             # Frontend dependencies
└── README.md               # This file
```

---

## Project Status

**Status:** Proof of Concept (Hackathon Project)

This is a demonstration project developed for a hackathon competition. The application showcases the integration of machine learning forecasting with conversational AI to provide financial insights. This is not production-ready and is intended to demonstrate the feasibility and value of AI-powered financial analysis for small businesses.

### Current Capabilities
- ✅ Financial data visualization
- ✅ Time-series forecasting with Prophet
- ✅ AI-powered Q&A with OpenAI
- ✅ Multi-entity support
- ✅ Responsive dashboard UI

---

## License

This project is developed as part of a hackathon competition.
