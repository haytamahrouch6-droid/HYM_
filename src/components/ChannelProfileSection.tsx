import {
  ArrowUpRight,
  Calendar,
  Check,
  Copy,
  Pencil,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CHANNEL_SUBSCRIBE_URL, DEFAULT_CHANNEL_PROFILE } from '../data/channelData';
import type { ChannelProfile } from '../types/channel';
import { MediaFrame } from './MediaFrame';

interface ChannelProfileSectionProps {
  profile: ChannelProfile;
  totalVideos: number;
  totalShorts: number;
  savedCount: number;
  onSaveProfile: (next: ChannelProfile) => void;
  onResetProfile: () => void;
}

export function ChannelProfileSection({
  profile,
  totalVideos,
  totalShorts,
  savedCount,
  onSaveProfile,
  onResetProfile,
}: ChannelProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ChannelProfile>(profile);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const openEditor = () => {
    setDraft(profile);
    setFormError(null);
    setSavedNotice(false);
    setIsEditing(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profile.youtubeUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFormError('La imagen debe pesar menos de 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (draft.name.trim().length < 2) {
      setFormError('El nombre del canal debe tener al menos 2 caracteres.');
      return;
    }

    const normalizedHandle = draft.handle.trim().startsWith('@')
      ? draft.handle.trim()
      : `@${draft.handle.trim()}`;

    onSaveProfile({
      ...draft,
      name: draft.name.trim(),
      handle: normalizedHandle,
      creatorName: draft.creatorName.trim() || DEFAULT_CHANNEL_PROFILE.creatorName,
      tagline: draft.tagline.trim() || DEFAULT_CHANNEL_PROFILE.tagline,
      bio: draft.bio.trim() || DEFAULT_CHANNEL_PROFILE.bio,
      schedule: draft.schedule.trim() || DEFAULT_CHANNEL_PROFILE.schedule,
      youtubeUrl: draft.youtubeUrl.trim() || DEFAULT_CHANNEL_PROFILE.youtubeUrl,
      discordUrl: draft.discordUrl.trim(),
      tiktokUrl: draft.tiktokUrl.trim(),
      twitchUrl: draft.twitchUrl.trim(),
    });

    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const socialLinks = [
    { label: 'YouTube', url: profile.youtubeUrl },
    { label: 'Discord', url: profile.discordUrl },
    { label: 'TikTok', url: profile.tiktokUrl },
    { label: 'Twitch', url: profile.twitchUrl },
  ].filter((item) => Boolean(item.url));

  return (
    <section id="perfil" className="border-b border-white/10 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-zinc-400">Identidad del creador</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Perfil del canal
            </h2>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={openEditor}
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-lg border border-white/15 bg-[#12141C] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B1E29] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
            >
              <Pencil className="w-4 h-4 text-[#E11D48]" aria-hidden="true" />
              <span>Editar perfil</span>
            </button>
          )}
        </div>

        {savedNotice && (
          <p
            role="status"
            className="text-xs font-medium text-emerald-400"
          >
            Perfil del canal actualizado correctamente en este dispositivo.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 rounded-xl border border-white/10 bg-[#12141C] p-6 sm:p-8">
            {!isEditing ? (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/15 bg-[#0A0B0D] shrink-0">
                    <MediaFrame
                      src={profile.avatarUrl}
                      alt={`Foto de perfil de ${profile.name}`}
                      fallbackTitle={profile.name}
                      coverTheme="controller"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 min-w-0">
                    <p className="text-xs font-mono text-zinc-400">
                      {profile.handle} <span aria-hidden="true">·</span> Creador: {profile.creatorName}{' '}
                      <span aria-hidden="true">·</span> {profile.language}
                    </p>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      {profile.name}
                    </h3>
                    <p className="text-sm sm:text-base font-medium text-zinc-300">
                      {profile.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-zinc-300 border-t border-white/10 pt-6">
                  {profile.bio}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-6">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-zinc-400">Contenido publicado</p>
                    <p className="text-base font-semibold text-white tabular-nums">
                      {totalVideos} vídeos · {totalShorts} Shorts
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-zinc-400">Ritmo de subida</p>
                    <p className="text-base font-semibold text-white">{profile.schedule}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-zinc-400">Tu lista guardada</p>
                    <p className="text-base font-semibold text-white tabular-nums">
                      {savedCount} vídeos guardados
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                  <a
                    href={CHANNEL_SUBSCRIBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#E11D48] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#BE123C] transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Suscribirse en YouTube</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0D0F15] px-4 py-2.5 text-sm font-medium text-zinc-200 hover:text-white hover:border-white/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? (
                      <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>{copiedUrl ? 'Enlace copiado' : 'Copiar enlace del canal'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-white/15 bg-[#0A0B0D] shrink-0">
                      <MediaFrame
                        src={draft.avatarUrl}
                        alt="Vista previa de avatar"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0D0F15] px-3 py-2 text-xs font-semibold text-white hover:bg-white/5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Cambiar foto de perfil</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-[11px] text-zinc-400">JPG o PNG hasta 2 MB.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onResetProfile();
                      setDraft(DEFAULT_CHANNEL_PROFILE);
                      setIsEditing(false);
                    }}
                    className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Restaurar original</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="prof-name" className="block text-xs font-medium text-zinc-300">
                      Nombre del canal
                    </label>
                    <input
                      id="prof-name"
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prof-handle" className="block text-xs font-medium text-zinc-300">
                      Identificador (@handle)
                    </label>
                    <input
                      id="prof-handle"
                      type="text"
                      value={draft.handle}
                      onChange={(e) => setDraft({ ...draft, handle: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prof-creator" className="block text-xs font-medium text-zinc-300">
                      Nombre del creador
                    </label>
                    <input
                      id="prof-creator"
                      type="text"
                      value={draft.creatorName}
                      onChange={(e) => setDraft({ ...draft, creatorName: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prof-schedule" className="block text-xs font-medium text-zinc-300">
                      Horario de publicación
                    </label>
                    <input
                      id="prof-schedule"
                      type="text"
                      value={draft.schedule}
                      onChange={(e) => setDraft({ ...draft, schedule: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prof-tagline" className="block text-xs font-medium text-zinc-300">
                    Titular corto del canal
                  </label>
                  <input
                    id="prof-tagline"
                    type="text"
                    value={draft.tagline}
                    onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prof-bio" className="block text-xs font-medium text-zinc-300">
                    Descripción del canal
                  </label>
                  <textarea
                    id="prof-bio"
                    rows={3}
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="prof-discord" className="block text-xs font-medium text-zinc-300">
                      Enlace Discord (opcional)
                    </label>
                    <input
                      id="prof-discord"
                      type="url"
                      value={draft.discordUrl}
                      onChange={(e) => setDraft({ ...draft, discordUrl: e.target.value })}
                      placeholder="https://discord.gg/..."
                      className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prof-tiktok" className="block text-xs font-medium text-zinc-300">
                      Enlace TikTok (opcional)
                    </label>
                    <input
                      id="prof-tiktok"
                      type="url"
                      value={draft.tiktokUrl}
                      onChange={(e) => setDraft({ ...draft, tiktokUrl: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                      className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prof-twitch" className="block text-xs font-medium text-zinc-300">
                      Enlace Twitch (opcional)
                    </label>
                    <input
                      id="prof-twitch"
                      type="url"
                      value={draft.twitchUrl}
                      onChange={(e) => setDraft({ ...draft, twitchUrl: e.target.value })}
                      placeholder="https://twitch.tv/..."
                      className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                </div>

                {formError && (
                  <p role="alert" className="text-xs font-medium text-rose-400">
                    {formError}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-[#E11D48] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#BE123C] transition-colors cursor-pointer"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="lg:col-span-4 rounded-xl border border-white/10 bg-[#12141C] p-6 sm:p-8 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Calendar className="w-4 h-4 text-[#E11D48]" aria-hidden="true" />
                <span>Calendario de emisión</span>
              </div>

              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3 space-y-1">
                  <p className="text-sm font-semibold text-white">Martes · 17:00</p>
                  <p className="text-xs text-zinc-400">
                    Música y Beats: remixes, bandas sonoras y diseño de sonido con juegos.
                  </p>
                </div>
                <div className="border-b border-white/10 pb-3 space-y-1">
                  <p className="text-sm font-semibold text-white">Viernes · 18:00</p>
                  <p className="text-xs text-zinc-400">
                    Gaming y Retos: partidas al ritmo de BPM, rankings y directos con el chat.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">Miércoles y Domingo</p>
                  <p className="text-xs text-zinc-400">
                    HYM_YT Shorts con clips rápidos y transformaciones de sonido.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5 space-y-3">
              <p className="text-xs font-mono text-zinc-400">Redes del canal</p>
              <div className="flex flex-col gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0D0F15] px-3.5 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white hover:border-white/25 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  </a>
                ))}
              </div>
              {socialLinks.length === 1 && !isEditing && (
                <p className="text-xs text-zinc-500">
                  Puedes añadir Discord, TikTok o Twitch desde Editar perfil.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
