// API client utilities
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://polymarket-alpha-ow2e.onrender.com';

export interface Market {
  id: string;
  title: string;
  description?: string;
  category?: string;
  state: 'active' | 'closed' | 'resolved';
  yesPrice: number;
  noPrice: number;
  liquidity?: number;
  volume24h?: number;
  endDate?: string;
  outcomes?: string[];
}

export interface PriceHistory {
  timestamp: number;
  yesPrice: number;
  noPrice: number;
}

export interface MarketDetail extends Market {
  priceHistory?: PriceHistory[];
  recentTrades?: Array<{
    id: string;
    outcome: 'yes' | 'no';
    price: number;
    amount: number;
    timestamp: number;
  }>;
  relatedMarkets?: Market[];
}

export async function fetchMarkets(
  page: number = 1,
  limit: number = 20
): Promise<{ markets: Market[]; total: number }> {
  const response = await fetch(
    `${API_BASE}/api/polymarket/markets?page=${page}&limit=${limit}`,
    { next: { revalidate: 5 } }
  );
  if (!response.ok) throw new Error('Failed to fetch markets');
  return response.json();
}

export async function fetchMarketDetail(id: string): Promise<MarketDetail> {
  const response = await fetch(
    `${API_BASE}/api/polymarket/market/${id}`,
    { next: { revalidate: 5 } }
  );
  if (!response.ok) throw new Error('Failed to fetch market');
  return response.json();
}

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/api/polymarket/health`, {
    next: { revalidate: 10 }
  });
  if (!response.ok) throw new Error('Health check failed');
  return response.json();
}
