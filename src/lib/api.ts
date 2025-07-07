export interface Voice {
  id: string;
  title: string | null;
}

export async function fetchVoices(): Promise<Voice[]> {
  const res = await fetch('/api/voice/list');
  if (!res.ok) throw new Error('Failed to fetch voices');
  const data = await res.json();
  return data.voices;
}

export async function fetchUserStatus(): Promise<boolean> {
  const res = await fetch('/api/user');
  if (!res.ok) throw new Error('Failed to fetch user status');
  const data = await res.json();
  return data.isPremium;
}
