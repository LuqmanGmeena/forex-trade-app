import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Download,
  Filter,
  Search,
  Activity,
  DollarSign
} from 'lucide-react';

export const TradingManagement: React.FC = () => {
  const { allTrades, exportTradingData } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPrice = (price: number, symbol: string) => {
    const decimals = symbol.includes('JPY') ? 2 : 4;
    return price.toFixed(decimals);
  };

  const filteredTrades = allTrades.filter(trade => {
    const matchesFilter = filter === 'ALL' || trade.status === filter;
    const matchesSearch = trade.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.userId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const openTrades = allTrades.filter(t => t.status === 'OPEN');
  const closedTrades = allTrades.filter(t => t.status === 'CLOSED');
  const totalVolume = allTrades.reduce((sum, t) => sum + t.amount, 0);
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const profitableTrades = closedTrades.filter(t => t.pnl > 0).length;
  const winRate = closedTrades.length > 0 ? (profitableTrades / closedTrades.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Trading Management</h2>
        <button
          onClick={exportTradingData}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={16} />
          <span>Export Data</span>
        </button>
      </div>

      {/* Trading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">{allTrades.length}</p>
            </div>
            <BarChart3 className="text-blue-500" size={32} />
          </div>
          <div className="mt-2 text-sm text-blue-600">
            {openTrades.length} open, {closedTrades.length} closed
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalVolume)}</p>
            </div>
            <Activity className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalPnL)}
              </p>
            </div>
            <TrendingUp className={totalPnL >= 0 ? 'text-green-500' : 'text-red-500'} size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">{winRate.toFixed(1)}%</p>
            </div>
            <DollarSign className="text-purple-500" size={32} />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {profitableTrades} / {closedTrades.length} profitable
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Trades</option>
              <option value="OPEN">Open Trades</option>
              <option value="CLOSED">Closed Trades</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 flex-1">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by user, symbol, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trade ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Symbol</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Open Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Current/Close</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">P&L</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map(trade => (
                <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{trade.id.slice(-8)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{trade.userName}</div>
                      <div className="text-xs text-gray-500">{trade.userId.slice(-8)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">{trade.symbol}</td>
                  <td className="py-3 px-4">
                    <div className={`flex items-center ${
                      trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.type === 'BUY' ? (
                        <TrendingUp size={14} className="mr-1" />
                      ) : (
                        <TrendingDown size={14} className="mr-1" />
                      )}
                      {trade.type}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(trade.amount)}</td>
                  <td className="py-3 px-4 font-mono text-sm">
                    {formatPrice(trade.openPrice, trade.symbol)}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">
                    {trade.status === 'OPEN' 
                      ? formatPrice(trade.currentPrice, trade.symbol)
                      : formatPrice(trade.closePrice || trade.currentPrice, trade.symbol)
                    }
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(trade.pnl)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {trade.status === 'OPEN' ? (
                        <Clock className="text-blue-500" size={16} />
                      ) : trade.pnl >= 0 ? (
                        <TrendingUp className="text-green-500" size={16} />
                      ) : (
                        <TrendingDown className="text-red-500" size={16} />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.status === 'OPEN' 
                          ? 'text-blue-600 bg-blue-100'
                          : trade.pnl >= 0
                          ? 'text-green-600 bg-green-100'
                          : 'text-red-600 bg-red-100'
                      }`}>
                        {trade.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(trade.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTrades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No trades found
          </div>
        )}
      </div>
    </div>
  );
};