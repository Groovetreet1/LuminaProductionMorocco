"use client";

const STORAGE_KEY = "lumina-utm";

export type UtmData = {
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
};

export function captureUtm() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utm: UtmData = {};
  for (const key of ["utm_source", "utm_campaign", "utm_medium", "utm_content"] as const) {
    const value = params.get(key);
    if (value) {
      utm[key.replace("utm_", "utm") as keyof UtmData] = value.slice(0, 100);
    }
  }
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  }
}

export function getUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}") as UtmData;
  } catch {
    return {};
  }
}
