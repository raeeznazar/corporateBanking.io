/**
 * "What are you working towards?" goal selector data.
 * Selecting a goal updates the recommendation panel below it.
 *
 * Renders into two separate DOM trees (desktop cards/grid vs. mobile compact
 * list) kept in sync from one shared selection state — the mobile design
 */

const GOALS = [
  {
    id: "growing",
    index: "01",
    title: "Growing my business",
    desc: "Capacity, headcount, new sites or acquisition.",
    descShort: "Capacity, sites, acquisition",
    intro: "Five areas our growth desk usually works on first.",
    recommendations: [
      { title: "Lending & Finance", desc: "Facilities sized for expansion, acquisition or new sites." },
      { title: "Cash Management", desc: "Multi-entity visibility as headcount and sites grow." },
      { title: "Working Capital", desc: "Trade finance and supplier programmes." },
      { title: "Payments", desc: "Payroll and supplier flows that scale with you." },
      { title: "Digital Banking", desc: "Role-based approvals as your team grows." },
    ],
  },
  {
    id: "international",
    index: "02",
    title: "Expanding internationally",
    desc: "New markets, new currencies, new counterparties.",
    descShort: "New markets and currencies",
    intro: "Five areas our international desk usually works on first.",
    recommendations: [
      { title: "International Banking", desc: "Accounts and coverage in 40+ markets." },
      { title: "Foreign Exchange", desc: "Hedging and forward cover for exposure." },
      { title: "Payments", desc: "Cross-border settlement and collections." },
      { title: "Cash Management", desc: "Multi-currency visibility and pooling." },
      { title: "Working Capital", desc: "Trade finance and supplier programmes." },
    ],
  },
  {
    id: "cashflow",
    index: "03",
    title: "Managing cash flow",
    desc: "Visibility, liquidity and working capital timing.",
    descShort: "Liquidity and timing",
    intro: "Five areas our cash management desk usually works on first.",
    recommendations: [
      { title: "Cash Management", desc: "One view of every account, currency and entity." },
      { title: "Working Capital", desc: "Release cash tied up in stock and receivables." },
      { title: "Payments", desc: "Predictable collections and supplier terms." },
      { title: "Digital Banking", desc: "Real-time visibility of balances and flows." },
      { title: "Treasury & Risk", desc: "Manage exposure as timing pressures shift." },
    ],
  },
  {
    id: "investment",
    index: "04",
    title: "Funding an investment",
    desc: "Plant, property, fleet or technology.",
    intro: "Five areas our lending desk usually works on first.",
    recommendations: [
      { title: "Lending & Finance", desc: "Asset and real estate finance from £1m." },
      { title: "Cash Management", desc: "Keep operations funded while capital is deployed." },
      { title: "Treasury & Risk", desc: "Interest rate structures sized to the facility." },
      { title: "Working Capital", desc: "Bridge timing between spend and returns." },
      { title: "Digital Banking", desc: "Track drawdowns and repayments in one place." },
    ],
  },
  {
    id: "payments",
    index: "05",
    title: "Managing payments",
    desc: "Collections, payroll and supplier flows at scale.",
    intro: "Five areas our payments desk usually works on first.",
    recommendations: [
      { title: "Payments", desc: "Payroll, supplier and collection flows with controls." },
      { title: "Cash Management", desc: "One view of every account and entity." },
      { title: "Digital Banking", desc: "Role-based approvals for payment runs." },
      { title: "International Banking", desc: "Cross-border payments without new accounts." },
      { title: "Working Capital", desc: "Supplier programmes that protect terms." },
    ],
  },
  {
    id: "planning",
    index: "06",
    title: "Planning what's next",
    desc: "Succession, refinancing or market risk.",
    intro: "Five areas our advisory desk usually works on first.",
    recommendations: [
      { title: "Treasury & Risk", desc: "Stress-test rate, currency and commodity exposure." },
      { title: "Lending & Finance", desc: "Refinance existing facilities on better terms." },
      { title: "Cash Management", desc: "A clear position before you plan your next move." },
      { title: "Digital Banking", desc: "Self-serve reporting for board and investors." },
      { title: "International Banking", desc: "Structure for markets you plan to enter." },
    ],
  },
];

const DEFAULT_GOAL_ID = "international";

const toSentenceCase = (title) => title.charAt(0) + title.slice(1).toLowerCase();

const arrowIcon = () => '<svg class="c-icon" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const checkIcon = () =>
  '<svg class="c-icon" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------- Desktop: card grid + inline recommendation row ---------- */

const renderGoalCard = (goal, isSelected) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "c-goal-card";
  card.id = `goal-${goal.id}`;
  card.setAttribute("aria-pressed", String(isSelected));
  card.dataset.goalId = goal.id;
  card.innerHTML = `
    <div>
      <p class="u-label c-goal-card__index">${goal.index}</p>
      <p class="c-goal-card__title">${goal.title}</p>
      <p class="u-caption c-goal-card__desc">${goal.desc}</p>
    </div>
    <span class="c-goal-card__indicator" aria-hidden="true">${isSelected ? checkIcon() : arrowIcon()}</span>
  `;
  return card;
};

const renderRecommendItem = (item) => {
  const el = document.createElement("div");
  el.className = "c-recommend__item";
  el.innerHTML = `
    <p class="c-recommend__item-title">${item.title}</p>
    <p class="u-caption c-recommend__item-desc">${item.desc}</p>
  `;
  return el;
};

const renderDesktopPanel = (panel, goal) => {
  panel.innerHTML = `
    <div class="c-recommend__head">
      <div>
        <p class="u-eyebrow c-recommend__eyebrow">Based on your goal</p>
        <h3 class="u-h3">${goal.title}</h3>
        <p class="u-body u-muted">${goal.intro}</p>
      </div>
      <a class="c-button c-button--primary" href="pages/enquiry.html">Start an enquiry</a>
    </div>
    <div class="c-recommend__items"></div>
  `;

  const itemsContainer = panel.querySelector(".c-recommend__items");
  goal.recommendations.forEach((item) => {
    itemsContainer.appendChild(renderRecommendItem(item));
  });
};

/* ---------- Mobile: compact list + stacked recommendation rows ---------- */

const renderGoalRow = (goal, isSelected) => {
  const row = document.createElement("button");
  row.type = "button";
  row.className = "c-goal-row";
  row.id = `goal-mobile-${goal.id}`;
  row.setAttribute("aria-pressed", String(isSelected));
  row.dataset.goalId = goal.id;
  row.innerHTML = `
    <div>
      <p class="c-goal-row__title">${goal.title}</p>
      ${goal.descShort ? `<p class="u-caption c-goal-row__desc">${goal.descShort}</p>` : ""}
    </div>
    <span class="c-goal-row__indicator" aria-hidden="true">${isSelected ? checkIcon() : arrowIcon()}</span>
  `;
  return row;
};

const renderRecommendRow = (item, index) => {
  const el = document.createElement("div");
  el.className = "c-recommend-mobile__item";
  if (index >= 3) {
    el.classList.add("c-recommend-mobile__item--collapsible");
  }
  el.innerHTML = `
    <div>
      <p class="c-recommend-mobile__item-title">${toSentenceCase(item.title)}</p>
      <p class="u-caption c-recommend-mobile__item-desc">${item.desc}</p>
    </div>
    ${arrowIcon()}
  `;
  return el;
};

const renderMobilePanel = (panel, goal) => {
  panel.dataset.expanded = "false";
  panel.innerHTML = `
    <p class="u-label c-recommend-mobile__eyebrow">Based on your goal</p>
    <h2 class="u-h2">Recommended for ${goal.title.toLowerCase()}</h2>
    <div class="c-recommend-mobile__items"></div>
    <button class="c-link c-recommend-mobile__more" type="button" id="recommend-mobile-toggle">
      Show 2 more
      ${arrowIcon()}
    </button>
    <a class="c-button c-button--primary c-button--block" href="pages/enquiry.html">Start an enquiry</a>
  `;

  const itemsContainer = panel.querySelector(".c-recommend-mobile__items");
  goal.recommendations.forEach((item, index) => {
    itemsContainer.appendChild(renderRecommendRow(item, index));
  });

  panel.querySelector("#recommend-mobile-toggle").addEventListener("click", () => {
    panel.dataset.expanded = "true";
  });
};

export const initGoalSelector = () => {
  const grid = document.getElementById("goal-grid");
  const panel = document.getElementById("recommend-panel");
  const list = document.getElementById("goal-list-mobile");
  const panelMobile = document.getElementById("recommend-mobile");
  if ((!grid || !panel) && (!list || !panelMobile)) return;

  let selectedId = DEFAULT_GOAL_ID;

  const render = () => {
    const goal = GOALS.find((g) => g.id === selectedId);
    if (!goal) return;

    if (grid) {
      grid.innerHTML = "";
      GOALS.forEach((g) => grid.appendChild(renderGoalCard(g, g.id === selectedId)));
    }
    if (panel) renderDesktopPanel(panel, goal);

    if (list) {
      list.innerHTML = "";
      GOALS.forEach((g) => list.appendChild(renderGoalRow(g, g.id === selectedId)));
    }
    if (panelMobile) renderMobilePanel(panelMobile, goal);
  };

  const selectGoal = (goalId, { refocus = false, mobile = false } = {}) => {
    selectedId = goalId;
    render();
    if (refocus) {
      document.getElementById(mobile ? `goal-mobile-${goalId}` : `goal-${goalId}`)?.focus();
    }
  };

  grid?.addEventListener("click", (event) => {
    const card = event.target.closest(".c-goal-card");
    if (!card) return;
    selectGoal(card.dataset.goalId, { refocus: true });
  });

  list?.addEventListener("click", (event) => {
    const row = event.target.closest(".c-goal-row");
    if (!row) return;
    selectGoal(row.dataset.goalId, { refocus: true, mobile: true });
  });

  render();
};
