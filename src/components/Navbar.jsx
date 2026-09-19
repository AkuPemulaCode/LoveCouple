import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', path: '/browse' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Scroll detection for transparent → solid transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Main navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[var(--ps-bg-95)] backdrop-blur-md border-b border-[var(--ps-border-60)] shadow-[0_4px_30px_rgba(108,99,255,0.1)]'
            : 'bg-gradient-to-b from-[var(--ps-bg-80)] to-transparent'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left — Logo + Nav links */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/browse" className="flex items-center gap-2.5 shrink-0 group">
                <img
                  src="/images/logo.png"
                  alt="Love Couple"
                  className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/15 shadow-[0_0_20px_rgba(108,99,255,0.3)] group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className="text-2xl md:text-[1.7rem] font-semibold tracking-normal text-[var(--ps-fg)] transition-colors"
                  style={{ fontFamily: "'OLIVER', serif" }}
                >
                  Love Couple
                </span>
              </Link>

              {/* Desktop nav links */}
              <ul className="items-center hidden gap-1 lg:flex">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-200 ${
                        isActive(link.path)
                          ? 'text-[#6c63ff] bg-[#6c63ff]/15 border border-[#6c63ff]/40'
                          : 'text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] hover:bg-[var(--ps-bg-mid-70)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--ps-bg-track)] border-r border-[var(--ps-border)] shadow-[4px_0_32px_rgba(108,99,255,0.2)] ps-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--ps-border)]">
              <Link
                to="/browse"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <img
                  src="/images/logo.png"
                  alt="Love Couple"
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/15"
                />
                <span
                  className="text-xl font-semibold tracking-normal text-[var(--ps-fg)]"
                  style={{ fontFamily: "'OLIVER', serif" }}
                >
                  Love Couple
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="p-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-[#6c63ff]/15 text-[#6c63ff] border border-[#6c63ff]/40'
                      : 'text-[var(--ps-fg-mid)] hover:text-[var(--ps-fg)] hover:bg-[var(--ps-bg-mid-70)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
