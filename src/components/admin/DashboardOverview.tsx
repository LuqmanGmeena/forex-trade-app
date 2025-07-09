import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  BarChart3,
  Activity
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { userStats, paymentStats, allWithdrawals, allTrades } = useAdmin();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pendingWithdrawals = allWithdrawals.filter(w => w.status === 'PENDING');
  const recentWithdrawals = allWithdrawals.slice(0, 10);
  const recentTrades = allTrades.slice(0, 10);
  
  // Calculate trading stats
  const openTrades = allTrades.filter(t => t.status === 'OPEN');
  const closedTrades = allTrades.filter(t => t.status === 'CLOSED');
  const totalVolume = allTrades.reduce((sum, t) => sum + t.amount, 0);
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
          <div className="mt-2 text-sm text-green-600">
            +{userStats.newUsersToday} today
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Trades</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{userStats.totalTrades}</p>
            </div>
            <BarChart3 className="text-green-500" size={24} />
          </div>
          <div className="mt-2 text-sm text-blue-600">
            {openTrades.length} open positions
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Volume</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatCurrency(totalVolume)}
              </p>
            </div>
            <Activity className="text-purple-500" size={24} />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Trading volume
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total P&L</p>
              <p className={`text-xl md:text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalPnL)}
              </p>
            </div>
            <TrendingUp className={totalPnL >= 0 ? 'text-green-500' : 'text-red-500'} size={24} />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Platform P&L
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Rewards</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatCurrency(userStats.totalRewardsEarned)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Paid</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatCurrency(paymentStats.totalPaid)}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{pendingWithdrawals.length}</p>
            </div>
            <Clock className="text-orange-500" size={24} />
          </div>
          <div className="mt-2 text-sm text-orange-600">
            {formatCurrency(paymentStats.pendingAmount)}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Traders</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{userStats.activeUsers}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trades</h3>
          {recentTrades.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No trades yet</div>
          ) : (
            <div className="space-y-3">
              {recentTrades.map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      trade.status === 'OPEN' ? 'bg-blue-500' : 
                      trade.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{trade.userName}</div>
                      <div className="text-xs text-gray-500">
                        {trade.type} {trade.symbol} - {formatCurrency(trade.amount)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      trade.status === 'OPEN' ? 'text-blue-600' :
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.status === 'OPEN' ? 'OPEN' : formatCurrency(trade.pnl)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Withdrawals */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Withdrawal Requests</h3>
          {recentWithdrawals.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No withdrawal requests yet</div>
          ) : (
            <div className="space-y-3">
              {recentWithdrawals.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {request.status === 'PENDING' && <Clock className="text-orange-500" size={16} />}
                    {request.status === 'COMPLETED' && <CheckCircle className="text-green-500" size={16} />}
                    {request.status === 'REJECTED' && <XCircle className="text-red-500" size={16} />}
                    {request.status === 'APPROVED' && <AlertTriangle className="text-blue-500" size={16} />}
                    <div>
                      <div className="font-medium text-sm">{formatCurrency(request.amount)}</div>
                      <div className="text-xs text-gray-500">
                        {request.method.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      request.status === 'COMPLETED' ? 'text-green-600' :
                      request.status === 'APPROVED' ? 'text-blue-600' :
                      request.status === 'REJECTED' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {request.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
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