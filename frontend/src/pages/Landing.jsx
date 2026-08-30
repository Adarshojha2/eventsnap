import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, QrCode, Upload, Download, Shield, BarChart2, Check, Star, ChevronDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const Landing = () => {
  return (
    <div>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="es-gradient-hero" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.3), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,101,132,0.25), transparent)', pointerEvents: 'none' }} />

        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.4)', borderRadius: 50, padding: '6px 16px', marginBottom: 24 }}>
                  <Camera size={14} color="#a89fff" />
                  <span style={{ fontSize: '0.8rem', color: '#a89fff', fontWeight: 600 }}>No App Required • Free Forever</span>
                </div>
                <h1 className="es-headline" style={{ color: 'white', marginBottom: 24 }}>
                  One QR.<br />
                  <span style={{ background: 'linear-gradient(135deg, #a89fff, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Every Memory.
                  </span>
                </h1>
                <p className="es-subheadline" style={{ marginBottom: 40, maxWidth: 480 }}>
                  Share every photo from your wedding, birthday, puja, or any event with everyone — instantly. Guests upload too. Zero apps needed.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/register" className="btn-es-primary btn" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                    🎉 Create Your Event
                  </Link>
                  <a href="#how-it-works" className="btn-es-outline btn" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                    How It Works
                  </a>
                </div>
                <div className="d-flex align-items-center gap-4 mt-4" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  {['500+ Events Created', '50K+ Photos Shared', '100% Free to Start'].map((t) => (
                    <span key={t} className="d-flex align-items-center gap-2">
                      <Check size={14} color="#00D4AA" /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <div className="col-lg-6 d-none d-lg-block">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
                <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
                  {/* Mock phone with gallery */}
                  <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: 32, padding: 24, border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ background: '#1a1a2e', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
                      <div style={{ padding: '12px 16px', background: 'rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Camera size={16} color="white" />
                        <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Adarsh & Priya Wedding 💍</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: 8 }}>
                        {[...Array(9)].map((_, i) => (
                          <div key={i} style={{ aspectRatio: '1', borderRadius: 6, background: `hsl(${240 + i * 20}, 60%, ${30 + i * 5}%)` }} />
                        ))}
                      </div>
                      <div style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                        1,248 Photos • 82 Videos
                      </div>
                    </div>
                    {/* QR Card */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 64, height: 64, background: '#1a1a2e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <QrCode size={40} color="white" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.9rem' }}>Scan to View Photos</div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>eventsnap.app/e/WDNG24</div>
                        <div style={{ fontSize: '0.7rem', color: '#00D4AA', fontWeight: 600 }}>No app needed ✓</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="es-section bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e' }}>How It Works</h2>
            <p style={{ color: '#6c757d', maxWidth: 500, margin: '12px auto 0', fontSize: '1rem' }}>
              Create your event in minutes. Share one QR. Everyone stays connected.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { num: '01', icon: '🎉', title: 'Create Event', desc: 'Set up your event with name, date, type, and privacy settings in under 2 minutes.' },
              { num: '02', icon: '📸', title: 'Upload Photos', desc: 'Upload hundreds of photos at once. Organize into albums. Your photographer can upload too.' },
              { num: '03', icon: '🔷', title: 'Share QR Code', desc: 'Your unique QR code is instantly generated. Print it, WhatsApp it, or display it on screen.' },
              { num: '04', icon: '👥', title: 'Everyone Views & Uploads', desc: 'Guests scan QR, view the beautiful gallery, download their favorites, and upload their own photos.' },
            ].map((step) => (
              <div key={step.num} className="col-sm-6 col-lg-3">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <div className="es-card h-100 p-4 text-center">
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #5849e8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', margin: '0 auto 16px' }}>
                      {step.num}
                    </div>
                    <div style={{ fontSize: '2rem', marginBottom: 12 }}>{step.icon}</div>
                    <h6 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{step.title}</h6>
                    <p style={{ color: '#6c757d', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="es-section" style={{ background: '#f8f9ff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e' }}>Everything You Need</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: QrCode, title: 'Instant QR Access', desc: 'Generate QR codes in seconds. No app installation. Guests just scan and see the gallery instantly.', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
              { icon: Upload, title: 'Guest Photo Upload', desc: 'Let guests contribute their own photos. Perfect for capturing every angle of the celebration.', color: '#FF6584', bg: 'rgba(255,101,132,0.1)' },
              { icon: Camera, title: 'Beautiful Gallery', desc: 'Masonry layout with full-screen lightbox viewer. Every photo looks stunning on any device.', color: '#00D4AA', bg: 'rgba(0,212,170,0.1)' },
              { icon: Shield, title: 'Privacy Controls', desc: 'Public, QR-only, PIN-protected, or private. You decide who sees your event photos.', color: '#f7971e', bg: 'rgba(247,151,30,0.1)' },
              { icon: BarChart2, title: 'Event Analytics', desc: 'Track QR scans, gallery views, downloads, and guest uploads with a simple dashboard.', color: '#6C63FF', bg: 'rgba(108,99,255,0.1)' },
              { icon: Download, title: 'Bulk Downloads', desc: 'Download individual photos or entire albums as a ZIP file. Your memories, always accessible.', color: '#FF6584', bg: 'rgba(255,101,132,0.1)' },
            ].map((f) => (
              <div key={f.title} className="col-md-6 col-lg-4">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <div className="es-card h-100 p-4">
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <f.icon size={22} color={f.color} />
                    </div>
                    <h6 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{f.title}</h6>
                    <p style={{ color: '#6c757d', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="es-section bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e' }}>Perfect For Every Occasion</h2>
          </div>
          <div className="row g-3">
            {[
              { emoji: '💍', title: 'Weddings', desc: 'Mehendi, haldi, ceremony, reception — all in one gallery.' },
              { emoji: '🎂', title: 'Birthdays', desc: 'From baby showers to milestone birthdays.' },
              { emoji: '🏢', title: 'Corporate Events', desc: 'Team outings, conferences, product launches.' },
              { emoji: '🎓', title: 'College Functions', desc: 'Fests, convocations, farewell parties.' },
              { emoji: '🪔', title: 'Pujas & Festivals', desc: 'Ganesh puja, Diwali, Navratri celebrations.' },
              { emoji: '✈️', title: 'Trips & Tours', desc: 'Group tours, family vacations, trekking.' },
            ].map((uc) => (
              <div key={uc.title} className="col-6 col-md-4 col-lg-2">
                <div className="es-card p-3 text-center h-100" style={{ cursor: 'default' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{uc.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e', marginBottom: 4 }}>{uc.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d', lineHeight: 1.5 }}>{uc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="es-section" style={{ background: '#f8f9ff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e' }}>Simple Pricing</h2>
            <p style={{ color: '#6c757d', marginTop: 12 }}>Start free. Upgrade when you need more.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              {
                name: 'Free', price: '₹0', period: 'forever',
                features: ['1 Event', '500 Photos', 'Basic QR Code', '30-day storage', 'Guest Access'],
                cta: 'Get Started Free', ctaVariant: 'outline', highlighted: false,
              },
              {
                name: 'Pro', price: '₹999', period: '/month',
                features: ['Unlimited Events', '10,000 Photos', 'Videos Support', 'Guest Uploads', 'Analytics Dashboard', '1-year storage', 'Custom QR'],
                cta: 'Start Pro Trial', ctaVariant: 'primary', highlighted: true,
                badge: '🔥 Most Popular',
              },
              {
                name: 'Photographer', price: '₹2,999', period: '/month',
                features: ['Everything in Pro', 'Unlimited Storage', 'Client Galleries', 'Photographer Branding', 'AI Face Search (soon)', 'Priority Support'],
                cta: 'Go Photographer', ctaVariant: 'outline', highlighted: false,
              },
            ].map((plan) => (
              <div key={plan.name} className="col-md-6 col-lg-4">
                <div
                  className="es-card h-100 p-4"
                  style={{
                    border: plan.highlighted ? '2px solid #6C63FF' : '1px solid #e8e8f0',
                    position: 'relative',
                    transform: plan.highlighted ? 'scale(1.03)' : 'none',
                    boxShadow: plan.highlighted ? '0 16px 48px rgba(108,99,255,0.2)' : '',
                  }}
                >
                  {plan.badge && (
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: 'white', borderRadius: 50, padding: '4px 16px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a2e', marginBottom: 8 }}>{plan.name}</div>
                  <div className="d-flex align-items-baseline gap-1 mb-4">
                    <span style={{ fontWeight: 900, fontSize: '2.4rem', color: '#1a1a2e' }}>{plan.price}</span>
                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>{plan.period}</span>
                  </div>
                  <div className="mb-4">
                    {plan.features.map((f) => (
                      <div key={f} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.875rem' }}>
                        <Check size={16} color="#00D4AA" strokeWidth={3} />
                        <span style={{ color: '#495057' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/register"
                    className="btn w-100"
                    style={{
                      borderRadius: 10, fontWeight: 700, padding: '11px',
                      background: plan.highlighted ? 'linear-gradient(135deg, #6C63FF, #5849e8)' : 'transparent',
                      color: plan.highlighted ? 'white' : '#6C63FF',
                      border: plan.highlighted ? 'none' : '2px solid #6C63FF',
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="es-section bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e' }}>What People Say</h2>
          </div>
          <div className="row g-4">
            {[
              { name: 'Priya Sharma', event: 'Wedding', rating: 5, text: 'EventSnap made our wedding so much more beautiful! All 300+ guests could access 2000+ photos instantly by just scanning a QR code. No WhatsApp group chaos!', avatar: 'P' },
              { name: 'Rahul Mehra', event: 'Corporate Event', rating: 5, text: 'We used EventSnap for our annual team outing. Our entire team of 150 people could upload and view photos in real time. Absolutely seamless experience.', avatar: 'R' },
              { name: 'Sneha Patel', event: 'Birthday Party', rating: 5, text: 'My daughter\'s birthday was captured beautifully! All relatives from different cities could view and download photos directly. So simple and elegant.', avatar: 'S' },
            ].map((t) => (
              <div key={t.name} className="col-md-4">
                <div className="es-card h-100 p-4">
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} color="#ffd200" fill="#ffd200" />)}
                  </div>
                  <p style={{ color: '#495057', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20, fontSize: '0.9rem' }}>
                    "{t.text}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6c757d' }}>{t.event} Organizer</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="es-section" style={{ background: '#f8f9ff' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e' }}>Frequently Asked Questions</h2>
          </div>
          <div className="accordion" id="faqAccordion">
            {[
              { q: 'Do guests need to create an account?', a: 'No! Guests just scan the QR code or open the event link and directly see the gallery. Zero accounts, zero app downloads required.' },
              { q: 'How many photos can guests upload?', a: 'Guests can upload up to 10 photos per session. The event owner can enable or disable guest uploads per event.' },
              { q: 'Is the QR code permanent?', a: 'The QR code stays active as long as the event is active. You can set an expiry date (30/60/90 days or 1 year) or keep it active forever.' },
              { q: 'Can I password-protect my event?', a: 'Yes! Set a PIN for your event. Guests will need to enter the PIN before accessing the gallery. Perfect for private events.' },
              { q: 'What file formats are supported?', a: 'We support JPEG, PNG, WebP, and GIF for photos, and MP4 and WebM for videos.' },
              { q: 'Can I download all photos at once?', a: 'Yes! Download individual photos, select multiple, or download an entire album as a ZIP file.' },
            ].map((faq, i) => (
              <div key={i} className="accordion-item mb-2" style={{ border: '1px solid #e8e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <h6 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`} style={{ fontWeight: 600, fontSize: '0.95rem', background: 'white' }}>
                    {faq.q}
                  </button>
                </h6>
                <div id={`faq${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body" style={{ color: '#6c757d', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="es-gradient-hero py-5">
        <div className="container text-center py-4">
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: 16 }}>
            Ready to capture every memory?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 32, fontSize: '1.05rem' }}>
            Create your first event free. No credit card needed.
          </p>
          <Link to="/register" className="btn-es-primary btn" style={{ fontSize: '1.05rem', padding: '14px 40px' }}>
            🎉 Start for Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
