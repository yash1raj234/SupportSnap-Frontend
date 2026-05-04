const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// Exact shape returned by POST /api/generate and GET /api/bot/:botId
export interface BotStats {
  pagesScraped: number;
  totalChunks: number;
  vectorsStored: number;
  processingTime: string;
}

export interface BotInfo {
  botId: string;
  url: string;
  stats: BotStats;
  config: {
    model: string;
    embeddingModel: string;
    topK: number;
    similarityThreshold: number;
  };
  createdAt: string;
}

export interface GenerateResult {
  botId: string;
  stats: BotStats;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json();
  if (!res.ok) {
    const err = body?.error;
    throw new ApiError(
      err?.message ?? 'Request failed',
      res.status,
      err?.code ?? 'UNKNOWN'
    );
  }
  return body.data ?? body;
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;
}

export async function generateBot(url: string): Promise<GenerateResult> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: normalizeUrl(url) }),
  });
  return handleResponse<GenerateResult>(res);
}

// Backend only accepts { botId, message } — no history parameter
export async function* chatWithBot(
  botId: string,
  message: string
): AsyncGenerator<string> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ botId, message }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body?.error?.message ?? 'Chat request failed',
      res.status,
      body?.error?.code ?? 'CHAT_ERROR'
    );
  }

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const parsed = JSON.parse(line.slice(6));
          if (parsed.type === 'token' && parsed.content) {
            yield parsed.content as string;
          }
          if (parsed.type === 'error') {
            throw new ApiError(
              parsed.error?.message ?? 'Stream error',
              500,
              'STREAM_ERROR'
            );
          }
        } catch (e) {
          if (e instanceof ApiError) throw e;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function getBotInfo(botId: string): Promise<BotInfo> {
  const res = await fetch(`${API_BASE}/api/bot/${botId}`);
  return handleResponse<BotInfo>(res);
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
