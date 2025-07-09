import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Settings, Save, AlertTriangle } from 'lucide-react';

export const PlatformSettings: React.FC = () => {
  const { adminSettings, updateAdminSettings } = useAdmin();
  const [settings, setSettings] = useState(adminSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateAdminSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            saved 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Save size={16} />
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Settings */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="mr-2" size={20} />
            Withdrawal Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Withdrawal Amount ($)
              </label>
              <input
                type="number"
                value={settings.minWithdrawal}
                onChange={(e) => handleChange('minWithdrawal', Number(e.target.value))}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Withdrawal Amount ($)
              </label>
              <input
                type="number"
                value={settings.maxWithdrawal}
                onChange={(e) => handleChange('maxWithdrawal', Number(e.target.value))}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Fee (%)
              </label>
              <input
                type="number"
                value={settings.withdrawalFee}
                onChange={(e) => handleChange('withdrawalFee', Number(e.target.value))}
                min="0"
                max="100"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Reward Multipliers */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reward Multipliers</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Reward Multiplier
              </label>
              <input
                type="number"
                value={settings.taskRewardMultiplier}
                onChange={(e) => handleChange('taskRewardMultiplier', Number(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Reward Multiplier
              </label>
              <input
                type="number"
                value={settings.quizRewardMultiplier}
                onChange={(e) => handleChange('quizRewardMultiplier', Number(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Reward Multiplier
              </label>
              <input
                type="number"
                value={settings.achievementRewardMultiplier}
                onChange={(e) => handleChange('achievementRewardMultiplier', Number(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Platform Controls */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Controls</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                <p className="text-xs text-gray-500">Disable platform access for maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Registration Enabled</label>
                <p className="text-xs text-gray-500">Allow new user registrations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={(e) => handleChange('registrationEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-yellow-600 mt-1" size={20} />
            <div>
              <h4 className="text-yellow-800 font-medium mb-2">Important Notice</h4>
              <p className="text-yellow-700 text-sm">
                Changes to reward multipliers will affect all future earnings. 
                Existing user balances will not be modified. Use maintenance mode 
                when making significant changes to prevent user confusion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};