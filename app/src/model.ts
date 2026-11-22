// Source: RICHER_ME_MASTER_HANDOVER.md. Financial records and prices are illustrative.
export type Kind = 'Subscriptions' | 'Banks' | 'Investments' | 'Expenses' | 'Bills';
export type Merchant = {
    id: string;
    name: string;
    mark: string;
    color: string;
    bg: string;
    kind: Kind;
    amount: number;
    day: number;
    uses: number | null;
    paused?: boolean;
    renewal?: string;
    cadence?: 'monthly' | 'annual';
    billingMonth?: number;
    expiredAt?: string;
    isNew?: boolean;
};
export type Account = {
    id: string;
    name: string;
    balance: number;
    connected: boolean;
};
export type State = {
    modelVersion?: number;
    removedServices?: string[];
    lastChecked?: string;
    email?: string;
    income: number;
    payday: number;
    merchants: Merchant[];
    accounts: Account[];
    permissions: {
        analysis: boolean;
        usage: boolean;
    };
    reminders: string[];
    dismissed: string[];
    buffer: number;
    reduced: boolean;
    name: string;
};
export const ANCHOR = '2026-11-22';
export const date = (s: string) => new Date(s + 'T00:00:00Z');
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const money = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
export const shortDate = (s: string) => date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
export const fullDate = (s: string) => date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const sub = (id: string, name: string, mark: string, color: string, bg: string, amount: number, day: number, uses: number | null): Merchant => ({ id, name, mark, color, bg, amount, day, uses, kind: 'Subscriptions' });
export const seed: State = { modelVersion: 2, removedServices: [], income: 80000, payday: 28, merchants: [
        sub('netflix', 'Netflix', 'N', '#ee2334', '#141414', 649, 5, 2),
        sub('spotify', 'Spotify', 'spotify', '#0c1710', '#1ed760', 119, 26, 24),
        sub('apple', 'iCloud+', 'apple', '#fff', '#28292c', 75, 9, null),
        sub('adobe', 'Adobe', 'adobe', '#fff', '#e82d24', 1675, 27, 18),
        sub('prime', 'Prime Video', 'prime', '#fff', '#058bd5', 125, 14, 4),
        sub('youtube', 'YouTube', 'youtube', '#f52625', '#f3f3f2', 149, 25, 16),
        sub('hotstar', 'JioHotstar', '✦', '#fff', '#6231e9', 299, 19, 1),
        sub('chatgpt', 'ChatGPT', '◎', '#fff', '#118575', 1999, 21, 22),
        sub('vpn', 'NordVPN', 'VPN', '#fff', '#1a3865', 199, 23, null),
        sub('strava', 'Strava', 'strava', '#fff', '#f34d1e', 249, 11, 8),
        sub('cult', 'Cult.fit', 'cult', '#fff', '#252629', 999, 16, 12),
        sub('notion', 'Notion', 'N̲', '#171717', '#f3f3f2', 800, 8, 14),
        { id: 'hdfc', name: 'HDFC Bank', mark: 'hdfc', color: '#fff', bg: '#125199', kind: 'Banks', amount: 32000, day: 28, uses: null },
        { id: 'sbi', name: 'SBI', mark: 'sbi', color: '#fff', bg: '#0753c5', kind: 'Banks', amount: 13000, day: 28, uses: null },
        { id: 'demat', name: 'Zerodha', mark: 'Z', color: '#fff', bg: '#2066ba', kind: 'Investments', amount: 185000, day: 3, uses: null },
        { id: 'epf', name: 'EPF', mark: 'EPF', color: '#ddd', bg: '#33363a', kind: 'Investments', amount: 240000, day: 28, uses: null },
        { id: 'dining', name: 'Dining', mark: 'dining', color: '#eee', bg: '#3b3030', kind: 'Expenses', amount: 5000, day: 18, uses: null },
        { id: 'groceries', name: 'Groceries', mark: 'basket', color: '#eee', bg: '#343c32', kind: 'Expenses', amount: 7500, day: 7, uses: null },
        { id: 'rent', name: 'Rent', mark: 'home', color: '#eee', bg: '#34343d', kind: 'Expenses', amount: 22000, day: 1, uses: null },
        { id: 'electricity', name: 'Electricity', mark: 'electricity', color: '#e5e8e5', bg: '#3b3830', kind: 'Bills', amount: 1500, day: 24, uses: null },
        { id: 'cable', name: 'Cable TV', mark: 'cable', color: '#e5e8e5', bg: '#353438', kind: 'Bills', amount: 200, day: 7, uses: null },
        { id: 'wifi', name: 'Home Wi-Fi', mark: 'wifi', color: '#e5e8e5', bg: '#323b3d', kind: 'Bills', amount: 800, day: 9, uses: null },
        { id: 'househelp', name: 'House help', mark: 'help', color: '#e5e8e5', bg: '#3d3535', kind: 'Bills', amount: 2500, day: 1, uses: null },
        { id: 'snacks', name: 'Snack box', mark: 'snacks', color: '#e5e8e5', bg: '#3d372e', kind: 'Bills', amount: 900, day: 15, uses: null },
        { id: 'mobile', name: 'Mobile plan', mark: 'mobile', color: '#e5e8e5', bg: '#323b36', kind: 'Bills', amount: 499, day: 13, uses: null },
        { id: 'gas', name: 'Cooking gas', mark: 'gas', color: '#e5e8e5', bg: '#3e3530', kind: 'Bills', amount: 600, day: 20, uses: null },
        { id: 'insurance', name: 'Health insurance', mark: 'insurance', color: '#e5e8e5', bg: '#35363e', kind: 'Bills', amount: 14400, day: 17, uses: null, cadence: 'annual', billingMonth: 4, renewal: '2027-04-17' },
        { id: 'transport', name: 'Transport', mark: 'transport', color: '#e5e8e5', bg: '#323839', kind: 'Expenses', amount: 3500, day: 10, uses: null },
        { id: 'vehicle-insurance', name: 'Vehicle insurance', mark: 'vehicle', color: '#e5e8e5', bg: '#353c40', kind: 'Bills', amount: 7200, day: 10, uses: null, cadence: 'annual', billingMonth: 8, renewal: '2027-08-10' },
        { id: 'annual-filing', name: 'Annual filing fee', mark: 'N', color: '#e5e8e5', bg: '#394039', kind: 'Bills', amount: 3000, day: 20, uses: null, cadence: 'annual', billingMonth: 7, renewal: '2027-07-20' },
        { ...sub('linkedin-ended', 'LinkedIn Premium', 'in', '#fff', '#2867a0', 999, 12, null), paused: true, expiredAt: '2026-10-12' },
        { ...sub('sonyliv-ended', 'Sony LIV', 'LIV', '#eee', '#433740', 299, 18, null), paused: true, expiredAt: '2026-09-18' }
    ], accounts: [{ id: 'hdfc', name: 'HDFC salary •• 4821', balance: 32000, connected: true }, { id: 'sbi', name: 'SBI savings •• 7902', balance: 13000, connected: true }], permissions: { analysis: false, usage: false }, reminders: [], dismissed: [], buffer: 30000, reduced: false, name: 'Rahul Mehta' };
export const cloneSeed = (): State => structuredClone(seed);
export const activeService = (m: Merchant) => !m.paused && !m.expiredAt;
export const monthlyCost = (m: Merchant) => m.cadence === 'annual' ? Math.round(m.amount / 12 * 100) / 100 : m.amount;
export function retentionEnd(m: Merchant) { const d = date(m.expiredAt || ANCHOR); d.setUTCMonth(d.getUTCMonth() + 4); return iso(d); }
export const visibleMerchants = (s: State) => s.merchants.filter(m => !s.removedServices?.includes(m.id) && (!m.expiredAt || retentionEnd(m) >= ANCHOR));
export function normalizeState(raw: State): State { const defaults = cloneSeed(), removed = raw.removedServices || []; const records = raw.merchants.map(m => m.id === 'insurance' && !m.cadence && m.amount === 1200 ? { ...m, amount: 14400, cadence: 'annual' as const, billingMonth: 4, renewal: '2027-04-17' } : m); return { ...defaults, ...raw, modelVersion: 2, removedServices: removed, merchants: [...records, ...defaults.merchants.filter(m => !records.some(old => old.id === m.id) && !removed.includes(m.id))].filter(m => !removed.includes(m.id)) }; }
export function reductionPlan(s: State, target: number, preferred: string[] = []) {
    let remaining = Math.max(0, target);
    const chosen: Merchant[] = [];
    const active = subs(s).filter(activeService);
    const candidates = [...preferred.map(id => active.find(m => m.id === id)).filter((m): m is Merchant => !!m), ...active.filter(m => !preferred.includes(m.id) && m.uses !== null).sort((a, b) => (a.uses ?? 0) - (b.uses ?? 0))];
    for (const m of candidates) {
        const cost = monthlyCost(m);
        if (cost > 0 && cost <= remaining + .001) {
            chosen.push(m);
            remaining = Math.round((remaining - cost) * 100) / 100;
        }
    }
    return { ids: chosen.map(m => m.id), subscriptions: chosen, subscriptionReduction: Math.round((target - remaining) * 100) / 100, livingReduction: remaining };
}
export const foundService: Merchant = { id: 'canva', name: 'Canva', mark: 'C', color: '#fff', bg: '#5266bd', kind: 'Subscriptions', amount: 499, day: 15, uses: 5, renewal: '2026-12-15', isNew: true };
export function autoCheck(s: State): State { const add = !s.merchants.some(m => m.id === foundService.id) && !s.removedServices?.includes(foundService.id); return { ...s, lastChecked: new Date().toISOString(), merchants: add ? [...s.merchants, { ...foundService }] : s.merchants }; }
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export const subs = (s: State) => s.merchants.filter(m => m.kind === 'Subscriptions');
export const living = (s: State) => s.merchants.filter(m => m.kind === 'Bills' || m.kind === 'Expenses').filter(activeService).reduce((a, m) => round(a + monthlyCost(m)), 0);
export const bills = (s: State) => s.merchants.filter(m => m.kind === 'Bills');
export const billMonthly = (s: State) => bills(s).filter(activeService).reduce((a, m) => round(a + monthlyCost(m)), 0);
export const monthly = (s: State) => subs(s).filter(activeService).reduce((a, m) => round(a + monthlyCost(m)), 0);
export function nextRenewal(m: Merchant) {
    if (m.renewal && m.renewal > ANCHOR)
        return m.renewal;
    const d = date(ANCHOR);
    if (m.cadence === 'annual') {
        let year = d.getUTCFullYear();
        let n = new Date(Date.UTC(year, (m.billingMonth || 1) - 1, m.day));
        if (n <= d)
            n = new Date(Date.UTC(year + 1, (m.billingMonth || 1) - 1, m.day));
        return iso(n);
    }
    let n = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), m.day));
    if (n <= d)
        n = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, Math.min(m.day, new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 2, 0)).getUTCDate())));
    return iso(n);
}
export type CashEvent = {
    date: string;
    label: string;
    amount: number;
    type: 'income' | 'expense' | 'investment' | 'subscription';
};
export type DayPoint = {
    date: string;
    balance: number;
    baseline: number;
    events: CashEvent[];
};
export function endFor(range: number) {
    const d = date(ANCHOR);
    if (range === 0)
        d.setUTCDate(d.getUTCDate() + 14);
    else
        d.setUTCMonth(d.getUTCMonth() + range);
    return iso(d);
}
export function forecast(s: State, range: number, simulate: string[] = [], adjustment = 0) {
    const start = date(ANCHOR), end = date(endFor(range));
    const events: CashEvent[] = [];
    const projected: CashEvent[] = [];
    const push = (ev: CashEvent, skip = false) => {
        events.push(ev);
        if (!skip)
            projected.push({ ...ev });
    };
    for (let t = start.getUTCFullYear() * 12 + start.getUTCMonth(); t <= end.getUTCFullYear() * 12 + end.getUTCMonth(); t++) {
        const year = Math.floor(t / 12), month = t % 12;
        const add = (day: number, label: string, amount: number, type: CashEvent['type'], skip = false, notBefore?: string) => {
            const dt = iso(new Date(Date.UTC(year, month, Math.min(day, new Date(Date.UTC(year, month + 1, 0)).getUTCDate()))));
            if (dt > ANCHOR && dt <= iso(end) && (!notBefore || dt >= notBefore))
                push({ date: dt, label, amount, type }, skip);
        };
        if (s.accounts.some(a => a.id === 'hdfc' && a.connected))
            add(s.payday ?? 28, 'Net salary · HDFC', s.income ?? 80000, 'income');
        s.merchants.filter(m => (m.kind === 'Bills' || m.kind === 'Expenses') && activeService(m)).forEach(m => {
            if (m.cadence !== 'annual' || month === (m.billingMonth || 1) - 1)
                add(m.day, m.name + (m.cadence === 'annual' ? ' · annual bill' : m.kind === 'Bills' ? ' bill' : ' budget'), -m.amount, 'expense', false, m.renewal);
        });
        add(3, 'SIP transfer · Zerodha', -10000, 'investment');
        if (adjustment) {
            const dt = iso(new Date(Date.UTC(year, month, 18)));
            const dining = projected.find(e => e.date === dt && e.label === 'Dining budget' && e.amount < 0);
            if (dining) {
                dining.amount = round(dining.amount + Math.min(adjustment, -dining.amount));
                dining.label = 'Dining budget · reduced';
            }
        }
        subs(s).filter(activeService).forEach(m => {
            if (m.cadence !== 'annual' || month === (m.billingMonth || 1) - 1)
                add(m.day, m.name, -m.amount, 'subscription', simulate.includes(m.id), m.renewal);
        });
    }
    events.sort((a, b) => a.date.localeCompare(b.date));
    projected.sort((a, b) => a.date.localeCompare(b.date));
    const opening = s.accounts.filter(a => a.connected).reduce((n, a) => n + a.balance, 0);
    let bal = opening, base = opening;
    const points: DayPoint[] = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        const dt = iso(d), today = projected.filter(e => e.date === dt);
        bal = round(bal + today.reduce((a, e) => a + e.amount, 0));
        base = round(base + events.filter(e => e.date === dt).reduce((a, e) => a + e.amount, 0));
        points.push({ date: dt, balance: bal, baseline: base, events: today });
    }
    const incoming = projected.filter(e => e.amount > 0).reduce((a, e) => round(a + e.amount), 0), outgoing = -projected.filter(e => e.amount < 0).reduce((a, e) => round(a + e.amount), 0);
    const investment = -projected.filter(e => e.type === 'investment').reduce((a, e) => a + e.amount, 0);
    return { points, events: projected, opening, closing: bal, baseline: base, incoming: round(incoming), outgoing: round(outgoing), investment: round(investment), min: Math.min(...points.map(p => p.balance)), saving: round(bal - base) };
}
export function upcoming(s: State) { return s.merchants.filter(m => m.kind === 'Subscriptions' || m.kind === 'Bills').filter(activeService).map(m => ({ ...m, next: nextRenewal(m) })).sort((a, b) => a.next.localeCompare(b.next)); }
export const nextPayday = (s: State) => nextRenewal({ ...s.merchants[0], day: s.payday ?? 28, renewal: undefined });
