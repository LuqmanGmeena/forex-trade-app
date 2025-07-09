import React, { useState } from 'react';
import { CurrencyPair, Trade } from '../types/trading';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TradingPanelProps {
  currencyPairs: CurrencyPair[];
  onExecuteTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'pnl' | 'status' | 'currentPrice'>) => void;
}

export const TradingPanel: React.FC<TradingPanelProps> = ({ currencyPairs, onExecuteTrade }) => {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(
    currencyPairs.length > 0 ? currencyPairs[0] : null
  );
  const [amount, setAmount] = useState<number>(1000);

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (!selectedPair) return;

    const openPrice = type === 'BUY' ? selectedPair.ask : selectedPair.bid;
    
    onExecuteTrade({
      symbol: selectedPair.symbol,
      type,
      amount,
      openPrice,
    });
  };

  const formatPrice = (price: number, symbol: string) => {
    const decimals = symbol.includes('JPY') ? 2 : 4;
    return price.toFixed(decimals);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 md:p-6">
      <h2 className="text-white text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center">
        <DollarSign className="mr-2" size={20} />
        Trading Panel
      </h2>

      {/* Currency Pair Selection */}
      <div className="mb-4 md:mb-6">
        <label className="text-gray-300 text-sm font-medium mb-2 block">
          Currency Pair
        </label>
        <select
          value={selectedPair?.symbol || ''}
          onChange={(e) => {
            const pair = currencyPairs.find(p => p.symbol === e.target.value);
            setSelectedPair(pair || null);
          }}
          className="w-full bg-gray-800 text-white rounded-lg px-3 md:px-4 py-2 md:py-3 border border-gray-700 focus:border-blue-500 focus:outline-none text-sm md:text-base"
        >
          {currencyPairs.map(pair => (
            <option key={pair.symbol} value={pair.symbol}>
              {pair.symbol} - {pair.name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Prices */}
      {selectedPair && (
        <div className="mb-4 md:mb-6 bg-gray-800 rounded-lg p-3 md:p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-1">Bid</div>
              <div className="text-red-400 font-mono text-base md:text-lg font-bold">
                {formatPrice(selectedPair.bid, selectedPair.symbol)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-1">Ask</div>
              <div className="text-green-400 font-mono text-base md:text-lg font-bold">
                {formatPrice(selectedPair.ask, selectedPair.symbol)}
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className={`text-sm ${
              selectedPair.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedPair.changePercent >= 0 ? '+' : ''}
              {selectedPair.changePercent.toFixed(4)}%
            </span>
          </div>
        </div>
      )}

      {/* Trade Amount */}
      <div className="mb-4 md:mb-6">
        <label className="text-gray-300 text-sm font-medium mb-2 block">
          Trade Amount (USD)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="100"
          max="100000"
          step="100"
          className="w-full bg-gray-800 text-white rounded-lg px-3 md:px-4 py-2 md:py-3 border border-gray-700 focus:border-blue-500 focus:outline-none text-sm md:text-base"
        />
      </div>

      {/* Trade Buttons */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={() => handleTrade('BUY')}
          disabled={!selectedPair}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm md:text-base"
        >
          <TrendingUp className="mr-2" size={16} />
          BUY
        </button>
        <button
          onClick={() => handleTrade('SELL')}
          disabled={!selectedPair}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm md:text-base"
        >
          <TrendingDown className="mr-2" size={16} />
          SELL
        </button>
      </div>
    </div>
  );
};