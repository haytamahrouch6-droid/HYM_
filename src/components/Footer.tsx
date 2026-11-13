import { ArrowUpRight } from 'lucide-react';
import { CHANNEL_URL } from '../data/channelData';

export function Footer() {
  return (
    <footer className="bg-[#0A0B0D] py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <p className="font-display text-xl font-bold tracking-tight text-white">HYM_YT</p>
          <p className="text-xs text-zinc-400">
            Gaming, música, beats y directos · Canal oficial @hym_yt
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-400"
          aria-label="Enlaces del pie"
        >
          <a href="#perfil" className="hover:text-white transition-colors">
            Perfil
          </a>
          <a href="#videos" className="hover:text-white transition-colors">
            Videos
          </a>
          <a href="#shorts" className="hover:text-white transition-colors">
            Shorts
          </a>
          <a href="#listas" className="hover:text-white transition-colors">
            Listas
          </a>
          <a href="#comunidad" className="hover:text-white transition-colors">
            Comunidad
          </a>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-white hover:text-[#E11D48] transition-colors"
          >
            <span>YouTube</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </nav>

        <p className="text-xs text-zinc-500 tabular-nums">© 2026 HYM_YT</p>
      </div>
    </footer>
  );
}
