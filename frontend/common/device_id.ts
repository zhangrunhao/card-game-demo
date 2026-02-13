const DEVICE_ID_KEY = "device_id";
const DEVICE_ID_LENGTH = 12;
const DEVICE_ID_PATTERN = /^[A-Za-z0-9]{12}$/;
const COOKIE_DOMAIN = ".zhangrh.shop";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 5;
const ID_CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let cachedDeviceId: string | null = null;

const isValidDeviceId = (value: string | null | undefined): value is string =>
  typeof value === "string" && DEVICE_ID_PATTERN.test(value);

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${encodeURIComponent(name)}=`;
  const pair = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));
  if (!pair) {
    return null;
  }
  return decodeURIComponent(pair.slice(prefix.length));
};

const writeCookie = (name: string, value: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Domain=${COOKIE_DOMAIN}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

const readStoredDeviceId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const local = window.localStorage.getItem(DEVICE_ID_KEY);
    if (isValidDeviceId(local)) {
      return local;
    }
  } catch {
    // ignore localStorage access failure
  }

  const cookie = readCookie(DEVICE_ID_KEY);
  return isValidDeviceId(cookie) ? cookie : null;
};

const writeStoredDeviceId = (deviceId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
  } catch {
    // ignore localStorage write failure
  }

  writeCookie(DEVICE_ID_KEY, deviceId);
};

const generateDeviceId = () => {
  const randomBytes = new Uint8Array(DEVICE_ID_LENGTH);
  const cryptoObj = globalThis.crypto;

  if (cryptoObj?.getRandomValues) {
    cryptoObj.getRandomValues(randomBytes);
  } else {
    for (let index = 0; index < randomBytes.length; index += 1) {
      randomBytes[index] = Math.floor(Math.random() * 256);
    }
  }

  let nextId = "";
  for (let index = 0; index < randomBytes.length; index += 1) {
    nextId += ID_CHARSET[randomBytes[index] % ID_CHARSET.length];
  }
  return nextId;
};

export const getOrCreateDeviceId = () => {
  if (isValidDeviceId(cachedDeviceId)) {
    return cachedDeviceId;
  }

  const stored = readStoredDeviceId();
  if (stored) {
    cachedDeviceId = stored;
    writeStoredDeviceId(stored);
    return stored;
  }

  const created = generateDeviceId();
  writeStoredDeviceId(created);
  cachedDeviceId = created;
  return created;
};
