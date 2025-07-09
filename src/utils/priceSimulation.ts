import { CurrencyPair, PriceHistory } from '../types/trading';

const CURRENCY_PAIRS: Omit<CurrencyPair, 'bid' | 'ask' | 'change' | 'changePercent'>[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen' },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar' },
];

const INITIAL_PRICES: Record<string, number> = {
  EURUSD: 1.0850,
  GBPUSD: 1.2650,
  USDJPY: 149.50,
  USDCHF: 0.8750,
  AUDUSD: 0.6650,
  USDCAD: 1.3650,
};

export class PriceSimulator {
  private prices: Record<string, number> = { ...INITIAL_PRICES };
  private previousPrices: Record<string, number> = { ...INITIAL_PRICES };
  private priceHistory: Record<string, PriceHistory[]> = {};
  private subscribers: ((pairs: CurrencyPair[]) => void)[] = [];

  constructor() {
    // Initialize price history
    CURRENCY_PAIRS.forEach(pair => {
      this.priceHistory[pair.symbol] = [];
    });

    this.startSimulation();
  }

  private startSimulation() {
    setInterval(() => {
      this.updatePrices();
      this.notifySubscribers();
    }, 1000); // Update every second
  }

  private updatePrices() {
    Object.keys(this.prices).forEach(symbol => {
      this.previousPrices[symbol] = this.prices[symbol];
      
      // Simulate realistic price movement
      const volatility = this.getVolatility(symbol);
      const change = (Math.random() - 0.5) * volatility;
      this.prices[symbol] = Math.max(0.0001, this.prices[symbol] + change);

      // Add to price history
      this.priceHistory[symbol].push({
        timestamp: Date.now(),
        price: this.prices[symbol]
      });

      // Keep only last 100 price points
      if (this.priceHistory[symbol].length > 100) {
        this.priceHistory[symbol].shift();
      }
    });
  }

  private getVolatility(symbol: string): number {
    const volatilities: Record<string, number> = {
      EURUSD: 0.0002,
      GBPUSD: 0.0003,
      USDJPY: 0.02,
      USDCHF: 0.0002,
      AUDUSD: 0.0003,
      USDCAD: 0.0002,
    };
    return volatilities[symbol] || 0.0002;
  }

  getCurrentPairs(): CurrencyPair[] {
    return CURRENCY_PAIRS.map(pair => {
      const currentPrice = this.prices[pair.symbol];
      const previousPrice = this.previousPrices[pair.symbol];
      const change = currentPrice - previousPrice;
      const changePercent = (change / previousPrice) * 100;
      
      const spread = currentPrice * 0.0001; // 1 pip spread
      
      return {
        ...pair,
        bid: currentPrice - spread / 2,
        ask: currentPrice + spread / 2,
        change,
        changePercent
      };
    });
  }

  getPriceHistory(symbol: string): PriceHistory[] {
    return this.priceHistory[symbol] || [];
  }

  subscribe(callback: (pairs: CurrencyPair[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    const pairs = this.getCurrentPairs();
    this.subscribers.forEach(callback => callback(pairs));
  }
}

export const priceSimulator = new PriceSimulator();