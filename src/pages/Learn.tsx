import { useState } from 'react';
import { BookOpen, ChevronRight, Brain, TrendingUp, Activity, BarChart3, Shield, Calculator, Layers, Eye, ArrowLeft, Database, Cpu, Zap, AlertTriangle, LineChart, DollarSign, Building2 } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  icon: typeof BookOpen;
  category: string;
  shortDesc: string;
  content: { heading: string; body: string }[];
}

const LESSONS: Lesson[] = [
  {
    id: 'what-is-stock',
    title: 'What is a Stock?',
    icon: Layers,
    category: 'Basics',
    shortDesc: 'Understand what stocks are and how they work.',
    content: [
      { heading: 'Definition', body: 'A stock (also known as a share) represents a small piece of ownership in a company. When you buy a stock, you become a shareholder — a partial owner of that company. The value of your shares changes based on the company\'s performance, market conditions, and investor demand.' },
      { heading: 'Why Companies Issue Stocks', body: 'Companies issue stocks to raise capital for expansion, research, debt repayment, or operations. This is done through an Initial Public Offering (IPO) on a stock exchange like the DSE.' },
      { heading: 'How You Make Money', body: 'Stock investors can profit in two ways: (1) Capital appreciation — selling the stock for more than you paid, and (2) Dividends — regular payments some companies distribute to shareholders from their profits.' },
      { heading: 'Key Terms', body: 'Ticker: A short code identifying a stock (e.g., BEXIMCO). Price: The current cost of one share. Volume: The number of shares traded in a period. Market Cap: Total value of all shares combined.' },
    ],
  },
  {
    id: 'what-is-rsi',
    title: 'What is RSI?',
    icon: Activity,
    category: 'Technical',
    shortDesc: 'Relative Strength Index explained in simple terms.',
    content: [
      { heading: 'Definition', body: 'RSI (Relative Strength Index) is a momentum oscillator that measures the speed and change of price movements on a scale of 0 to 100. It helps identify whether a stock is overbought or oversold.' },
      { heading: 'How to Read RSI', body: 'RSI above 70: The stock may be overbought — the price has risen quickly and a pullback could occur. RSI below 30: The stock may be oversold — the price has fallen sharply and a bounce might happen. RSI between 30-70: Neutral territory.' },
      { heading: 'Limitations', body: 'RSI alone should not be used for investment decisions. It can stay in overbought/oversold territory for extended periods during strong trends. StockSense AI uses RSI alongside MACD, moving averages, and other indicators for a composite signal.' },
    ],
  },
  {
    id: 'what-is-macd',
    title: 'What is MACD?',
    icon: BarChart3,
    category: 'Technical',
    shortDesc: 'Moving Average Convergence Divergence explained.',
    content: [
      { heading: 'Definition', body: 'MACD (Moving Average Convergence Divergence) is a trend-following momentum indicator. It shows the relationship between two moving averages of a stock\'s price — typically the 12-day and 26-day EMAs.' },
      { heading: 'Components', body: 'MACD Line: The difference between the 12-day and 26-day EMAs. Signal Line: A 9-day EMA of the MACD line. Histogram: The difference between the MACD line and the signal line.' },
      { heading: 'How to Use', body: 'When the MACD line crosses above the signal line, it can indicate bullish momentum. When it crosses below, it may signal bearish momentum. A positive histogram suggests upward momentum is strengthening.' },
    ],
  },
  {
    id: 'moving-averages',
    title: 'What are Moving Averages?',
    icon: TrendingUp,
    category: 'Technical',
    shortDesc: 'SMA and EMA explained for beginners.',
    content: [
      { heading: 'Definition', body: 'A moving average (MA) smooths out price data to show the underlying trend. The Simple Moving Average (SMA) is the average price over a set period. The Exponential Moving Average (EMA) gives more weight to recent prices.' },
      { heading: 'Common Periods', body: 'SMA 20: Short-term trend. SMA 50: Medium-term trend. SMA 200: Long-term trend. When the current price is above the SMA, it suggests an uptrend; below suggests a downtrend.' },
      { heading: 'Golden Cross & Death Cross', body: 'A Golden Cross occurs when the SMA 50 crosses above the SMA 200 — a bullish signal. A Death Cross is the opposite — the SMA 50 crosses below the SMA 200, a bearish signal.' },
    ],
  },
  {
    id: 'what-is-volatility',
    title: 'What is Volatility?',
    icon: Shield,
    category: 'Risk',
    shortDesc: 'Understanding risk and price swings.',
    content: [
      { heading: 'Definition', body: 'Volatility measures how much and how quickly a stock\'s price fluctuates. High volatility means large price swings; low volatility means more stable prices. It is typically measured as the standard deviation of returns, annualized.' },
      { heading: 'Why It Matters', body: 'Volatility is a key risk metric. High-volatility stocks offer greater potential returns but also greater potential losses. StockSense AI includes volatility in its risk assessment, weighting it at 10% of the total AI score.' },
      { heading: 'Risk vs Reward', body: 'Conservative investors should prefer low-volatility stocks. Aggressive investors may seek higher volatility for potential outsized returns — but must be prepared for larger drawdowns.' },
    ],
  },
  {
    id: 'what-is-diversification',
    title: 'What is Diversification?',
    icon: Layers,
    category: 'Strategy',
    shortDesc: 'Don\'t put all your eggs in one basket.',
    content: [
      { heading: 'Definition', body: 'Diversification means spreading investments across different stocks, sectors, and asset types to reduce risk. The idea is that if one investment performs poorly, others may perform well, balancing the overall portfolio.' },
      { heading: 'How to Diversify', body: 'Invest in stocks from different sectors (e.g., Pharmaceuticals, Banks, Telecom). Avoid concentrating too much in a single stock. StockSense AI shows your sector allocation on the Portfolio page to help you identify concentration.' },
      { heading: 'Limits of Diversification', body: 'Diversification reduces unsystematic risk (risk specific to one company) but cannot eliminate systematic risk (market-wide risk). Even a diversified portfolio can lose value during a market crash.' },
    ],
  },
  {
    id: 'technical-analysis',
    title: 'What is Technical Analysis?',
    icon: BarChart3,
    category: 'Analysis',
    shortDesc: 'Using charts and indicators to understand price action.',
    content: [
      { heading: 'Definition', body: 'Technical analysis is the study of historical price and volume data to identify patterns and trends. It assumes that price movements are not entirely random and that historical patterns tend to repeat.' },
      { heading: 'Key Tools', body: 'Chart patterns (support/resistance, trendlines), technical indicators (RSI, MACD, Bollinger Bands), and volume analysis. StockSense AI combines multiple technical indicators into its "Technical Momentum" score component.' },
      { heading: 'Limitations', body: 'Technical analysis does not consider a company\'s financial health or intrinsic value. It should be combined with fundamental analysis for a complete picture. Past patterns do not guarantee future results.' },
    ],
  },
  {
    id: 'fundamental-analysis',
    title: 'What is Fundamental Analysis?',
    icon: Eye,
    category: 'Analysis',
    shortDesc: 'Evaluating a company\'s financial health and value.',
    content: [
      { heading: 'Definition', body: 'Fundamental analysis evaluates a stock\'s true value by examining the company\'s financial statements, management, competitive position, and growth prospects. The goal is to determine whether a stock is overvalued, undervalued, or fairly priced.' },
      { heading: 'Key Metrics', body: 'EPS (Earnings Per Share): Profit per share. P/E Ratio: Price relative to earnings. Revenue Growth: How fast sales are growing. Dividend Yield: Annual dividend as a percentage of price. Debt/Equity: Financial leverage.' },
      { heading: 'StockSense AI Approach', body: 'StockSense AI includes a "Fundamental Health" component in its AI score, weighing P/E, growth, dividends, and debt. This is combined with technical and sentiment analysis for a holistic view.' },
    ],
  },
  {
    id: 'how-ai-prediction-works',
    title: 'How AI Prediction Works',
    icon: Brain,
    category: 'AI',
    shortDesc: 'Understanding the StockSense AI prediction pipeline.',
    content: [
      { heading: 'The Pipeline', body: 'StockSense AI follows a structured pipeline: Data Collection (prices, fundamentals, news) → Feature Engineering (technical indicators, returns) → ML Model (XGBoost/LightGBM) → Prediction (probability UP/DOWN) → Risk Analysis → Explainable Output.' },
      { heading: 'What the Model Predicts', body: 'The model predicts the probability of a stock\'s price moving up or down over a defined period. It does NOT predict exact future prices. The output is a probability (e.g., 72% chance of upward movement) with a confidence level.' },
      { heading: 'Why Explanations Matter', body: 'A prediction without explanation is a black box. StockSense AI provides 3-5 reasons for every signal, showing which factors (momentum, fundamentals, sentiment) drove the decision. This helps users understand and trust — or question — the AI\'s output.' },
    ],
  },
  {
    id: 'how-to-interpret-confidence',
    title: 'How to Interpret Model Confidence',
    icon: Calculator,
    category: 'AI',
    shortDesc: 'What confidence levels mean and how to use them.',
    content: [
      { heading: 'Confidence Levels', body: 'StockSense AI assigns a confidence level to each prediction: LOW (<50%), MEDIUM (50-70%), HIGH (>70%). Confidence reflects how strongly the model\'s input factors agree on a direction.' },
      { heading: 'High Confidence ≠ Guaranteed', body: 'Even a HIGH confidence prediction is not a guarantee. Market conditions can change unexpectedly. High confidence means the model\'s inputs are aligned — not that the outcome is certain.' },
      { heading: 'Using Confidence Wisely', body: 'Treat confidence as one factor in your decision. A BUY signal with HIGH confidence is stronger than one with LOW confidence, but you should still consider risk level, your own research, and your risk tolerance before acting.' },
    ],
  },
  {
    id: 'ml-pipeline-explained',
    title: 'The ML Pipeline: From Data to Prediction',
    icon: Cpu,
    category: 'AI',
    shortDesc: 'How raw market data becomes an AI signal.',
    content: [
      { heading: 'Step 1: Data Collection', body: 'StockSense AI collects historical price data (Open, High, Low, Close, Volume), company fundamentals (EPS, P/E, revenue growth), and news sentiment for each stock. In production, this comes from stock exchange APIs and financial data providers.' },
      { heading: 'Step 2: Feature Engineering', body: 'Raw data is transformed into features the model can learn from: daily returns, 5/10/20-day returns, SMA, EMA, RSI, MACD, Bollinger Bands, volatility, volume change, and market trend. These 18 features capture different aspects of price behavior.' },
      { heading: 'Step 3: Model Training', body: 'An XGBoost model is trained on historical data using chronological splitting (2018-2022 for training, 2023 for validation, 2024-2025 for testing). Walk-forward validation prevents data leakage. The model learns which feature patterns are associated with upward vs downward price movements.' },
      { heading: 'Step 4: Prediction', body: 'Given current features for a stock, the model outputs a probability (0-100%) that the price will move up. This probability, combined with the composite AI score, determines the BUY/HOLD/AVOID signal and confidence level.' },
      { heading: 'Step 5: Risk Analysis', body: 'The risk engine evaluates volatility, debt-to-equity, and market exposure to assign a risk level (LOW/MEDIUM/HIGH). This is always displayed alongside the signal — "Don\'t just predict the price, explain the risk."' },
    ],
  },
  {
    id: 'what-is-xgboost',
    title: 'What is XGBoost?',
    icon: Zap,
    category: 'AI',
    shortDesc: 'Understanding the machine learning algorithm behind StockSense AI.',
    content: [
      { heading: 'Definition', body: 'XGBoost (eXtreme Gradient Boosting) is a machine learning algorithm that builds an ensemble of decision trees. Each tree corrects the errors of the previous ones, creating a powerful predictor that handles tabular financial data well.' },
      { heading: 'Why XGBoost?', body: 'XGBoost is widely used in finance because it handles non-linear relationships, is robust to outliers, provides feature importance scores, and trains quickly. It consistently outperforms simpler models on structured data like stock features.' },
      { heading: 'Limitations', body: 'XGBoost is not a neural network — it cannot learn complex sequential patterns the way LSTM or Transformer models can. StockSense AI is designed to be modular: XGBoost is the initial model, with LSTM/GRU/Transformer architectures planned for future versions to capture longer temporal patterns.' },
      { heading: 'Feature Importance', body: 'XGBoost tells us which features matter most. In StockSense AI, RSI, MACD, and SMA 20 are typically the most influential features. This transparency is part of the "explainable AI" approach — you can see what drives the model\'s decisions on the Model Evaluation page.' },
    ],
  },
  {
    id: 'data-leakage-prevention',
    title: 'Preventing Data Leakage in ML',
    icon: Database,
    category: 'AI',
    shortDesc: 'Why chronological splitting matters for stock prediction.',
    content: [
      { heading: 'What is Data Leakage?', body: 'Data leakage occurs when information from the future accidentally leaks into the training data. In stock prediction, this means using data from 2024 to train a model that is then "tested" on 2023 data — the model appears accurate but fails in real-world use because it has seen the future.' },
      { heading: 'Chronological Splitting', body: 'StockSense AI splits data by time: 2018-2022 for training, 2023 for validation, 2024-2025 for testing. The model never sees future data during training. This simulates real-world deployment where you predict tomorrow based on data up to today.' },
      { heading: 'Walk-Forward Validation', body: 'Instead of a single train/test split, walk-forward validation retrains the model on expanding windows. Train on 2018-2022, test on 2023. Then train on 2018-2023, test on 2024. This provides a more robust estimate of real-world performance.' },
      { heading: 'Why It Matters', body: 'A model that achieves 90% accuracy with random shuffling might achieve only 55% with proper chronological splitting. Honest evaluation prevents overconfidence and helps users understand the true uncertainty in predictions.' },
    ],
  },
  {
    id: 'bollinger-bands',
    title: 'What are Bollinger Bands?',
    icon: LineChart,
    category: 'Technical',
    shortDesc: 'Understanding volatility bands and price channels.',
    content: [
      { heading: 'Definition', body: 'Bollinger Bands are a volatility indicator consisting of three lines: a middle band (SMA 20), an upper band (SMA 20 + 2 standard deviations), and a lower band (SMA 20 - 2 standard deviations). The bands widen during high volatility and narrow during low volatility.' },
      { heading: 'How to Read Them', body: 'When price touches the upper band, the stock may be overbought. When it touches the lower band, it may be oversold. A "squeeze" (bands narrowing) often precedes a major price move. StockSense AI includes Bollinger Bands in its technical analysis.' },
      { heading: 'Limitations', body: 'Bollinger Bands are most useful in ranging markets. During strong trends, price can ride the upper or lower band for extended periods. They should be combined with other indicators like RSI and MACD for reliable signals.' },
    ],
  },
  {
    id: 'what-is-dse',
    title: 'Understanding the DSE (Dhaka Stock Exchange)',
    icon: Building2,
    category: 'Market',
    shortDesc: 'How the Bangladesh stock market works.',
    content: [
      { heading: 'What is the DSE?', body: 'The Dhaka Stock Exchange (DSE) is the primary stock exchange of Bangladesh, located in Dhaka. It lists over 300 companies across sectors including pharmaceuticals, banking, telecom, engineering, cement, and food. The DSE is regulated by the Bangladesh Securities and Exchange Commission (BSEC).' },
      { heading: 'Trading Hours', body: 'DSE trading sessions run from 10:00 AM to 2:30 PM, Sunday through Thursday. The market is closed on Fridays and Saturdays, as well as national holidays. StockSense AI displays market status in the dashboard header.' },
      { heading: 'Key Indices', body: 'The DSEX is the broad index of the DSE, similar to the S&P 500. The DS30 tracks 30 leading companies. These indices give a snapshot of overall market direction. StockSense AI tracks all DSE-listed stocks in its database.' },
      { heading: 'Currency', body: 'All prices on the DSE are in Bangladeshi Taka (BDT, symbol ৳). StockSense AI displays prices in ৳ by default. You can change your preferred currency in Profile & Settings.' },
    ],
  },
  {
    id: 'p/e-ratio-explained',
    title: 'Understanding P/E Ratio',
    icon: DollarSign,
    category: 'Fundamental',
    shortDesc: 'What Price-to-Earnings tells you about a stock.',
    content: [
      { heading: 'Definition', body: 'The Price-to-Earnings (P/E) ratio compares a stock\'s price to its Earnings Per Share (EPS). A P/E of 15 means investors pay ৳15 for every ৳1 of annual earnings. It is one of the most widely used valuation metrics.' },
      { heading: 'How to Interpret P/E', body: 'A low P/E (e.g., 8-12) may indicate an undervalued stock or a company with low growth expectations. A high P/E (e.g., 25+) may indicate high growth expectations or an overvalued stock. P/E should be compared within the same sector, not across sectors.' },
      { heading: 'StockSense AI Use', body: 'StockSense AI includes P/E in its Fundamental Health score. Stocks with P/E below 15 receive a higher fundamental score. However, P/E alone is not sufficient — it is combined with growth rates, dividends, and debt ratios for a complete picture.' },
      { heading: 'Limitations', body: 'P/E can be misleading for companies with negative earnings (no meaningful P/E), or for companies with one-time gains/losses. The forward P/E (based on projected earnings) may differ significantly from the trailing P/E (based on past earnings).' },
    ],
  },
  {
    id: 'risk-management',
    title: 'Risk Management for Investors',
    icon: AlertTriangle,
    category: 'Risk',
    shortDesc: 'How to protect your portfolio from excessive losses.',
    content: [
      { heading: 'Why Risk Management Matters', body: 'Even the best AI predictions can be wrong. Risk management is about limiting losses when predictions fail. The goal is not to avoid risk entirely (that means no returns), but to take calculated risks aligned with your tolerance.' },
      { heading: 'Position Sizing', body: 'Never put all your capital in a single stock. A common rule is to risk no more than 2-5% of your portfolio on any single position. StockSense AI shows your portfolio allocation by stock and sector to help you identify over-concentration.' },
      { heading: 'Stop-Loss Discipline', body: 'A stop-loss is a pre-determined price at which you sell to limit losses. StockSense AI\'s alert system can notify you when a stock falls below a threshold you set. This removes emotional decision-making during market downturns.' },
      { heading: 'Risk-Adjusted Returns', body: 'Returns should be evaluated relative to the risk taken. A 20% return with high volatility may be worse than a 12% return with low volatility. StockSense AI\'s risk score helps you assess whether a stock\'s potential return justifies its risk level.' },
      { heading: 'The StockSense AI Philosophy', body: '"Don\'t just predict the price — explain the risk." Every AI signal includes a risk assessment. Users should never act on a signal without considering the associated risk level and their own risk tolerance.' },
    ],
  },
  {
    id: 'ai-vs-human-analysis',
    title: 'AI vs Human Analysis: Complementary, Not Replacement',
    icon: Brain,
    category: 'AI',
    shortDesc: 'Understanding the strengths and limits of AI in stock analysis.',
    content: [
      { heading: 'What AI Does Well', body: 'AI excels at processing large volumes of data quickly, identifying patterns across hundreds of stocks simultaneously, maintaining consistency (no emotional bias), and providing probabilistic estimates based on historical patterns. StockSense AI analyzes 125+ stocks with 18 features each — a task impossible for a human to do manually.' },
      { heading: 'What AI Cannot Do', body: 'AI cannot predict black swan events (pandemics, political crises), understand qualitative factors like management quality or brand loyalty, or account for information not in the data. It also cannot guarantee outcomes — it provides probabilities, not certainties.' },
      { heading: 'The Best Approach', body: 'Use AI as a tool to narrow the field and identify opportunities, then apply human judgment for the final decision. AI can flag a stock with strong momentum; a human can assess whether the company\'s product strategy makes sense. This combination is more effective than either alone.' },
      { heading: 'StockSense AI Design', body: 'StockSense AI is designed to be explainable, not a black box. Every signal shows 3-5 reasons and risk warnings. This transparency lets users verify the AI\'s logic and override it when they have additional context the model doesn\'t.' },
    ],
  },
];

const CATEGORIES = ['All', 'Basics', 'Technical', 'Fundamental', 'Risk', 'Strategy', 'Analysis', 'AI', 'Market'];

export function Learn() {
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [category, setCategory] = useState('All');

  const filtered = category === 'All' ? LESSONS : LESSONS.filter((l) => l.category === category);

  if (selected) {
    return (
      <div className="space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700 dark:hover:text-ink-300">
          <ArrowLeft className="h-4 w-4" /> Back to Learning Center
        </button>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
              <selected.icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-900 dark:text-ink-100">{selected.title}</h1>
              <p className="text-xs text-ink-500">{selected.category} · StockSense AI Learning Center</p>
            </div>
          </div>

          <div className="space-y-5">
            {selected.content.map((section, i) => (
              <div key={i}>
                <h2 className="text-sm font-bold text-ink-900 dark:text-ink-100">{section.heading}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-brand-50 p-4 dark:bg-brand-950/20">
            <p className="text-sm text-brand-700 dark:text-brand-300">
              StockSense AI provides educational content for informational purposes only. This is not financial advice.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Learning Center</h1>
        <p className="mt-1 text-sm text-ink-500">Understand stocks, indicators, and AI predictions in simple terms</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${category === c ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Lessons grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lesson) => {
          const Icon = lesson.icon;
          return (
            <button key={lesson.id} onClick={() => setSelected(lesson)} className="card card-hover p-5 text-left">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="badge bg-neutral-soft">{lesson.category}</span>
              </div>
              <h3 className="text-sm font-bold text-ink-900 dark:text-ink-100">{lesson.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{lesson.shortDesc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                Read more <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
