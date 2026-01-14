import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers),
        host: new URL(url).host,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    // Set response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send the response back
    res.status(response.status);
    response.body.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
