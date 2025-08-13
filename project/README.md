# Smart Todo List with AI Integration

A full-stack web application featuring intelligent task management with AI-powered prioritization, deadline suggestions, and context-aware recommendations.

## Features

### Core Functionality
- **Smart Task Management**: Create, edit, delete, and organize tasks with AI assistance
- **AI-Powered Prioritization**: Automatic priority scoring based on context analysis
- **Intelligent Deadline Suggestions**: AI recommends optimal deadlines based on task complexity
- **Context-Aware Analysis**: Process daily context (messages, emails, notes) for better task recommendations
- **Smart Categorization**: Automatic task categorization with usage tracking
- **Advanced Filtering**: Filter by status, category, priority, and search functionality

### AI Integration Features
- **Context Processing**: Analyzes daily context to understand user priorities
- **Task Enhancement**: Improves task descriptions with context-aware details
- **Priority Scoring**: Uses AI to rank tasks based on urgency and context
- **Smart Suggestions**: Provides actionable recommendations for task management
- **Sentiment Analysis**: Analyzes context sentiment for better prioritization
- **Keyword Extraction**: Identifies relevant keywords from context data

### User Interface
- **Modern Design**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Instant feedback and smooth animations
- **Dashboard Analytics**: Task statistics and progress tracking
- **Context History**: View and analyze past context entries
- **Mobile Responsive**: Optimized for all screen sizes

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend Simulation
- **Local Storage** for data persistence (simulating database)
- **Mock AI Services** demonstrating required AI functionality
- **Service Layer Architecture** ready for Django REST Framework integration

### AI Integration
- Simulated AI analysis engine
- Context processing algorithms
- Priority scoring system
- Smart categorization logic

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard with task management
│   ├── TaskCard.tsx     # Individual task display component
│   ├── TaskForm.tsx     # Task creation/editing form with AI analysis
│   ├── ContextForm.tsx  # Daily context input form
│   └── ContextHistory.tsx # Context history viewer
├── services/           # Business logic services
│   ├── aiService.ts    # AI analysis and recommendations
│   └── dataService.ts  # Data persistence and management
├── types/             # TypeScript type definitions
│   └── index.ts       # Core interfaces and types
└── App.tsx            # Main application component
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-todo-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Click "Load Sample Data" to populate with example tasks and context

## Usage Guide

### Task Management
1. **Create a Task**: Click "New Task" and fill in the details
2. **AI Analysis**: Click "AI Analysis" for intelligent suggestions
3. **Apply Suggestions**: Use AI recommendations for category, priority, and deadlines
4. **Manage Tasks**: Update status, edit, or delete tasks as needed

### Context Integration
1. **Add Context**: Click "Add Context" to input daily information
2. **Choose Source**: Select WhatsApp, Email, or Notes
3. **AI Processing**: The system automatically analyzes content for insights
4. **View History**: Check the Context History tab for processed entries

### Filtering and Search
- Use the search bar to find specific tasks
- Filter by status (Pending, In Progress, Completed)
- Filter by category or priority level
- Tasks are automatically sorted by priority score and deadline

## API Documentation (Simulated)

### Task Endpoints
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Context Endpoints
- `GET /api/context` - Retrieve context entries
- `POST /api/context` - Add new context entry
- `POST /api/context/analyze` - Process context with AI

### AI Analysis Endpoints
- `POST /api/ai/analyze-task` - Get AI task analysis
- `POST /api/ai/prioritize` - Get priority suggestions
- `POST /api/ai/categorize` - Get category suggestions

## Sample Data

### Example Tasks
- **Project Presentation** (High Priority, Work Category)
- **Grocery Shopping** (Medium Priority, Personal Category)
- **Doctor Appointment** (High Priority, Health Category)

### Example Context Entries
- Email: "Meeting with client tomorrow at 2 PM"
- WhatsApp: "Urgent: Need to submit quarterly report"
- Notes: "Remember to pick up dry cleaning"

## AI Features Demonstration

### Priority Scoring Algorithm
- Base score: 50/100
- Urgency keywords: +15 points each
- Context relevance: +5 points per relevant entry
- Category importance: Variable bonus
- Final score: 0-100 range

### Smart Categorization
- Keyword-based category detection
- Work: meeting, project, deadline, client
- Personal: shopping, clean, organize, hobby
- Health: doctor, exercise, medicine
- Finance: bank, payment, budget, tax
- Family: birthday, family, vacation

### Deadline Suggestions
- High priority (80+): 2 days
- Medium priority (60-79): 3-5 days
- Low priority (<60): 7+ days
- Complexity adjustment based on description length

## Future Enhancements

### Backend Integration
- Django REST Framework implementation
- PostgreSQL database integration
- User authentication system
- Real AI API integration (OpenAI, Claude, Gemini)

### Advanced Features
- Calendar integration
- Email notifications
- Team collaboration
- Mobile app version
- Export/import functionality
- Advanced analytics dashboard

## Contributing

This project demonstrates the complete architecture for a production-ready Smart Todo application with AI integration. The codebase is structured to easily transition from the current simulation to a full Django backend with real AI services.

## License

MIT License - See LICENSE file for details