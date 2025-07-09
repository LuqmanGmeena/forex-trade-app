import React from 'react';
import { Trade } from '../types/trading';
import { Clock, TrendingUp, TrendingDown, X } from 'lucide-react';

interface TradeHistoryProps {
  trades: Trade[];
  onCloseTrade: (tradeId: string) => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades, onCloseTrade }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPrice = (price: number, symbol: string) => {
    const decimals = symbol.includes('JPY') ? 2 : 4;
    return price.toFixed(decimals);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const openTrades = trades.filter(trade => trade.status === 'OPEN');
  const closedTrades = trades.filter(trade => trade.status === 'CLOSED');

  return (
    <div className="bg-gray-900 rounded-lg p-4 md:p-6">
      <h2 className="text-white text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center">
        <Clock className="mr-2" size={20} />
        Trade History
      </h2>

      {/* Open Positions */}
      <div className="mb-6 md:mb-8">
        <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">Open Positions</h3>
        {openTrades.length === 0 ? (
          <div className="text-gray-400 text-center py-6 md:py-8">No open positions</div>
        ) : (
          <div className="space-y-3">
            {openTrades.map(trade => (
              <div key={trade.id} className="bg-gray-800 rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`flex items-center ${
                      trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.type === 'BUY' ? (
                        <TrendingUp size={14} className="mr-1" />
                      ) : (
                        <TrendingDown size={14} className="mr-1" />
                      )}
                      <span className="font-semibold text-sm">{trade.type}</span>
                    </div>
                    <span className="text-white font-medium text-sm">{trade.symbol}</span>
                    <span className="text-gray-400 text-sm">{formatCurrency(trade.amount)}</span>
                  </div>
                  <button
                    onClick={() => onCloseTrade(trade.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-400">Open:</span>
                    <div className="text-white">{formatPrice(trade.openPrice, trade.symbol)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Current:</span>
                    <div className="text-white">{formatPrice(trade.currentPrice, trade.symbol)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">P&L:</span>
                    <div className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(trade.pnl)}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-gray-400">Time:</span>
                    <div className="text-white text-xs">{formatDate(trade.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Closed Positions */}
      <div>
        <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">Closed Positions</h3>
        {closedTrades.length === 0 ? (
          <div className="text-gray-400 text-center py-6 md:py-8">No closed positions</div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {closedTrades.slice(-10).reverse().map(trade => (
              <div key={trade.id} className="bg-gray-800 rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className={`flex items-center ${
                      trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.type === 'BUY' ? (
                        <TrendingUp size={14} className="mr-1" />
                      ) : (
                        <TrendingDown size={14} className="mr-1" />
                      )}
                      <span className="font-semibold text-sm">{trade.type}</span>
                    </div>
                    <span className="text-white font-medium text-sm">{trade.symbol}</span>
                    <span className="text-gray-400 text-sm">{formatCurrency(trade.amount)}</span>
                  </div>
                  <div className={`font-bold text-sm ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(trade.pnl)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-400">Open:</span>
                    <div className="text-white">{formatPrice(trade.openPrice, trade.symbol)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Close:</span>
                    <div className="text-white">{formatPrice(trade.closePrice!, trade.symbol)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <div className="text-white">
                      {Math.round((trade.closeTimestamp! - trade.timestamp) / 1000 / 60)}m
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};