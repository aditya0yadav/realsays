import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                {/* Add more routes here later */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
