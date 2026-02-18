import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import ScrollToTop from '../components/common/ScrollToTop';

// Legal Pages
import TermsOfService from '../pages/legal/TermsOfService';
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import CookiePolicy from '../pages/legal/CookiePolicy';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Onboarding from '../pages/onboarding/Onboarding';
import Dashboard from '../pages/dashboard/Dashboard';

// Info Pages
import ResearchPanels from '../pages/info/ResearchPanels';
import FAQ from '../pages/info/FAQ';

// Admin Pages
import QualificationMapping from '../pages/admin/QualificationMapping';
import AdminLogin from '../pages/admin/AdminLogin';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Auth Routes (Standalone) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />

                    {/* Information Routes */}
                    <Route path="research-panels" element={<ResearchPanels />} />
                    <Route path="faqs" element={<FAQ />} />

                    {/* Legal Routes */}
                    <Route path="terms-of-service" element={<TermsOfService />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="cookie-policy" element={<CookiePolicy />} />

                    {/* Admin Routes */}
                    <Route path="admin/mappings" element={<QualificationMapping />} />

                    {/* Add more routes here later */}
                </Route>
            </Routes>
        </>
    );
};

export default AppRoutes;
