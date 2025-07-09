import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { userStats, paymentStats, allWithdrawals, allUsers } = useAdmin();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate analytics
  const completedWithdrawals = allWithdrawals.filter(w => w.status === 'COMPLETED');
  const rejectedWithdrawals = allWithdrawals.filter(w => w.status === 'REJECTED');
  const conversionRate = allUsers.length > 0 ? (completedWithdrawals.length / allUsers.length) * 100 : 0;
  
  const totalEarningsDistribution = allUsers.reduce((acc, user) => {
    if (user.totalEarned === 0) acc.zero++;
    else if (user.totalEarned < 50) acc.low++;
    else if (user.totalEarned < 200) acc.medium++;
    else acc.high++;
    return acc;
  }, { zero: 0, low: 0, medium: 0, high: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Users who withdrew money
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg. Earnings per User</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(userStats.totalRewardsEarned / Math.max(userStats.totalUsers, 1))}
              </p>
            </div>
            <DollarSign className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {allWithdrawals.length > 0 ? 
                  ((completedWithdrawals.length / allWithdrawals.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <Activity className="text-purple-500" size={32} />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Successful withdrawals
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Earners</p>
              <p className="text-2xl font-bold text-gray-900">
                {allUsers.filter(u => u.totalEarned > 0).length}
              </p>
            </div>
            <Users className="text-orange-500" size={32} />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Users with earnings
          </div>
        </div>
      </div>

      {/* Charts and Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Distribution</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">No Earnings</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full" 
                    style={{ width: `${(totalEarningsDistribution.zero / allUsers.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{totalEarningsDistribution.zero}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">$1 - $49</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(totalEarningsDistribution.low / allUsers.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{totalEarningsDistribution.low}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">$50 - $199</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(totalEarningsDistribution.medium / allUsers.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{totalEarningsDistribution.medium}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">$200+</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(totalEarningsDistribution.high / allUsers.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{totalEarningsDistribution.high}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Status */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-semibold">
                  {formatCurrency(paymentStats.totalPaid)}
                </span>
                <span className="text-sm text-gray-500">
                  ({completedWithdrawals.length})
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <div className="flex items-center space-x-2">
                <span className="text-orange-600 font-semibold">
                  {formatCurrency(paymentStats.pendingAmount)}
                </span>
                <span className="text-sm text-gray-500">
                  ({allWithdrawals.filter(w => w.status === 'PENDING').length})
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rejected</span>
              <div className="flex items-center space-x-2">
                <span className="text-red-600 font-semibold">
                  {formatCurrency(paymentStats.rejectedAmount)}
                </span>
                <span className="text-sm text-gray-500">
                  ({rejectedWithdrawals.length})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Rank</th>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Total Earned</th>
                <th className="text-left py-2">Available Balance</th>
                <th className="text-left py-2">Pending Withdrawal</th>
              </tr>
            </thead>
            <tbody>
              {paymentStats.topEarners.slice(0, 10).map((earner, index) => (
                <tr key={earner.userId} className="border-b border-gray-100">
                  <td className="py-2 font-semibold">#{index + 1}</td>
                  <td className="py-2">{earner.userName}</td>
                  <td className="py-2 font-semibold text-green-600">
                    {formatCurrency(earner.totalEarned)}
                  </td>
                  <td className="py-2 font-semibold text-blue-600">
                    {formatCurrency(earner.availableBalance)}
                  </td>
                  <td className="py-2 font-semibold text-orange-600">
                    {formatCurrency(earner.pendingWithdrawal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};