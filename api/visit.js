export default async function handler(req, res) {
  const baseCount = 1091;
  const namespace = 'meet-vaghasiya-portfolio';
  const key = 'visitors';
  const url = `https://counterapi.dev/track/${namespace}/${key}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      return res.status(502).json({ count: baseCount });
    }

    const data = await response.json();
    const rawCount = Number(data.count);
    const safeCount = Number.isFinite(rawCount) ? rawCount : 1;
    const displayCount = baseCount + Math.max(0, safeCount - 1);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ count: displayCount });
  } catch (error) {
    return res.status(500).json({ count: baseCount });
  }
}
