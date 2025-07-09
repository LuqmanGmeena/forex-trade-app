import React from 'react';
import { CurrencyPair } from '../types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketOverviewProps {
  currencyPairs: CurrencyPair[];
  onSelectPair: (pair: CurrencyPair) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ currencyPairs, onSelectPair }) => {
  const formatPrice = (price: number, symbol: string) => {
    const decimals = symbol.includes('JPY') ? 2 : 4;
    return price.toFixed(decimals);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 md:p-6">
      <h2 className="text-white text-lg md:text-xl font-bold mb-4 md:mb-6">Market Overview</h2>
      
      <div className="space-y-3">
        {currencyPairs.map(pair => (
          <div
            key={pair.symbol}
            onClick={() => onSelectPair(pair)}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-3 md:p-4 cursor-pointer transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-semibold text-sm md:text-base">{pair.symbol}</span>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="text-gray-400 text-xs md:text-sm">
                      {formatPrice(pair.bid, pair.symbol)}
                    </span>
                    <span className="text-gray-400 text-xs">/</span>
                    <span className="text-gray-400 text-xs md:text-sm">
                      {formatPrice(pair.ask, pair.symbol)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs md:text-sm truncate">{pair.name}</span>
                  <div className={`flex items-center ${
                    pair.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pair.changePercent >= 0 ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    <span className="text-xs font-medium">
                      {pair.changePercent >= 0 ? '+' : ''}
                      {pair.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};