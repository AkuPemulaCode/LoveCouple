import { Link } from "react-router-dom";
import { GitBranch, X, Film, Video, Globe } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Navigate",
    links: [{ label: "Home", path: "/browse" }],
  },

  {
    heading: "Support",
    links: [
      { label: "Help Center", path: "/browse" },
      { label: "Contact Us", path: "/browse" },
    ],
  },
];

const SOCIALS = [
  { icon: X, label: "Twitter / X", href: "#" },
  { icon: Film, label: "Instagram", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
  { icon: GitBranch, label: "GitHub", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--ps-bg)] border-t border-[var(--ps-border)] overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6c63ff]/60 to-transparent" />

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 pt-16 pb-8">
        {/* Top section — logo + social + tagline */}
        <div className="flex flex-col gap-8 mb-12 md:flex-row md:items-start md:justify-between">
          {/* Logo + tagline */}
          <div className="max-w-xs">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2.5 mb-3 group"
            >
              <img
                src="/images/logo.png"
                alt="Love Couple"
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/15 shadow-[0_0_20px_rgba(108,99,255,0.3)] group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="text-xl font-bold tracking-normal text-white group-hover:text-white transition-colors"
                style={{ fontFamily: "'OLIVER', serif", textShadow: '0 0 16px rgba(255,255,255,0.45)' }}
              >
                Love Couple
              </span>
            </Link>
            <p className="text-[var(--ps-fg-mid)] text-sm leading-relaxed">
              Tau ga ? apa yang membuat hubungan bisa lama ? Komunikasi.
              <br />
              Kenapa komunikasi? Karena hubungan tanpa komunikasi perlahan akan
              kehilangan rasa. Tanpa saling bercerita, memahami, dan
              mendengarkan, kita hanya akan saling menebak.
              <br /> Jadi, jangan hanya mencintai pasanganmu. Bicaralah
              dengannya, dengarkan dia, dan tetap hadir untuknya.
              <br />
              Because sometimes, communication is how love stays alive.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="p-2.5 rounded-lg border border-[var(--ps-border)] bg-[var(--ps-bg-card)] text-[var(--ps-fg-mid)] hover:text-[#6c63ff] hover:border-[#6c63ff]/60 hover:bg-[#6c63ff]/10 hover:shadow-[0_0_12px_rgba(108,99,255,0.3)] transition-all duration-200"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 mb-12 md:grid-cols-4">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3
                className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-4"
                style={{ fontFamily: "Orbitron, monospace" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-[var(--ps-fg-mid)] text-sm hover:text-[var(--ps-fg)] transition-colors duration-200 hover:underline underline-offset-2 decoration-[#6c63ff]/40"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--ps-border)] to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[var(--ps-fg-mid)] text-xs">
          <p>
            © {new Date().getFullYear()}{" "}
            <span
              className="text-[#6c63ff]"
              style={{ fontFamily: "Orbitron, monospace", fontWeight: 700 }}
            >
              Love Couple
            </span>
            . Create By Muhammad Almustofa Khanafi
          </p>

          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
            <span className="text-[var(--ps-fg-mid)]">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
