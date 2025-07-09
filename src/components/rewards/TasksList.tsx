import React from 'react';
import { useRewards } from '../../contexts/RewardsContext';
import { CheckCircle, Clock, DollarSign, Target, Users, BookOpen } from 'lucide-react';

export const TasksList: React.FC = () => {
  const { tasks, completeTask, userRewards } = useRewards();

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'TRADING': return <Target className="text-blue-400" size={16} />;
      case 'EDUCATIONAL': return <BookOpen className="text-green-400" size={16} />;
      case 'ENGAGEMENT': return <Clock className="text-orange-400" size={16} />;
      case 'REFERRAL': return <Users className="text-purple-400" size={16} />;
      default: return <Target className="text-gray-400" size={16} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center">
        <CheckCircle className="mr-2" size={20} />
        Available Tasks
      </h2>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
              task.isCompleted 
                ? 'border-green-400 opacity-75' 
                : 'border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {getTaskIcon(task.type)}
                <div>
                  <h3 className="text-white font-semibold">{task.title}</h3>
                  <p className="text-gray-400 text-sm">{task.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-400 font-bold">
                  <DollarSign size={16} className="mr-1" />
                  {formatCurrency(task.reward)}
                </div>
                {task.isDaily && (
                  <span className="text-xs text-orange-400">Daily</span>
                )}
              </div>
            </div>
            
            {task.isCompleted ? (
              <div className="flex items-center text-green-400 text-sm">
                <CheckCircle size={16} className="mr-1" />
                Completed
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                {task.requirements.trades && `Complete ${task.requirements.trades} trades`}
                {task.requirements.profit && `Earn $${task.requirements.profit} profit`}
                {task.requirements.daysActive && `Stay active for ${task.requirements.daysActive} days`}
                {task.requirements.referrals && `Refer ${task.requirements.referrals} friends`}
                {Object.keys(task.requirements).length === 0 && 'Click to complete'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};