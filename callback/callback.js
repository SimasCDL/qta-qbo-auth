(() => {
  "use strict";
  const params = new URLSearchParams(location.search);
  // Erase the code before loading other pages. GitHub still receives the initial request.
  history.replaceState(null, "", location.pathname);
  const status = document.getElementById("status");
  const link = document.getElementById("continue");
  const state = params.get("state") || "";
  const match = /^qta1\.([0-9]{1,5})\.([A-Za-z0-9_-]{43})$/.exec(state);
  const port = match ? Number(match[1]) : 0;
  const allowed = new Set(["state", "code", "realmId", "error", "error_description"]);
  const keys = [...params.keys()];
  if (!match || port < 1024 || port > 65535 || keys.some(k => !allowed.has(k) || params.getAll(k).length !== 1)
      || (!params.has("error") && (!params.get("code") || !/^[0-9]+$/.test(params.get("realmId") || "")))) {
    status.textContent = "No valid sign-in response. Start Connect QuickBooks from Claude.";
    return;
  }
  const query = new URLSearchParams();
  for (const key of ["state", "code", "realmId", "error"]) {
    if (params.has(key)) query.set(key, params.get(key));
  }
  // Fixed loopback host and path, never a caller-provided URL. The receiver verifies random state.
  const target = `http://127.0.0.1:${port}/qbo/callback?${query}`;
  link.href = target;
  link.hidden = false;
  link.rel = "noreferrer";
  status.textContent = "Returning to the connection on this computer. If the browser blocks it, use Continue below.";
  location.replace(target);
})();
