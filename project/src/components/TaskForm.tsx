import React, { useState, useEffect } from 'react';
import { Task, ContextEntry, AIAnalysis } from '../types';
import { aiService } from '../services/aiService';
import { dataService } from '../services/dataService';
import { X, Sparkles, Calendar, Tag, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  contextEntries: ContextEntry[];
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  contextEntries,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as Task['priority'],
    deadline: '',
    status: 'pending' as Task['status']
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const categories = dataService.getCategories();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        deadline: task.deadline,
        status: task.status
      });
    }
  }, [task]);

  const handleAiAnalysis = async () => {
    if (!formData.title.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const analysis = aiService.analyzeTask(formData, contextEntries);
      setAiAnalysis(analysis);
      setShowAiSuggestions(true);
      setIsAnalyzing(false);
    }, 1000);
  };

  const applyAiSuggestions = () => {
    if (!aiAnalysis) return;

    setFormData(prev => ({
      ...prev,
      category: aiAnalysis.suggestedCategory,
      deadline: aiAnalysis.recommendedDeadline,
      description: aiAnalysis.enhancedDescription,
      priority: aiAnalysis.priorityScore > 70 ? 'high' : 
                aiAnalysis.priorityScore > 40 ? 'medium' : 'low'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    const taskData: Task = {
      id: task?.id || Date.now().toString(),
      ...formData,
      priorityScore: aiAnalysis?.priorityScore || 50,
      createdAt: task?.createdAt || now,
      updatedAt: now,
      aiSuggestions: aiAnalysis?.relevantContext || [],
      contextRelevant: (aiAnalysis?.relevantContext?.length || 0) > 0
    };

    // Update category usage
    dataService.updateCategoryUsage(formData.category);
    
    onSave(taskData);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <button
              type="button"
              onClick={handleAiAnalysis}
              disabled={!formData.title.trim() || isAnalyzing}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'AI Analysis'}</span>
            </button>
            {aiAnalysis && (
              <span className="text-sm text-green-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Confidence: {aiAnalysis.confidence}%
              </span>
            )}
          </div>

          {showAiSuggestions && aiAnalysis && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-purple-800 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Suggestions
                </h3>
                <button
                  type="button"
                  onClick={applyAiSuggestions}
                  className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                >
                  Apply All
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-purple-700">{aiAnalysis.suggestedCategory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Priority Score:</span>
                  <span className={`font-semibold ${getPriorityColor(
                    aiAnalysis.priorityScore > 70 ? 'high' : 
                    aiAnalysis.priorityScore > 40 ? 'medium' : 'low'
                  )}`}>
                    {aiAnalysis.priorityScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Suggested Deadline:</span>
                  <span className="font-semibold text-purple-700">{aiAnalysis.recommendedDeadline}</span>
                </div>
                {aiAnalysis.relevantContext.length > 0 && (
                  <div>
                    <span>Relevant Context:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {aiAnalysis.relevantContext.map((context, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {context}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your task in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name} ({category.usageCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {task && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};