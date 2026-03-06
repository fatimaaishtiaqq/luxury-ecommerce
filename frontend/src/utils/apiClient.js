const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://luxury-ecommerce-snowy.vercel.app" : "http://localhost:5000");

// Simple in-memory cache to avoid refetching the same resources repeatedly
const cache = new Map();
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds

const buildKey = (path) => `${API_BASE_URL}${path}`;

export const getWithCache = async (path, { ttl = DEFAULT_TTL_MS } = {}) => {
    const key = buildKey(path);
    const now = Date.now();

    const cached = cache.get(key);
    if (cached && cached.expiry > now) {
        return cached.data;
    }

    const res = await fetch(key);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Failed to fetch ${path}`);
    }

    const data = await res.json();
    cache.set(key, { data, expiry: now + ttl });
    return data;
};

export const invalidateCache = (pathPrefix = '') => {
    const fullPrefix = pathPrefix ? buildKey(pathPrefix) : '';
    for (const key of cache.keys()) {
        if (!fullPrefix || key.startsWith(fullPrefix)) {
            cache.delete(key);
        }
    }
};

export { API_BASE_URL };

