export type SyncTopic = "announcements" | "prayer" | "hijri" | "sidebar";

type SyncMessage = {
  topic: SyncTopic;
  at: number;
  sender: string;
};

const CHANNEL_NAME = "masjid-sync";
const TAB_ID = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);

function getChannel(): BroadcastChannel | null {
  try {
    if (typeof BroadcastChannel === "undefined") return null;
    return new BroadcastChannel(CHANNEL_NAME);
  } catch {
    return null;
  }
}

export function broadcastSync(topic: SyncTopic) {
  const channel = getChannel();
  if (!channel) return;
  const msg: SyncMessage = { topic, at: Date.now(), sender: TAB_ID };
  try {
    channel.postMessage(msg);
  } catch {
    // ignore
  }
}

export function listenSync(handler: (topic: SyncTopic) => void): () => void {
  const channel = getChannel();
  if (!channel) return () => {};

  const onMessage = (event: MessageEvent) => {
    const msg = event.data as Partial<SyncMessage>;
    if (!msg || typeof msg !== "object") return;
    if (msg.sender === TAB_ID) return;
    if (msg.topic === "announcements" || msg.topic === "prayer" || msg.topic === "hijri" || msg.topic === "sidebar") {
      handler(msg.topic);
    }
  };

  channel.addEventListener("message", onMessage);
  return () => {
    try {
      channel.removeEventListener("message", onMessage);
      channel.close();
    } catch {
      // ignore
    }
  };
}
