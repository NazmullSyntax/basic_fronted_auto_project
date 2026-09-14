import { useState } from "react";
import { Mail, Inbox, CheckCircle2, AlertTriangle, Archive, Clock, Send, PenLine, ArrowRight, RefreshCcw } from "lucide-react";

const FOLDERS = [
  { id: "all", label: "All mail" },
  { id: "needs_review", label: "Needs review" },
  { id: "auto_replied", label: "Auto-replied" },
  { id: "escalated", label: "Escalated" },
  { id: "archived", label: "Archived" },
];

const STATUS_STYLE = {
  needs_review: { label: "NEEDS REVIEW", color: "#B8863A", tilt: "-3deg" },
  auto_replied: { label: "AUTO-REPLIED", color: "#3F6355", tilt: "2deg" },
  escalated: { label: "ESCALATED", color: "#9C4A32", tilt: "-2deg" },
  archived: { label: "ARCHIVED", color: "#7A7266", tilt: "3deg" },
};

const EMAILS = [
  {
    id: 1,
    from: "dana.whitfield@larkfieldco.com",
    name: "Dana Whitfield",
    subject: "Invoice #4471 charged twice this month",
    preview: "Hi team, I just noticed we were billed on the 3rd and again on the 9th for the same plan cycle...",
    body: "Hi team,\n\nI just noticed we were billed on the 3rd and again on the 9th for the same plan cycle. Our finance lead is asking questions and I'd like this sorted before our board sync on Friday.\n\nCan someone confirm which charge is correct and refund the duplicate?\n\nThanks,\nDana",
    category: "Billing",
    confidence: 96,
    status: "needs_review",
    time: "9:14 AM",
    sentiment: "Frustrated",
    draft: "Hi Dana,\n\nThanks for flagging this — you're right, our system double-billed the March cycle on your account. I've reversed the duplicate charge of $214.00; you should see it back on your card within 3–5 business days.\n\nI've also added a note to your account so this doesn't happen again. Let me know if the board sync needs anything further from us.\n\nBest,\nMeridian Support",
    crmDiff: [
      { field: "Ticket priority", from: "Normal", to: "High" },
      { field: "Sentiment", from: "Neutral", to: "Frustrated" },
      { field: "Open billing issue", from: "No", to: "Yes — duplicate charge" },
    ],
  },
  {
    id: 2,
    from: "priyar@northbridgetech.io",
    name: "Priya Ramaswamy",
    subject: "Interested in the Enterprise tier",
    preview: "We're evaluating vendors for our Q3 rollout and your Enterprise plan looks like a strong fit...",
    body: "We're evaluating vendors for our Q3 rollout and your Enterprise plan looks like a strong fit for our 400-seat org. Could someone send pricing and set up a call with sales this week?",
    category: "Sales inquiry",
    confidence: 91,
    status: "auto_replied",
    time: "8:52 AM",
    sentiment: "Positive",
    draft: "Hi Priya,\n\nGreat to hear from you — a 400-seat rollout fits well within our Enterprise tier. I've looped in our sales lead, Marcus, who'll follow up today with pricing and a few call times.\n\nIn the meantime, here's our Enterprise overview: meridian.io/enterprise\n\nLooking forward to it,\nMeridian Support",
    crmDiff: [
      { field: "Lead stage", from: "New", to: "Qualified — Enterprise" },
      { field: "Owner", from: "Unassigned", to: "Marcus Feld (Sales)" },
      { field: "Deal size est.", from: "—", to: "400 seats" },
    ],
  },
  {
    id: 3,
    from: "j.oyelaran@fenwickstudio.com",
    name: "James Oyelaran",
    subject: "Exporting won't finish — stuck at 90%",
    preview: "Every export over 200 rows hangs at 90% and eventually times out. This is blocking our client delivery today.",
    body: "Every export over 200 rows hangs at 90% and eventually times out. This is blocking our client delivery today. We've tried three browsers and cleared cache. Please advise urgently.",
    category: "Bug report",
    confidence: 88,
    status: "escalated",
    time: "8:41 AM",
    sentiment: "Urgent",
    draft: "Hi James,\n\nSorry for the disruption — this looks like the export timeout our engineering team is actively tracking (issue EXP-1183). I've escalated your account directly to them given today's deadline.\n\nAs a workaround, exporting in batches under 150 rows should complete normally. I'll follow up the moment there's a fix.\n\nMeridian Support",
    crmDiff: [
      { field: "Ticket priority", from: "Normal", to: "Urgent" },
      { field: "Linked bug", from: "—", to: "EXP-1183" },
      { field: "Escalated to", from: "—", to: "Engineering (on-call)" },
    ],
  },
  {
    id: 4,
    from: "accounts@greylockmutual.com",
    name: "Greylock Mutual — Accounts",
    subject: "Cancelling our subscription",
    preview: "Please cancel our team plan effective end of this billing cycle. We've moved internal workflows in-house.",
    body: "Please cancel our team plan effective end of this billing cycle. We've moved internal workflows in-house and no longer need the seats. Please confirm cancellation in writing.",
    category: "Cancellation",
    confidence: 94,
    status: "needs_review",
    time: "7:58 AM",
    sentiment: "Neutral",
    draft: "Hi there,\n\nI've processed the cancellation for your team plan, effective at the end of the current billing cycle (April 30). You won't be charged again after that date, and your data will remain exportable for 30 days.\n\nIf anything changes, we're happy to have you back — no hard feelings either way.\n\nMeridian Support",
    crmDiff: [
      { field: "Account status", from: "Active", to: "Pending cancellation" },
      { field: "Churn reason", from: "—", to: "Moved in-house" },
      { field: "Win-back flag", from: "No", to: "Yes — 90 day follow-up" },
    ],
  },
  {
    id: 5,
    from: "hello@driftcollective.studio",
    name: "Drift Collective",
    subject: "Partnership / co-marketing idea",
    preview: "We run a newsletter for 40k product designers and think a joint webinar could work well for both audiences.",
    body: "We run a newsletter for 40k product designers and think a joint webinar could work well for both audiences. Open to a quick call to scope it out?",
    category: "Partnership",
    confidence: 79,
    status: "needs_review",
    time: "7:20 AM",
    sentiment: "Positive",
    draft: "Hi there,\n\nThanks for reaching out — a joint webinar sounds like a good fit, and 40k product designers is a great audience for us. I've flagged this for our partnerships lead, who'll reply within two business days with some times to talk.\n\nMeridian Support",
    crmDiff: [
      { field: "Lead type", from: "—", to: "Partnership" },
      { field: "Owner", from: "Unassigned", to: "Partnerships queue" },
    ],
  },
  {
    id: 6,
    from: "noreply@dealflashbot.net",
    name: "DealFlashBot",
    subject: "🔥 90% OFF your next SaaS tool — limited time!!",
    preview: "This exclusive offer won't last — unlock premium tools for your business at a fraction of the cost...",
    body: "This exclusive offer won't last — unlock premium tools for your business at a fraction of the cost. Click below before midnight!",
    category: "Spam",
    confidence: 99,
    status: "archived",
    time: "6:03 AM",
    sentiment: "—",
    draft: null,
    crmDiff: [],
  },
];

export default function EmailTriageAgent() {
  const [folder, setFolder] = useState("all");
  const [selectedId, setSelectedId] = useState(EMAILS[0].id);
  const [edited, setEdited] = useState({});
  const [sentIds, setSentIds] = useState([]);

  const visible = folder === "all" ? EMAILS : EMAILS.filter((e) => e.status === folder);
  const selected = EMAILS.find((e) => e.id === selectedId) || visible[0];
  const draftValue = edited[selected?.id] ?? selected?.draft ?? "";

  const counts = FOLDERS.reduce((acc, f) => {
    acc[f.id] = f.id === "all" ? EMAILS.length : EMAILS.filter((e) => e.status === f.id).length;
    return acc;
  }, {});

  return (
    <div style={{ "--ink": "#1C2321", "--paper": "#EEE8DA", "--paper-2": "#E4DCC8", "--line": "#C9C0AC", "--teal": "#3F6355", "--amber": "#B8863A", "--rust": "#9C4A32" }}
      className="w-full min-h-[720px] flex flex-col" >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Public+Sans:wght@400;500;600&display=swap');
        .eta-root * { font-family: 'Public Sans', sans-serif; }
        .eta-serif { font-family: 'Fraunces', serif; }
        .eta-stamp {
          display: inline-block; border: 1.5px solid; border-radius: 3px;
          padding: 2px 7px; font-size: 10.5px; letter-spacing: 0.06em;
          font-weight: 600; white-space: nowrap;
        }
        .eta-row:hover { background: var(--paper-2); }
        .eta-scroll::-webkit-scrollbar { width: 8px; }
        .eta-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
      `}</style>

      <div className="eta-root w-full flex-1 flex flex-col" style={{ background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line)" }}>

        {/* header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2.5">
            <Mail size={18} strokeWidth={1.75} />
            <span className="eta-serif text-[19px]" style={{ fontWeight: 500 }}>Meridian Inbox Agent</span>
          </div>
          <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "#5B5647" }}>
            <RefreshCcw size={13} />
            <span>Last sync 2 min ago · 6 messages triaged today</span>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">

          {/* left rail */}
          <div className="w-[210px] shrink-0 flex flex-col px-3 py-4" style={{ borderRight: "1px solid var(--line)" }}>
            <div className="px-2 mb-4">
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "#8A8370" }}>Agent status</div>
              <div className="mt-1.5 text-[13px] leading-snug">
                Running — checking inbox every <span style={{ fontWeight: 600 }}>60s</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[12px]" style={{ color: "var(--teal)" }}>
                <CheckCircle2 size={13} />
                <span>4 of 6 resolved without a human</span>
              </div>
            </div>
            <nav className="flex flex-col gap-0.5">
              {FOLDERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFolder(f.id)}
                  className="flex items-center justify-between px-2 py-1.5 rounded-sm text-[13.5px] text-left"
                  style={{
                    background: folder === f.id ? "var(--paper-2)" : "transparent",
                    fontWeight: folder === f.id ? 600 : 400,
                  }}
                >
                  <span>{f.label}</span>
                  <span style={{ color: "#8A8370", fontSize: 12 }}>{counts[f.id]}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* middle list */}
          <div className="w-[360px] shrink-0 flex flex-col min-h-0" style={{ borderRight: "1px solid var(--line)" }}>
            <div className="px-4 py-2.5 text-[11px] uppercase tracking-wide" style={{ color: "#8A8370", borderBottom: "1px solid var(--line)" }}>
              {FOLDERS.find((f) => f.id === folder)?.label} — {visible.length}
            </div>
            <div className="eta-scroll flex-1 overflow-y-auto">
              {visible.map((e) => {
                const st = STATUS_STYLE[e.status];
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    className="eta-row w-full text-left px-4 py-3 flex flex-col gap-1.5"
                    style={{
                      borderBottom: "1px solid var(--line)",
                      background: selected?.id === e.id ? "var(--paper-2)" : "transparent",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] truncate" style={{ fontWeight: 600 }}>{e.name}</span>
                      <span className="text-[11px] shrink-0" style={{ color: "#8A8370" }}>{e.time}</span>
                    </div>
                    <div className="text-[13px] truncate">{e.subject}</div>
                    <div className="text-[12px] truncate" style={{ color: "#6B6656" }}>{e.preview}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="eta-stamp" style={{ color: st.color, borderColor: st.color, transform: `rotate(${st.tilt})` }}>
                        {st.label}
                      </span>
                      <span className="text-[11px]" style={{ color: "#8A8370" }}>{e.category} · {e.confidence}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* right detail */}
          <div className="flex-1 eta-scroll overflow-y-auto px-6 py-5 min-h-0">
            {!selected ? (
              <div className="text-[13px]" style={{ color: "#8A8370" }}>No message selected.</div>
            ) : (
              <div className="max-w-[620px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="eta-serif text-[20px]" style={{ fontWeight: 500 }}>{selected.subject}</div>
                    <div className="text-[13px] mt-1" style={{ color: "#6B6656" }}>{selected.name} &lt;{selected.from}&gt; · {selected.time}</div>
                  </div>
                  <span className="eta-stamp shrink-0" style={{
                    color: STATUS_STYLE[selected.status].color,
                    borderColor: STATUS_STYLE[selected.status].color,
                    transform: `rotate(${STATUS_STYLE[selected.status].tilt})`,
                  }}>
                    {STATUS_STYLE[selected.status].label}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-[12px]" style={{ color: "#6B6656" }}>
                  <span>Category: <b style={{ color: "var(--ink)" }}>{selected.category}</b></span>
                  <span>Confidence: <b style={{ color: "var(--ink)" }}>{selected.confidence}%</b></span>
                  <span>Sentiment: <b style={{ color: "var(--ink)" }}>{selected.sentiment}</b></span>
                </div>

                <div className="mt-5 p-4 text-[13.5px] whitespace-pre-wrap leading-relaxed" style={{ background: "var(--paper-2)", border: "1px solid var(--line)" }}>
                  {selected.body}
                </div>

                {selected.draft ? (
                  <>
                    <div className="flex items-center gap-2 mt-6 mb-2">
                      <PenLine size={14} />
                      <span className="text-[12px] uppercase tracking-wide" style={{ color: "#8A8370" }}>Drafted reply — edit before sending</span>
                    </div>
                    <textarea
                      value={draftValue}
                      onChange={(ev) => setEdited({ ...edited, [selected.id]: ev.target.value })}
                      rows={7}
                      className="w-full text-[13.5px] leading-relaxed p-3 outline-none"
                      style={{ background: "#fff", border: "1px solid var(--line)", resize: "vertical" }}
                    />

                    <div className="flex items-center gap-2 mt-6 mb-2">
                      <ArrowRight size={14} />
                      <span className="text-[12px] uppercase tracking-wide" style={{ color: "#8A8370" }}>CRM update queued</span>
                    </div>
                    <div style={{ border: "1px solid var(--line)" }}>
                      {selected.crmDiff.map((d, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 text-[13px]"
                          style={{ borderBottom: i === selected.crmDiff.length - 1 ? "none" : "1px solid var(--line)" }}>
                          <span style={{ color: "#6B6656" }}>{d.field}</span>
                          <span className="flex items-center gap-1.5">
                            <span style={{ color: "#8A8370" }}>{d.from}</span>
                            <ArrowRight size={11} style={{ color: "#8A8370" }} />
                            <span style={{ fontWeight: 600 }}>{d.to}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                      <button
                        onClick={() => setSentIds([...sentIds, selected.id])}
                        disabled={sentIds.includes(selected.id)}
                        className="flex items-center gap-2 px-4 py-2 text-[13px]"
                        style={{ background: "var(--ink)", color: "var(--paper)", fontWeight: 600, opacity: sentIds.includes(selected.id) ? 0.5 : 1 }}
                      >
                        <Send size={13} />
                        {sentIds.includes(selected.id) ? "Sent" : "Approve & send"}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-[13px]" style={{ border: "1px solid var(--ink)", fontWeight: 600 }}>
                        <AlertTriangle size={13} />
                        Escalate to human
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 mt-6 text-[13px]" style={{ color: "#8A8370" }}>
                    <Archive size={14} />
                    Filed as spam — no reply or CRM action taken.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
