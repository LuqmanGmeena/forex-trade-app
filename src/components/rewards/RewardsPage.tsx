import React, { useState } from 'react';
import { RewardsOverview } from './RewardsOverview';
import { TasksList } from './TasksList';
import { QuizSection } from './QuizSection';
import { AchievementsList } from './AchievementsList';
import { WithdrawalSection } from './WithdrawalSection';
import { Award, CheckCircle, BookOpen, Trophy, DollarSign } from 'lucide-react';

export const RewardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Award },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'quizzes', label: 'Quizzes', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'withdrawals', label: 'Withdrawals', icon: DollarSign }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <RewardsOverview />;
      case 'tasks': return <TasksList />;
      case 'quizzes': return <QuizSection />;
      case 'achievements': return <AchievementsList />;
      case 'withdrawals': return <WithdrawalSection />;
      default: return <RewardsOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        {/* Tab Navigation */}
        <div className="bg-gray-900 rounded-lg p-2 mb-6">
          {/* Desktop Tabs */}
          <div className="hidden md:flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};