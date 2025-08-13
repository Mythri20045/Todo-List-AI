import { Task, ContextEntry, AIAnalysis } from '../types';

class AIService {
  private contextData: ContextEntry[] = [];

  // Simulate AI analysis of daily context
  processContext(entries: ContextEntry[]): ContextEntry[] {
    return entries.map(entry => ({
      ...entry,
      processedInsights: this.extractInsights(entry.content),
      keywords: this.extractKeywords(entry.content),
      sentiment: this.analyzeSentiment(entry.content)
    }));
  }

  // Simulate task prioritization based on context and urgency
  analyzePriority(task: Partial<Task>, context: ContextEntry[]): number {
    let score = 50; // Base score
    
    // Analyze urgency keywords
    const urgentKeywords = ['urgent', 'asap', 'deadline', 'important', 'critical', 'meeting'];
    const taskText = `${task.title} ${task.description}`.toLowerCase();
    
    urgentKeywords.forEach(keyword => {
      if (taskText.includes(keyword)) score += 15;
    });

    // Context relevance
    const relevantContext = context.filter(entry => 
      this.isContextRelevant(entry.content, taskText)
    );
    score += relevantContext.length * 5;

    // Category-based scoring
    const categoryScores = {
      'work': 20,
      'personal': 10,
      'health': 25,
      'finance': 20,
      'family': 15
    };
    
    if (task.category && categoryScores[task.category.toLowerCase() as keyof typeof categoryScores]) {
      score += categoryScores[task.category.toLowerCase() as keyof typeof categoryScores];
    }

    return Math.min(100, Math.max(0, score));
  }

  // Generate AI-powered task analysis
  analyzeTask(task: Partial<Task>, context: ContextEntry[]): AIAnalysis {
    const priorityScore = this.analyzePriority(task, context);
    const suggestedCategory = this.suggestCategory(task);
    const recommendedDeadline = this.suggestDeadline(task, priorityScore);
    const enhancedDescription = this.enhanceDescription(task, context);
    const relevantContext = this.findRelevantContext(task, context);

    return {
      priorityScore,
      suggestedCategory,
      recommendedDeadline,
      enhancedDescription,
      relevantContext,
      confidence: this.calculateConfidence(task, context)
    };
  }

  // Suggest optimal deadlines based on task complexity and current workload
  suggestDeadline(task: Partial<Task>, priorityScore: number): string {
    const now = new Date();
    let daysToAdd = 7; // Default

    // Adjust based on priority
    if (priorityScore > 80) daysToAdd = 2;
    else if (priorityScore > 60) daysToAdd = 3;
    else if (priorityScore > 40) daysToAdd = 5;

    // Adjust based on task complexity (word count as proxy)
    const wordCount = (task.description || '').split(' ').length;
    if (wordCount > 50) daysToAdd += 2;
    if (wordCount > 100) daysToAdd += 3;

    const deadline = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return deadline.toISOString().split('T')[0];
  }

  // Smart categorization based on task content
  suggestCategory(task: Partial<Task>): string {
    const text = `${task.title} ${task.description}`.toLowerCase();
    
    const categoryKeywords = {
      'work': ['meeting', 'project', 'deadline', 'client', 'email', 'presentation', 'report'],
      'personal': ['shopping', 'clean', 'organize', 'call', 'visit', 'hobby', 'book'],
      'health': ['doctor', 'exercise', 'gym', 'medicine', 'appointment', 'diet', 'wellness'],
      'finance': ['bank', 'payment', 'budget', 'tax', 'insurance', 'investment', 'bill'],
      'family': ['birthday', 'anniversary', 'kids', 'parents', 'family', 'vacation', 'dinner']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  // Enhance task descriptions with context-aware details
  private enhanceDescription(task: Partial<Task>, context: ContextEntry[]): string {
    const relevantContext = this.findRelevantContext(task, context);
    let enhanced = task.description || '';

    if (relevantContext.length > 0) {
      const contextInsights = relevantContext
        .flatMap(ctx => ctx.processedInsights || [])
        .slice(0, 2);
      
      if (contextInsights.length > 0) {
        enhanced += `\n\n📋 AI Insights: ${contextInsights.join(', ')}`;
      }
    }

    return enhanced;
  }

  // Find context entries relevant to the task
  private findRelevantContext(task: Partial<Task>, context: ContextEntry[]): ContextEntry[] {
    const taskText = `${task.title} ${task.description}`.toLowerCase();
    
    return context.filter(entry => 
      this.isContextRelevant(entry.content, taskText)
    ).slice(0, 3);
  }

  // Check if context entry is relevant to task
  private isContextRelevant(contextContent: string, taskText: string): boolean {
    const contextWords = contextContent.toLowerCase().split(/\s+/);
    const taskWords = taskText.split(/\s+/);
    
    const commonWords = contextWords.filter(word => 
      word.length > 3 && taskWords.includes(word)
    );
    
    return commonWords.length >= 2;
  }

  // Extract insights from context
  private extractInsights(content: string): string[] {
    const insights = [];
    const text = content.toLowerCase();
    
    if (text.includes('deadline') || text.includes('due')) {
      insights.push('Time-sensitive task detected');
    }
    if (text.includes('meeting') || text.includes('call')) {
      insights.push('Requires coordination with others');
    }
    if (text.includes('urgent') || text.includes('asap')) {
      insights.push('High priority item');
    }
    if (text.includes('follow up') || text.includes('remind')) {
      insights.push('Requires follow-up action');
    }
    
    return insights;
  }

  // Extract keywords from content
  private extractKeywords(content: string): string[] {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    return content
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 5);
  }

  // Analyze sentiment of content
  private analyzeSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'excited'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worried', 'stressed', 'urgent', 'problem'];
    
    const text = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Calculate confidence score for AI analysis
  private calculateConfidence(task: Partial<Task>, context: ContextEntry[]): number {
    let confidence = 60; // Base confidence
    
    if (task.title && task.title.length > 5) confidence += 10;
    if (task.description && task.description.length > 20) confidence += 15;
    if (context.length > 0) confidence += 15;
    
    return Math.min(100, confidence);
  }
}

export const aiService = new AIService();