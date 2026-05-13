import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-600 dark:text-slate-400">Last updated: May 2026</p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp} 
            className="bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm"
          >
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
              <p className="mb-6">
                When you use BuyerPortal, we may collect personal information such as your name, email address, phone number, and account details. 
                We also collect technical data including IP addresses, browser types, and usage statistics through cookies.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-6">
                We use the collected information to provide and improve our services, facilitate communication between buyers and sellers, 
                personalize your user experience, and send important updates or promotional content related to your interests.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data Sharing and Disclosure</h2>
              <p className="mb-6">
                We do not sell your personal information to third parties. We may share necessary details with trusted partners who assist us 
                in operating the platform, or if required by law to protect our rights and user safety.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Data Security</h2>
              <p className="mb-6">
                We implement strict security measures to protect your data from unauthorized access, alteration, or disclosure. However, 
                no transmission method over the internet is entirely secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Rights</h2>
              <p className="mb-6">
                You have the right to access, update, or delete your personal information. You can manage your preferences through your 
                account settings or by contacting our support team directly.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Cookies and Tracking</h2>
              <p className="mb-6">
                Our platform uses cookies to enhance functionality and analyze user behavior. You can disable cookies in your browser settings, 
                but this may affect your experience and access to certain features on the site.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Contact Us</h2>
              <p>
                If you have any questions or concerns regarding this Privacy Policy, please contact us at privacy@buyerportal.com or through 
                our Help Center.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
