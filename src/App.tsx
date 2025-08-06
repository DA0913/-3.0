import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ModulesInterface from './components/ModulesInterface';
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
import FeatureModulesContainer from './components/FeatureModulesContainer';
import HomepageCustomerCases from './components/HomepageCustomerCases';
import PartnerSupport from './components/PartnerSupport';
import CustomerServiceButton from './components/CustomerServiceButton';

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
          <HomepageCustomerCases />
          <Services />
          <PartnerSupport />
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
      
      {/* 客服咨询按钮 */}
      <CustomerServiceButton onClick={() => {}} />
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