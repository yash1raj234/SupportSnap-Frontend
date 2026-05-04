export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrl(input: string): string {
  if (input.startsWith('http://') || input.startsWith('https://')) return input;
  return `https://${input}`;
}

export function generateEmbedCode(botId: string, primaryColor = '#000000'): string {
  return `<script
  src="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supportsnap.ai'}/embed.js"
  data-bot-id="${botId}"
  data-primary-color="${primaryColor}"
  async
></script>`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  return Promise.resolve();
}
