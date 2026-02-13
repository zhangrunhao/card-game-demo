import { getOrCreateDeviceId } from "./device_id";

const TRACK_ENDPOINT = "/track";

type TrackParams = Record<string, unknown>;

type TrackPayload = {
  time: number;
  project: string;
  device_id: string;
  event: string;
  params: TrackParams;
};

type TrackInput = {
  event: string;
  params?: TrackParams;
  project: string;
};

const inFlightImages: HTMLImageElement[] = [];

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "{}";
  }
};

const postTrackByImage = (payload: TrackPayload) => {
  if (typeof window === "undefined") {
    return;
  }

  const query = new URLSearchParams({
    time: String(payload.time),
    project: payload.project,
    device_id: payload.device_id,
    event: payload.event,
    params: safeStringify(payload.params),
  });

  const img = new Image();
  inFlightImages.push(img);
  const clear = () => {
    const index = inFlightImages.indexOf(img);
    if (index !== -1) {
      inFlightImages.splice(index, 1);
    }
  };
  img.onload = clear;
  img.onerror = clear;
  img.src = `${TRACK_ENDPOINT}?${query.toString()}`;
};

export const track = ({ event, params = {}, project }: TrackInput) => {
  const payload: TrackPayload = {
    time: Date.now(),
    project,
    device_id: getOrCreateDeviceId(),
    event,
    params,
  };

  postTrackByImage(payload);
  return payload;
};
