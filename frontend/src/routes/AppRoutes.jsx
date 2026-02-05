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

// Info Pages
import ResearchPanels from '../pages/info/ResearchPanels';
import FAQ from '../pages/info/FAQ';

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Auth Routes (Standalone) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />

                    {/* Information Routes */}
                    <Route path="research-panels" element={<ResearchPanels />} />
                    <Route path="faqs" element={<FAQ />} />

                    {/* Legal Routes */}
                    <Route path="terms-of-service" element={<TermsOfService />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="cookie-policy" element={<CookiePolicy />} />

                    {/* Add more routes here later */}
                </Route>
            </Routes>
        </>
    );
};

export default AppRoutes;
