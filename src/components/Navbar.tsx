import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu,Mail , X, Shield, Phone, ArrowRight,Instagram, Facebook, Linkedin, Youtube, } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Insights', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-x-hidden ${
      isScrolled ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm py-3.5 border-b border-[#D4AF37]/20' : 'bg-[#FAF8F5] py-4 sm:py-5 border-b border-[#D4AF37]/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
          <span className="font-serif-luxury text-sm sm:text-lg tracking-wider group-hover:opacity-80 transition-opacity">
            <span className="font-bold text-[#17212B]">PRIME</span> <span className="font-light text-[#C5A059]">PROPERTIES</span>
          </span>
        </Link>

        {/* Zone 2: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2C2825]/80">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#D4AF37] relative py-1 ${
                location.pathname === link.path ? 'text-[#D4AF37] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D4AF37]' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* <Link
            to="/admin"
            className="hidden lg:flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#2C2825] transition-colors"
            title="Administrator Portal"
          >
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Admin</span>
          </Link> */}
          <a
            href="tel:+919820000000"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#2C2825] bg-[#F2EFE9] px-3 py-2 rounded-md hover:bg-[#D4AF37]/10 transition-colors"
          >
            
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>+91 8080489984</span>
          </a>
          {/* social media */}
          <div className="flex items-center gap-4 pt-2 text-[#D4AF37]">
                        <a href="https://www.instagram.com/shantanu_patil_02_?dlrf=dTN2OGY4bmJqaWx0&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full">
                          <Instagram className="w-4 h-4" />
                        </a>
                        <a
                        href="https://wa.me/918080489984?text=Hi%2C%20I%20visited%20your%20portfolio!%20of%20Prime%20Properties"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Contact me on WhatsApp"
                        title="WhatsApp me"
                        className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full"
                      >
                        <FaWhatsapp  size={20} />
                      </a>
                       <a
                        href="mailto:shantanupatil636@gmail.com"
                        aria-label="Email me"
                        title="Email me for prime properties mps will reply you if they are free..."
                        className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full"
                      >
                        <Mail size={20} />
                      </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full">
                          <Youtube className="w-4 h-4" />
                        </a>
                      </div>
          <Link
            to="/properties"
            className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white bg-[#2C2825] rounded-md hover:bg-[#D4AF37] hover:text-[#2C2825] transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5"
          >
            <span>Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#2C2825] focus:outline-none rounded-lg hover:bg-[#F2EFE9] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile full-window menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 w-full h-full bg-[#FAF8F5] z-[999] overflow-y-auto px-6 py-6 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/25">
            <span className="font-serif-luxury text-xs tracking-widest text-[#2C2825] uppercase font-bold">Navigation Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#2C2825] bg-[#F2EFE9] rounded-lg hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <span>Close</span>
              <X className="w-4 h-4 text-[#2C2825]" />
            </button>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif font-medium text-[#2C2825] hover:text-[#D4AF37] py-3 border-b border-[#F2EFE9] flex items-center justify-between"
            >
              <span>{link.name}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm font-medium text-[#78716C] py-3 border-b border-[#F2EFE9]"
          >
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <span>Administrator Portal</span>
          </Link>
          <a
            href="tel:+919820000000"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#2C2825] py-4 rounded-xl mt-4 shadow-lg hover:bg-[#D4AF37] hover:text-[#1A1816] transition-all"
          >
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>Call Advisory Desk (+91 98200 00000)</span>
          </a>
        </div>
      )}
    </header>
  );
}
