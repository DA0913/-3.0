import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ModulesInterface from './components/ModulesInterface';
import TrustSection from './components/TrustSection';
import Services from './components/Services';
import Footer from './components/Footer';
import ProductIntroduction from './components/ProductIntroduction';
import SolutionsPage from './components/SolutionsPage';
import TradeKnowledge from './components/TradeKnowledge';
import CustomerCasesPage from './components/CustomerCasesPage';
import AboutPage from './components/AboutPage';
import FloatingNav from './components/FloatingNav';
import IntegratedAdminApp from './components/IntegratedAdminApp';
import FormButton from './components/FormButton';
import PartnershipSection from './components/PartnershipSection';
import FeatureModulesContainer from './components/FeatureModulesContainer';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' ? (
        <>
          <Hero />
          <ModulesInterface />
          <FeatureModulesContainer />
          <TrustSection />
          <Services />
          <PartnershipSection />
          <Footer />
        </>
      ) : currentPage === 'product' ? (
        <>
          <ProductIntroduction />
          <Footer />
        </>
      ) : currentPage === 'solutions' ? (
        <>
          <SolutionsPage />
          <Footer />
        </>
      ) : currentPage === 'knowledge' ? (
        <>
          <TradeKnowledge />
          <Footer />
        </>
      ) : currentPage === 'cases' ? (
        <>
          <CustomerCasesPage />
          <Footer />
        </>
      ) : currentPage === 'about' ? (
        <>
          <AboutPage />
          <Footer />
        </>
      ) : null}
    </div>
  );
}

function App() {
  return (
    <Router>
      <FloatingNav />
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<IntegratedAdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;