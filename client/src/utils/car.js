// Araç adı "[HYUNDAI] GrandeurHG HG 300 Premium" formatında geliyor.
// Maker (marka) prefix'ini ve geri kalan model adını ayırır.
export function parseCarName(name = '') {
  const match = name.match(/^\[([^\]]+)\]\s*(.*)$/);
  if (match) {
    return { maker: match[1].trim(), model: match[2].trim() || match[1].trim() };
  }
  return { maker: '', model: name.trim() };
}

export function formatPrice(usd) {
  if (usd == null) return '—';
  return `$${Number(usd).toLocaleString('en-US')}`;
}

export function formatKm(km) {
  if (km == null) return '—';
  return `${Number(km).toLocaleString('en-US')} km`;
}
