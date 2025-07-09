import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Filter,
  Search,
  Eye,
  CreditCard,
  Banknote,
  Bitcoin
} from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const { allWithdrawals, updateWithdrawalStatus, exportPaymentData } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [viewDetails, setViewDetails] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredWithdrawals = allWithdrawals.filter(withdrawal => {
    const matchesFilter = filter === 'ALL' || withdrawal.status === filter;
    const matchesSearch = withdrawal.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = (withdrawalId: string, newStatus: string) => {
    updateWithdrawalStatus(withdrawalId, newStatus, notes);
    setSelectedWithdrawal(null);
    setNotes('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="text-orange-500" size={16} />;
      case 'APPROVED': return <AlertTriangle className="text-blue-500" size={16} />;
      case 'COMPLETED': return <CheckCircle className="text-green-500" size={16} />;
      case 'REJECTED': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-600 bg-orange-100';
      case 'APPROVED': return 'text-blue-600 bg-blue-100';
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'PAYPAL': return <CreditCard className="text-blue-500" size={16} />;
      case 'BANK_TRANSFER': return <Banknote className="text-green-500" size={16} />;
      case 'CRYPTO': return <Bitcoin className="text-orange-500" size={16} />;
      default: return <DollarSign className="text-gray-500" size={16} />;
    }
  };

  const getWithdrawalDetails = (withdrawal: any) => {
    const details = withdrawal.details || {};
    switch (withdrawal.method) {
      case 'PAYPAL':
        return details.email || 'No email provided';
      case 'BANK_TRANSFER':
        return details.bankAccount || 'No bank details provided';
      case 'CRYPTO':
        return details.cryptoAddress || 'No wallet address provided';
      default:
        return 'No details available';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Payment Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">💰 Payment Management Center</h2>
          <button
            onClick={exportPaymentData}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={16} />
            <span>Export Data</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-orange-300" size={20} />
              <span className="text-sm">Pending</span>
            </div>
            <div className="text-2xl font-bold">
              {allWithdrawals.filter(w => w.status === 'PENDING').length}
            </div>
            <div className="text-sm opacity-80">
              {formatCurrency(allWithdrawals.filter(w => w.status === 'PENDING').reduce((sum, w) => sum + w.amount, 0))}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-blue-300" size={20} />
              <span className="text-sm">Approved</span>
            </div>
            <div className="text-2xl font-bold">
              {allWithdrawals.filter(w => w.status === 'APPROVED').length}
            </div>
            <div className="text-sm opacity-80">
              {formatCurrency(allWithdrawals.filter(w => w.status === 'APPROVED').reduce((sum, w) => sum + w.amount, 0))}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="text-green-300" size={20} />
              <span className="text-sm">Completed</span>
            </div>
            <div className="text-2xl font-bold">
              {allWithdrawals.filter(w => w.status === 'COMPLETED').length}
            </div>
            <div className="text-sm opacity-80">
              {formatCurrency(allWithdrawals.filter(w => w.status === 'COMPLETED').reduce((sum, w) => sum + w.amount, 0))}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <XCircle className="text-red-300" size={20} />
              <span className="text-sm">Rejected</span>
            </div>
            <div className="text-2xl font-bold">
              {allWithdrawals.filter(w => w.status === 'REJECTED').length}
            </div>
            <div className="text-sm opacity-80">
              {formatCurrency(allWithdrawals.filter(w => w.status === 'REJECTED').reduce((sum, w) => sum + w.amount, 0))}
            </div>
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
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 flex-1">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by User ID or Withdrawal ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Processing Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-semibold mb-3 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          💳 Payment Processing Workflow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-orange-100 rounded-lg p-3">
            <div className="font-medium text-orange-800 mb-1">1. PENDING</div>
            <div className="text-orange-700">User submits withdrawal request</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-3">
            <div className="font-medium text-blue-800 mb-1">2. APPROVED</div>
            <div className="text-blue-700">Admin approves for processing</div>
          </div>
          <div className="bg-green-100 rounded-lg p-3">
            <div className="font-medium text-green-800 mb-1">3. COMPLETED</div>
            <div className="text-green-700">Payment sent to user</div>
          </div>
          <div className="bg-red-100 rounded-lg p-3">
            <div className="font-medium text-red-800 mb-1">4. REJECTED</div>
            <div className="text-red-700">Request denied, funds returned</div>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Withdrawal ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">User ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Method</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map(withdrawal => (
                <tr key={withdrawal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{withdrawal.id.slice(-8)}</td>
                  <td className="py-3 px-4 font-mono text-sm">{withdrawal.userId.slice(-8)}</td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(withdrawal.amount)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(withdrawal.method)}
                      <span>{withdrawal.method.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(withdrawal.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(withdrawal.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewDetails(withdrawal.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="View Details"
                      >
                        <Eye size={12} />
                      </button>
                      {withdrawal.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(withdrawal.id, 'APPROVED')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(withdrawal.id, 'REJECTED')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {withdrawal.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusUpdate(withdrawal.id, 'COMPLETED')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredWithdrawals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No withdrawal requests found
          </div>
        )}
      </div>

      {/* Withdrawal Details Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            {(() => {
              const withdrawal = allWithdrawals.find(w => w.id === viewDetails);
              if (!withdrawal) return null;
              
              return (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Withdrawal Details</h3>
                    <button
                      onClick={() => setViewDetails(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(withdrawal.amount)}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Method</label>
                      <div className="flex items-center space-x-2">
                        {getMethodIcon(withdrawal.method)}
                        <span>{withdrawal.method.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Details</label>
                      <div className="bg-gray-100 rounded p-3 text-sm font-mono">
                        {getWithdrawalDetails(withdrawal)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(withdrawal.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Requested</label>
                      <div className="text-sm text-gray-600">
                        {new Date(withdrawal.requestedAt).toLocaleString()}
                      </div>
                    </div>
                    
                    {withdrawal.processedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Processed</label>
                        <div className="text-sm text-gray-600">
                          {new Date(withdrawal.processedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                    
                    {withdrawal.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <div className="text-sm text-gray-600 bg-gray-100 rounded p-2">
                          {withdrawal.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};