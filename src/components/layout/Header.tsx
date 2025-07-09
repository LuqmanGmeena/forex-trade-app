import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRewards } from '../../contexts/RewardsContext';
import { SyncStatus } from '../common/SyncStatus';
import { Activity, LogOut, User, Award, DollarSign, Menu, X, Shield, Settings } from 'lucide-react';

interface HeaderProps {
  onViewChange?: (view: 'trading' | 'rewards') => void;
  currentView?: 'trading' | 'rewards';
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, currentView = 'trading' }) => {
  const { user, logout } = useAuth();
  const { userRewards } = useRewards();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const goToAdmin = () => {
    window.location.href = '/admin';
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
              <img 
                src="/FX Signal Strategy.png" 
                alt="FX Signal Strategy" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold hidden sm:block">FX Signal Strategy</h1>
              <h1 className="text-lg font-bold sm:hidden">FX Signal</h1>
              <div className="text-xs text-green-400 hidden sm:block">Professional Trading Platform</div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Navigation Tabs */}
            {onViewChange && (
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => onViewChange('trading')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentView === 'trading'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Trading
                </button>
                <button
                  onClick={() => onViewChange('rewards')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentView === 'rewards'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Rewards
                </button>
              </div>
            )}

            {/* Rewards Balance */}
            <div className="flex items-center space-x-4 bg-gray-800 rounded-lg px-3 py-2">
              <div className="flex items-center text-green-400">
                <DollarSign size={16} className="mr-1" />
                <span className="text-sm font-medium">
                  {formatCurrency(userRewards.availableBalance)}
                </span>
              </div>
              <div className="flex items-center text-orange-400">
                <Award size={16} className="mr-1" />
                <span className="text-sm">{userRewards.dailyStreak}d</span>
              </div>
            </div>

            {/* Live Market Indicator */}
            <div className="flex items-center text-green-400">
              <Activity size={16} className="mr-1" />
              <span className="text-sm">Live</span>
            </div>
            
            {/* Sync Status */}
            <SyncStatus />
            
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                {/* Enhanced Admin Access Button */}
                <button
                  onClick={goToAdmin}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  title="Access Admin Dashboard"
                >
                  <Shield size={16} />
                  <span className="text-sm font-medium">Admin Panel</span>
                  <Settings size={14} className="animate-pulse" />
                </button>
                
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            <div className="space-y-4">
              {/* Navigation Tabs */}
              {onViewChange && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onViewChange('trading');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                      currentView === 'trading'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Trading
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('rewards');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                      currentView === 'rewards'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Rewards
                  </button>
                </div>
              )}

              {/* Rewards Balance */}
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-green-400">
                    <DollarSign size={16} className="mr-1" />
                    <span className="text-sm font-medium">Balance</span>
                  </div>
                  <span className="text-green-400 font-bold">
                    {formatCurrency(userRewards.availableBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-orange-400">
                    <Award size={16} className="mr-1" />
                    <span className="text-sm">Daily Streak</span>
                  </div>
                  <span className="text-orange-400 font-bold">{userRewards.dailyStreak} days</span>
                </div>
              </div>

              {/* Live Market */}
              <div className="flex items-center justify-center text-green-400 bg-gray-800 rounded-lg p-3">
                <Activity size={16} className="mr-2" />
                <span className="text-sm font-medium">Live Market Active</span>
              </div>
              
              {/* Sync Status */}
              <div className="bg-gray-800 rounded-lg p-3">
                <SyncStatus />
              </div>

              {/* User Info */}
              {user && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* Enhanced Mobile Admin Button */}
                    <button
                      onClick={() => {
                        goToAdmin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg transition-all duration-200 font-medium shadow-lg"
                    >
                      <Shield size={16} />
                      <span className="text-sm">Admin Dashboard</span>
                      <Settings size={14} className="animate-pulse" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 text-red-400 hover:bg-red-900/20 py-2 rounded-md transition-colors"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};