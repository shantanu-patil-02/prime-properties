import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Mail, X, Shield, Phone, ArrowRight, Instagram, Youtube } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll detection for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll completely when mobile menu is open to prevent background scrolling & glitches
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Insights', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@shantanu_patil_02_',
      href: 'https://www.instagram.com/shantanu_patil_02_?dlrf=dTN2OGY4bmJqaWx0&utm_source=qr',
      icon: <Instagram className="w-4 h-4" />,
      color: 'hover:text-[#E1306C]',
      desc: 'Visual portfolio & reels',
    },
    {
      name: 'WhatsApp',
      handle: '+91 8080489984',
      href: 'https://wa.me/918080489984?text=Hi%2C%20I%20visited%20your%20portfolio!%20of%20Prime%20Properties',
      icon: <FaWhatsapp className="w-4 h-4" />,
      color: 'hover:text-[#25D366]',
      desc: 'Instant confidential chat',
    },
    {
      name: 'Email',
      handle: 'shantanupatil636@gmail.com',
      href: 'mailto:shantanupatil636@gmail.com',
      icon: <Mail className="w-4 h-4" />,
      color: 'hover:text-[#D4AF37]',
      desc: 'Direct broker desk',
    },
    {
      name: 'YouTube',
      handle: 'Prime Properties India',
      href: 'https://youtube.com',
      icon: <Youtube className="w-4 h-4" />,
      color: 'hover:text-[#FF0000]',
      desc: 'Architectural walkthroughs',
    },
  ];

  return (
    <>
      {/* Sticky Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#D4AF37]/20'
            : 'bg-[#FAF8F5] py-3.5 sm:py-4 border-b border-[#D4AF37]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
            <span className="font-serif-luxury text-base sm:text-lg tracking-wider group-hover:opacity-85 transition-opacity">
              <span className="font-bold text-[#17212B]">PRIME</span>{' '}
              <span className="font-light text-[#C5A059]">PROPERTIES</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2C2825]/85">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors whitespace-nowrap py-1 relative hover:text-[#D4AF37] ${
                  location.pathname === link.path
                    ? 'text-[#D4AF37] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4AF37]'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Phone button on tablet/desktop */}
            <a
              href="tel:+918080489984"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C2825] bg-[#F2EFE9] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-[#D4AF37]/15 transition-colors border border-transparent hover:border-[#D4AF37]/30"
              title="Call Direct Broker Line"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden md:inline">+91 8080489984</span>
              <span className="md:hidden">Call</span>
            </a>

            {/* Responsive 4 Social Media Icons on desktop & tablet */}
            <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={social.name}
                  title={`${social.name}: ${social.handle}`}
                  className="w-8 h-8 rounded-full bg-[#2C2825] text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1A1816] hover:scale-105 active:scale-95 transition-all shadow-xs"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Portfolio CTA Button */}
            <Link
              to="/properties"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white bg-[#2C2825] rounded-lg hover:bg-[#D4AF37] hover:text-[#1A1816] transition-all whitespace-nowrap shadow-xs flex items-center gap-1.5"
            >
              <span>Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </Link>

            {/* Mobile menu hamburger toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#2C2825] bg-[#F2EFE9] hover:bg-[#D4AF37]/20 rounded-lg transition-colors focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5 text-[#2C2825]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay (Isolated full viewport overlay) */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] h-[100dvh] w-screen bg-[#FAF8F5] flex flex-col overflow-hidden animate-in fade-in duration-200"
        >
          {/* Top Bar of Mobile Menu */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/25 bg-[#FAF8F5]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <span className="font-serif-luxury text-base tracking-wider">
                <span className="font-bold text-[#17212B]">PRIME</span>{' '}
                <span className="font-light text-[#C5A059]">PROPERTIES</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-[#2C2825] bg-[#F2EFE9] hover:bg-[#D4AF37]/20 rounded-lg transition-colors flex items-center gap-1.5 border border-[#D4AF37]/20"
              aria-label="Close navigation menu"
            >
              <span>Close</span>
              <X className="w-4 h-4 text-[#2C2825]" />
            </button>
          </div>

          {/* Scrollable Content Container (Smooth isolated scrolling) */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 overscroll-contain">
            {/* Primary Navigation Links */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-[#78716C] font-semibold block px-1 mb-2">
                Navigation
              </span>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-serif font-medium py-3 px-3 rounded-lg flex items-center justify-between transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#D4AF37]/15 text-[#2C2825] font-semibold border-l-3 border-[#D4AF37]'
                      : 'text-[#2C2825] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </Link>
              ))}
            </div>

            {/* Quick Action Button */}
            <div>
              <Link
                to="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 bg-[#2C2825] text-white hover:bg-[#D4AF37] hover:text-[#1A1816] rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Explore Verified Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4 Social Media Icons (Responsive & Touch-Optimized) */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-widest text-[#78716C] font-semibold block px-1 mb-3">
                Direct Channels & Social Media
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="p-3 rounded-xl bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#FAF8F5] transition-all flex flex-col gap-1.5 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-[#2C2825] text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#1A1816] flex items-center justify-center transition-colors">
                        {social.icon}
                      </span>
                      <span className="text-[10px] text-[#78716C] font-semibold uppercase tracking-wider">
                        Open
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2C2825]">{social.name}</h4>
                      <p className="text-[10px] text-[#78716C] truncate">{social.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Direct Phone Assistance */}
            <div className="pt-2">
              <a
                href="tel:+918080489984"
                className="flex items-center justify-center gap-2.5 text-xs font-semibold text-[#2C2825] bg-[#F2EFE9] border border-[#D4AF37]/30 py-3.5 rounded-xl hover:bg-[#D4AF37]/20 transition-all"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Call Broker Desk: +91 8080489984</span>
              </a>
            </div>

            {/* Admin Portal Link */}
            <div className="pt-2 pb-4 text-center">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 text-xs text-[#78716C] hover:text-[#2C2825] transition-colors py-2"
              >
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Authorized Administrator Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
