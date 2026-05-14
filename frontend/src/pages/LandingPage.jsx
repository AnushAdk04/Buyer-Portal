import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiSearch, FiHome, FiTrendingUp, FiShield, FiArrowRight, FiHeart, FiMessageCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const LandingPage = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosClient.get('/search?limit=4&sort=newest');
        setFeatured(data.properties || []);
      } catch { /* silent */ }
    };
    load();
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] font-sans">
      <SEO title="Home" description="Find your dream home with Buyer Portal. Search properties, compare prices, and connect directly with sellers." />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6">✨ Nepal's Premium Real Estate Portal</span>
              <h1 className="text-5xl md:text-7xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
                Find your perfect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">place to call home.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">Discover verified properties for sale and rent across the country. Connect with sellers and find your dream home today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2">
                  <FiSearch className="text-xl" /> Browse Properties
                </Link>
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                  Join as Seller <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-white dark:bg-[#151515] border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Verified Listings', value: '500+', icon: FiHome },
                { label: 'Active Users', value: '2,000+', icon: FiTrendingUp },
                { label: 'Cities Covered', value: '15+', icon: FiSearch },
                { label: 'Secure Platform', value: '100%', icon: FiShield },
              ].map((stat, idx) => (
                <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx} variants={fadeUp} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                    <stat.icon className="text-2xl" />
                  </div>
                  <p className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">{stat.value}</p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        {featured.length > 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">Latest Properties</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Fresh listings added by our verified sellers.</p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((p, i) => (
                  <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                    <Link to={`/dashboard/properties/${p.id}`} className="group block bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all">
                      <div className="relative h-44 overflow-hidden">
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase">
                          {p.status === 'for_rent' ? 'For Rent' : 'For Sale'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{p.location}</p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-2">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  View All Properties <FiArrowRight />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="py-20 bg-white dark:bg-[#151515] border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">How It Works</h2>
              <p className="text-slate-600 dark:text-slate-400">Three simple steps to your next home.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: FiSearch, title: 'Search & Filter', desc: 'Browse listings with advanced filters by location, price, type, and specs.' },
                { icon: FiHeart, title: 'Save & Compare', desc: 'Favourite properties you love and compare them side by side.' },
                { icon: FiMessageCircle, title: 'Connect & Close', desc: 'Contact sellers directly and make your dream home a reality.' },
              ].map((step, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="text-center p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-colors group">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="text-3xl" />
                  </div>
                  <div className="w-8 h-8 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">{i + 1}</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">Ready to find your next home?</h2>
              <p className="text-xl text-blue-100 mb-10">Join thousands of others who found their dream property through our platform.</p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg transition-all shadow-xl">
                Get Started Now <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
