import React, { useState, useEffect } from 'react';
import { Task, ContextEntry, User } from './types';
import { Dashboard } from './components/Dashboard';
import { ContextHistory } from './components/ContextHistory';
import { LoginPage } from './components/LoginPage';
import { dataService } from './services/dataService';
import { authService } from './services/authService';
import { Calendar, Brain, Home, Database, LogOut, User as UserIcon } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'context'>('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Load data on app start
    const loadedTasks = dataService.getTasks();
    const loadedContext = dataService.getContextEntries();
    
    // Generate sample data if none exists
    if (loadedTasks.length === 0 && loadedContext.length === 0 && !isInitialized) {
      dataService.generateSampleData();
      setTasks(dataService.getTasks());
      setContextEntries(dataService.getContextEntries());
      setIsInitialized(true);
    } else {
      setTasks(loadedTasks);
      setContextEntries(loadedContext);
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setTasks([]);
    setContextEntries([]);
    setIsInitialized(false);
  };
  const handleSampleData = () => {
    dataService.generateSampleData();
    setTasks(dataService.getTasks());
    setContextEntries(dataService.getContextEntries());
  };

  const tabs = [
    { id: 'dashboard', label: 'Task Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'context', label: 'Context History', icon: <Brain className="w-4 h-4" /> }
  ];

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">Smart Todo AI</span>
              </div>
              
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSampleData}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>Load Sample Data</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <Dashboard
            tasks={tasks}
            contextEntries={contextEntries}
            onTaskUpdate={setTasks}
            onContextUpdate={setContextEntries}
          />
        ) : (
          <ContextHistory entries={contextEntries} />
        )}
      </main>
    </div>
  );
}

export default App;