import React from 'react';
import { Account } from '../types/trading';
import { DollarSign, TrendingUp, Shield, Wallet } from 'lucide-react';

interface AccountInfoProps {
  account: Account;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ account }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMarginLevelColor = (level: number) => {
    if (level > 200) return 'text-green-400';
    if (level > 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 md:p-6">
      <h2 className="text-white text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center">
        <Wallet className="mr-2" size={20} />
        Account Information
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-gray-800 rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="text-blue-400 mr-2" size={14} />
              <span className="text-gray-300 text-sm">Balance</span>
            </div>
            <span className="text-white font-semibold text-sm md:text-base">
              {formatCurrency(account.balance)}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="text-green-400 mr-2" size={14} />
              <span className="text-gray-300 text-sm">Equity</span>
            </div>
            <span className={`font-semibold text-sm md:text-base ${
              account.equity >= account.balance ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(account.equity)}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-orange-400 mr-2" size={14} />
              <span className="text-gray-300 text-sm">Margin</span>
            </div>
            <span className="text-white font-semibold text-sm md:text-base">
              {formatCurrency(account.margin)}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="text-purple-400 mr-2" size={14} />
              <span className="text-gray-300 text-sm">Free Margin</span>
            </div>
            <span className="text-white font-semibold text-sm md:text-base">
              {formatCurrency(account.freeMargin)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-800 rounded-lg p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">Margin Level</span>
          <span className={`font-bold text-sm md:text-base ${getMarginLevelColor(account.marginLevel)}`}>
            {account.marginLevel.toFixed(2)}%
          </span>
        </div>
        <div className="bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              account.marginLevel > 200 ? 'bg-green-400' :
              account.marginLevel > 100 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${Math.min(100, (account.marginLevel / 300) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};