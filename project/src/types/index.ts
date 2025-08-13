export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  priorityScore: number;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  aiSuggestions?: string[];
  contextRelevant?: boolean;
}

export interface ContextEntry {
  id: string;
  content: string;
  sourceType: 'whatsapp' | 'email' | 'notes';
  timestamp: string;
  processedInsights?: string[];
  keywords?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

export interface AIAnalysis {
  priorityScore: number;
  suggestedCategory: string;
  recommendedDeadline: string;
  enhancedDescription: string;
  relevantContext: string[];
  confidence: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}