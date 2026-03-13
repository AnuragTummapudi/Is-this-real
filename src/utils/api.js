const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function getApiBase() {
  return API_BASE;
}

async function postWithFallback(path, fallbackPath, options) {
  const first = await fetch(`${API_BASE}${path}`, options);
  if (first.status !== 404) {
    return first;
  }
  return fetch(`${API_BASE}${fallbackPath}`, options);
}

function normalizeResult(payload) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  return {
    ...payload,
    ai_fake_probability:
      payload.ai_fake_probability ?? payload.fake_probability ?? 0,
  };
}

export async function analyzeFile(file) {
  const data = new FormData();
  data.append('file', file);

  const isVideo = file.type.startsWith('video/');
  const response = await postWithFallback(
    isVideo ? '/api/analyze/video' : '/api/analyze/image',
    isVideo ? '/analyze/video' : '/analyze/image',
    {
      method: 'POST',
      body: data,
    }
  );

  if (!response.ok) {
    throw new Error(`Server ${response.status}`);
  }

  const payload = await response.json();
  return normalizeResult(payload);
}

export async function analyzeUrl(url) {
  const response = await postWithFallback(
    '/api/analyze/url',
    '/analyze/url',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type: 'auto' }),
    }
  );

  if (!response.ok) {
    throw new Error(`Server ${response.status}`);
  }

  const payload = await response.json();
  return normalizeResult(payload);
}
