import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DashboardPage from './pages/DashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import LeadsPage from './pages/LeadsPage';
import AccountsPage from './pages/AccountsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import ProspectingPage from './pages/ProspectingPage';
import InboxPage from './pages/InboxPage';
import WhatsappPage from './pages/WhatsappPage';
import EmailPage from './pages/EmailPage';
import CallsPage from './pages/CallsPage';
import SchedulerPage from './pages/SchedulerPage';
import ProductsPage from './pages/ProductsPage';
import QuoteRequestsPage from './pages/QuoteRequestsPage';
import QuotesPage from './pages/QuotesPage';
import InvoicesPage from './pages/InvoicesPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentLinksPage from './pages/PaymentLinksPage';
import EmployeesPage from './pages/EmployeesPage';
import HierarchyPage from './pages/HierarchyPage';
import RolesPage from './pages/RolesPage';
import TicketsPage from './pages/TicketsPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AiInboxPage from './pages/AiInboxPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import ProposalsPage from './pages/ProposalsPage';
import TasksPage from './pages/TasksPage';
import EventsPage from './pages/EventsPage';
import AutomationsPage from './pages/AutomationsPage';
import CustomModuleBuilderPage from './pages/CustomModuleBuilderPage';
import DynamicModulePage from './pages/DynamicModulePage';
import { CopilotDrawer } from './components/systems/AICopilot/CopilotDrawer';
import LoginPage from './pages/Auth/LoginPage';
import ClientPortal from './pages/ClientPortal/ClientPortal';

function ProtectedLayout() {
  const { token, activeTab, showCopilotDrawer, setShowCopilotDrawer } = useAppContext();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className={`content-area ${activeTab === 'inbox' || activeTab === 'email' || activeTab === 'ai-inbox' ? 'hellomail-page' : activeTab === 'dashboard' ? 'dashboard-page' : ''}`}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/prospecting" element={<ProspectingPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/whatsapp" element={<WhatsappPage />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/calls" element={<CallsPage />} />
            <Route path="/scheduler" element={<SchedulerPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/quote-requests" element={<QuoteRequestsPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payment-links" element={<PaymentLinksPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/hierarchy" element={<HierarchyPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/ai-inbox" element={<AiInboxPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/automations" element={<AutomationsPage />} />
            <Route path="/module-builder" element={<CustomModuleBuilderPage />} />
            <Route path="/custom-module/:moduleId" element={<DynamicModulePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
      <CopilotDrawer isOpen={showCopilotDrawer} onClose={() => setShowCopilotDrawer(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portal/*" element={<ClientPortal />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
