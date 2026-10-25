import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Youtube, Shield } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#1A1816] text-[#FAF8F5] pt-16 pb-12 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <span className="font-serif-luxury text-lg tracking-wider text-white">
              <span className="font-bold text-white">PRIME</span> <span className="font-light text-[#D4AF37]">PROPERTIES</span>
            </span>
            <p className="text-sm text-[#78716C] leading-relaxed">
              Pioneering ultra-luxury real estate advisory services across Mumbai and Pune. Specializing in landmark penthouses, historic estates, and waterfront residences for discerning UHNWIs.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#D4AF37]">
              <a
                href="https://www.instagram.com/shantanu_patil_02_?dlrf=dTN2OGY4bmJqaWx0&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram: @shantanu_patil_02_"
                className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full hover:bg-[#D4AF37] hover:scale-105 active:scale-95"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/918080489984?text=Hi%2C%20I%20visited%20your%20portfolio!%20of%20Prime%20Properties"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp: +91 8080489984"
                className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full hover:bg-[#D4AF37] hover:scale-105 active:scale-95"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a
                href="mailto:shantanupatil636@gmail.com"
                aria-label="Email"
                title="Email: shantanupatil636@gmail.com"
                className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full hover:bg-[#D4AF37] hover:scale-105 active:scale-95"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="YouTube Channel"
                className="hover:text-white transition-colors p-2 bg-[#2C2825] rounded-full hover:bg-[#D4AF37] hover:scale-105 active:scale-95"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">Explore Portfolio</h4>
            <ul className="space-y-2.5 text-sm text-[#A8A29E]">
              <li><Link to="/properties?city=Mumbai" className="hover:text-[#D4AF37] transition-colors">Mumbai Residences</Link></li>
              <li><Link to="/properties?city=Pune" className="hover:text-[#D4AF37] transition-colors">Pune Estates & Villas</Link></li>
              <li><Link to="/properties?type=Penthouse" className="hover:text-[#D4AF37] transition-colors">Sky Penthouses</Link></li>
              <li><Link to="/properties?type=Villa" className="hover:text-[#D4AF37] transition-colors">Luxury Mansions</Link></li>
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Prime Properties</Link></li>
            </ul>
          </div>

          {/* Col 3: Offices */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">Flagship Offices</h4>
            <div className="space-y-3 text-sm text-[#A8A29E]">
              <div>
                <strong className="text-white block font-medium">Mumbai Flagship</strong>
                <span>Worli Seaface, The Imperial Tower, Mumbai 400018</span>
              </div>
              <div>
                <strong className="text-white block font-medium">Pune Advisory</strong>
                <span>Koregaon Park North, Lane 7, Pune 411001</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Admin */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide">Advisory Desk</h4>
            <div className="space-y-3 text-sm text-[#A8A29E]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+91 98200 00000 / +91 20 6600 9999</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>advisory@primeproperties.in</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 text-xs text-[#D4AF37] bg-[#2C2825] px-3.5 py-2 rounded-md hover:bg-[#D4AF37] hover:text-[#1A1816] transition-colors font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Authorized Admin Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2C2825] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>© 2026 Prime Properties India. All rights reserved. Authorized Administrator: shantanupatil636@gmail.com</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Terms of Advisory</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Regulatory Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
