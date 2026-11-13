import { CheckCircle2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { CommunityProposal, PollOption } from '../types/channel';

interface CommunitySectionProps {
  pollOptions: PollOption[];
  votedOptionId: string | null;
  onVote: (optionId: string) => void;
  proposals: CommunityProposal[];
  onSubmitProposal: (proposal: Omit<CommunityProposal, 'id' | 'createdAt'>) => void;
}

export function CommunitySection({
  pollOptions,
  votedOptionId,
  onVote,
  proposals,
  onSubmitProposal,
}: CommunitySectionProps) {
  const [author, setAuthor] = useState('');
  const [topic, setTopic] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const totalVotes = pollOptions.reduce((sum, opt) => sum + opt.votes, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (author.trim().length < 2) {
      setFormError('Indica tu nombre o @usuario (mínimo 2 caracteres).');
      return;
    }
    if (topic.trim().length < 8) {
      setFormError('Describe el juego, reto o beat que quieres ver (mínimo 8 caracteres).');
      return;
    }
    if (referenceUrl.trim() && !/^https?:\/\/.+/i.test(referenceUrl.trim())) {
      setFormError('El enlace opcional debe empezar por http:// o https://.');
      return;
    }

    onSubmitProposal({
      author: author.trim(),
      topic: topic.trim(),
      referenceUrl: referenceUrl.trim() || undefined,
    });

    setAuthor('');
    setTopic('');
    setReferenceUrl('');
    setFormSuccess(true);
  };

  return (
    <section id="comunidad" className="border-b border-white/10 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-xs font-mono text-zinc-400">Participación directa</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Comunidad HYM_YT
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#12141C] p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-zinc-400 tabular-nums">
                Encuesta abierta <span aria-hidden="true">·</span>{' '}
                {new Intl.NumberFormat('es-ES').format(totalVotes)} votos
              </p>
              <h3 className="font-display text-2xl font-bold text-white">
                ¿Qué vídeo estrenamos este viernes en HYM_YT?
              </h3>
            </div>

            <div className="space-y-3">
              {pollOptions.map((option) => {
                const percentage =
                  totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                const isSelected = votedOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onVote(option.id)}
                    aria-pressed={isSelected}
                    className={`relative w-full overflow-hidden rounded-lg border text-left p-4 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] ${
                      isSelected
                        ? 'border-[#E11D48] bg-[#1A131A]'
                        : 'border-white/10 bg-[#0D0F15] hover:border-white/25'
                    }`}
                  >
                    {votedOptionId && (
                      <div
                        aria-hidden="true"
                        style={{ width: `${percentage}%` }}
                        className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                          isSelected ? 'bg-[#E11D48]/25' : 'bg-white/5'
                        }`}
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-white">{option.label}</span>
                      {votedOptionId && (
                        <span className="font-mono text-xs font-semibold text-zinc-200 tabular-nums shrink-0">
                          {percentage}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-zinc-400">
              {votedOptionId
                ? 'Voto registrado en tu dispositivo. Puedes cambiar tu elección en cualquier momento.'
                : 'Pulsa una opción para votar y consultar el reparto actual.'}
            </p>
          </div>

          <div className="lg:col-span-6 rounded-xl border border-white/10 bg-[#12141C] p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-zinc-400">Buzón de ideas</p>
              <h3 className="font-display text-2xl font-bold text-white">
                Propón un juego, reto o beat para el canal
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="proposal-author" className="block text-xs font-medium text-zinc-300">
                  Nombre o @usuario de YouTube
                </label>
                <input
                  id="proposal-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ej. @alex_beats"
                  className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proposal-topic" className="block text-xs font-medium text-zinc-300">
                  Juego, reto o canción que te gustaría ver
                </label>
                <textarea
                  id="proposal-topic"
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej. Haz un remix Lo-Fi con la música del menú y juega una ranked a 170 BPM..."
                  className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proposal-url" className="block text-xs font-medium text-zinc-300">
                  Enlace de referencia o maqueta (opcional)
                </label>
                <input
                  id="proposal-url"
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://www.youtube.com/..."
                  className="w-full rounded-lg border border-white/15 bg-[#0A0B0D] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-400">
                  {formError}
                </p>
              )}

              {formSuccess && (
                <p className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Propuesta enviada a la lista de próximas grabaciones.</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto rounded-lg bg-[#E11D48] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#BE123C] transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Enviar propuesta
              </button>
            </form>

            {proposals.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <p className="text-xs font-mono text-zinc-400">Últimas propuestas enviadas</p>
                <ul className="space-y-2">
                  {proposals.slice(0, 3).map((item) => (
                    <li
                      key={item.id}
                      className="text-xs text-zinc-300 flex items-baseline justify-between gap-3"
                    >
                      <span className="truncate">
                        <strong className="font-semibold text-white">{item.author}</strong>:{' '}
                        {item.topic}
                      </span>
                      <span className="font-mono text-zinc-500 shrink-0">{item.createdAt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
