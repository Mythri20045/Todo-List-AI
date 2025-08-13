import React from 'react';
import { ContextEntry } from '../types';
import { MessageSquare, Mail, FileText, Calendar, Brain, TrendingUp } from 'lucide-react';

interface ContextHistoryProps {
  entries: ContextEntry[];
}

export const ContextHistory: React.FC<ContextHistoryProps> = ({ entries }) => {
  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'whatsapp': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'email': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'notes': return <FileText className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No context data yet</h3>
        <p className="text-gray-500">
          Add your daily context (messages, emails, notes) to help AI understand your priorities better.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">Context History</h2>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
            {entries.length} entries
          </span>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getSourceIcon(entry.sourceType)}
                  <div>
                    <span className="font-semibold text-gray-800 capitalize">
                      {entry.sourceType}
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {entry.sentiment && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(entry.sentiment)}`}>
                    {entry.sentiment}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-3 line-clamp-3">
                {entry.content}
              </p>

              {entry.keywords && entry.keywords.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Keywords:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.keywords.map((keyword, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entry.processedInsights && entry.processedInsights.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">AI Insights:</span>
                  </div>
                  <div className="space-y-1">
                    {entry.processedInsights.map((insight, index) => (
                      <div key={index} className="bg-purple-50 text-purple-800 px-3 py-2 rounded-lg text-sm">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};