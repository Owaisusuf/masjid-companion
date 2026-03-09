type StorageBackend = "local" | "session" | "memory";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

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
  if (cachedBackend && cachedStorage !== null) return { backend: cachedBackend, storage: cachedStorage };

  // Prefer localStorage when writable.
  try {
    if (typeof localStorage !== "undefined" && testStorage(localStorage)) {
      cachedBackend = "local";
      cachedStorage = localStorage;
      return { backend: cachedBackend, storage: cachedStorage };
    }
  } catch {
    // ignore
  }

  // Fallback: sessionStorage (often works when cookies/localStorage are blocked).
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
  const { storage, backend } = resolveStorage();
  if (backend === "memory") return memoryStore.get(key) ?? null;
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
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveItem(key: string): boolean {
  const { storage, backend } = resolveStorage();
  if (backend === "memory") {
    memoryStore.delete(key);
    return true;
  }
  try {
    storage?.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function emitSameTabStorageEvents(customEventName?: string) {
  // "storage" doesn't fire on the same tab for localStorage writes.
  window.dispatchEvent(new Event("storage"));
  if (customEventName) window.dispatchEvent(new Event(customEventName));
}
