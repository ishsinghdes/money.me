import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Home as HomeIcon, Sparkles, ChartNoAxesColumnIncreasing, UserRound, Settings, SlidersHorizontal, ChevronRight, X, ArrowUpRight, ArrowDownLeft, Info, Check, Plus, ShieldCheck, Bell, Database, WalletCards, CalendarDays, TrendingUp, Landmark, Utensils, ShoppingBasket, House, RotateCcw, Search, CheckCheck, Download, Eye, LockKeyhole, Wifi, Signal, BatteryFull, Minus, Zap, Tv, Router, Cookie, Smartphone, Flame, HeartPulse, TrainFront, CarFront, ArrowLeftRight } from 'lucide-react';
import { type Merchant, type State, type Kind, cloneSeed, money, monthly, living, bills, subs, forecast, upcoming, nextRenewal, nextPayday, shortDate, fullDate, ANCHOR, endFor, normalizeState, activeService, monthlyCost, visibleMerchants, retentionEnd, reductionPlan, autoCheck } from './model';
import './style.css';
type Tab = 'Home' | 'Insights' | 'Forecast' | 'Profile';
type Sheet = {
    type: string;
    id?: string;
};
const icons = { Home: HomeIcon, Insights: Sparkles, Forecast: ChartNoAxesColumnIncreasing, Profile: UserRound };
const KEY = 'richer-me-v1';
const SERVICE_HUB: Merchant = { id: 'add', name: 'Add or refresh a service', mark: 'add', color: '#c5cac7', bg: '#242a27', kind: 'Subscriptions', amount: 0, day: 1, uses: null };
function load(): State {
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (s?.merchants && s?.accounts && s?.permissions)
            return normalizeState(s);
    }
    catch { }
    return cloneSeed();
}
function Logo({ m }: {
    m: Merchant;
}) {
    const common = { viewBox: '0 0 64 64', 'aria-hidden': true as const };
    if (m.mark === 'spotify')
        return <svg {...common}><path d="M13 24Q32 13 52 25M16 35Q33 26 49 36M20 45Q33 38 45 46" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/></svg>;
    if (m.mark === 'youtube')
        return <svg {...common}><rect x="4" y="13" width="56" height="39" rx="12" fill="currentColor"/><path d="M27 22L44 32 27 43Z" fill="white"/></svg>;
    if (m.mark === 'apple')
        return <svg {...common}><path d="M42 8c-1 7-5 11-11 11-1-6 4-11 11-11ZM44 20c-5-2-9 1-12 1-4 0-7-4-13-1-13 6-8 28 1 35 4 3 7-1 12-1s8 4 12 1c4-3 7-8 9-13-10-4-12-15-2-20-2-1-5-2-7-2Z" fill="currentColor"/></svg>;
    if (m.mark === 'adobe')
        return <svg {...common}><path d="M5 10h20L5 56Zm34 0h20v46ZM32 26l13 30H34l-5-12h-9Z" fill="currentColor"/></svg>;
    if (m.mark === 'hdfc')
        return <svg {...common}><path d="M8 8h48v48H8Z" fill="#e52c36"/><path d="M15 15h34v34H15Z" fill="white"/><path d="M23 23h18v18H23Z" fill="#2053a1"/><path d="M28 3h8v16h-8ZM28 45h8v16h-8ZM3 28h16v8H3ZM45 28h16v8H45Z" fill="white"/></svg>;
    if (m.mark === 'sbi')
        return <svg {...common}><circle cx="32" cy="28" r="21" fill="#28c5ed"/><path d="M28 55V35a9 9 0 1 1 8 0v20" fill="#0753c5"/></svg>;
    if (m.mark === 'prime')
        return <span className="prime-logo">prime<svg viewBox="0 0 70 20"><path d="M5 4Q35 25 63 4m-8-1 9 1-3 8" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg></span>;
    if (m.mark === 'strava')
        return <svg {...common}><path d="m26 6 19 32H7Zm18 24 15 26H29Z" fill="currentColor"/></svg>;
    if (m.mark === 'add')
        return <Plus />;
    if (m.mark === 'electricity')
        return <Zap />;
    if (m.mark === 'cable')
        return <Tv />;
    if (m.mark === 'wifi')
        return <Router />;
    if (m.mark === 'help')
        return <UserRound />;
    if (m.mark === 'snacks')
        return <Cookie />;
    if (m.mark === 'mobile')
        return <Smartphone />;
    if (m.mark === 'gas')
        return <Flame />;
    if (m.mark === 'vehicle' || m.id === 'vehicle-insurance')
        return <CarFront />;
    if (m.mark === 'insurance')
        return <HeartPulse />;
    if (m.mark === 'transport')
        return <TrainFront />;
    if (m.mark === 'dining')
        return <Utensils />;
    if (m.mark === 'basket')
        return <ShoppingBasket />;
    if (m.mark === 'home')
        return <House />;
    return <span className={'letter-logo ' + (m.id === 'netflix' ? 'netflix' : '')}>{m.mark}</span>;
}
function Brand({ m, small = false }: {
    m: Merchant;
    small?: boolean;
}) { return <span className={'brand-icon ' + (small ? 'small' : '')} style={{ background: m.bg, color: m.color }}><Logo m={m}/></span>; }
function App() {
    const [desktop, setDesktop] = useState(new URLSearchParams(location.search).get('view') === 'desktop');
    const [entry, setEntry] = useState<'welcome' | 'entering' | 'ready'>(() => {
        try {
            return sessionStorage.getItem('money-me-entered') ? 'ready' : 'welcome';
        }
        catch {
            return 'welcome';
        }
    });
    const [s, setS] = useState<State>(load), [tab, setTab] = useState<Tab>('Home'), [sheet, setSheet] = useState<Sheet | null>(null), [selected, setSelected] = useState('netflix'), [appSearch, setAppSearch] = useState(''), [focusRequest, setFocusRequest] = useState(0), [filter, setFilter] = useState<Kind | 'All'>('All'), [toast, setToast] = useState(''), [confirm, setConfirm] = useState<{
        title: string;
        body: string;
        action: () => void;
        label?: string;
    } | null>(null), [range, setRange] = useState(3), [sim, setSim] = useState<string[]>([]), [adjust, setAdjust] = useState(0), [point, setPoint] = useState<number | null>(null), [cashTab, setCashTab] = useState<'incoming' | 'outgoing'>('incoming'), [guided, setGuided] = useState(false), [guideStep, setGuideStep] = useState(0), [checking, setChecking] = useState(false);
    const content = useRef<HTMLDivElement>(null), modalRef = useRef<HTMLDivElement>(null), returnFocus = useRef<HTMLElement | null>(null);
    function attentionText(m: Merchant) {
        if (m.isNew)
            return `${m.name} was added by your latest auto check. Review its ${money(monthlyCost(m))} monthly commitment.`;
        if (m.expiredAt)
            return '';
        if (s.dismissed.includes('attention-' + m.id))
            return '';
        if (m.id === 'netflix' && !m.paused && m.uses !== null && m.uses <= 2)
            return `${m.uses} sessions logged this month. Is your ${money(m.amount)}/month plan still right for you?`;
        if (m.id === 'electricity' && nextRenewal(m) < nextPayday(s))
            return `${money(m.amount)} due on ${shortDate(nextRenewal(m))}, before your next salary on ${shortDate(nextPayday(s))}.`;
        return '';
    }
    const active = selected === 'add' ? SERVICE_HUB : s.merchants.find(m => m.id === selected) || s.merchants[0];
    const plan = useMemo(() => reductionPlan(s, adjust, sim), [s, adjust, sim]);
    const f = useMemo(() => forecast(s, range, plan.ids, plan.livingReduction), [s, range, plan]);
    const usageRank = subs(s).filter(m => activeService(m) && m.uses !== null).sort((a, b) => (b.uses || 0) - (a.uses || 0));
    useEffect(() => {
        try {
            localStorage.setItem(KEY, JSON.stringify(s));
        }
        catch { }
    }, [s]);
    useEffect(() => {
        if (!toast)
            return;
        const id = setTimeout(() => setToast(''), 3500);
        return () => clearTimeout(id);
    }, [toast]);
    useEffect(() => { content.current?.scrollTo(0, 0); }, [tab]);
    useEffect(() => {
        if (!sheet && !confirm)
            return;
        returnFocus.current = document.activeElement as HTMLElement;
        const el = modalRef.current;
        const first = el?.querySelector<HTMLElement>('button,input,select');
        first?.focus();
        function key(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                if (confirm)
                    setConfirm(null);
                else
                    setSheet(null);
            }
            if (e.key === 'Tab' && el) {
                const all = Array.from(el.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select,textarea,a[href],[tabindex="0"]')).filter(x => x.offsetParent !== null);
                const i = all.indexOf(document.activeElement as HTMLElement);
                if (e.shiftKey && i <= 0) {
                    e.preventDefault();
                    all.at(-1)?.focus();
                }
                else if (!e.shiftKey && i === all.length - 1) {
                    e.preventDefault();
                    all[0]?.focus();
                }
            }
        }
        document.addEventListener('keydown', key);
        return () => { document.removeEventListener('keydown', key); returnFocus.current?.focus(); };
    }, [sheet, confirm]);
    function notify(t: string) { setToast(t); }
    function open(type: string, id?: string) { setSheet({ type, id }); }
    function update(id: string, fn: (m: Merchant) => Merchant) { setS(v => ({ ...v, merchants: v.merchants.map(m => m.id === id ? fn(m) : m) })); }
    function pause(m: Merchant) { setConfirm({ title: m.paused ? 'Resume this subscription?' : 'Pause this subscription?', body: `${m.name} · ${money(m.amount)}/month. ${m.paused ? 'Include' : 'Exclude'} future payments in your Money.me plan from ${fullDate(nextRenewal(m))}. To change billing or access, manage the subscription with ${m.name}.`, label: m.paused ? 'Resume subscription' : 'Confirm pause', action: () => { update(m.id, x => ({ ...x, paused: !m.paused })); setSim(a => a.filter(id => id !== m.id)); setSheet(null); notify(m.paused ? 'Subscription resumed' : 'Subscription paused in your plan'); } }); }
    function checkServices() { setConfirm({ title: 'Auto check subscriptions?', body: 'Our smart AI will review the subscription records available to Money.me for new services and updated plans. Your service list will be updated after the check.', label: 'Start auto check', action: () => { setSheet(null); setChecking(true); } }); }
    useEffect(() => {
        if (!checking)
            return;
        const timer = setTimeout(() => { const result = autoCheck(s), added = result.merchants.find(m => !s.merchants.some(old => old.id === m.id)); setS(result); setChecking(false); setSheet(null); setTab('Home'); setSelected(added?.id || 'add'); setFocusRequest(v => v + 1); setEntry('entering'); notify(added ? `${added.name} added · 1 new service` : 'Your subscriptions are up to date'); }, s.reduced ? 150 : 2400);
        return () => clearTimeout(timer);
    }, [checking]);
    function renew(m: Merchant) { setConfirm({ title: `Renew ${m.name}?`, body: `Include ${m.name} in your Money.me plan again at ${money(monthlyCost(m))}/month. Complete payment or billing changes with the provider.`, label: 'Renew in my plan', action: () => { update(m.id, x => ({ ...x, expiredAt: undefined, paused: false, isNew: true })); setSheet(null); setSelected(m.id); setFocusRequest(v => v + 1); notify('Membership restored to your plan'); } }); }
    function removeService(m: Merchant) { setConfirm({ title: `Remove ${m.name}?`, body: 'Remove this ended membership from Money.me. This does not change your account with the provider.', label: 'Remove service', action: () => { setS(v => ({ ...v, removedServices: [...new Set([...(v.removedServices || []), m.id])], merchants: v.merchants.filter(x => x.id !== m.id) })); setSelected('add'); setFocusRequest(v => v + 1); setSheet(null); notify('Service removed'); } }); }
    function remind(id: string, label: string) { setS(v => ({ ...v, reminders: [...new Set([...v.reminders, id])] })); notify(`Reminder saved: ${label}`); }
    function restartExperience() {
        setS(cloneSeed());
        setSheet(null);
        setConfirm(null);
        setTab('Home');
        setSelected('netflix');
        setFocusRequest(v => v + 1);
        setFilter('All');
        setAppSearch('');
        setToast('');
        setRange(3);
        setSim([]);
        setAdjust(0);
        setPoint(null);
        setCashTab('incoming');
        setGuided(false);
        setGuideStep(0);
        setChecking(false);
        setEntry('welcome');
        try {
            sessionStorage.removeItem('money-me-entered');
        }
        catch { }
    }
    function enterHome(email: string) {
        setS(v => ({ ...v, email }));
        setTab('Home');
        setSheet(null);
        setEntry('entering');
        try {
            sessionStorage.setItem('money-me-entered', '1');
        }
        catch { }
    }
    useEffect(() => {
        if (entry !== 'entering')
            return;
        const id = setTimeout(() => setEntry('ready'), s.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1550);
        return () => clearTimeout(id);
    }, [entry, s.reduced]);
    function go(t: Tab) {
        setTab(t);
        setSheet(null);
        if (entry === 'welcome') {
            setEntry('ready');
            try {
                sessionStorage.setItem('money-me-entered', '1');
            }
            catch { }
        }
    }
    const near = upcoming(s).filter(m => m.next < nextPayday(s));
    const nearTotal = near.reduce((a, m) => a + m.amount, 0);
    const netflix = s.merchants.find(m => m.id === 'netflix')!;
    function exportData() { const u = URL.createObjectURL(new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = u; a.download = 'money-me-data.json'; a.click(); URL.revokeObjectURL(u); notify('Data exported'); }
    function togglePermission(key: 'analysis' | 'usage') { setS(v => ({ ...v, permissions: { ...v.permissions, [key]: !v.permissions[key] } })); }
    const row = (title: string, description: string, action: () => void, Icon: any = ChevronRight) => <button className="menu-row" onClick={action}><Icon size={22}/><span><strong>{title}</strong><small>{description}</small></span><ChevronRight size={19}/></button>;
    function detail(m: Merchant) {
        if (m.expiredAt)
            return <><div className="detail-heading"><Brand m={m}/><h2>{m.name}</h2></div><div className="ended-banner"><h3>Membership ended</h3><p>{fullDate(m.expiredAt)}</p></div><Stat label="Previous monthly commitment" value={money(monthlyCost(m))}/><p>Keep it here until {fullDate(retentionEnd(m))}, or remove it when you’re ready.</p><button className="primary" onClick={() => renew(m)}>Renew membership</button><button className="secondary" onClick={() => removeService(m)}>Remove service</button></>;
        const isSub = m.kind === 'Subscriptions';
        const attention = attentionText(m);
        const linked = s.accounts.find(a => a.id === m.id);
        return <><div className="detail-heading"><Brand m={m}/><div><p className="eyebrow">{m.kind}</p><h2>{m.name}</h2></div></div><div className="detail-value">{money(linked?.balance ?? m.amount)}<small>{m.cadence === 'annual' ? '/ year' : isSub ? '/ month' : m.kind === 'Investments' ? (m.id === 'epf' ? 'accrued balance' : 'market value') : m.kind === 'Expenses' ? '/ month · budget' : m.kind === 'Bills' ? '/ month · bill' : 'balance'}</small></div>{attention && <div className={'attention-panel ' + (m.isNew ? 'new-update' : '')}><span className="attention-label"><i /> {m.isNew ? 'New service' : 'Needs your attention'}</span><p>{attention}</p><div><button onClick={() => open(m.kind === 'Subscriptions' ? 'compare' : 'evidence', m.id)}>{m.kind === 'Subscriptions' ? 'Review your options' : 'See upcoming payments'} <ChevronRight size={15}/></button><button aria-label="Dismiss attention" onClick={() => { update(m.id, x => ({ ...x, isNew: false })); setS(v => ({ ...v, dismissed: [...v.dismissed, 'attention-' + m.id] })); }}>Got it</button></div></div>}{isSub ? <><div className="mini-grid renewal-stats"><Stat label="Next renewal" value={fullDate(nextRenewal(m))}/><Stat label="Annual equivalent" value={money(m.cadence === 'annual' ? m.amount : m.amount * 12)}/></div>{m.paused && <p className="subscription-status">Paused · future payments excluded</p>}<section className="usage-overview"><h3>This month</h3><div className="usage-number">{m.uses === null ? '—' : m.uses}<small>{m.id === 'strava' ? 'activities logged' : m.id === 'cult' ? 'workouts logged' : ['adobe', 'notion', 'chatgpt'].includes(m.id) ? 'active days logged' : 'sessions logged'}</small></div>{m.uses !== null && m.uses > 0 && <p>{money(m.amount / m.uses)} per {m.id === 'strava' ? 'activity' : m.id === 'cult' ? 'workout' : ['adobe', 'notion', 'chatgpt'].includes(m.id) ? 'active day' : 'session'}</p>}<button className="text-action" onClick={() => open('edit', m.id)}>Update your usage <ChevronRight size={16}/></button></section><Discover m={m}/><details className="payment-history"><summary>Payment history <Plus size={19}/></summary>{[0, 1, 2].map(i => <div className="line-row" key={i}><span>{['5 Nov', '5 Oct', '5 Sep'][i].replace('5 ', m.day + ' ')} 2026</span><strong>{money(m.amount)}</strong></div>)}</details><div className="button-stack"><button className="primary" onClick={() => open('compare', m.id)}>Compare your options</button><button className="secondary" onClick={() => open('edit', m.id)}>Edit subscription</button><button className="text-action" onClick={() => pause(m)}>{m.paused ? 'Resume subscription' : 'Pause subscription'}</button></div></> : m.kind === 'Banks' ? <><Stat label="Included in cash flow" value={linked?.connected ? 'Yes' : 'No'}/><h3>What happens next</h3><div className="line-row"><span>{m.id === 'hdfc' ? 'Net salary · ' + shortDate(nextPayday(s)) : 'Savings account'}<small>{m.id === 'hdfc' ? 'Recurring income assumption' : 'No recurring income scheduled'}</small></span><strong>{m.id === 'hdfc' ? money(s.income) : '—'}</strong></div><p>Opening cash includes only the selected accounts. Brokerage and EPF are excluded.</p><button className="primary" onClick={() => go('Forecast')}>Explore cash flow</button><button className="secondary" onClick={() => open('accounts')}>Manage accounts</button></> : m.kind === 'Investments' ? <><p className="notice">{m.id === 'epf' ? 'EPF is separate from available cash. No withdrawal is planned.' : 'Market value can change. Investments are separate from available cash.'}</p><div className="mini-grid"><Stat label={m.id === 'epf' ? 'Payroll treatment' : 'Monthly contribution'} value={m.id === 'epf' ? 'Net salary used' : money(10000)}/><Stat label="Forecast growth" value="Not assumed"/></div><p>{m.id === 'epf' ? 'Salary is already net of payroll deductions. EPF is not deducted again.' : 'The SIP on the 3rd is counted once as cash outflow, separately from living costs. The current holding is excluded from liquid cash.'}</p><button className="primary" onClick={() => go('Forecast')}>See contribution in forecast</button></> : <><p className="notice">{m.kind === 'Bills' ? 'Recurring household bill assumption.' : 'Scheduled monthly budget.'} No bank transaction history.</p><div className="mini-grid renewal-stats"><Stat label={m.kind === 'Bills' ? 'Next bill' : 'Budget date'} value={m.kind === 'Bills' ? fullDate(nextRenewal(m)) : `${m.day} of each month`}/><Stat label="Annual equivalent" value={money(m.cadence === 'annual' ? m.amount : m.amount * 12)}/></div><h3>Your spending mix</h3><SpendingViews s={s}/><p className="muted">Budgets are assumptions. Review actual spend before making a decision.</p><button className="primary" onClick={() => go('Forecast')}>Adjust living costs</button></>}</>;
    }
    function sheetBody() {
        const m = s.merchants.find(m => m.id === sheet?.id) || active;
        switch (sheet?.type) {
            case 'services': return <><h2>Add or refresh a service</h2><div className="menu-group">{row('Add a service', 'Track a new subscription or membership', () => open('edit'), Plus)}{row('Disable a service', 'Stop including it in your future commitments', () => open('disable-services'), Minus)}{row('Auto check subscriptions', s.lastChecked ? 'Checked recently · look for changes' : 'Find new services and updated plans', checkServices, RotateCcw)}</div></>;
            case 'disable-services': return <>{subs(s).filter(activeService).map(m => <button className="merchant-row" key={m.id} onClick={() => pause(m)}><Brand m={m} small/><span><strong>{m.name}</strong><small>Disable in your Money.me plan</small></span><b>{money(monthlyCost(m))}/mo</b><ChevronRight size={16}/></button>)}</>;
            case 'usage': return <><div className="detail-heading"><Brand m={m}/><h2>{m.name}</h2></div><div className="mini-grid"><Stat label="Monthly commitment" value={money(monthlyCost(m))}/><Stat label="Uses this month" value={m.uses === null ? 'Not logged' : String(m.uses)}/></div>{m.uses !== null && m.uses > 0 && <p>{money(monthlyCost(m) / m.uses)} per logged use.</p>}<button className="primary" onClick={() => open('detail', m.id)}>View subscription details</button></>;
            case 'detail': return detail(m);
            case 'all-apps': return <><label className="app-search"><Search size={19}/><input type="search" aria-label="Search apps" placeholder="Search apps" value={appSearch} onChange={e => setAppSearch(e.target.value)}/></label><div className="app-categories" role="group" aria-label="App categories">{(['All', 'Subscriptions', 'Bills', 'Banks', 'Investments', 'Expenses'] as const).map(k => <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)}>{k}</button>)}</div><div className="app-results">{visibleMerchants(s).filter(m => (filter === 'All' || m.kind === filter) && m.name.toLowerCase().includes(appSearch.trim().toLowerCase())).map(m => <button className="merchant-row" key={m.id} aria-pressed={m.id === selected} onClick={() => { setSelected(m.id); setFocusRequest(v => v + 1); setSheet(null); }}><Brand m={m} small/><span><strong>{m.name}</strong><small>{m.kind}{m.isNew ? ' · New' : m.expiredAt ? ' · Ended ' + shortDate(m.expiredAt) : m.paused ? ' · paused' : ''}</small></span>{attentionText(m) && <span className="list-update-dot" aria-label="1 update"/>}<b>{money(m.amount)}</b>{m.id === selected ? <Check size={17}/> : <ChevronRight size={17}/>}</button>)}{!visibleMerchants(s).some(m => (filter === 'All' || m.kind === filter) && m.name.toLowerCase().includes(appSearch.trim().toLowerCase())) && <p className="empty-results">No apps found. Try another name or category.</p>}</div></>;
            case 'compare': return <><div className="detail-heading"><Brand m={m}/><h2>{m.name}</h2></div><p>Keep what adds value. Compare before deciding.</p><div className="compare-option"><span>Keep your current plan</span><strong>{money(m.amount)}/mo</strong><small>No change to your commitments.</small></div><div className="compare-option"><span>Pause from next renewal</span><strong>{money(m.amount * 12)}/year</strong><small>Potential annual reduction if paused for 12 full renewals. Access may end under the provider's terms.</small></div><p className="notice">No alternate plan price is verified. This comparison uses your current plan and a full pause, not an invented discount.</p><button className="primary" onClick={() => { setSim([m.id]); setAdjust(monthlyCost(m)); setRange(3); setPoint(null); go('Forecast'); notify('Comparison added to your forecast.'); }}>Simulate in Forecast</button><button className="secondary" onClick={() => pause(m)}>{m.paused ? 'Resume subscription' : 'Pause subscription'}</button><button className="text-action" onClick={() => remind(m.id, m.name)}>Remind me before renewal</button></>;
            case 'recurring': return <><Stat label="Subscriptions + household bills / month" value={money(monthly(s) + bills(s).reduce((n, m) => n + m.amount, 0))}/><p className="muted">{subs(s).filter(m => !m.paused).length} subscriptions and {bills(s).length} household bills. Ordered by next renewal.</p>{upcoming(s).map(m => <button className="merchant-row" key={m.id} onClick={() => open('detail', m.id)}><Brand m={m} small/><span><strong>{m.name}</strong><small>{fullDate(m.next)}</small></span><b>{money(m.amount)}</b><ChevronRight size={16}/></button>)}</>;
            case 'evidence': return <><h2>{near.length} payments before payday</h2><p>{money(nearTotal)} due before your next salary on {fullDate(nextPayday(s))}.</p>{near.map(m => <button className="merchant-row" key={m.id} onClick={() => open('detail', m.id)}><Brand m={m} small/><span><strong>{m.name}</strong><small>{fullDate(m.next)}</small></span><b>{money(m.amount)}</b><ChevronRight size={16}/></button>)}<button className="primary" onClick={() => open('recurring')}>Review all payments</button><button className="secondary" onClick={() => remind('payday', 'Payments before payday')}>Set a reminder</button><button className="text-action" onClick={() => { setS(v => ({ ...v, dismissed: [...v.dismissed, 'payday'] })); setSheet(null); notify('Insight dismissed. Restore it in Settings.'); }}>Dismiss</button></>;
            case 'benefit': return <><div className="detail-heading"><Brand m={s.merchants.find(m => m.id === 'hdfc')!}/><h2>Make your card work harder.</h2></div><div className="detail-value">5%<small>cashback · selected merchants</small></div><p>HDFC's official Millennia page lists selected merchants including Amazon and Swiggy.</p><p className="notice">Source-backed benefit reference checked 22 Nov 2026. Your eligibility, merchant category, exclusions, monthly caps and current terms must be confirmed by the bank. No reward is included in your forecast.</p><a className="primary link-button" href="https://www.hdfc.bank.in/credit-cards/millennia-credit-card" target="_blank" rel="noreferrer">Read official HDFC terms <ArrowUpRight size={16}/></a><button className="secondary" onClick={() => remind('card', 'Review card benefit terms')}>Save to review</button></>;
            case 'activity': return <>{f.events.map((e, i) => <div className="line-row" key={i}><span>{e.label}<small>{fullDate(e.date)}</small></span><strong className={e.amount > 0 ? 'positive' : ''}>{e.amount > 0 ? '+' : '−'}{money(Math.abs(e.amount))}</strong></div>)}<button className="primary" onClick={() => go('Forecast')}>Explore all dated events</button></>;
            case 'trends': return <><h2>Where your month goes.</h2><SpendingViews s={s}/><p>Monthly living budgets total {money(living(s))}. Active subscriptions add {money(monthly(s))}. A {money(10000)} SIP is an investment transfer, separate from consumption.</p><button className="primary" onClick={() => go('Forecast')}>Try a different budget</button></>;
            case 'value': return <><p className="muted">Value is personal. Usage is one input, not a cancellation instruction.</p>{!s.permissions.usage && <button className="primary" onClick={() => open('permissions')}>Enable manual usage analysis</button>}{subs(s).map(m => <button className="merchant-row" key={m.id} onClick={() => open('edit', m.id)}><Brand m={m} small/><span><strong>{m.name}</strong><small>{s.permissions.usage && m.uses !== null ? `${m.uses} reported uses · ${m.uses ? money(m.amount / m.uses) + '/use' : 'no reported uses'}` : 'Usage analysis off or unknown'}</small></span><ChevronRight size={18}/></button>)}<p className="notice">Usage is based on what you’ve logged.</p></>;
            case 'add-subscription':
            case 'edit': return <SubscriptionForm m={sheet.id ? m : undefined} onSave={item => { setS(v => ({ ...v, merchants: sheet.id ? v.merchants.map(x => x.id === item.id ? item : x) : [...v.merchants, { ...item, isNew: true }] })); setSelected(item.id); setFocusRequest(v => v + 1); setSheet(null); notify('Subscription saved'); }}/>;
            case 'accounts': return <>{s.accounts.map(a => <div className="account-control" key={a.id}><div><strong>{a.name}</strong><p>{money(a.balance)} · {a.connected ? 'included in cash' : 'excluded'}</p></div><button className="secondary" onClick={() => setConfirm({ title: a.connected ? 'Exclude this account?' : 'Include this account?', body: `${a.name}: ${money(a.balance)} will be ${a.connected ? 'excluded from' : 'included in'} opening cash.${a.id === 'hdfc' ? ' Its salary events will also be ' + (a.connected ? 'removed.' : 'included.') : ''} Your banking access is unchanged.`, label: 'Confirm change', action: () => { setS(v => ({ ...v, accounts: v.accounts.map(x => x.id === a.id ? { ...x, connected: !x.connected } : x) })); notify('Cash flow updated'); } })}>{a.connected ? 'Exclude' : 'Include'}</button></div>)}<button className="text-action" onClick={() => open('link')}>Add an account</button></>;
            case 'link': return <AccountForm onSave={a => { setS(v => ({ ...v, accounts: [...v.accounts, a], merchants: [...v.merchants, { id: a.id, name: a.name, kind: 'Banks', amount: a.balance, day: 1, mark: 'bank', color: '#eee', bg: '#333', uses: null }] })); open('accounts'); notify('Account added'); }}/>;
            case 'permissions': return <><p>Choose what informs your insights.</p><Toggle title="Personalized insights" description="Use commitments for contextual recommendations." checked={s.permissions.analysis} onChange={() => togglePermission('analysis')}/><Toggle title="Usage insights" description="Include self-reported logged use counts. No screen-time access." checked={s.permissions.usage} onChange={() => togglePermission('usage')}/><div className="notice"><LockKeyhole size={18}/> Manage connection details in Data & privacy.</div></>;
            case 'cashflow': return <><h2>Where it comes from.<br />Where it goes.</h2><p>See your total income and outgoings, then explore how to make the most of the money in your accounts.</p><div className="cashflow-tabs" role="group" aria-label="Cash movements"><button aria-pressed={cashTab === 'incoming'} className={cashTab === 'incoming' ? 'incoming active' : 'incoming'} onClick={() => setCashTab('incoming')}><ArrowDownLeft size={18}/> Incoming</button><button aria-pressed={cashTab === 'outgoing'} className={cashTab === 'outgoing' ? 'outgoing active' : 'outgoing'} onClick={() => setCashTab('outgoing')}><ArrowUpRight size={18}/> Outgoing</button></div><div className={'cashflow-total ' + cashTab}><small>{fullDate(ANCHOR)} – {fullDate(endFor(range))}</small><strong>{money(cashTab === 'incoming' ? f.incoming : f.outgoing)}</strong><span>{cashTab === 'incoming' ? 'Total incoming cash' : 'Total outgoing cash'}</span></div>{cashTab === 'incoming' ? <><button className="salary-evidence" onClick={() => open('income')}><span><strong>Salary credit · {money(s.income)}/month</strong><small>Monthly credit · day {s.payday}</small></span><ChevronRight size={18}/></button></> : <p className="notice">Household bills, consumption and subscriptions are shown by date. SIP contributions appear once as transfers into investments.</p>}{f.events.filter(e => cashTab === 'incoming' ? e.amount > 0 : e.amount < 0).map((e, i) => <div className="line-row" key={i}><span>{e.label}<small>{fullDate(e.date)}</small></span><strong className={cashTab === 'incoming' ? 'positive' : ''}>{e.amount > 0 ? '+' : '−'}{money(Math.abs(e.amount))}</strong></div>)}</>;
            case 'income': return <form onSubmit={e => { e.preventDefault(); const d = new FormData(e.currentTarget); setS(v => ({ ...v, income: Number(d.get('income')), payday: Number(d.get('payday')) })); open('cashflow'); notify('Salary assumptions updated across your app'); }}><label className="field">Monthly take-home salary (₹)<input name="income" type="number" min="0" max="10000000" step="0.01" required defaultValue={s.income}/></label><label className="field">Monthly salary credit day<input name="payday" type="number" min="1" max="28" required defaultValue={s.payday}/></label><p className="muted">Use net salary after payroll deductions. This avoids deducting EPF twice.</p><button className="primary">Save income assumptions</button></form>;
            case 'settings': return <><h2>A few things, set your way.</h2><p className="muted">Control your data, your priorities and how Money.me feels.</p><div className="menu-group">{row('Welcome screen', 'Replay the opening', () => { setSheet(null); setTab('Home'); setEntry('welcome'); }, Sparkles)}{row('Preferences', 'Safety buffer, reduced motion and dismissed insights', () => open('preferences'), SlidersHorizontal)}{row('Permissions', `${s.permissions.analysis ? 'Personalization on' : 'Personalization off'} · manual usage ${s.permissions.usage ? 'on' : 'off'}`, () => open('permissions'), ShieldCheck)}{row('Alerts & reminders', `${s.reminders.length} reminders saved on this device`, () => open('reminders'), Bell)}{row('Accounts', `${s.accounts.filter(a => a.connected).length} included in your cash forecast`, () => open('accounts'), Landmark)}{row('Data & privacy', 'Export your data or start fresh', () => open('privacy'), Database)}</div><p className="notice">Planning date · 22 November 2026. All financial data stays in this browser. No real bank, screen-time or AI service is connected.</p><p className="footnote app-credit">Money.me · concept version 1.1<br />Designed with love, designed with a heart, by Ish.</p></>;
            case 'preferences': return <><Toggle title="Reduce motion" description="Minimize transitions and animated sheets." checked={s.reduced} onChange={() => setS(v => ({ ...v, reduced: !v.reduced }))}/><label className="field">Safety buffer (₹)<input type="number" min="0" max="5000000" value={s.buffer} onChange={e => setS(v => ({ ...v, buffer: Math.max(0, Math.min(5000000, Number(e.target.value) || 0)) }))}/></label><button className="secondary" onClick={() => { setS(v => ({ ...v, dismissed: [] })); notify('Dismissed insights restored'); }}>Restore dismissed insights</button><p className="muted">System reduced-motion preferences are also respected.</p></>;
            case 'reminders': return <>{s.reminders.length ? s.reminders.map(id => <div className="line-row" key={id}><span>{s.merchants.find(m => m.id === id)?.name || ({ 'payday': 'Renewals before payday', 'card': 'Review card benefits' } as Record<string, string>)[id] || id}<small>Review before next due date</small></span><button className="icon-button" aria-label={`Remove reminder ${id}`} onClick={() => setS(v => ({ ...v, reminders: v.reminders.filter(x => x !== id) }))}><X size={18}/></button></div>) : <p>No reminders saved. Add one from an insight or subscription.</p>}</>;
            case 'privacy': return <><ShieldCheck size={34}/><h2>Your money. Your control.</h2><p>All financial data is simulated and stored in this browser. No bank logins, transaction feeds, screen-time permissions or external AI requests are used.</p><p>Your name, changes, preferences and reminders persist locally on this device. Clearing browser data removes them. External source links open only when you choose them.</p><button className="primary" onClick={exportData}><Download size={18}/> Export your data</button><button className="secondary" onClick={() => setConfirm({ title: 'Reset your data?', body: 'This deletes your local edits, accounts, consent settings, reminders and plans, then restores the starting data. There are no real accounts to delete.', label: 'Reset data', action: () => { setS(cloneSeed()); setSim([]); setAdjust(0); setSelected('netflix'); setFilter('All'); setSheet(null); setTab('Home'); notify('Your data has been reset'); } })}>Reset local data</button></>;
            case 'profile': return <form onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); setS(v => ({ ...v, name: String(data.get('name')).trim() })); setSheet(null); notify('Profile updated'); }}><label className="field">Display name<input required maxLength={45} name="name" defaultValue={s.name}/></label><p className="muted">Bengaluru · 29</p><button className="primary">Save name</button></form>;
            case 'assumptions': return <><h2>Every forecast has a starting point.</h2><p>Forecast starting {fullDate(ANCHOR)}. Selected horizon ends {fullDate(endFor(range))}.</p><ul className="assumptions"><li>Opening cash: sum of included accounts, currently {money(f.opening)}.</li><li>{money(s.income)} net salary on day {s.payday} each month when HDFC is included.</li><li>Living budgets and household bills: {money(living(s))}/month; remaining living-cost reductions occur on the 18th; suggested subscription reductions take effect on each renewal date.</li><li>Monthly subscriptions are charged on their renewal dates. Annual insurance and fees appear once on their dated renewals. Ended or disabled services are excluded.</li><li>₹10,000 SIP on each 3rd, counted exactly once as an investment cash outflow.</li><li>₹1,85,000 demat and ₹2,40,000 EPF are not liquid cash. No extra EPF deduction after net salary.</li><li>No investment returns, interest, inflation, tax changes or extraordinary expenses.</li><li>Card cashback is not booked as income. Credit spending is not double counted as both purchases and statement payments.</li></ul><p className="notice">Forecasts reflect your inputs. Actual expenses and income may change.</p></>;
            default: return null;
        }
    }
    const titles: Record<string, string> = { services: 'SERVICES', 'disable-services': 'DISABLE A SERVICE', usage: 'COMMITMENT & USAGE', 'all-apps': 'All apps', cashflow: 'YOUR MONEY', income: 'SALARY & INCOME', settings: 'SETTINGS', detail: 'OVERVIEW', compare: 'COMPARE OPTIONS', recurring: 'RECURRING COMMITMENTS', evidence: 'UPCOMING PAYMENTS', benefit: 'CARD BENEFITS', activity: 'ACCOUNT ACTIVITY', trends: 'SPENDING TRENDS', value: 'SUBSCRIPTION VALUE', edit: sheet?.id ? 'EDIT SUBSCRIPTION' : 'ADD SUBSCRIPTION', accounts: 'ACCOUNTS', link: 'ADD ACCOUNT', permissions: 'PERMISSIONS', preferences: 'PREFERENCES', reminders: 'REMINDERS', privacy: 'DATA & PRIVACY', profile: 'YOUR PROFILE', assumptions: 'FORECAST ASSUMPTIONS' };
    return <main className={'showcase ' + (desktop ? 'desktop-showcase ' : 'mobile-first ') + (s.reduced ? 'reduce-motion' : '')}><button className="view-toggle" onClick={() => setDesktop(v => !v)}>{desktop ? 'Mobile preview' : 'Desktop showcase'}</button><aside className="stage-intro"><a className="stage-wordmark" href="#" onClick={e => { e.preventDefault(); go('Home'); }}>Money<span>.me</span></a><div className="intro-copy"><h1>Know your money.<br /><span>Make more of it.</span></h1></div><div className="demo-notes"><span className="demo-tag">INTERACTIVE PRODUCT CONCEPT</span><p>Meet Rahul. 29. Bengaluru.<br />Explore his financial world with<br />transparent, simulated data.</p><button className="stage-button" onClick={() => { setGuided(true); setGuideStep(0); go('Insights'); }}><Sparkles size={17}/> Take the two-minute tour</button></div><small className="stage-credit">Designed with love, designed with a heart, by Ish.</small></aside>
 <div className="phone-wrap"><div className="phone"><span className="hardware volume-one"/><span className="hardware volume-two"/><span className="hardware power"/><div className="phone-screen"><div className={'app-layer ' + (entry === 'welcome' ? 'entry-hidden ' : entry === 'entering' ? 'home-entering ' : '') + (tab === 'Home' ? 'home-active ' : '') + ((sheet || confirm) ? 'obscured' : '')} inert={sheet || confirm || checking || entry !== 'ready' ? true : undefined}><div className="status-bar"><button className="status-restart" aria-label="Return to welcome screen" onClick={restartExperience}>9:41</button><div className="dynamic-island"><i /></div><div><Signal size={15}/><Wifi size={15}/><BatteryFull size={22}/></div></div><header className="app-header"><div className="header-brand-group"><button className="wordmark" onClick={() => go('Home')} aria-label="Money.me home">Money<span>.me</span><i /></button>{tab === 'Home' && <button className="header-apps" style={{ '--merchant-accent': active.id === 'netflix' ? '#b92734' : active.bg } as React.CSSProperties} onClick={() => { setAppSearch(''); setFilter('All'); open('all-apps'); }}>All apps <ChevronRight size={14}/></button>}</div><button className="icon-button settings" aria-label="Settings" onClick={() => open('settings')}><Settings size={23}/></button></header>
 {tab === 'Home' ? <div className="home-screen"><Honeycomb merchants={visibleMerchants(s)} focusRequest={focusRequest} selected={selected} onSelect={setSelected} onAdd={() => { setSelected('add'); setFocusRequest(v => v + 1); }} attentionIds={s.merchants.filter(m => !!attentionText(m)).map(m => m.id)} onOpen={id => open('detail', id)}/><div className="home-context"><button className={'selected-panel ' + (selected === 'add' ? 'service-hub-card' : '')} style={{ '--merchant-accent': active.id === 'netflix' ? '#b92734' : active.bg } as React.CSSProperties} onClick={() => open(selected === 'add' ? 'services' : 'detail', active.id)}><Brand m={active} small/><span><span className="merchant-name-row"><strong>{active.name}</strong>{active.isNew ? <small className="context-update new-badge">New</small> : attentionText(active) && <small className="context-update">1 update</small>}</span>{selected === 'add' ? <small>Add, disable or auto check subscriptions</small> : <><b>{money(active.kind === 'Banks' ? (s.accounts.find(a => a.id === active.id)?.balance ?? active.amount) : monthlyCost(active))}{(active.kind === 'Subscriptions' || active.kind === 'Bills') ? <small> / month{active.cadence === 'annual' ? ' equivalent' : ''}</small> : ''}</b><small>{active.expiredAt ? 'Membership ended ' + shortDate(active.expiredAt) + ' · renew or remove' : active.paused ? 'Paused' : active.kind === 'Subscriptions' ? 'Renews ' + shortDate(nextRenewal(active)) : active.kind === 'Banks' ? 'Account' : active.kind === 'Investments' ? 'Not liquid cash' : active.kind === 'Bills' ? 'Due ' + shortDate(nextRenewal(active)) : 'Monthly budget'}</small></>}</span><ChevronRight size={20}/></button></div></div> : <div className="screen-content" ref={content} key={tab}><div className="screen-heading"><div className="screen-title-row"><h2 className="eyebrow">{tab.toUpperCase()}</h2>{tab === 'Forecast' && <button className="icon-button assumptions-eye" aria-label="Forecast assumptions" onClick={() => open('assumptions')}><Info size={17}/></button>}</div>{tab !== 'Profile' && <p>{tab === 'Insights' ? "See what’s coming in, what’s going out, and how to make the most of your money." : 'Plan expenses for the weeks, months and years ahead. Make the most of what you have.'}</p>}</div>
 {tab === 'Insights' && <><div className="scenario-label">AS OF · 22 NOV 2026</div>{!s.dismissed.includes('payday') ? <button className="ai-hero" onClick={() => open('evidence')}><h2>{near.length ? `${near.length} payments` : 'All clear'}<br />{near.length ? 'before payday.' : 'until payday.'}</h2><div className="hero-payment"><span className="amount-pill">{money(nearTotal)}</span><span>scheduled before {shortDate(nextPayday(s))}</span></div><span className="hero-arrow"><ArrowUpRight size={23}/></span><svg className="hero-contour" viewBox="0 0 200 100" aria-hidden="true"><path d="M0 100Q50 90 80 70T130 52 200 0M0 114Q50 105 83 85T133 67 200 15"/></svg></button> : <div className="panel"><CheckCheck /><h3>You're caught up.</h3><p>Renewal insight dismissed. You can restore it in Preferences.</p></div>}
 <div className="section-title"><h3>Your benefits</h3><span aria-label="Scroll left or right"><ArrowLeftRight size={17}/></span></div><div className="insight-carousel"><button className="insight-tile benefit-netflix" onClick={() => open('compare', 'netflix')}><div className="brand-stack">{['netflix', 'prime', 'spotify'].map(id => <Brand key={id} m={s.merchants.find(m => m.id === id)!} small/>)}</div><h3>{netflix.paused ? 'A little breathing room.' : 'Same life. Less autopilot.'}</h3><p>{netflix.paused ? 'Your Netflix pause is in the forecast.' : `Review your ${money(netflix.amount)}/mo Netflix plan.`}</p><span>Compare options <ChevronRight size={17}/></span></button><button className="insight-tile benefit-bank" onClick={() => open('benefit')}><div className="brand-stack"><Brand m={s.merchants.find(m => m.id === 'hdfc')!} small/><WalletCards size={25}/></div><h3>Benefits hiding in plain sight.</h3><p>A source-backed card benefit worth checking.</p><span>View card benefit <ChevronRight size={17}/></span></button><button className="insight-tile benefit-value" onClick={() => open('value')}><Sparkles size={28}/><h3>Is it earning its place?</h3><p>Bring usage into the conversation, on your terms.</p><span>Review value <ChevronRight size={17}/></span></button></div>
 <button className="spend-summary" onClick={() => open('trends')}><TrendingUp size={26}/><span><small>Monthly planned consumption</small><strong>{money(living(s) + monthly(s))}</strong></span><ChevronRight size={20}/></button><div className="section-title"><h3>The full picture</h3></div><div className="menu-group">{row('Recurring commitments', `${subs(s).filter(m => !m.paused).length} services + ${bills(s).length} household bills`, () => open('recurring'), CalendarDays)}{row('Account activity', 'Income and outgoings by date', () => open('activity'), Landmark)}{row('Relevant benefits', 'Source-backed reference · eligibility unverified', () => open('benefit'), WalletCards)}{row('Demat & investments', `${money(185000)} · SIP ${money(10000)}/mo`, () => open('detail', 'demat'), ChartNoAxesColumnIncreasing)}{row('EPF', 'Non-liquid · no double payroll deduction', () => open('detail', 'epf'), ShieldCheck)}{row('Subscription value & usage', s.permissions.usage ? 'Manual estimates · medium confidence' : 'Usage analysis is off', () => open('value'), Eye)}</div><p className="footnote">Recommendations explain your data. Nothing is connected to your real accounts.</p></>}
 {tab === 'Forecast' && <><button className="salary-summary" onClick={() => { setCashTab('incoming'); open('cashflow'); }}><span className="salary-symbol"><ArrowDownLeft size={20}/></span><span><small>Your salary</small><strong>{money(s.income)}<small>/month</small></strong></span><ChevronRight size={18}/></button><div className="range-tabs" role="group" aria-label="Forecast horizon">{[[0, '2W'], [1, '1M'], [3, '3M'], [6, '6M'], [12, '12M']].map(([r, label]) => <button key={r} aria-pressed={range === r} className={range === r ? 'active' : ''} onClick={() => { setRange(Number(r)); setPoint(null); }}>{label}</button>)}</div><div className="chart-panel"><div className="chart-title"><span>{point === null ? 'Projected closing cash' : 'Cash on ' + shortDate(f.points[Math.min(point, f.points.length - 1)].date)}</span></div><div className="forecast-number">{money(point === null ? f.closing : f.points[Math.min(point, f.points.length - 1)].balance)}</div><p className="forecast-change">{f.closing - f.opening >= 0 ? '+' : '−'}{money(Math.abs(f.closing - f.opening))} <span>vs. {fullDate(ANCHOR)}</span></p><ForecastChart points={f.points} point={point} onPoint={setPoint} buffer={s.buffer}/><div className="chart-legend"><span><i />Your forecast</span><span><i className="dashed"/>Current plan</span></div><label className="chart-scrub">Inspect a date<input aria-label="Inspect forecast date" type="range" min="0" max={f.points.length - 1} value={point ?? f.points.length - 1} onChange={e => setPoint(Number(e.target.value))}/></label><div className="chart-date">{point !== null ? fullDate(f.points[Math.min(point, f.points.length - 1)].date) : fullDate(ANCHOR) + ' – ' + fullDate(endFor(range))}</div>{point !== null && <div className="chart-event" aria-live="polite">{f.points[Math.min(point, f.points.length - 1)].events.map(e => `${e.label}: ${e.amount > 0 ? '+' : '−'}${money(Math.abs(e.amount))}`).join(' · ') || 'No scheduled cash movements.'}</div>}</div><div className="cash-totals"><button onClick={() => { setCashTab('incoming'); open('cashflow'); }}><Stat label="Incoming" value={money(f.incoming)} icon={<ArrowDownLeft size={18}/>}/></button><button onClick={() => { setCashTab('outgoing'); open('cashflow'); }}><Stat label="Outgoing" value={money(f.outgoing)} icon={<ArrowUpRight size={18}/>}/></button></div><p className={'buffer-note ' + (f.min < s.buffer ? 'warning' : '')}><ShieldCheck size={16}/><span>Lowest cash: {money(f.min)}<small>{f.min < s.buffer ? 'Below' : 'Above'} your {money(s.buffer)} safety buffer</small></span></p>
 <section className="simulation compact-simulation"><label className="field adjustment">Monthly living-cost reduction <b>{money(adjust)}</b><input aria-label="Monthly living-cost reduction" type="range" min="0" max="5000" step="1" value={adjust} onChange={e => { setAdjust(Number(e.target.value)); setSim([]); setPoint(null); }}/></label><div className="scenario-result" aria-live="polite"><span>Extra cash by {shortDate(endFor(range))}</span><strong>+{money(f.saving)}</strong><small>{plan.ids.length} subscription {plan.ids.length === 1 ? 'reduction' : 'reductions'}{plan.livingReduction > 0 ? ` · 1 living-cost reduction (${money(plan.livingReduction)}/mo)` : ''}</small>{plan.ids.length > 0 && <span className="reduction-names">{plan.subscriptions.map(m => m.name).join(' · ')}</span>}</div></section><h3 className="usage-section-title">Most used subscriptions</h3><UsageStrip items={usageRank.slice(0, 5)} onSelect={m => open('usage', m.id)}/><h3 className="usage-section-title">Least used subscriptions</h3><UsageStrip items={[...usageRank].reverse().slice(0, 5)} onSelect={m => open('usage', m.id)}/><details className="forecast-disclosure"><summary><span>Annual bills ahead</span><Plus size={18}/></summary><div className="annual-bills">{s.merchants.filter(m => m.cadence === 'annual' && activeService(m)).sort((a, b) => nextRenewal(a).localeCompare(nextRenewal(b))).map(m => <button className="line-row" key={m.id} onClick={() => open('detail', m.id)}><span>{m.name}<small>{fullDate(nextRenewal(m))}</small></span><strong>{money(m.amount)}</strong></button>)}</div></details><details className="forecast-disclosure"><summary><span>Dated cash movements <small>{f.events.length} events</small></span><Plus size={18}/></summary><div className="event-list">{f.events.slice(0, 8).map((e, i) => <div className="line-row" key={i}><span>{e.label}<small>{fullDate(e.date)} · {e.type}</small></span><strong>{e.amount > 0 ? '+' : '−'}{money(Math.abs(e.amount))}</strong></div>)}</div><button className="secondary" onClick={() => open('activity')}>Review more events</button></details><p className="footnote">Includes {money(f.investment)} investment transfers, counted once. Brokerage and EPF are excluded from cash.</p></>}
 {tab === 'Profile' && <><button className="profile-card" onClick={() => open('profile')}><span className="avatar">{s.name.split(' ').map(x => x[0]).slice(0, 2).join('')}</span><span><strong>{s.name}</strong><small>29 · Bengaluru</small></span><ChevronRight size={21}/></button><div className="menu-group">{row('Linked accounts', `${s.accounts.filter(a => a.connected).length} accounts · no live connection`, () => open('accounts'), Landmark)}{row('Subscriptions & bills', `${subs(s).filter(m => !m.paused).length} services + ${bills(s).length} household bills`, () => open('recurring'), WalletCards)}{row('Permissions', 'You choose what informs your insights', () => open('permissions'), ShieldCheck)}{row('Alerts & reminders', `${s.reminders.length} saved locally · no push access`, () => open('reminders'), Bell)}{row('Preferences', 'Safety buffer, motion and insight recovery', () => open('preferences'), SlidersHorizontal)}{row('Data & privacy', 'Local your data · export or reset', () => open('privacy'), Database)}</div><div className="privacy-note"><LockKeyhole size={22}/><p>Your information stays yours.<small>Clear permissions. No hidden connections.<br />You confirm every important change.</small></p></div><p className="footnote">Money.me · product concept<br />Designed with love, designed with a heart, by Ish.</p></>}
 </div>}
 <nav className="bottom-nav" aria-label="Main navigation" style={{ '--nav-accent': ({ Home: '#b9d9c9', Insights: '#e4c48d', Forecast: '#c7d991', Profile: '#c8beda' } as Record<Tab, string>)[tab] } as React.CSSProperties}><span className="nav-pill" aria-hidden="true" style={{ left: `calc(${(['Home', 'Insights', 'Forecast', 'Profile'] as Tab[]).indexOf(tab) * 25}% + 5px)` }}/>{(['Home', 'Insights', 'Forecast', 'Profile'] as Tab[]).map(t => { const Icon = icons[t]; return <button aria-label={t} title={t} aria-current={tab === t ? 'page' : undefined} className={tab === t ? 'active' : ''} key={t} onClick={() => go(t)}><span><Icon size={24} strokeWidth={tab === t ? 1.8 : 1.5}/></span></button>; })}</nav><div className="home-indicator"/></div>
 {checking && <div className="auto-check-screen" role="status"><WelcomeCloud merchants={s.merchants}/><div><Sparkles size={25}/><h2>Checking your subscriptions</h2><p>Looking for new services and updated plans</p><span className="scan-progress"/></div></div>}
 {entry === 'welcome' && <WelcomeScreen merchants={s.merchants} email={s.email || 'ishnishansingh@gmail.com'} onEnter={enterHome}/>}
 {(sheet || confirm) && <div className={'sheet-backdrop ' + (sheet?.type === 'all-apps' ? 'app-picker ' : '') + (confirm ? 'confirmation' : '')} onClick={e => {
                if (e.target === e.currentTarget) {
                    if (confirm)
                        setConfirm(null);
                    else
                        setSheet(null);
                }
            }}><div ref={modalRef} className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div className="sheet-handle"/><div className="sheet-top"><h2 id="sheet-title" className="eyebrow">{confirm ? 'YOUR CONFIRMATION' : titles[sheet?.type || '']}</h2><button className="icon-button" aria-label="Close dialog" onClick={() => confirm ? setConfirm(null) : setSheet(null)}><X size={22}/></button></div><div className="sheet-body">{confirm ? <><ShieldCheck size={36}/><h2>{confirm.title}</h2><p>{confirm.body}</p><button className="primary" onClick={() => { confirm.action(); setConfirm(null); }}>{confirm.label || 'Confirm'}</button><button className="secondary" onClick={() => setConfirm(null)}>Keep things as they are</button></> : sheetBody()}</div></div></div>}
 {toast && <div className="toast" role="status"><Check size={17}/>{toast}</div>}
 </div></div><div className="phone-shadow"/></div>
 <aside className="stage-side"><p className="eyebrow">EXPLORE MONEY.ME</p>{(['Splash', 'Home', 'Insights', 'Forecast', 'Profile'] as const).map((t, i) => <button key={t} className={(t === 'Splash' ? entry === 'welcome' : entry !== 'welcome' && t === tab) ? 'active' : ''} onClick={() => t === 'Splash' ? restartExperience() : go(t)}><span>0{i + 1}</span><strong>{t}</strong><small>{['Start here', 'Your connected services', 'Intelligence, with context', 'Tomorrow, made clearer', 'You’re in control'][i]}</small></button>)}<div className="stage-status"><ShieldCheck size={17}/><span>Real interactions.<br />Simulated financial data.</span></div></aside>
 {guided && <div className="guide"><button className="icon-button guide-close" onClick={() => setGuided(false)} aria-label="Close guided tour"><X size={18}/></button><span className="eyebrow">{guideStep < 2 ? 'RENEWALS' : 'PLAN AHEAD'}</span><h3>{['Meet your next money decision.', 'From insight to informed choice.', 'See a different tomorrow.', 'Make the call. Keep the control.'][guideStep]}</h3><p>{['Open the amber AI insight. Review the dates, evidence and confidence.', 'Compare Netflix from the first card. You can simulate or confirm a pause.', 'Select services in Forecast. Inspect the chart and see exactly when savings appear.', 'Review and confirm your plan. Then return Home to see the same state. Restore any service from its details.'][guideStep]}</p><button className="primary" onClick={() => {
                if (guideStep === 3) {
                    setGuided(false);
                    return;
                }
                setGuideStep(guideStep + 1);
                if (guideStep === 0) {
                    go('Insights');
                    open('compare', 'netflix');
                }
                if (guideStep === 1) {
                    go('Forecast');
                    setSim(netflix.paused ? [] : ['netflix']);
                    setAdjust(netflix.paused ? 0 : monthlyCost(netflix));
                }
                if (guideStep === 2)
                    go('Forecast');
            }}>{guideStep === 3 ? 'Explore on your own' : 'Next step'} <ChevronRight size={16}/></button></div>}
 </main>;
}
function WelcomeScreen({ merchants, email, onEnter }: {
    merchants: Merchant[];
    email: string;
    onEnter: (email: string) => void;
}) { const [value, setValue] = useState(email); return <section className="welcome-screen" aria-label="Welcome to Money.me"><div className="status-bar"><span>9:41</span><div className="dynamic-island"><i /></div><div><Signal size={15}/><Wifi size={15}/><BatteryFull size={22}/></div></div><div className="welcome-wordmark">Money<span>.me</span></div><WelcomeCloud merchants={merchants}/><div className="welcome-bottom"><h1>Your money.<br /><span>All together.</span></h1><p>Track your finances with smart AI.<br />Predict ahead and save more over time.</p><form onSubmit={e => { e.preventDefault(); onEnter(value.trim()); }}><label className="welcome-email">Email address<input type="email" name="email" autoComplete="email" required value={value} onChange={e => setValue(e.target.value)} aria-label="Email address"/></label><button className="primary welcome-continue">Continue</button></form></div></section>; }
function WelcomeCloud({ merchants }: {
    merchants: Merchant[];
}) {
    const box = useRef<HTMLDivElement>(null), nodes = useRef<(HTMLDivElement | null)[]>([]);
    const [identities, setIdentities] = useState(() => Array.from({ length: 17 }, (_, i) => i % merchants.length));
    useEffect(() => {
        if (!box.current)
            return;
        const bounds = { w: box.current.clientWidth, h: box.current.clientHeight };
        const layout = [[.5, .1, 52], [.23, .2, 43], [.77, .2, 47], [.4, .35, 61], [.66, .4, 55], [.14, .46, 40], [.87, .53, 38], [.31, .63, 48], [.54, .69, 64], [.75, .8, 44], [.18, .83, 34], [.42, .91, 47], [.65, .95, 38], [.1, .28, 46], [.9, .33, 34], [.15, .7, 55], [.85, .9, 42]];
        const balls = layout.map(([x, y, size], i) => ({ x: x * bounds.w, y: y * bounds.h, r: size / 2, vx: Math.cos(i * 2.4) * 10, vy: Math.sin(i * 1.7) * 8, age: -i * .16, life: 7.5 + (i % 5) * 1.1, size, births: 0 }));
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !!box.current.closest('.reduce-motion');
        const render = (b: typeof balls[number], i: number, scale: number, opacity: number) => {
            const el = nodes.current[i];
            if (el) {
                const depth = Math.sin(b.age * .24 + i * 1.9) * 42;
                el.style.transform = `translate3d(${b.x - b.r}px,${b.y - b.r}px,${depth}px) scale(${scale})`;
                el.style.opacity = String(opacity * (.84 + (depth + 42) / 84 * .16));
                el.style.zIndex = String(Math.round(depth + 50));
            }
        };
        if (reduce) {
            balls.forEach((b, i) => render(b, i, 1, 1));
            return;
        }
        let frame = 0, last = performance.now();
        const resize = new ResizeObserver(() => {
            if (box.current) {
                bounds.w = box.current.clientWidth;
                bounds.h = box.current.clientHeight;
            }
        });
        resize.observe(box.current);
        function tick(time: number) {
            const dt = Math.min(.04, (time - last) / 1000);
            last = time;
            const changed: {
                i: number;
                id: number;
            }[] = [];
            balls.forEach((b, i) => {
                b.age += dt;
                if (b.age > b.life) {
                    b.age = -.2 - (i % 3) * .15;
                    b.births++;
                    b.x = (.2 + ((i * 31 + b.births * 17) % 60) / 100) * bounds.w;
                    b.y = (.18 + ((i * 23 + b.births * 13) % 63) / 100) * bounds.h;
                    b.vx = Math.cos(i + b.births) * 10;
                    b.vy = Math.sin(i * 1.7 + b.births) * 8;
                    changed.push({ i, id: (i + b.births * 7) % merchants.length });
                }
                if (b.age < 0) {
                    render(b, i, .2, 0);
                    return;
                }
                b.vx += Math.sin(time * .00035 + i) * dt * .35;
                b.vy += Math.cos(time * .0003 + i) * dt * .35;
                b.x += b.vx * dt;
                b.y += b.vy * dt;
                const min = b.r + 3, maxX = Math.max(min, bounds.w - b.r - 3), maxY = Math.max(min, bounds.h - b.r - 3);
                if (b.x < min) {
                    b.x = min;
                    b.vx = Math.abs(b.vx);
                }
                if (b.x > maxX) {
                    b.x = maxX;
                    b.vx = -Math.abs(b.vx);
                }
                if (b.y < min) {
                    b.y = min;
                    b.vy = Math.abs(b.vy);
                }
                if (b.y > maxY) {
                    b.y = maxY;
                    b.vy = -Math.abs(b.vy);
                }
            });
            for (let i = 0; i < balls.length; i++)
                for (let j = i + 1; j < balls.length; j++) {
                    const a = balls[i], b = balls[j];
                    if (a.age < .5 || b.age < .5 || a.age > a.life - .6 || b.age > b.life - .6)
                        continue;
                    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, min = a.r + b.r + 3;
                    if (d < min) {
                        const nx = dx / d, ny = dy / d, push = (min - d) * .5;
                        a.x -= nx * push;
                        a.y -= ny * push;
                        b.x += nx * push;
                        b.y += ny * push;
                        const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                        if (closing > 0) {
                            a.vx -= closing * nx * .95;
                            a.vy -= closing * ny * .95;
                            b.vx += closing * nx * .95;
                            b.vy += closing * ny * .95;
                        }
                    }
                }
            balls.forEach((b, i) => {
                if (b.age < 0)
                    return;
                const t = Math.min(1, b.age / .65, (b.life - b.age) / .65);
                const ease = t * t * (3 - 2 * t);
                render(b, i, .25 + .75 * ease, ease);
            });
            if (changed.length)
                setIdentities(prev => { const next = [...prev]; changed.forEach(c => next[c.i] = c.id); return next; });
            frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(frame); resize.disconnect(); };
    }, [merchants]);
    const sizes = [52, 43, 47, 61, 55, 40, 38, 48, 64, 44, 34, 47, 38, 46, 34, 55, 42];
    return <div className="welcome-cloud physics-cloud" ref={box} aria-hidden="true">{identities.map((id, i) => { const m = merchants[id % merchants.length]; return <div className="welcome-orbit" key={i} ref={el => { nodes.current[i] = el; }} style={{ width: sizes[i], height: sizes[i] }}><div className={"welcome-bubble " + (i >= 13 ? "iridescent-bubble iridescent-" + (i % 4) : '')} style={i >= 13 ? undefined : { background: m.bg, color: m.color }}>{i < 13 && <Logo m={m}/>}</div></div>; })}<div className="welcome-cloud-fade"/></div>;
}
function UsageStrip({ items, onSelect }: {
    items: Merchant[];
    onSelect: (m: Merchant) => void;
}) { return <div className="usage-strip">{items.map(m => <button key={m.id} className="usage-card" onClick={() => onSelect(m)}><Brand m={m} small/><strong className="usage-name">{m.name}</strong><small className="usage-price">{money(monthlyCost(m))}/month</small><span className="usage-frequency">{m.uses} {m.uses === 1 ? 'use' : 'uses'} this month</span></button>)}</div>; }
function Stat({ label, value, icon }: {
    label: string;
    value: string;
    icon?: React.ReactNode;
}) { return <div className="stat"><small>{icon}{label}</small><strong>{value}</strong></div>; }
function Toggle({ title, description, checked, onChange }: {
    title: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) { return <label className="toggle-row"><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" role="switch" checked={checked} onChange={onChange}/></label>; }
// Visual reference: https://www.highcharts.com/demo/highcharts/pie-legend (interaction pattern only; original SVG implementation).
function SpendingViews({ s }: {
    s: State;
}) {
    const [view, setView] = useState<'list' | 'pie'>('list'), [selected, setSelected] = useState<string | null>(null);
    const colors = ['#c3d995', '#86b9ac', '#d3b18a', '#a6acd2', '#cc9298', '#8ba9c0', '#b8b58b', '#9fc9bd', '#c2a2ca', '#a9b7c2', '#c6bf9f', '#89b6b1', '#c7a597'];
    const items = s.merchants.filter(m => (m.kind === 'Expenses' || m.kind === 'Bills') && activeService(m) && monthlyCost(m) > 0).map(m => ({ ...m, value: monthlyCost(m) })).sort((a, b) => b.value - a.value);
    const total = items.reduce((v, m) => v + m.value, 0), current = items.find(m => m.id === selected) || items[0];
    let angle = -90;
    const point = (r: number, a: number) => [160 + r * Math.cos(a * Math.PI / 180), 160 + r * Math.sin(a * Math.PI / 180)];
    return <div className="spending-views"><div className="spending-view-switch" role="group" aria-label="Spending view">{(['list', 'pie'] as const).map(v => <button key={v} aria-pressed={view === v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>{v === 'list' ? 'List' : 'Pie chart'}</button>)}</div><p className="spending-period">Monthly living costs · annual bills spread over 12 months</p>{view === 'list' ? <div className="budget-bars">{items.map((m, i) => <div key={m.id}><span>{m.name}<b>{money(m.value)}</b></span><i style={{ width: m.value / (items[0]?.value || 1) * 100 + '%', background: colors[i % colors.length] }}/></div>)}</div> : <div className="spending-pie"><div className="donut-wrap"><svg viewBox="0 0 320 320" aria-label="Monthly living costs by category" role="group">{items.map((m, i) => {
                const start = angle, end = angle + m.value / total * 360;
                angle = end;
                const p1 = point(139, start), p2 = point(139, end), p3 = point(100, end), p4 = point(100, start), large = end - start > 180 ? 1 : 0;
                return <path key={m.id} role="button" tabIndex={0} aria-label={`${m.name}, ${money(m.value)} per month, ${(m.value / total * 100).toFixed(1)} percent${i === 0 ? ', highest' : i === items.length - 1 ? ', lowest' : ''}`} aria-pressed={current?.id === m.id} onPointerEnter={() => setSelected(m.id)} onClick={() => setSelected(m.id)} onFocus={() => setSelected(m.id)} onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelected(m.id);
                        }
                    }} d={`M${p1} A139 139 0 ${large} 1 ${p2} L${p3} A100 100 0 ${large} 0 ${p4} Z`} fill={colors[i % colors.length]} stroke="#222526" strokeWidth="3" className={current?.id === m.id ? 'selected' : ''}><title>{m.name}: {money(m.value)}/month</title></path>;
            })}</svg><div className="donut-center" aria-live="polite">{current && <><Brand m={current} small/><span>{current.name}</span><strong>{money(current.value)}</strong><small>{(current.value / total * 100).toFixed(1)}% of {money(total)}</small></>}</div></div><div className="spending-extremes">{[items[0], items.at(-1)].filter(Boolean).map((m, i) => <button key={m!.id} onClick={() => setSelected(m!.id)}><small>{i === 0 ? 'Highest' : 'Lowest'}</small><span>{m!.name}</span><strong>{money(m!.value)}</strong></button>)}</div><div className="pie-legend">{items.map((m, i) => <button key={m.id} aria-pressed={current?.id === m.id} className={current?.id === m.id ? 'active' : ''} onClick={() => setSelected(m.id)}><i style={{ background: colors[i % colors.length] }}/><span>{m.name}</span><b>{money(m.value)}</b></button>)}</div></div>}</div>;
}
const discoveryImages: Record<string, string> = { laapataa: '/discovery/laapataa.webp', maharaja: '/discovery/maharaja.webp', strava: '/discovery/strava.webp', spotify: '/discovery/spotify.webp', notion: '/discovery/notion.webp', youtube: '/discovery/youtube.webp', apple: '/discovery/apple.webp' };
function DiscoveryPicture({ merchant: m, title }: {
    merchant: Merchant;
    title: string;
}) { const key = m.id === 'netflix' ? (title === 'Laapataa Ladies' ? 'laapataa' : 'maharaja') : m.id; const photo = !!discoveryImages[key]; return <div className={'discovery-picture art-' + key} style={{ '--art-color': m.bg } as React.CSSProperties}>{photo ? <img src={discoveryImages[key]} alt={m.id === 'netflix' ? title + ' artwork' : m.name + ' artwork'} loading="lazy" decoding="async" width="620" height="350"/> : <><div className="feature-art-grid" aria-hidden="true"/><Brand m={m}/><span className="feature-art-line"/><span className="feature-art-line short"/></>}</div>; }
function Discover({ m }: {
    m: Merchant;
}) { const movie = m.id === 'netflix'; const items = movie ? [{ title: 'Laapataa Ladies', tag: '2024 · Comedy', text: 'A heartfelt switch of journeys.', url: 'https://www.netflix.com/in/title/81760391', color: '#655a38' }, { title: 'Maharaja', tag: '2024 · Crime drama', text: 'A missing possession. A deeper mystery.', url: 'https://www.netflix.com/in/title/81690671', color: '#593e3b' }] : m.id === 'strava' ? [{ title: 'Find your next challenge', tag: 'MOVE WITH A GOAL', text: 'Pick a distance, elevation or activity goal.', url: 'https://support.strava.com/en-us/articles/15401916-strava-challenges', color: '#69442f' }, { title: 'Know your segments', tag: 'MAKE EACH ROUTE COUNT', text: 'Compare your efforts on familiar stretches.', url: 'https://support.strava.com/en-us/articles/15401700-my-activities-are-set-to-everyone-where-does-that-data-go-on-strava', color: '#414f3b' }] : m.id === 'spotify' ? [{ title: 'Your next favourite', tag: 'DISCOVER WEEKLY', text: 'Explore a fresh mix shaped around your listening.', url: 'https://open.spotify.com/', color: '#355540' }, { title: 'Find something fresh', tag: 'RELEASE RADAR', text: 'Make room for new music in your week.', url: 'https://open.spotify.com/', color: '#4d435a' }] : [{ title: 'Make time for ' + m.name, tag: 'GET MORE FROM YOUR PLAN', text: m.id === 'adobe' ? 'Set aside time for a creative project.' : m.id === 'cult' ? 'Plan your next workout.' : m.id === 'notion' ? 'Organize one project you care about.' : m.id === 'chatgpt' ? 'Bring a question you want to work through.' : 'Choose something you’ll look forward to using.', url: ({ adobe: 'https://www.adobe.com/', cult: 'https://www.cult.fit/', notion: 'https://www.notion.com/', chatgpt: 'https://chatgpt.com/', youtube: 'https://www.youtube.com/', prime: 'https://www.primevideo.com/', hotstar: 'https://www.hotstar.com/', apple: 'https://www.icloud.com/', vpn: 'https://nordvpn.com/' } as Record<string, string>)[m.id], color: '#3d4a4e' }]; return <section className="discover"><h3>{movie ? 'For your next watch' : m.id === 'strava' ? 'Make your next move' : 'More from ' + m.name}</h3><div className="discover-scroll">{items.map(item => <a key={item.title} className={'discover-card discovery-' + m.id} style={{ background: `linear-gradient(155deg,${item.color},#242627)` }} href={item.url || undefined} target={item.url ? '_blank' : undefined} rel="noreferrer"><DiscoveryPicture merchant={m} title={item.title}/><div className="discover-copy"><small>{item.tag}</small><strong>{item.title}</strong><p>{item.text}</p>{item.url && <span>{movie ? 'View on Netflix' : 'Explore'} <ArrowUpRight size={16}/></span>}</div></a>)}</div></section>; }
function SubscriptionForm({ m, onSave }: {
    m?: Merchant;
    onSave: (m: Merchant) => void;
}) {
    const [error, setError] = useState('');
    return <form onSubmit={e => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            const amount = Number(d.get('amount')), name = String(d.get('name')).trim(), renewal = String(d.get('renewal')), uses = String(d.get('uses'));
            if (!name || !Number.isFinite(amount) || amount <= 0 || amount > 1000000 || renewal <= ANCHOR) {
                setError('Enter a name, positive amount up to ₹10,00,000 and a date after 22 Nov 2026.');
                return;
            }
            onSave({ ...m, id: m?.id || 'custom-' + Date.now(), name, amount, day: Number(renewal.slice(-2)), renewal, uses: uses === '' ? null : Number(uses), mark: m?.mark || name[0].toUpperCase(), bg: m?.bg || '#33363a', color: m?.color || '#eee', kind: 'Subscriptions' });
        }}><label className="field">Subscription name<input name="name" required maxLength={40} defaultValue={m?.name}/></label><label className="field">Monthly amount (₹)<input name="amount" type="number" step="0.01" required min="0.01" max="1000000" defaultValue={m?.amount}/></label><label className="field">Next renewal<input name="renewal" type="date" required min="2026-11-23" defaultValue={m ? nextRenewal(m) : '2026-12-01'}/></label><label className="field">Uses this month (optional)<input name="uses" type="number" min="0" max="10000" defaultValue={m?.uses ?? ''}/></label>{error && <p role="alert" className="error">{error}</p>}<button className="primary">Save subscription</button></form>;
}
function AccountForm({ onSave }: {
    onSave: (a: State['accounts'][0]) => void;
}) { return <form onSubmit={e => { e.preventDefault(); const d = new FormData(e.currentTarget); onSave({ id: 'bank-' + Date.now(), name: String(d.get('name')).trim(), balance: Number(d.get('balance')), connected: true }); }}><label className="field">Account name<input name="name" required maxLength={40}/></label><label className="field">Opening balance (₹)<input name="balance" type="number" required min="0" max="100000000" step="0.01"/></label><button className="primary">Add account</button></form>; }
function Honeycomb({ merchants, selected, onSelect, onAdd, attentionIds, focusRequest, onOpen }: {
    merchants: Merchant[];
    onOpen: (id: string) => void;
    focusRequest: number;
    selected: string;
    onSelect: (id: string) => void;
    onAdd: () => void;
    attentionIds: string[];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const drag = useRef<{
        x: number;
        y: number;
        ox: number;
        oy: number;
        dist: number;
    } | null>(null);
    const [dragging, setDragging] = useState(false);
    const lastTap = useRef<{
        id: string;
        time: number;
        x: number;
        y: number;
    } | null>(null);
    const positions = useMemo(() => {
        const ordered = [...merchants.filter(m => !m.expiredAt), ...merchants.filter(m => m.expiredAt)];
        const items = [...ordered.slice(0, 6), { ...SERVICE_HUB, name: 'Add or refresh a service' }, ...ordered.slice(6)];
        const coords = [{ q: 0, r: 0 }];
        for (let ring = 1; coords.length < items.length; ring++) {
            for (let q = -ring; q <= ring; q++)
                for (let r = -ring; r <= ring; r++)
                    if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) === ring)
                        coords.push({ q, r });
        }
        return items.map((m, i) => ({ ...m, x: (coords[i].q + coords[i].r / 2) * 88, y: coords[i].r * 76.21 }));
    }, [merchants]);
    useEffect(() => {
        if (selected !== 'add' && !merchants.some(m => m.id === selected) && merchants[0]) {
            setOffset({ x: 0, y: 0 });
            onSelect(merchants[0].id);
        }
    }, [merchants.map(m => m.id).join(',')]);
    useEffect(() => {
        const p = positions.find(p => p.id === selected);
        if (p)
            setOffset({ x: -p.x, y: -p.y });
    }, [focusRequest]);
    function selectNear(x: number, y: number) {
        if (!positions.length)
            return;
        const near = positions.reduce((a, b) => ((a.x + x) ** 2 + (a.y + y) ** 2) < ((b.x + x) ** 2 + (b.y + y) ** 2) ? a : b);
        onSelect(near.id);
    }
    function pan(x: number, y: number) { const extent = Math.max(120, ...positions.map(p => Math.max(Math.abs(p.x), Math.abs(p.y)))); const next = { x: Math.max(-extent, Math.min(extent, x)), y: Math.max(-extent, Math.min(extent, y)) }; setOffset(next); selectNear(next.x, next.y); }
    return <div className={'honeycomb ' + (dragging ? 'dragging' : '')} ref={ref} aria-label="Pannable financial connections" onPointerDown={e => {
            if (e.button !== 0)
                return;
            drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y, dist: 0 };
            setDragging(true);
        }} onPointerMove={e => {
            if (!drag.current)
                return;
            const d = drag.current, dx = e.clientX - d.x, dy = e.clientY - d.y;
            d.dist = Math.hypot(dx, dy);
            if (d.dist > 4) {
                ref.current?.setPointerCapture(e.pointerId);
                pan(d.ox + dx, d.oy + dy);
            }
        }} onPointerUp={e => {
            if (drag.current && drag.current.dist > 5) {
                e.preventDefault();
            }
            setDragging(false);
            setTimeout(() => { drag.current = null; }, 0);
        }} onPointerCancel={() => { drag.current = null; setDragging(false); }} onWheel={e => { pan(offset.x - e.deltaX, offset.y - e.deltaY); }}><div className="focus-target" aria-hidden="true"/><div className="honey-plane" style={{ transform: `translate(${offset.x}px,${offset.y}px)` }}>{positions.map(m => <button key={m.id} className={'honey-item ' + (m.id === selected ? 'selected' : '') + (m.paused ? ' paused' : '') + (m.expiredAt ? ' expired' : '') + (m.isNew ? ' newly-added' : '')} style={{ left: `calc(50% + ${m.x}px)`, top: `calc(50% + ${m.y}px)`, background: m.bg, color: m.color }} aria-label={`${m.name}${m.expiredAt ? ', membership ended' : m.paused ? ', paused' : ''}${m.isNew ? ', new service' : attentionIds.includes(m.id) ? ', needs attention' : ''}`} aria-pressed={m.id === selected} onClick={e => {
                if (drag.current && drag.current.dist > 5) {
                    lastTap.current = null;
                    return;
                }
                if (m.id === 'add') {
                    lastTap.current = null;
                    setOffset({ x: -m.x, y: -m.y });
                    onAdd();
                    return;
                }
                const now = performance.now(), last = lastTap.current;
                const twice = e.detail > 0 && last && now - last.time < 340 && (last.id === m.id || Math.hypot(e.clientX - last.x, e.clientY - last.y) < 22);
                if (twice) {
                    const original = positions.find(p => p.id === last.id);
                    if (original) {
                        setOffset({ x: -original.x, y: -original.y });
                        onSelect(original.id);
                        onOpen(original.id);
                    }
                    lastTap.current = null;
                    return;
                }
                lastTap.current = e.detail > 0 ? { id: m.id, time: now, x: e.clientX, y: e.clientY } : null;
                setOffset({ x: -m.x, y: -m.y });
                onSelect(m.id);
            }} onFocus={() => {
                if (!drag.current) {
                    setOffset({ x: -m.x, y: -m.y });
                    onSelect(m.id);
                }
            }}><Logo m={m}/>{m.isNew ? <span className="attention-dot new-dot" aria-hidden="true"/> : attentionIds.includes(m.id) && <span className="attention-dot" aria-hidden="true"/>}{m.paused && <span className="pause-mark">Ⅱ</span>}</button>)}</div></div>;
}
function ForecastChart({ points, point, onPoint, buffer }: {
    points: ReturnType<typeof forecast>['points'];
    point: number | null;
    onPoint: (i: number) => void;
    buffer: number;
}) {
    const width = 330, height = 174, pad = 12;
    const min = Math.min(buffer, ...points.flatMap(p => [p.balance, p.baseline])) - 8000, max = Math.max(buffer, ...points.flatMap(p => [p.balance, p.baseline])) + 8000;
    const x = (i: number) => pad + i / (points.length - 1) * (width - pad * 2), y = (n: number) => height - pad - (n - min) / (max - min) * (height - pad * 2);
    const path = (key: 'balance' | 'baseline') => points.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(p[key]).toFixed(1)).join(' ');
    const p = point === null ? null : points[Math.min(point, points.length - 1)];
    return <svg className="forecast-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Daily cash forecast from ${money(points[0].balance)} to ${money(points.at(-1)!.balance)}. Use the date slider to inspect.`} onPointerMove={e => {
            if (e.buttons || e.pointerType === 'mouse') {
                const b = e.currentTarget.getBoundingClientRect();
                onPoint(Math.max(0, Math.min(points.length - 1, Math.round(((e.clientX - b.left) / b.width * width - pad) / (width - pad * 2) * (points.length - 1)))));
            }
        }} onPointerDown={e => { const b = e.currentTarget.getBoundingClientRect(); onPoint(Math.max(0, Math.min(points.length - 1, Math.round((e.clientX - b.left) / b.width * (points.length - 1))))); }}><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cbdc7b" stopOpacity=".36"/><stop offset=".65" stopColor="#7fa68b" stopOpacity=".12"/><stop offset="1" stopColor="#cedb7b" stopOpacity="0"/></linearGradient><linearGradient id="chart-line" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#81bb9e"/><stop offset=".55" stopColor="#cbdc7b"/><stop offset="1" stopColor="#efe3a0"/></linearGradient></defs>{[0, 1, 2].map(i => <line key={i} x1="12" x2="318" y1={pad + i * (height - 2 * pad) / 2} y2={pad + i * (height - 2 * pad) / 2} stroke="#ffffff10"/>)}<line x1="12" x2="318" y1={y(buffer)} y2={y(buffer)} stroke="#c0a26a" strokeDasharray="3 5" opacity=".6"/><path d={path('balance') + ` L${x(points.length - 1)},${height} L12,${height}Z`} fill="url(#chart-fill)"/><path d={path('baseline')} fill="none" stroke="#92958a" strokeWidth="2" strokeDasharray="4 4"/><path d={path('balance')} fill="none" stroke="url(#chart-line)" strokeWidth="2.5"/>{p && point !== null && <><line x1={x(point)} x2={x(point)} y1="0" y2={height} stroke="#ddd" opacity=".3"/><circle cx={x(point)} cy={y(p.balance)} r="5" fill="#cedb7b" stroke="#202122" strokeWidth="3"/></>}</svg>;
}
createRoot(document.getElementById('root')!).render(<App />);
