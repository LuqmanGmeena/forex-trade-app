import React, { useState } from 'react';
import { useRewards } from '../../contexts/RewardsContext';
import { DollarSign, CreditCard, Banknote, Bitcoin, Clock, CheckCircle, X } from 'lucide-react';

export const WithdrawalSection: React.FC = () => {
  const { userRewards, withdrawalRequests, requestWithdrawal } = useRewards();
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('PAYPAL');
  const [details, setDetails] = useState({
    email: '',
    bankAccount: '',
    cryptoAddress: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount <= 0 || withdrawAmount > userRewards.availableBalance) {
      alert('Invalid withdrawal amount');
      return;
    }

    if (withdrawAmount < 10) {
      alert('Minimum withdrawal amount is $10');
      return;
    }

    const withdrawalDetails: any = {};
    if (method === 'PAYPAL') {
      withdrawalDetails.email = details.email;
    } else if (method === 'BANK_TRANSFER') {
      withdrawalDetails.bankAccount = details.bankAccount;
    } else if (method === 'CRYPTO') {
      withdrawalDetails.cryptoAddress = details.cryptoAddress;
    }

    requestWithdrawal(withdrawAmount, method, withdrawalDetails);
    setShowForm(false);
    setAmount('');
    setDetails({ email: '', bankAccount: '', cryptoAddress: '' });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'PAYPAL': return <CreditCard className="text-blue-400" size={16} />;
      case 'BANK_TRANSFER': return <Banknote className="text-green-400" size={16} />;
      case 'CRYPTO': return <Bitcoin className="text-orange-400" size={16} />;
      default: return <DollarSign className="text-gray-400" size={16} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="text-yellow-400" size={16} />;
      case 'APPROVED': return <CheckCircle className="text-blue-400" size={16} />;
      case 'COMPLETED': return <CheckCircle className="text-green-400" size={16} />;
      case 'REJECTED': return <X className="text-red-400" size={16} />;
      default: return <Clock className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center">
        <DollarSign className="mr-2" size={20} />
        Withdrawals
      </h2>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Available Balance</div>
          <div className="text-green-400 font-bold text-lg">
            {formatCurrency(userRewards.availableBalance)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Pending Withdrawal</div>
          <div className="text-yellow-400 font-bold text-lg">
            {formatCurrency(userRewards.pendingWithdrawal)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total Earned</div>
          <div className="text-blue-400 font-bold text-lg">
            {formatCurrency(userRewards.totalEarnings)}
          </div>
        </div>
      </div>

      {/* Withdrawal Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          disabled={userRewards.availableBalance < 10}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-6"
        >
          Request Withdrawal (Min. $10)
        </button>
      )}

      {/* Withdrawal Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Request Withdrawal</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10"
                max={userRewards.availableBalance}
                step="0.01"
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Withdrawal Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="PAYPAL">PayPal</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CRYPTO">Cryptocurrency</option>
              </select>
            </div>

            {method === 'PAYPAL' && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            )}

            {method === 'BANK_TRANSFER' && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Bank Account Details
                </label>
                <textarea
                  value={details.bankAccount}
                  onChange={(e) => setDetails(prev => ({ ...prev, bankAccount: e.target.value }))}
                  required
                  rows={3}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Bank name, account number, routing number, etc."
                />
              </div>
            )}

            {method === 'CRYPTO' && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Crypto Wallet Address
                </label>
                <input
                  type="text"
                  value={details.cryptoAddress}
                  onChange={(e) => setDetails(prev => ({ ...prev, cryptoAddress: e.target.value }))}
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Wallet address"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Submit Withdrawal Request
            </button>
          </form>
        </div>
      )}

      {/* Withdrawal History */}
      <div>
        <h3 className="text-white font-semibold mb-4">Withdrawal History</h3>
        {withdrawalRequests.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No withdrawal requests yet</div>
        ) : (
          <div className="space-y-3">
            {withdrawalRequests.slice(-10).reverse().map(request => (
              <div key={request.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getMethodIcon(request.method)}
                    <span className="text-white font-medium">
                      {formatCurrency(request.amount)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      via {request.method.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className={`text-sm font-medium ${
                      request.status === 'COMPLETED' ? 'text-green-400' :
                      request.status === 'APPROVED' ? 'text-blue-400' :
                      request.status === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  Requested: {new Date(request.requestedAt).toLocaleDateString()}
                  {request.processedAt && (
                    <span className="ml-4">
                      Processed: {new Date(request.processedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};