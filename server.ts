import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function extractYouTubeId(input: string): { id: string | null; isShort: boolean } {
  const trimmed = input.trim();
  const isShort = /youtube\.com\/shorts\//i.test(trimmed);

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { id: trimmed, isShort: false };
  }

  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /[?&]v=([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return { id: match[1], isShort };
    }
  }

  return { id: null, isShort: false };
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseYouTubeRss(xml: string) {
  const entries: Array<{
    youtubeId: string;
    title: string;
    publishedAt: string;
    description: string;
    views: number;
    thumbnailUrl: string;
  }> = [];

  const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  for (const entry of entryMatches) {
    const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
    const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const viewsMatch = entry.match(/views="(\d+)"/);
    const thumbMatch = entry.match(/<media:thumbnail url="([^"]+)"/);

    if (idMatch?.[1] && titleMatch?.[1]) {
      const youtubeId = idMatch[1].trim();
      entries.push({
        youtubeId,
        title: decodeXmlEntities(titleMatch[1].trim()),
        publishedAt: publishedMatch?.[1]?.trim() ?? new Date().toISOString(),
        description: decodeXmlEntities((descMatch?.[1] ?? '').trim()),
        views: viewsMatch?.[1] ? Number(viewsMatch[1]) : 0,
        thumbnailUrl:
          thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      });
    }
  }

  return entries;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, channel: '@hym_yt' });
  });

  app.get('/api/youtube/feed', async (req, res) => {
    const rawHandle = String(req.query.handle || '@hym_yt').trim();
    const normalizedHandle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;

    try {
      const channelResponse = await fetch(`https://www.youtube.com/${normalizedHandle}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; HYMYTApp/1.0)',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!channelResponse.ok) {
        return res.json({
          synced: false,
          handle: normalizedHandle,
          channelId: null,
          videos: [],
          message: 'No se pudo consultar el perfil público de YouTube en este momento.',
        });
      }

      const html = await channelResponse.text();
      const channelIdMatch =
        html.match(/"channelId":"(UC[a-zA-Z0-9_-]{22})"/) ||
        html.match(/channel_id=(UC[a-zA-Z0-9_-]{22})/) ||
        html.match(/https:\/\/www\.youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/);

      const channelId = channelIdMatch?.[1] ?? null;
      if (!channelId) {
        return res.json({
          synced: false,
          handle: normalizedHandle,
          channelId: null,
          videos: [],
          message: 'Canal encontrado sin ID RSS público disponible.',
        });
      }

      const rssResponse = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
        { signal: AbortSignal.timeout(6000) }
      );

      if (!rssResponse.ok) {
        return res.json({
          synced: false,
          handle: normalizedHandle,
          channelId,
          videos: [],
          message: 'No se pudo leer el feed RSS del canal.',
        });
      }

      const xml = await rssResponse.text();
      const videos = parseYouTubeRss(xml);

      return res.json({
        synced: true,
        handle: normalizedHandle,
        channelId,
        videos,
        message:
          videos.length > 0
            ? `Se sincronizaron ${videos.length} publicaciones desde YouTube.`
            : 'El canal aún no tiene vídeos públicos en su feed RSS.',
      });
    } catch {
      return res.json({
        synced: false,
        handle: normalizedHandle,
        channelId: null,
        videos: [],
        message: 'Modo catálogo local activo (sin acceso externo al feed de YouTube).',
      });
    }
  });

  app.get('/api/youtube/resolve', async (req, res) => {
    const rawUrl = String(req.query.url || '').trim();
    const { id: youtubeId, isShort } = extractYouTubeId(rawUrl);

    if (!youtubeId) {
      return res.status(400).json({
        error: 'Introduce un enlace válido de YouTube (watch, youtu.be o shorts).',
      });
    }

    const canonicalUrl = isShort
      ? `https://www.youtube.com/shorts/${youtubeId}`
      : `https://www.youtube.com/watch?v=${youtubeId}`;

    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (oembedRes.ok) {
        const data = (await oembedRes.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        return res.json({
          youtubeId,
          isShort,
          title: data.title || 'Vídeo de YouTube',
          authorName: data.author_name || 'HYM_YT',
          thumbnailUrl:
            data.thumbnail_url || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
          resolvedFromApi: true,
        });
      }
    } catch {
      // Fallback to canonical YouTube ID metadata below
    }

    return res.json({
      youtubeId,
      isShort,
      title: `Publicación HYM_YT (${youtubeId})`,
      authorName: 'HYM_YT',
      thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      resolvedFromApi: false,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HYM_YT server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
