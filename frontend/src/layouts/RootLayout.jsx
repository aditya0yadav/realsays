import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            {/* Footer could go here */}
        </div>
    );
};

export default RootLayout;
