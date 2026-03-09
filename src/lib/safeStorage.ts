type StorageBackend = "local" | "session" | "memory";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/**
 * In-memory fallback/override.
 * - For memory backend: this is the primary store.
 * - For local/session backend: this stores last-write values when persistent write fails,
 *   so reads don't immediately revert to stale persistent data.
 */
const memoryStore = new Map<string, string>();

let cachedBackend: StorageBackend | null = null;
let cachedStorage: StorageLike | null = null;

function testStorage(storage: StorageLike): boolean {
  try {
    const key = "__masjid_storage_test__";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function resolveStorage(): { backend: StorageBackend; storage: StorageLike | null } {
  if (cachedBackend !== null && (cachedBackend === "memory" || cachedStorage !== null)) {
    return { backend: cachedBackend, storage: cachedStorage };
  }

  try {
    if (typeof localStorage !== "undefined" && testStorage(localStorage)) {
      cachedBackend = "local";
      cachedStorage = localStorage;
      return { backend: cachedBackend, storage: cachedStorage };
    }
  } catch {
    // ignore
  }

  try {
    if (typeof sessionStorage !== "undefined" && testStorage(sessionStorage)) {
      cachedBackend = "session";
      cachedStorage = sessionStorage;
      return { backend: cachedBackend, storage: cachedStorage };
    }
  } catch {
    // ignore
  }

  cachedBackend = "memory";
  cachedStorage = null;
  return { backend: cachedBackend, storage: null };
}

export function getStorageBackend(): StorageBackend {
  return resolveStorage().backend;
}

export function safeGetItem(key: string): string | null {
  // Prefer in-memory override first. This prevents stale reads when a previous
  // persistent write failed (quota/blocked).
  if (memoryStore.has(key)) return memoryStore.get(key) ?? null;

  const { storage, backend } = resolveStorage();
  if (backend === "memory") return null;

  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  const { storage, backend } = resolveStorage();

  if (backend === "memory") {
    memoryStore.set(key, value);
    return true;
  }

  try {
    storage?.setItem(key, value);
    memoryStore.delete(key); // clear stale override after successful persistent write
    return true;
  } catch {
    memoryStore.set(key, value);
    return false;
  }
}

export function safeRemoveItem(key: string): boolean {
  const { storage, backend } = resolveStorage();
  memoryStore.delete(key);

  if (backend === "memory") return true;

  try {
    storage?.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function emitSameTabStorageEvents(customEventName?: string) {
  window.dispatchEvent(new Event("storage"));
  if (customEventName) window.dispatchEvent(new Event(customEventName));
}

