const defaultState = () => ({
  profile: {
    name: "", city: "Melbourne, FL", skills: "", assets: "Laptop, Grok, Gemini, email",
    goal: 2500, hours: 12, capital: 0, path: "auto", no: ""
  },
  deals: [],
  income: [],
  content: [],
  checks: {}
});

let S = load();

function load() {
  try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch { return defaultState(); }
}
function save() {
  localStorage.setItem(KEY, JSON.stringify(S));
  renderAll();
}

function $(id) { return document.getElementById(id); }
function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.style.display = "block";
  setTimeout(() => t.style.display = "none", 1600);
}
function money(n) { return "$" + Math.round(n || 0).toLocaleString(); }
function monthKey(d) { return d.slice(0, 7); }
function thisMonth() { return new Date().toISOString().slice(0, 7); }
function monthIncome() {
  return S.income.filter(i => monthKey(i.date) === thisMonth()).reduce((a, b) => a + Number(b.amt || 0), 0);
}
function plan() {
  const p = S.profile;
  const goal = Number(p.goal) || 0;
  const hours = Math.max(1, Number(p.hours) || 12);
  const weekly = goal / 4.33;
  const rate = weekly / hours;
  const path = choosePath(p);
  const price = suggestedPrice(path, hours, goal);
  const closes = Math.max(1, Math.ceil(goal / price));
  const conv = path === "products" ? 0.02 : 0.12;
  const convos = Math.ceil(closes / conv);
  const outreaches = Math.ceil(convos / 0.25);
  return { goal, hours, weekly, rate, path, price, closes, convos, outreaches };
}
function choosePath(p) {
  if (p.path && p.path !== "auto") return p.path;
  const hours = Number(p.hours) || 12;
  if (hours <= 6) return "products";
  if ((p.city || "").length > 3) return "local";
  return "services";
}
function suggestedPrice(path, hours, goal) {
  if (path === "products") return 29;
  if (path === "content") return 19;
  if (path === "local") return Math.min(399, Math.max(199, Math.round(goal / 8)));
  return Math.min(797, Math.max(147, Math.round((goal / 4.33) / Math.max(1, hours / 6))));
}
function pathLabel(path) {
  return {
    services: "Productized services",
    products: "Digital products",
    local: "Local retainers",
    content: "Content + affiliate",
    hybrid: "Hybrid (service + product)"
  }[path] || "Hybrid (service + product)";
}
function offers() {
  const p = S.profile;
  const pl = plan();
  const skill = (p.skills || "research, writing, organization").split(/[,.\n]/)[0].trim();
  const city = p.city || "your city";
  return [
    {
      tag: "Flagship",
      name: pl.path === "local" ? "Local Presence Pack" : pl.path === "products" ? "Operator Template Pack" : "Done-For-You Content / Ops Pack",
      price: pl.path === "products" ? 29 : pl.price,
      blurb: pl.path === "local"
        ? "Monthly Google posts, review replies, and a simple script pack for a " + city + " owner who is busy on the tools. You run it with an assistant. They just approve."
        : pl.path === "products"
        ? "A reusable kit extracted from " + skill + ". Checklists, scripts, and examples someone can use the same day."
        : "A fixed-scope pack using " + skill + ". Clear inputs, 3-5 day turnaround, one revision, PDF/Docs delivery."
    },
    {
      tag: "Backup",
      name: "90-minute paid audit",
      price: Math.max(97, Math.round(pl.price * 0.35)),
      blurb: "A recorded or written teardown of their current page, listing, or process plus a 1-page action plan. Low-risk yes that upgrades into the flagship."
    },
    {
      tag: "Product",
      name: "The same work, packaged",
      price: 19,
      blurb: "Gumroad version of the checklists you already use to deliver. Ships after the second paid client so it is real, not theoretical."
    }
  ];
}

function masterPrompt() {
  const p = S.profile;
  const pl = plan();
  const o = offers()[0];
  return "You are the Operator of Income OS for " + (p.name || "the Owner") + ".\n" +
    "The Owner lives/works in " + (p.city || "an unspecified US market") + " and has about " + pl.hours + " hours/week.\n" +
    "Monthly net goal: " + money(pl.goal) + ". Starting capital: " + money(p.capital) + ".\n" +
    "Skills and proof: " + (p.skills || "(not given — ask 3 questions, then assume writing + research)") + ".\n" +
    "Assets: " + (p.assets || "laptop and free AI chats") + ".\n" +
    "Will not do: " + (p.no || "nothing specified") + ".\n" +
    "Chosen path: " + pathLabel(pl.path) + ".\n" +
    "Flagship offer: " + o.name + " at " + money(o.price) + ". " + o.blurb + "\n\n" +
    "Rules:\n- Optimize for cash this week.\n- Return finished drafts, not outlines, unless asked.\n- Do not invent clients, credentials, or results.\n- No licensed legal, tax, medical, or investment advice.\n- After every reply: Today’s objective, 3 ships, drafts, owner actions, stop line.\n- Keep work inside " + pl.hours + " hours/week.\n- Prefer " + (p.city || "local") + " buyers when the path is local or services.\n\nYou draft. The Owner sends, publishes, invoices, and collects.";
}

function dailyPrompt() {
  const day = new Date().getDay();
  const d = DAYS[day];
  const p = S.profile;
  const pl = plan();
  const pipe = S.deals.map(x => "- [" + x.stage + "] " + x.who + " — " + x.offer).join("\n") || "(empty)";
  const earned = monthIncome();
  return "DATE: " + new Date().toISOString().slice(0,10) + "\n" +
    "TODAY’S MODE: " + d.mode + " — " + d.title + "\n" +
    "OWNER: " + (p.name || "Owner") + " | " + p.city + " | " + pl.hours + " hrs/week | goal " + money(pl.goal) + "\n" +
    "SKILLS: " + (p.skills || "n/a") + "\n" +
    "FLAGSHIP: " + offers()[0].name + " @ " + money(offers()[0].price) + "\n" +
    "LEDGER THIS MONTH: " + money(earned) + " of " + money(pl.goal) + "\n" +
    "PIPELINE:\n" + pipe + "\n" +
    "CONTENT QUEUE: " + S.content.length + " items\n\n" +
    "Do the Operator standing format. Produce the three ships for " + d.mode + ".\n" +
    "Ships the OS expects: " + d.ships.join("; ") + ".";
}

function renderProfile() {
  const p = S.profile;
  $("pName").value = p.name || "";
  $("pCity").value = p.city || "";
  $("pSkills").value = p.skills || "";
  $("pAssets").value = p.assets || "";
  $("pGoal").value = p.goal || 0;
  $("pHours").value = p.hours || 12;
  $("pCapital").value = p.capital || 0;
  $("pPath").value = p.path || "auto";
  $("pNo").value = p.no || "";
}
function grabProfile() {
  S.profile = {
    name: $("pName").value.trim(),
    city: $("pCity").value.trim(),
    skills: $("pSkills").value.trim(),
    assets: $("pAssets").value.trim(),
    goal: Number($("pGoal").value || 0),
    hours: Number($("pHours").value || 12),
    capital: Number($("pCapital").value || 0),
    path: $("pPath").value,
    no: $("pNo").value.trim()
  };
}

function renderPlan() {
  const pl = plan();
  const earned = monthIncome();
  const pct = pl.goal ? Math.min(100, (earned / pl.goal) * 100) : 0;
  $("planStats").innerHTML = [
    ["Weekly target", money(pl.weekly), "Goal / 4.33 weeks"],
    ["Effective rate", money(pl.rate) + "/hr", "If every hour produced cash"],
    ["Flagship price", money(pl.price), pathLabel(pl.path)],
    ["Closes needed", pl.closes, pl.path === "products" ? "product sales / month" : "clients / month"]
  ].map(([k,v,s]) => "<div class=\"card\"><div class=\"muted\">" + k + "</div><div class=\"stat\">" + v + "</div><div class=\"muted\">" + s + "</div></div>").join("");
  $("planNarrative").innerHTML = "<h3>How this number happens</h3><p>Path: <span class=\"pill gold\">" + pathLabel(pl.path) + "</span></p><p>To hit " + money(pl.goal) + " this month you need about <b>" + pl.closes + "</b> paid close(s) at " + money(pl.price) + ".</p><p>Working backwards at conservative conversion: ~<b>" + pl.convos + "</b> real conversations and ~<b>" + pl.outreaches + "</b> personalized outreaches.</p><p>That is <b>" + Math.ceil(pl.outreaches / 4.33) + "</b> outreaches per week inside " + pl.hours + " hours. The assistant writes them. You send them.</p><div class=\"bar\" style=\"margin-top:14px\"><i style=\"width:" + pct + "%\"></i></div><p class=\"muted\">" + money(earned) + " collected of " + money(pl.goal) + " (" + pct.toFixed(0) + "%).</p>";
  const names = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  $("planWeek").innerHTML = "<h3>This week’s operating rhythm</h3><table>" + DAYS.map((d,i) => "<tr><td>" + names[i] + "</td><td><b>" + d.mode + "</b></td><td class=\"muted\">" + d.title + "</td></tr>").join("") + "</table><p class=\"muted\">If hours are under 8, drop Saturday batch into Friday and skip vanity content.</p>";
}

function renderOffers() {
  $("offerCards").innerHTML = offers().map(o => {
    const suffix = (o.tag === "Flagship" && plan().path === "local") ? "<span class='muted'>/mo</span>" : "";
    return "<div class=\"card\"><span class=\"pill gold\">" + o.tag + "</span><h3 style=\"margin-top:10px\">" + o.name + "</h3><div class=\"stat\">" + money(o.price) + suffix + "</div><p class=\"muted\">" + o.blurb + "</p></div>";
  }).join("");
}

function renderOperator() {
  $("masterPrompt").textContent = masterPrompt();
  $("jobPrompts").innerHTML = JOBS.map(([t, body]) => "<div class=\"card\"><div class=\"row\" style=\"justify-content:space-between;align-items:center\"><h3>" + t + "</h3><button class=\"btn ghost copy-job\">Copy</button></div><div class=\"prompt\">" + escapeHtml(jobPrompt(body)) + "</div></div>").join("");
  document.querySelectorAll(".copy-job").forEach((btn, i) => {
    btn.onclick = () => copyText(jobPrompt(JOBS[i][1]));
  });
}
function jobPrompt(body) {
  return masterPrompt() + "\n\nJOB:\n" + body + "\n\nReturn finished work the Owner can use in the next 25 minutes.";
}

function renderDaily() {
  const day = new Date().getDay();
  const d = DAYS[day];
  $("dailySub").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + " · " + d.mode;
  $("dailyCard").innerHTML = "<h3>" + d.mode + ": " + d.title + "</h3><ol>" + d.ships.map(s => "<li>" + s + "</li>").join("") + "</ol><p class=\"muted\">Assistant drafts all of it. You send, publish, or invoice. Do not add a fourth ship.</p>";
  const key = new Date().toISOString().slice(0,10);
  if (!S.checks[key]) S.checks[key] = d.ships.map(() => false);
  $("dailyChecks").innerHTML = d.ships.map((s, i) => "<label style=\"display:flex;gap:8px;align-items:flex-start;margin:8px 0;color:var(--text)\"><input type=\"checkbox\" data-i=\"" + i + "\" " + (S.checks[key][i] ? "checked" : "") + " /><span>" + s + "</span></label>").join("");
  $("dailyChecks").onchange = (e) => {
    const i = e.target.getAttribute("data-i");
    if (i == null) return;
    S.checks[key][i] = e.target.checked;
    save();
  };
  $("dailyPrompt").textContent = dailyPrompt();
}

function renderPipeline() {
  $("kanban").innerHTML = STAGES.map(st => {
    const items = S.deals.filter(d => d.stage === st);
    return "<div class=\"col\"><h4>" + st + " (" + items.length + ")</h4>" + items.map(d => {
      const i = S.deals.indexOf(d);
      return "<div class=\"deal\" data-i=\"" + i + "\"><b>" + escapeHtml(d.who) + "</b><div class=\"muted\">" + escapeHtml(d.offer) + "</div><div class=\"row\" style=\"margin-top:6px\"><button class=\"btn ghost prev\">◀</button><button class=\"btn ghost next\">▶</button><button class=\"btn rose del\">x</button></div></div>";
    }).join("") + "</div>";
  }).join("");
  $("kanban").onclick = (e) => {
    const card = e.target.closest(".deal");
    if (!card) return;
    const i = Number(card.getAttribute("data-i"));
    const deal = S.deals[i];
    const si = STAGES.indexOf(deal.stage);
    if (e.target.classList.contains("next") && si < STAGES.length - 1) deal.stage = STAGES[si + 1];
    if (e.target.classList.contains("prev") && si > 0) deal.stage = STAGES[si - 1];
    if (e.target.classList.contains("del")) S.deals.splice(i, 1);
    save();
  };
}

function renderLedger() {
  const earned = monthIncome();
  const pl = plan();
  const pct = pl.goal ? Math.min(100, earned / pl.goal * 100) : 0;
  const pipelineValue = S.deals.filter(d => d.stage !== "Paid").length * pl.price;
  $("ledgerStats").innerHTML = [
    ["Collected this month", money(earned), "<div class=\"bar\"><i style=\"width:" + pct + "%\"></i></div>"],
    ["Remaining", money(Math.max(0, pl.goal - earned)), "to goal"],
    ["Open pipeline (est.)", money(pipelineValue), "deals x flagship price"]
  ].map(([k,v,s]) => "<div class=\"card\"><div class=\"muted\">" + k + "</div><div class=\"stat\">" + v + "</div><div class=\"muted\">" + s + "</div></div>").join("");
  $("incomeRows").innerHTML = S.income.slice().reverse().map((i, idx) => {
    const real = S.income.length - 1 - idx;
    return "<tr><td>" + i.date + "</td><td>" + escapeHtml(i.source) + "</td><td class=\"ok\">" + money(i.amt) + "</td><td><button class=\"btn rose\" data-del=\"" + real + "\">x</button></td></tr>";
  }).join("") || "<tr><td colspan=\"4\" class=\"muted\">No payments yet. First dollar is the whole game.</td></tr>";
  $("incomeRows").onclick = (e) => {
    const id = e.target.getAttribute("data-del");
    if (id == null) return;
    S.income.splice(Number(id), 1);
    save();
  };
  $("navEarned").textContent = money(earned);
  $("navGoal").textContent = "Goal " + money(pl.goal);
}

function renderContent() {
  $("contentRows").innerHTML = S.content.map((c, i) => "<tr><td>" + escapeHtml(c.chan) + "</td><td>" + escapeHtml(c.idea) + "</td><td><span class=\"pill " + (c.done ? "mint" : "") + "\">" + (c.done ? "shipped" : "queued") + "</span></td><td><button class=\"btn ghost\" data-toggle=\"" + i + "\">" + (c.done ? "Reopen" : "Shipped") + "</button> <button class=\"btn rose\" data-kill=\"" + i + "\">x</button></td></tr>").join("") || "<tr><td colspan=\"4\" class=\"muted\">Queue work that names the buyer and the offer.</td></tr>";
  $("contentRows").onclick = (e) => {
    const t = e.target.getAttribute("data-toggle");
    const k = e.target.getAttribute("data-kill");
    if (t != null) S.content[Number(t)].done = !S.content[Number(t)].done;
    if (k != null) S.content.splice(Number(k), 1);
    if (t != null || k != null) save();
  };
}

function renderPlaybooks() {
  $("playGrid").innerHTML = PLAYBOOKS.map(p => "<div class=\"card play\"><h3>" + p.t + "</h3><p class=\"muted\">" + p.b + "</p></div>").join("");
}

function renderAll() {
  renderProfile();
  renderPlan();
  renderOffers();
  renderOperator();
  renderDaily();
  renderPipeline();
  renderLedger();
  renderContent();
  renderPlaybooks();
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>\"']/g, c => ({ "&":"&", "<":"<", ">":">", "\"":""", "'":"&#39;" }[c]));
}
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => toast("Copied to clipboard")).catch(() => { prompt("Copy this:", text); });
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll("main > section").forEach(s => s.classList.add("hidden"));
    $(btn.dataset.tab).classList.remove("hidden");
  };
});

$("saveProfile").onclick = () => { grabProfile(); save(); toast("Plan updated"); };
$("regenOffers").onclick = () => { grabProfile(); save(); toast("Offers rebuilt"); };
$("copyMaster").onclick = () => copyText(masterPrompt());
$("copyDaily").onclick = () => copyText(dailyPrompt());
$("addDeal").onclick = () => {
  const who = $("dWho").value.trim();
  const offer = $("dOffer").value.trim();
  if (!who) return toast("Add a name");
  S.deals.push({ who, offer: offer || offers()[0].name, stage: $("dStage").value });
  $("dWho").value = ""; $("dOffer").value = "";
  save();
};
$("iDate").value = new Date().toISOString().slice(0,10);
$("addIncome").onclick = () => {
  const source = $("iSource").value.trim();
  const amt = Number($("iAmt").value || 0);
  const date = $("iDate").value || new Date().toISOString().slice(0,10);
  if (!source || !amt) return toast("Source and amount required");
  S.income.push({ source, amt, date });
  $("iSource").value = ""; $("iAmt").value = "";
  save();
};
$("addContent").onclick = () => {
  const idea = $("cIdea").value.trim();
  if (!idea) return toast("Add an idea");
  S.content.push({ idea, chan: $("cChan").value, done: false });
  $("cIdea").value = "";
  save();
};
$("copyContentPrompt").onclick = () => {
  const list = S.content.filter(c => !c.done).map(c => "- " + c.chan + ": " + c.idea).join("\n") || "(queue empty — invent 5 posts that sell the flagship)";
  copyText(masterPrompt() + "\n\nJOB: Write every queued item to publishable quality.\nQUEUE:\n" + list);
};
$("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "income-os-backup.json";
  a.click();
};
$("importBtn").onclick = () => $("importFile").click();
$("importFile").onchange = (e) => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try { S = Object.assign(defaultState(), JSON.parse(r.result)); save(); toast("Imported"); }
    catch { toast("Invalid file"); }
  };
  r.readAsText(f);
};
$("wipeBtn").onclick = () => {
  if (confirm("Wipe all local Income OS data?")) { S = defaultState(); save(); }
};

renderAll();
