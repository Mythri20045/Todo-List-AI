import React, { useState } from 'react';
import { ContextEntry } from '../types';
import { X, MessageSquare, Mail, FileText, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';

interface ContextFormProps {
  onSave: (entry: ContextEntry) => void;
  onCancel: () => void;
}

export const ContextForm: React.FC<ContextFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    content: '',
    sourceType: 'notes' as ContextEntry['sourceType']
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const entry: ContextEntry = {
        id: Date.now().toString(),
        content: formData.content,
        sourceType: formData.sourceType,
        timestamp: new Date().toISOString(),
        processedInsights: [],
        keywords: [],
        sentiment: 'neutral'
      };

      // Process with AI
      const processed = aiService.processContext([entry])[0];
      onSave(processed);
      setIsProcessing(false);
    }, 500);
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp': return <MessageSquare className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'notes': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Daily Context
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
              Source Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
                { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
                { value: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> }
              ].map((source) => (
                <button
                  key={source.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, sourceType: source.value as ContextEntry['sourceType'] })}
                  className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-all ${
                    formData.sourceType === source.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {source.icon}
                  <span>{source.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter your ${formData.sourceType} content here...`}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">AI Processing</span>
            </div>
            <p className="text-sm text-blue-700">
              Our AI will analyze this content to extract insights, keywords, and sentiment to help improve your task management.
            </p>
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
              disabled={isProcessing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing && <Sparkles className="w-4 h-4 animate-spin" />}
              <span>{isProcessing ? 'Processing...' : 'Add Context'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};