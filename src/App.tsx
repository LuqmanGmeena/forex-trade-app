import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RewardsProvider, useRewards } from './contexts/RewardsContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Header } from './components/layout/Header';
import { RewardsPage } from './components/rewards/RewardsPage';
import { CurrencyPair, Trade, Account } from './types/trading';
import { priceSimulator } from './utils/priceSimulation';
import { TradingPanel } from './components/TradingPanel';
import { AccountInfo } from './components/AccountInfo';
import { MarketOverview } from './components/MarketOverview';
import { TradeHistory } from './components/TradeHistory';
import { TradingChart } from './components/TradingChart';

const TradingApp: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { completeTask, addEarnings, updateDailyStreak } = useRewards();
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EURUSD');
  const [currentView, setCurrentView] = useState<'trading' | 'rewards'>('trading');
  const [account, setAccount] = useState<Account>({
    balance: 10000,
    equity: 10000,
    margin: 0,
    freeMargin: 10000,
    marginLevel: 0
  });

  // Load user trades from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedTrades = localStorage.getItem(`trades_${user.id}`);
      if (storedTrades) {
        setTrades(JSON.parse(storedTrades));
      }
    }
  }, [isAuthenticated, user]);

  // Save trades to localStorage whenever trades change
  useEffect(() => {
    if (isAuthenticated && user && trades.length > 0) {
      localStorage.setItem(`trades_${user.id}`, JSON.stringify(trades));
    }
  }, [trades, isAuthenticated, user]);

  // Initialize price simulator and subscribe to updates
  useEffect(() => {
    if (!isAuthenticated) return;

    // Update daily streak on login
    updateDailyStreak();

    const unsubscribe = priceSimulator.subscribe((pairs) => {
      setCurrencyPairs(pairs);
      
      // Update current prices for open trades
      setTrades(prevTrades => 
        prevTrades.map(trade => {
          if (trade.status === 'OPEN') {
            const pair = pairs.find(p => p.symbol === trade.symbol);
            if (pair) {
              const currentPrice = trade.type === 'BUY' ? pair.bid : pair.ask;
              const priceDiff = trade.type === 'BUY' 
                ? currentPrice - trade.openPrice 
                : trade.openPrice - currentPrice;
              const pnl = (priceDiff / trade.openPrice) * trade.amount;
              
              return {
                ...trade,
                currentPrice,
                pnl
              };
            }
          }
          return trade;
        })
      );
    });

    return unsubscribe;
  }, [isAuthenticated, updateDailyStreak]);

  // Update account information when trades change
  useEffect(() => {
    if (!isAuthenticated) return;

    const openTrades = trades.filter(trade => trade.status === 'OPEN');
    const totalPnL = openTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalMargin = openTrades.reduce((sum, trade) => sum + trade.amount * 0.01, 0); // 1% margin
    
    const newEquity = account.balance + totalPnL;
    const newFreeMargin = newEquity - totalMargin;
    const newMarginLevel = totalMargin > 0 ? (newEquity / totalMargin) * 100 : 0;

    setAccount(prev => ({
      ...prev,
      equity: newEquity,
      margin: totalMargin,
      freeMargin: newFreeMargin,
      marginLevel: newMarginLevel
    }));
  }, [trades, account.balance, isAuthenticated]);

  const handleExecuteTrade = (tradeData: Omit<Trade, 'id' | 'timestamp' | 'pnl' | 'status' | 'currentPrice'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      timestamp: Date.now(),
      currentPrice: tradeData.openPrice,
      pnl: 0,
      status: 'OPEN'
    };

    setTrades(prev => [...prev, newTrade]);

    // Complete first trade task
    if (trades.length === 0) {
      completeTask('first_trade');
    }

    // Complete daily login task
    completeTask('daily_login');
  };

  const handleCloseTrade = (tradeId: string) => {
    setTrades(prev => 
      prev.map(trade => {
        if (trade.id === tradeId && trade.status === 'OPEN') {
          const closedTrade = {
            ...trade,
            status: 'CLOSED' as const,
            closePrice: trade.currentPrice,
            closeTimestamp: Date.now()
          };

          // Update account balance
          setAccount(prevAccount => ({
            ...prevAccount,
            balance: prevAccount.balance + trade.pnl
          }));

          // Complete profitable trade task
          if (trade.pnl > 0) {
            completeTask('profitable_trade');
            // Add bonus earnings for profitable trades
            addEarnings(Math.min(trade.pnl * 0.1, 10), 'Profitable Trade Bonus');
          }

          return closedTrade;
        }
        return trade;
      })
    );
  };

  const handleSelectPair = (pair: CurrencyPair) => {
    setSelectedSymbol(pair.symbol);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  const priceHistory = priceSimulator.getPriceHistory(selectedSymbol);

  if (currentView === 'rewards') {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header onViewChange={setCurrentView} currentView={currentView} />
        <RewardsPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onViewChange={setCurrentView} currentView={currentView} />

      {/* Admin Access Notice */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse bg-white/20 rounded-full p-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm font-medium">Admin Dashboard Available</span>
          </div>
          <div className="text-xs opacity-80">
            Click "Admin Panel" button or visit /admin
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4">
          <AccountInfo account={account} />
          <TradingChart 
            priceHistory={priceHistory}
            symbol={selectedSymbol}
          />
          <TradingPanel 
            currencyPairs={currencyPairs} 
            onExecuteTrade={handleExecuteTrade}
          />
          <MarketOverview 
            currencyPairs={currencyPairs}
            onSelectPair={handleSelectPair}
          />
          <TradeHistory 
            trades={trades}
            onCloseTrade={handleCloseTrade}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <AccountInfo account={account} />
            <TradingPanel 
              currencyPairs={currencyPairs} 
              onExecuteTrade={handleExecuteTrade}
            />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <TradingChart 
              priceHistory={priceHistory}
              symbol={selectedSymbol}
            />
            <MarketOverview 
              currencyPairs={currencyPairs}
              onSelectPair={handleSelectPair}
            />
          </div>

          {/* Right Column */}
          <div>
            <TradeHistory 
              trades={trades}
              onCloseTrade={handleCloseTrade}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthFlow: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  if (isLogin) {
    return <LoginPage onSwitchToRegister={() => setIsLogin(false)} />;
  }

  return <RegisterPage onSwitchToLogin={() => setIsLogin(true)} />;
};

const AdminApp: React.FC = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

const AppRouter: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Check URL for admin access
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setIsAdminMode(true);
    }
  }, []);

  // Add admin access button (hidden, accessible via URL)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdminMode(true);
        window.history.pushState({}, '', '/admin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (isAdminMode) {
    return (
      <AdminProvider>
        <AdminApp />
      </AdminProvider>
    );
  }

  return (
    <AuthProvider>
      <RewardsProvider>
        <TradingApp />
      </RewardsProvider>
    </AuthProvider>
  );
};

function App() {
  return <AppRouter />;
}

export default App;