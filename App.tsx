import React, { useState } from 'react';
import { Layout } from './components/layout';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from './constants';
import { useBusinessLogic } from './hooks/useBusinessLogic';
import { Dashboard } from './pages/Dashboard';
import { SitesPage } from './pages/SitesPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { QuotesPage } from './pages/QuotesPage';
import { OrdersPage } from './pages/OrdersPage';
import { AuthPage } from './pages/AuthPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [searchQuery, setSearchQuery] = useState('');

  // -- GLOBAL STATE & LOGIC --
  const { 
    sites, setSites, 
    quotes, setQuotes, 
    orders, setOrders, 
    invoices, setInvoices, 
    suppliers, 
    products 
  } = useBusinessLogic();

  // Simple Router
  const renderContent = () => {
    switch(activePath) {
      case '/': return <Dashboard searchQuery={searchQuery} />;
      case '/quotes': return <QuotesPage quotes={quotes} setQuotes={setQuotes} products={products} sites={sites} searchQuery={searchQuery} />;
      case '/orders': return <OrdersPage orders={orders} searchQuery={searchQuery} />;
      case '/sites': return <SitesPage sites={sites} setSites={setSites} searchQuery={searchQuery} />;
      case '/suppliers': return <SuppliersPage suppliers={suppliers} products={products} searchQuery={searchQuery} />;
      case '/invoices': return <InvoicesPage invoices={invoices} searchQuery={searchQuery} />;
      default: return <div className="p-4">Page not found</div>;
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout 
      user={MOCK_USERS[0]} 
      notifications={MOCK_NOTIFICATIONS} 
      activePath={activePath} 
      onNavigate={(path) => {
        setActivePath(path);
        setSearchQuery(''); // Reset search on navigation
      }}
      onLogout={() => setIsAuthenticated(false)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;