import { Gamepad2, Headphones, Mic2, Music2, Sliders, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { CoverTheme } from '../types/channel';

interface MediaFrameProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  coverTheme?: CoverTheme;
  className?: string;
  imgClassName?: string;
}

function ThemeArtwork({
  theme = 'controller',
  title,
}: {
  theme?: CoverTheme;
  title?: string;
}) {
  const configs: Record<
    CoverTheme,
    { gradient: string; accent: string; bars: number[]; Icon: typeof Gamepad2 }
  > = {
    waveform: {
      gradient: 'from-[#0E1628] via-[#0B0D14] to-[#1A1014]',
      accent: '#38BDF8',
      bars: [28, 56, 84, 46, 92, 68, 38, 76, 54, 88, 42, 64],
      Icon: Headphones,
    },
    arena: {
      gradient: 'from-[#1D1114] via-[#0B0D14] to-[#0E1826]',
      accent: '#E11D48',
      bars: [42, 74, 58, 90, 48, 82, 64, 96, 52, 70, 44, 60],
      Icon: Gamepad2,
    },
    remix: {
      gradient: 'from-[#1C140E] via-[#0B0D14] to-[#101827]',
      accent: '#F97316',
      bars: [34, 62, 48, 78, 66, 90, 50, 72, 86, 40, 58, 46],
      Icon: Music2,
    },
    arcade: {
      gradient: 'from-[#0D1A26] via-[#0A0B0D] to-[#1C1310]',
      accent: '#38BDF8',
      bars: [50, 38, 80, 62, 44, 88, 72, 54, 94, 48, 68, 40],
      Icon: Sparkles,
    },
    studio: {
      gradient: 'from-[#16131C] via-[#0A0B0D] to-[#121822]',
      accent: '#F97316',
      bars: [40, 58, 72, 64, 82, 52, 76, 88, 60, 46, 68, 54],
      Icon: Sliders,
    },
    controller: {
      gradient: 'from-[#101622] via-[#0A0B0D] to-[#1C1215]',
      accent: '#E11D48',
      bars: [36, 70, 54, 84, 60, 78, 42, 90, 66, 50, 74, 44],
      Icon: Mic2,
    },
  };

  const { gradient, accent, bars, Icon } = configs[theme];

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br ${gradient} p-5 select-none w-full h-full`}
      role="img"
      aria-label={title || 'Portada de HYM_YT'}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${theme}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${theme})`} />
      </svg>

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-400">
          HYM_YT
        </span>
        <Icon className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
      </div>

      <div className="relative my-auto flex items-end justify-center gap-1.5 h-16 px-4">
        {bars.map((height, idx) => (
          <span
            key={idx}
            className="w-1.5 rounded-full opacity-75"
            style={{
              height: `${height}%`,
              backgroundColor: idx % 3 === 0 ? accent : 'rgba(255,255,255,0.22)',
            }}
          />
        ))}
      </div>

      <div className="relative h-2" />
    </div>
  );
}

export function MediaFrame({
  src,
  alt,
  fallbackTitle,
  coverTheme = 'controller',
  className = '',
  imgClassName = 'w-full h-full object-cover',
}: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={className}>
        <ThemeArtwork theme={coverTheme} title={fallbackTitle || alt} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#12141C] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={imgClassName}
        loading="lazy"
      />
    </div>
  );
}
