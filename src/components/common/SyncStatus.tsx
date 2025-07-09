import React from 'react';
import { useFirebaseSync } from '../../hooks/useFirebase';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const SyncStatus: React.FC = () => {
  const { isOnline, syncStatus, syncUserData } = useFirebaseSync();

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="animate-spin" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={16} />;
      default:
        return <CheckCircle className="text-green-400" size={16} />;
    }
  };

  const getSyncText = () => {
    if (!isOnline) return 'Offline';
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Error';
      default:
        return 'Synced';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {/* Online/Offline Status */}
      <div className="flex items-center space-x-1">
        {isOnline ? (
          <Wifi className="text-green-400" size={16} />
        ) : (
          <WifiOff className="text-red-400" size={16} />
        )}
        <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Sync Status */}
      {isOnline && (
        <>
          <span className="text-gray-400">•</span>
          <button
            onClick={syncUserData}
            disabled={syncStatus === 'syncing'}
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors disabled:cursor-not-allowed"
          >
            {getSyncIcon()}
            <span>{getSyncText()}</span>
          </button>
        </>
      )}
    </div>
  );
};