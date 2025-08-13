import { Task, ContextEntry, Category } from '../types';

class DataService {
  private readonly TASKS_KEY = 'smart-todo-tasks';
  private readonly CONTEXT_KEY = 'smart-todo-context';
  private readonly CATEGORIES_KEY = 'smart-todo-categories';

  // Default categories
  private defaultCategories: Category[] = [
    { id: '1', name: 'Work', color: 'bg-blue-500', usageCount: 0 },
    { id: '2', name: 'Personal', color: 'bg-green-500', usageCount: 0 },
    { id: '3', name: 'Health', color: 'bg-red-500', usageCount: 0 },
    { id: '4', name: 'Finance', color: 'bg-yellow-500', usageCount: 0 },
    { id: '5', name: 'Family', color: 'bg-purple-500', usageCount: 0 },
    { id: '6', name: 'General', color: 'bg-gray-500', usageCount: 0 }
  ];

  // Tasks
  getTasks(): Task[] {
    const stored = localStorage.getItem(this.TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  addTask(task: Task): Task[] {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
    return tasks;
  }

  updateTask(taskId: string, updates: Partial<Task>): Task[] {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveTasks(tasks);
    }
    return tasks;
  }

  deleteTask(taskId: string): Task[] {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
    return tasks;
  }

  // Context entries
  getContextEntries(): ContextEntry[] {
    const stored = localStorage.getItem(this.CONTEXT_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveContextEntries(entries: ContextEntry[]): void {
    localStorage.setItem(this.CONTEXT_KEY, JSON.stringify(entries));
  }

  addContextEntry(entry: ContextEntry): ContextEntry[] {
    const entries = this.getContextEntries();
    entries.push(entry);
    this.saveContextEntries(entries);
    return entries;
  }

  // Categories
  getCategories(): Category[] {
    const stored = localStorage.getItem(this.CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : this.defaultCategories;
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  updateCategoryUsage(categoryName: string): void {
    const categories = this.getCategories();
    const category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (category) {
      category.usageCount += 1;
      this.saveCategories(categories);
    }
  }

  // Generate sample data for testing
  generateSampleData(): void {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Prepare project presentation',
        description: 'Create slides for the quarterly review meeting',
        category: 'Work',
        priority: 'high',
        priorityScore: 85,
        deadline: '2025-01-20',
        status: 'in-progress',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
        aiSuggestions: ['Schedule practice session', 'Prepare backup slides'],
        contextRelevant: true
      },
      {
        id: '2',
        title: 'Buy groceries',
        description: 'Weekly grocery shopping for the family',
        category: 'Personal',
        priority: 'medium',
        priorityScore: 45,
        deadline: '2025-01-18',
        status: 'pending',
        createdAt: '2025-01-15T11:00:00Z',
        updatedAt: '2025-01-15T11:00:00Z',
        aiSuggestions: ['Create shopping list', 'Check store hours']
      },
      {
        id: '3',
        title: 'Doctor appointment',
        description: 'Annual health checkup with Dr. Smith',
        category: 'Health',
        priority: 'high',
        priorityScore: 75,
        deadline: '2025-01-22',
        status: 'pending',
        createdAt: '2025-01-15T12:00:00Z',
        updatedAt: '2025-01-15T12:00:00Z',
        aiSuggestions: ['Prepare medical history', 'Bring insurance card']
      }
    ];

    const sampleContext: ContextEntry[] = [
      {
        id: '1',
        content: 'Meeting with client tomorrow at 2 PM to discuss project requirements',
        sourceType: 'email',
        timestamp: '2025-01-15T09:00:00Z',
        processedInsights: ['Time-sensitive task detected', 'Requires coordination with others'],
        keywords: ['meeting', 'client', 'project', 'requirements'],
        sentiment: 'neutral'
      },
      {
        id: '2',
        content: 'Urgent: Need to submit quarterly report by Friday',
        sourceType: 'whatsapp',
        timestamp: '2025-01-15T14:00:00Z',
        processedInsights: ['High priority item', 'Time-sensitive task detected'],
        keywords: ['urgent', 'submit', 'quarterly', 'report'],
        sentiment: 'negative'
      },
      {
        id: '3',
        content: 'Remember to pick up dry cleaning and stop by pharmacy',
        sourceType: 'notes',
        timestamp: '2025-01-15T16:00:00Z',
        processedInsights: ['Multiple errands to combine'],
        keywords: ['remember', 'cleaning', 'pharmacy'],
        sentiment: 'neutral'
      }
    ];

    this.saveTasks(sampleTasks);
    this.saveContextEntries(sampleContext);
  }
}

export const dataService = new DataService();