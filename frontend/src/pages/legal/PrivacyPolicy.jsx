import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="py-20 lg:py-32 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-500 text-lg">Last Updated: February 4, 2026</p>
                </div>

                <div className="space-y-12 text-gray-700 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information necessary to provide you with the best survey opportunities. This includes:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, and demographic details.</li>
                            <li><strong>Survey Responses:</strong> The data you provide when completing surveys for our clients.</li>
                            <li><strong>Usage Data:</strong> Information on how you interact with our platform (IP address, browser type).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                        <p>
                            Your privacy is our priority. We use your data to:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Match you with relevant survey opportunities.</li>
                            <li>Process your reward payouts.</li>
                            <li>Improve platform security and user experience.</li>
                            <li>Provide aggregated, anonymous data to market research clients.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing Your Information</h2>
                        <p>
                            We never sell your personally identifiable information to third parties for marketing purposes. Your survey responses are typically shared in an anonymized or aggregated format with researchers. We may share information with trusted service providers who assist us in operating our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal data at any time. You can manage your information directly through your account settings or by contacting our support team.
                        </p>
                    </section>

                    <section className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
                        <p>
                            If you have concerns about your privacy or data usage, please reach out to:
                        </p>
                        <p className="font-semibold text-orange-600 mt-2">privacy@realsays.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
