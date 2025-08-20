// 共通フェッチ（JSON前提）
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include', // セッションCookie
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  // 204 No Content 対応
  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    let payload: any = null;
    try { payload = await res.json(); } catch { /* 非JSONもありえる */ }
    const err = new Error(payload?.error || res.statusText);
    (err as any).status = res.status;
    (err as any).payload = payload;
    throw err;
  }
  return res.json() as Promise<T>;
}

/* =========================
   型
========================= */
export type User = {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
};

export type TimeSlot = {
  id: number;
  restaurant_id: number;
  start_time: string;
  end_time: string;
  capacity: number;
};

export type Reservation = {
  id: number;
  restaurant_id: number;
  timeslot_id: number;
  date: string;        // "YYYY-MM-DD"
  party_size: number;
  status: 'booked' | 'canceled';
  created_at?: string;
};

export type CreateReservationPayload = {
  restaurant_id: number;
  timeslot_id: number;
  date: string;            // 'YYYY-MM-DD'
  party_size: number;
  course_id?: string;      // 将来的に必須にしても良い
  course_name?: string;
  course_price?: number;
  metadata?: Record<string, any>;
};

/* =========================
   認証API
========================= */
export const AuthAPI = {
  me: () => api<{ user: User }>('/api/auth/me'),
  signup: (body: { email: string; password: string; full_name: string; phone?: string }) =>
    api<{ user: User }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    api<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => api<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  health: () => api<{ status: 'ok' }>('/api/auth/health'),
};

/* =========================
   予約API
========================= */
export const ReservationAPI = {
  timeslots: () => api<TimeSlot[]>('/api/timeslots'),
  create: (input: CreateReservationPayload) =>
    api<{ reservation: Reservation }>('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  my: () => api<Reservation[]>('/api/reservations/my'),
  cancel: (id: number) => api<{ ok: true }>(`/api/reservations/${id}`, { method: 'DELETE' }),
};

/* =========================
   予約一覧＆キャンセル
========================= */
// 既存の export async function api<T>(...) はそのまま

export type MyReservation = {
  id: number
  restaurant_id: number
  date: string       // "YYYY-MM-DD"
  timeslot_id: number
  party_size: number
  status: 'booked' | 'canceled'
  created_at?: string
}

export async function fetchMyReservations(): Promise<MyReservation[]> {
  return api<MyReservation[]>('/api/reservations/my', { method: 'GET' })
}

export async function cancelReservation(id: number): Promise<{ ok: true }> {
  return api<{ ok: true }>(`/api/reservations/${id}`, { method: 'DELETE' })
}

export async function fetchTimeslots(): Promise<TimeSlot[]> {
  const res = await fetch('/api/timeslots')
  if (!res.ok) throw new Error('Failed to fetch timeslots')
  return res.json()
}