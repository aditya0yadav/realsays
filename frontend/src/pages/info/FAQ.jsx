import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How do I start earning rewards on RealSays?",
            answer: "Simply create a free account, complete your profile to 100%, and match with surveys. Once you complete a survey successfully, the rewards will be credited to your account balance."
        },
        {
            question: "Is RealSays really free to join?",
            answer: "Yes, 100%! We will never ask for payment or subscription fees. Our platform is supported by the researchers who want to hear your voice."
        },
        {
            question: "What is the minimum payout threshold?",
            answer: "The minimum payout threshold depends on the withdrawal method you choose. Typically, it ranges from $5.00 to $10.00. You can check the current thresholds in your Rewards dashboard."
        },
        {
            question: "Why was my survey disqualified?",
            answer: "Researchers often look for a very specific demographic. If your responses indicate you don't fit that criteria, the survey may end early. We try to match you as accurately as possible, but disqualifications can still happen."
        },
        {
            question: "How long does it take to receive my payment?",
            answer: "Most payouts are processed within 24-48 business hours. Some methods, like bank transfers, may take up to 3-5 business days depending on your financial institution."
        },
        {
            question: "Can I use RealSays on my mobile device?",
            answer: "Absolutely! RealSays is fully optimized for mobile browsers. You can take surveys on the go, whether you're commuting or relaxing at home."
        }
    ];

    return (
        <div className="py-20 lg:py-32 bg-gray-50/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-4 border-b-2 border-teal-600 inline-block">Support Center</h2>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-gray-500 text-lg mt-4 font-medium">Everything you need to know about getting the most out of RealSays.</p>
                </div>

                {/* Search Bar Placeholder */}
                <div className="relative mb-12">
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full h-16 pl-14 pr-6 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-lg transition-all"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                    ? 'bg-white border-blue-200 shadow-lg'
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full px-8 py-6 flex justify-between items-center text-left"
                            >
                                <span className={`text-lg font-bold ${openIndex === index ? 'text-blue-600' : 'text-slate-900'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? <ChevronUp className="text-blue-600 shrink-0" /> : <ChevronDown className="text-gray-400 shrink-0" />}
                            </button>

                            {openIndex === index && (
                                <div className="px-8 pb-8">
                                    <div className="h-[1px] bg-gray-100 mb-6" />
                                    <p className="text-gray-600 text-lg leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h3>
                    <p className="text-gray-500 mb-8">Can't find the answer you're looking for? Reach out to our friendly support team.</p>
                    <a href="mailto:support@realsays.com" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors inline-block active:scale-95 shadow-lg">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
