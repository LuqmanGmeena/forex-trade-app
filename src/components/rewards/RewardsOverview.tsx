import React from 'react';
import { useRewards } from '../../contexts/RewardsContext';
import { DollarSign, TrendingUp, Award, Calendar, Users } from 'lucide-react';

export const RewardsOverview: React.FC = () => {
  const { userRewards } = useRewards();

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
        <Award className="mr-2" size={20} />
        Rewards Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="text-green-400 mr-2" size={16} />
              <span className="text-gray-300 text-sm">Total Earnings</span>
            </div>
            <span className="text-green-400 font-bold">
              {formatCurrency(userRewards.totalEarnings)}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="text-blue-400 mr-2" size={16} />
              <span className="text-gray-300 text-sm">Available Balance</span>
            </div>
            <span className="text-blue-400 font-bold">
              {formatCurrency(userRewards.availableBalance)}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="text-orange-400 mr-2" size={16} />
              <span className="text-gray-300 text-sm">Daily Streak</span>
            </div>
            <span className="text-orange-400 font-bold">
              {userRewards.dailyStreak} days
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="text-purple-400 mr-2" size={16} />
              <span className="text-gray-300 text-sm">Referrals</span>
            </div>
            <span className="text-purple-400 font-bold">
              {userRewards.referredUsers.length}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">Referral Code</span>
          <button
            onClick={() => navigator.clipboard.writeText(userRewards.referralCode)}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="bg-gray-700 rounded px-3 py-2 font-mono text-white text-center">
          {userRewards.referralCode}
        </div>
      </div>
    </div>
  );
};