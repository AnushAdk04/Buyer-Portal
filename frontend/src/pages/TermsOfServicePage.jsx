import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-slate-600 dark:text-slate-400">Last updated: May 2026</p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp} 
            className="bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm"
          >
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using BuyerPortal, you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Use of the Platform</h2>
              <p className="mb-6">
                BuyerPortal provides a real estate listing platform. We do not own the properties listed and are not a party to any 
                transaction between buyers and sellers. Users are responsible for verifying all information before making any decisions.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. User Accounts</h2>
              <p className="mb-6">
                To access certain features, you must register for an account. You agree to provide accurate information and keep your 
                account details secure. You are responsible for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Property Listings</h2>
              <p className="mb-6">
                Sellers must ensure all property listings are accurate, legal, and not misleading. BuyerPortal reserves the right to remove 
                any listing that violates these terms or is deemed inappropriate without prior notice.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Intellectual Property</h2>
              <p className="mb-6">
                All content, trademarks, logos, and materials on BuyerPortal are the property of their respective owners. You may not use, 
                reproduce, or distribute any content without explicit permission.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Limitation of Liability</h2>
              <p className="mb-6">
                BuyerPortal shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use 
                or inability to use our services, including but not limited to reliance on any information obtained from the platform.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use 
                of the platform constitutes acceptance of the revised terms.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
