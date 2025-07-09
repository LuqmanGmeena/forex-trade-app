import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { DashboardOverview } from './DashboardOverview';
import { PaymentManagement } from './PaymentManagement';
import { UserManagement } from './UserManagement';
import { PlatformSettings } from './PlatformSettings';
import { Analytics } from './Analytics';
import { TradingManagement } from './TradingManagement';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Settings, 
  TrendingUp, 
  LogOut,
  Shield,
  Menu,
  X,
  Activity
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminUser } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trading', label: 'Trading', icon: Activity },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview />;
      case 'trading': return <TradingManagement />;
      case 'payments': return <PaymentManagement />;
      case 'users': return <UserManagement />;
      case 'analytics': return <Analytics />;
      case 'settings': return <PlatformSettings />;
      default: return <DashboardOverview />;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    window.location.reload();
  };

  const goBackToTrading = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Shield className="text-red-400" size={28} />
              <h1 className="text-xl font-bold hidden sm:block">Admin Portal</h1>
              <h1 className="text-lg font-bold sm:hidden">Admin</h1>
            </div>
            
            {/* Desktop User Info */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={goBackToTrading}
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                title="Back to Trading"
              >
                <BarChart3 size={16} />
                <span className="text-sm">Trading Platform</span>
              </button>

              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                <Shield size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">
                  {adminUser?.firstName} {adminUser?.lastName}
                </span>
                <span className="text-xs text-red-400 bg-red-900/30 px-2 py-1 rounded">
                  {adminUser?.role}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
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
                {/* User Info */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Shield size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {adminUser?.firstName} {adminUser?.lastName}
                      </span>
                    </div>
                    <span className="text-xs text-red-400 bg-red-900/30 px-2 py-1 rounded">
                      {adminUser?.role}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        goBackToTrading();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 text-blue-400 hover:bg-blue-900/20 py-2 rounded-md transition-colors"
                    >
                      <BarChart3 size={16} />
                      <span className="text-sm">Trading</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 text-red-400 hover:bg-red-900/20 py-2 rounded-md transition-colors"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* Tab Navigation */}
        <div className="bg-gray-900 rounded-lg p-2 mb-6">
          {/* Desktop Tabs */}
          <div className="hidden md:flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-red-500 focus:outline-none"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};