import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { CHANNEL_SUBSCRIBE_URL } from '../data/channelData';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#perfil', label: 'Perfil' },
    { href: '#videos', label: 'Videos' },
    { href: '#shorts', label: 'Shorts' },
    { href: '#listas', label: 'Listas' },
    { href: '#comunidad', label: 'Comunidad' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0B0D]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#inicio"
          className="font-display text-2xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] rounded-sm"
        >
          HYM_YT
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-white transition-colors duration-150 underline-offset-8 hover:underline decoration-[#E11D48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={CHANNEL_SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#E11D48] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#BE123C] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0D]"
          >
            Suscribirse
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-lg border border-white/15 text-zinc-200 hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0B0D] px-6 py-4">
          <nav className="flex flex-col gap-3" aria-label="Menú móvil">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-zinc-200 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href={CHANNEL_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#E11D48] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#BE123C]"
            >
              Suscribirse en YouTube
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
