export type Signal = 'BUY' | 'HOLD' | 'AVOID';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type Confidence = 'LOW' | 'MEDIUM' | 'HIGH';
export type Impact = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskTolerance = 'Conservative' | 'Moderate' | 'Aggressive';
export type InvestmentHorizon = 'Short term' | 'Medium term' | 'Long term';
export type Theme = 'light' | 'dark';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type TradingStyle = 'Long-term' | 'Swing' | 'Short-term' | 'Day trading';
export type AuthView = 'landing' | 'login' | 'signup' | 'onboarding' | 'app';

export interface ForecastRange {
  bear: [number, number];
  base: [number, number];
  bull: [number, number];
}

export interface PriceForecast {
  sevenDay: ForecastRange;
  thirtyDay: ForecastRange;
  probPositiveReturn: number;
  confidence: Confidence;
  expectedVolatility: RiskLevel;
}

export interface ScoreComponent {
  label: string;
  score: number;
  weight: number;
}

export interface AIScore {
  total: number;
  components: ScoreComponent[];
  signal: Signal;
  confidence: number;
  reasons: string[];
  risks: string[];
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  date: string;
  ticker: string;
  sentiment: Sentiment;
  confidence: number;
  impact: Impact;
  summary: string;
}

export interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  volatility: number;
}

export interface Fundamentals {
  eps: number;
  peRatio: number;
  revenueGrowth: number;
  profitGrowth: number;
  dividendYield: number;
  debtToEquity: number;
  marketCap: number;
  bookValue: number;
}

export interface PricePoint {
  date: string;
  price: number;
  volume: number;
}

export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePct: number;
  volume: number;
  marketCap: number;
  history: PricePoint[];
  fundamentals: Fundamentals;
  technicals: TechnicalIndicators;
  aiScore: AIScore;
  forecast: PriceForecast;
  news: NewsItem[];
}

export interface PortfolioHolding {
  ticker: string;
  shares: number;
  avgCost: number;
}

export interface AlertRule {
  id: string;
  ticker: string;
  type: 'price_above' | 'price_below' | 'daily_change' | 'volume_spike' | 'buy_signal' | 'risk_high' | 'news_major' | 'forecast_change';
  label: string;
  threshold?: number;
  active: boolean;
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
  message: string;
}

export interface InvestorProfile {
  riskTolerance: RiskTolerance;
  horizon: InvestmentHorizon;
  preferredSectors: string[];
  experienceLevel: ExperienceLevel;
  tradingStyle: TradingStyle;
  preferredMarket: string;
  preferredCurrency: string;
  emailNotifications: boolean;
  browserNotifications: boolean;
  alertFrequency: 'Instant' | 'Hourly' | 'Daily';
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatar: string;
  provider: 'email' | 'google' | 'facebook' | 'linkedin';
  isAdmin: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface ModelVersion {
  version: string;
  date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  active: boolean;
}

export type PageId =
  | 'dashboard'
  | 'markets'
  | 'watchlist'
  | 'analysis'
  | 'signals'
  | 'alerts'
  | 'portfolio'
  | 'simulator'
  | 'backtesting'
  | 'settings'
  | 'compare'
  | 'learn'
  | 'admin'
  | 'model';
