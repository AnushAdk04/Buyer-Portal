import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FiHome, FiShield, FiUsers, FiHeart, FiSearch, FiArrowRight } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 25 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] font-sans">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-20 pb-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-semibold mb-5">About Us</span>
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-6 leading-tight">Building Nepal's most trusted <br className="hidden sm:block" /> real estate platform.</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">We're on a mission to make property discovery simple, transparent, and accessible for everyone across the country.</p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white dark:bg-[#151515] border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-3">What Drives Us</h2>
              <p className="text-slate-600 dark:text-slate-400">Our core principles shape everything we build.</p>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: FiShield, title: 'Trust & Safety', desc: 'All listings are verified. Your data is encrypted and secure.' },
                { icon: FiSearch, title: 'Effortless Discovery', desc: 'Smart search and filters make finding the right property easy.' },
                { icon: FiUsers, title: 'Community First', desc: 'We connect buyers and sellers with transparency at the core.' },
                { icon: FiHeart, title: 'Built with Care', desc: 'Every feature is designed with our users in mind.' },
              ].map((v, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-colors text-center">
                  <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5">
                    <v.icon className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <p>BuyerPortal was born from a simple idea: finding property in Nepal shouldn't be complicated. We saw how fragmented the market was — scattered listings, unreliable information, and no easy way for buyers to compare options.</p>
                <p>So we built a platform that brings everything together. Verified listings, advanced search, direct seller contact, and a modern experience that works beautifully on any device. Whether you're looking for a house in Kathmandu, an apartment in Pokhara, or land in Chitwan — we've got you covered.</p>
                <p>We're a small team of developers and designers passionate about real estate technology. Every feature we ship is driven by feedback from real users like you.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center text-white">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <FiHome className="text-5xl mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Start Exploring Today</h2>
              <p className="text-lg text-blue-100 mb-8">Browse hundreds of properties and find the perfect place to call home.</p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg transition-all shadow-xl">
                Create Free Account <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
