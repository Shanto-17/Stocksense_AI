import { AppProvider, useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { ChatAssistant } from '@/components/ChatAssistant';
import { Landing } from '@/pages/Landing';
import { Auth } from '@/pages/Auth';
import { Onboarding } from '@/pages/Onboarding';
import { Dashboard } from '@/pages/Dashboard';
import { Markets } from '@/pages/Markets';
import { Watchlist } from '@/pages/Watchlist';
import { StockAnalysis } from '@/pages/StockAnalysis';
import { AISignals } from '@/pages/AISignals';
import { Alerts } from '@/pages/Alerts';
import { Portfolio } from '@/pages/Portfolio';
import { Simulator } from '@/pages/Simulator';
import { Backtesting } from '@/pages/Backtesting';
import { Settings } from '@/pages/Settings';
import { Compare } from '@/pages/Compare';
import { Learn } from '@/pages/Learn';
import { Admin } from '@/pages/Admin';
import { ModelEval } from '@/pages/ModelEval';

function PageRouter() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'markets':
      return <Markets />;
    case 'watchlist':
      return <Watchlist />;
    case 'analysis':
      return <StockAnalysis />;
    case 'signals':
      return <AISignals />;
    case 'alerts':
      return <Alerts />;
    case 'compare':
      return <Compare />;
    case 'portfolio':
      return <Portfolio />;
    case 'simulator':
      return <Simulator />;
    case 'backtesting':
      return <Backtesting />;
    case 'model':
      return <ModelEval />;
    case 'learn':
      return <Learn />;
    case 'admin':
      return <Admin />;
    case 'settings':
      return <Settings />;
    default:
      return <Dashboard />;
  }
}

function AppRouter() {
  const { authView } = useApp();

  switch (authView) {
    case 'landing':
      return <Landing />;
    case 'login':
      return <Auth mode="login" />;
    case 'signup':
      return <Auth mode="signup" />;
    case 'onboarding':
      return <Onboarding />;
    case 'app':
      return (
        <>
          <Layout>
            <PageRouter />
          </Layout>
          <ChatAssistant />
        </>
      );
    default:
      return <Landing />;
  }
}

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
