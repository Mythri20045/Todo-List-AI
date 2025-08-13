import React, { useState, useMemo } from 'react';
import { Task, ContextEntry } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { ContextForm } from './ContextForm';
import { Plus, Filter, Search, BarChart3, Calendar, MessageSquare } from 'lucide-react';
import { dataService } from '../services/dataService';

interface DashboardProps {
  tasks: Task[];
  contextEntries: ContextEntry[];
  onTaskUpdate: (tasks: Task[]) => void;
  onContextUpdate: (entries: ContextEntry[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  contextEntries,
  onTaskUpdate,
  onContextUpdate
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showContextForm, setShowContextForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const categories = dataService.getCategories();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    }).sort((a, b) => {
      // Sort by priority score (higher first), then by deadline
      if (a.priorityScore !== b.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [tasks, searchTerm, filterStatus, filterCategory, filterPriority]);

  const handleTaskSave = (task: Task) => {
    let updatedTasks;
    if (editingTask) {
      updatedTasks = dataService.updateTask(task.id, task);
    } else {
      updatedTasks = dataService.addTask(task);
    }
    
    onTaskUpdate(updatedTasks);
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    const updatedTasks = dataService.updateTask(taskId, { status });
    onTaskUpdate(updatedTasks);
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = dataService.deleteTask(taskId);
    onTaskUpdate(updatedTasks);
  };

  const handleContextSave = (entry: ContextEntry) => {
    const updatedEntries = dataService.addContextEntry(entry);
    onContextUpdate(updatedEntries);
    setShowContextForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => 
      new Date(t.deadline) < new Date() && t.status !== 'completed'
    ).length;

    return { total, completed, inProgress, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Smart Todo AI</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowContextForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Add Context</span>
              </button>
              
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-red-600">{stats.overdue}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first task to get started'
                }
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                onEdit={handleEditTask}
                onDelete={handleTaskDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Forms */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          contextEntries={contextEntries}
          onSave={handleTaskSave}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(undefined);
          }}
        />
      )}

      {showContextForm && (
        <ContextForm
          onSave={handleContextSave}
          onCancel={() => setShowContextForm(false)}
        />
      )}
    </div>
  );
};