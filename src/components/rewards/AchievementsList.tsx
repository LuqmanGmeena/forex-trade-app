import React from 'react';
import { useRewards } from '../../contexts/RewardsContext';
import { Trophy, Target, DollarSign, Calendar, CheckCircle, Award, Lock } from 'lucide-react';

export const AchievementsList: React.FC = () => {
  const { achievements } = useRewards();

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const iconProps = {
      size: 24,
      className: isUnlocked ? 'text-yellow-400' : 'text-gray-500'
    };

    switch (iconName) {
      case 'Trophy': return <Trophy {...iconProps} />;
      case 'Target': return <Target {...iconProps} />;
      case 'DollarSign': return <DollarSign {...iconProps} />;
      case 'Calendar': return <Calendar {...iconProps} />;
      case 'CheckCircle': return <CheckCircle {...iconProps} />;
      case 'Award': return <Award {...iconProps} />;
      default: return <Trophy {...iconProps} />;
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

  const getRequirementText = (requirement: any) => {
    switch (requirement.type) {
      case 'TRADES_COUNT':
        return `Complete ${requirement.value} trades`;
      case 'PROFIT_AMOUNT':
        return `Earn ${formatCurrency(requirement.value)} in profits`;
      case 'DAYS_ACTIVE':
        return `Stay active for ${requirement.value} days`;
      case 'TASKS_COMPLETED':
        return `Complete ${requirement.value} tasks`;
      case 'QUIZ_SCORE':
        return `Score ${requirement.value}% on a quiz`;
      default:
        return 'Complete requirement';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center">
        <Trophy className="mr-2" size={20} />
        Achievements
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`bg-gray-800 rounded-lg p-4 border-2 transition-all duration-300 ${
              achievement.isUnlocked 
                ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/20' 
                : 'border-gray-700'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${
                achievement.isUnlocked ? 'bg-yellow-400/20' : 'bg-gray-700'
              }`}>
                {achievement.isUnlocked ? (
                  getAchievementIcon(achievement.icon, true)
                ) : (
                  <Lock className="text-gray-500" size={24} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${
                    achievement.isUnlocked ? 'text-yellow-400' : 'text-gray-300'
                  }`}>
                    {achievement.title}
                  </h3>
                  <div className="flex items-center text-green-400 text-sm font-bold">
                    <DollarSign size={14} className="mr-1" />
                    {formatCurrency(achievement.reward)}
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">
                  {achievement.description}
                </p>
                
                <div className="text-xs text-gray-500">
                  {getRequirementText(achievement.requirement)}
                </div>
                
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="mt-2 text-xs text-yellow-400">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};