import { WifiOff, RefreshCw, Zap } from 'lucide-react';

export default function OfflinePage() {
  const retry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--ps-bg)] flex items-center justify-center px-6">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none ps-grid-bg" />

      <div className="relative z-10 w-full max-w-md text-center ps-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-[#6c63ff] rounded-sm rotate-12" />
            <div className="absolute inset-0 bg-[#00d4ff] rounded-sm -rotate-12 opacity-60" />
            <Zap className="relative z-10 w-5 h-5 text-white m-2.5" strokeWidth={3} />
          </div>
          <span
            className="text-2xl font-black tracking-widest uppercase"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            <span className="text-[#6c63ff] ps-neon-text">Pixel</span>
            <span className="text-[#00d4ff]">Sync</span>
          </span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--ps-bg-mid)] border border-[var(--ps-border)] flex items-center justify-center ps-pulse-glow">
          <WifiOff className="w-9 h-9 text-[#6c63ff]" />
        </div>

        <h1
          className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-3 text-[var(--ps-fg)]"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          No Internet Connection
        </h1>

        <p className="text-[var(--ps-fg-mid)] text-sm leading-relaxed mb-8">
          Kamu sedang tidak terhubung ke internet. Periksa koneksi Wi-Fi atau data selulermu,
          lalu coba lagi. Koneksi akan terdeteksi otomatis saat kembali online.
        </p>

        <button
          onClick={retry}
          className="flex items-center gap-2 mx-auto px-8 py-3 bg-[#6c63ff] hover:bg-[#4f46e5] text-white font-bold text-sm rounded transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(108,99,255,0.4)]"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}