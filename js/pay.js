(function () {
  const box = document.getElementById("configPreview");
  if (!box) return;
  function current() {
    return {
      ownerName: "David Mitchell",
      ownerEmail: "mitchell5584.dm@gmail.com",
      market: "Melbourne / Brevard County, FL",
      stripePack: (document.getElementById("payStripePack") || {}).value || "",
      stripePilot: (document.getElementById("payStripePilot") || {}).value || "",
      paypalMe: (document.getElementById("payPaypal") || {}).value || "",
      gumroadPack: (document.getElementById("payGumroad") || {}).value || "",
      currencyNote: "USD"
    };
  }
  function snippet(p) { return "window.INCOME_PAY = " + JSON.stringify(p, null, 2) + ";\n"; }
  try {
    const saved = JSON.parse(localStorage.getItem("incomeos.pay") || "{}");
    const map = { payStripePack: "stripePack", payStripePilot: "stripePilot", payGumroad: "gumroadPack", payPaypal: "paypalMe" };
    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el && saved[map[id]]) el.value = saved[map[id]];
    });
  } catch (e) {}
  box.textContent = snippet(current());
  const save = document.getElementById("savePay");
  const copy = document.getElementById("copyConfig");
  if (save) save.onclick = function () {
    const p = current();
    localStorage.setItem("incomeos.pay", JSON.stringify(p));
    box.textContent = snippet(p);
  };
  if (copy) copy.onclick = function () {
    navigator.clipboard.writeText(snippet(current()));
  };
})();
