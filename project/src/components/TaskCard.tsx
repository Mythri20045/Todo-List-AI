import React from 'react';
import { Task } from '../types';
import { Calendar, Clock, AlertCircle, CheckCircle2, Play, Tag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onStatusChange, 
  onEdit, 
  onDelete 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-orange-500 bg-orange-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Play className="w-5 h-5 text-blue-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && task.status !== 'completed';
  };

  return (
    <div className={`border-l-4 ${getPriorityColor(task.priority)} bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon(task.status)}
          <h3 className={`font-semibold text-gray-800 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.priority} ({task.priorityScore})
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Tag className="w-4 h-4" />
            <span>{task.category}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className={isOverdue(task.deadline) ? 'text-red-600 font-semibold' : ''}>
              {formatDate(task.deadline)}
            </span>
            {isOverdue(task.deadline) && <AlertCircle className="w-4 h-4 text-red-600" />}
          </div>
        </div>
      </div>

      {task.aiSuggestions && task.aiSuggestions.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-blue-600 font-semibold mb-1">🤖 AI Suggestions:</div>
          <div className="flex flex-wrap gap-1">
            {task.aiSuggestions.slice(0, 2).map((suggestion, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};