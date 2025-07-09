export interface CurrencyPair {
  symbol: string;
  name: string;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  openPrice: number;
  currentPrice: number;
  timestamp: number;
  status: 'OPEN' | 'CLOSED';
  pnl: number;
  closePrice?: number;
  closeTimestamp?: number;
}

export interface Account {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}