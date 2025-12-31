type ClientStatus = "active" | "at_risk" | "inactive";

type RiskLevel = "low" | "medium" | "high";

type MoneyTxnType = "income" | "expense";

type InvoiceStatus = "draft" | "sent" | "paid" | "due" | "overdue";

type TaskStatus = "open" | "blocked" | "done";

type FormStatus = "not_started" | "in_progress" | "complete";

type ProjectStatus = "todo" | "doing" | "done";

export type MockClient = {
  id: string;
  name: string;
  status: ClientStatus;
  riskLevel: RiskLevel;
  riskReason: string;
  lastTouchDaysAgo: number;
};

export type MockProposal = {
  id: string;
  clientId: string;
  title: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  value: number;
  createdAt: string; // ISO date
};

export type MockInvoice = {
  id: string;
  clientId: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string; // ISO date
  dueAt: string; // ISO date
  paidAt?: string; // ISO date
};

export type MockMoneyTransaction = {
  id: string;
  type: MoneyTxnType;
  amount: number;
  date: string; // ISO date
  clientId?: string;
  vendor?: string;
  category?: string;
  memo?: string;
  invoiceId?: string;
};

export type MockBudget = {
  id: string;
  category: string;
  limit: number;
  spent: number;
};

export type MockCashFlowPoint = {
  label: string;
  inflow: number;
  outflow: number;
};

export type MockProject = {
  id: string;
  clientId: string;
  title: string;
  status: ProjectStatus;
  progress: number; // 0..1
  deadline: string; // ISO date
};

export type MockTask = {
  id: string;
  title: string;
  status: TaskStatus;
  due: string; // ISO date
  clientId?: string;
  projectId?: string;
};

export type MockCalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO datetime
};

export type MockComplianceForm = {
  id: string;
  name: string;
  status: FormStatus;
  dueAt: string; // ISO date
};

export type MockAuditLog = {
  id: string;
  at: string; // ISO date
  action: string;
};

export type MockMarketplacePack = {
  id: string;
  kind: "theme" | "preset" | "widget";
  name: string;
  priceLabel: string;
  description: string;
};

export type MockDb = {
  clients: MockClient[];
  proposals: MockProposal[];
  invoices: MockInvoice[];
  moneyTransactions: MockMoneyTransaction[];
  budgets: MockBudget[];
  cashFlow: MockCashFlowPoint[];
  projects: MockProject[];
  tasks: MockTask[];
  calendarEvents: MockCalendarEvent[];
  complianceForms: MockComplianceForm[];
  auditLog: MockAuditLog[];
  marketplacePacks: MockMarketplacePack[];
};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isoDateTime(d: Date) {
  return d.toISOString().slice(0, 19);
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfYear(base: Date) {
  return new Date(base.getFullYear(), 0, 1);
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function pick<T>(arr: T[], idx: number) {
  return arr[idx % arr.length];
}

function makeId(prefix: string, n: number) {
  return `${prefix}_${n}`;
}

function computeBudgetSpent(transactions: MockMoneyTransaction[], category: string) {
  return Math.round(
    transactions
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((s, t) => s + t.amount, 0)
  );
}

function buildDb(now: Date): MockDb {
  const clientNames = [
    "Acme Co",
    "Northwind",
    "Globex",
    "Initech",
    "Umbrella",
    "Soylent",
    "Hooli",
    "Stark Industries",
    "Wayne Enterprises",
    "Wonka Industries",
    "Tyrell Corp",
    "Cyberdyne",
    "Oscorp",
    "Aperture Science",
    "Pied Piper",
    "Vandelay Imports",
    "Duff Brewing",
    "Oceanic",
    "Biffco",
    "Good Burger",
    "Massive Dynamic",
    "Prestige Worldwide",
    "Gekko & Co",
    "Gringotts",
  ];

  const clients: MockClient[] = clientNames.map((name, i) => {
    const status: ClientStatus = i % 7 === 0 ? "inactive" : i % 5 === 0 ? "at_risk" : "active";
    const riskLevel: RiskLevel = status === "active" ? (i % 4 === 0 ? "medium" : "low") : status === "inactive" ? "medium" : "high";

    const riskReason =
      status === "active"
        ? riskLevel === "medium"
          ? "Scope expanding quickly"
          : "Healthy engagement"
        : status === "inactive"
          ? "No recent activity"
          : i % 2
            ? "Late invoice"
            : "Payment dispute";

    const lastTouchDaysAgo = status === "inactive" ? 45 + (i % 20) : status === "at_risk" ? 12 + (i % 18) : 2 + (i % 9);

    return {
      id: makeId("cli", i + 1),
      name,
      status,
      riskLevel,
      riskReason,
      lastTouchDaysAgo,
    };
  });

  const yearStart = startOfYear(now);

  const proposals: any[] = [];
  for (let i = 0; i < 18; i++) {
    const client = pick(clients, i * 3 + 2);
    const createdAt = isoDate(addDays(now, -(20 + i * 6)));
    const status = (i % 5 === 0 ? "draft" : i % 4 === 0 ? "rejected" : i % 3 === 0 ? "accepted" : "sent") as MockProposal["status"];
    proposals.push({
      id: makeId("prop", i + 1),
      clientId: client.id,
      title: `${client.name} • Retainer ${i + 1}`,
      status,
      value: 1200 + (i % 7) * 650 + (i % 3) * 300,
      createdAt,
    } satisfies MockProposal);
  }

  const invoices: MockInvoice[] = [];
  const moneyTransactions: MockMoneyTransaction[] = [];

  const invoiceCount = 72;
  for (let i = 0; i < invoiceCount; i++) {
    const client = pick(clients, i * 5 + 1);

    // Spread invoices across the year.
    const issuedAtDate = addDays(yearStart, 6 + i * 5);
    const dueAtDate = addDays(issuedAtDate, 14);

    const amount = Math.round(650 + (i % 9) * 420 + (i % 4) * 175);

    const isPaid = i % 4 !== 0;
    const isOverdue = !isPaid && i % 8 === 0;

    const status: InvoiceStatus = isPaid ? "paid" : isOverdue ? "overdue" : "due";

    const invoice: MockInvoice = {
      id: makeId("inv", i + 1),
      clientId: client.id,
      amount,
      status,
      issuedAt: isoDate(issuedAtDate),
      dueAt: isoDate(dueAtDate),
      paidAt: isPaid ? isoDate(addDays(dueAtDate, -(i % 10))) : undefined,
    };

    invoices.push(invoice);

    if (isPaid) {
      moneyTransactions.push({
        id: makeId("inc", i + 1),
        type: "income",
        amount,
        date: invoice.paidAt ?? invoice.issuedAt,
        clientId: client.id,
        memo: `Invoice ${invoice.id}`,
        invoiceId: invoice.id,
      });
    }
  }

  const expenseVendors = [
    { vendor: "Adobe", category: "Software" },
    { vendor: "AWS", category: "Ops" },
    { vendor: "Notion", category: "Software" },
    { vendor: "Google Workspace", category: "Ops" },
    { vendor: "Figma", category: "Software" },
    { vendor: "Office Depot", category: "Office" },
    { vendor: "UPS", category: "Office" },
    { vendor: "Meta Ads", category: "Marketing" },
    { vendor: "Mailchimp", category: "Marketing" },
    { vendor: "Zoom", category: "Ops" },
  ];

  const expenseCount = 90;
  for (let i = 0; i < expenseCount; i++) {
    const v = pick(expenseVendors, i);
    const date = isoDate(addDays(yearStart, 2 + i * 3));
    const amount = Math.round(15 + (i % 12) * 9 + (i % 5) * 21);
    moneyTransactions.push({
      id: makeId("exp", i + 1),
      type: "expense",
      amount,
      date,
      vendor: v.vendor,
      category: v.category,
      memo: `${v.vendor} ${i % 2 ? "subscription" : "charge"}`,
    });
  }

  const budgetCategories = ["Software", "Marketing", "Ops", "Office"];
  const budgets: MockBudget[] = budgetCategories.map((category, i) => {
    const limit = category === "Marketing" ? 550 : category === "Software" ? 420 : category === "Ops" ? 480 : 300;
    const spent = computeBudgetSpent(moneyTransactions, category);
    return {
      id: makeId("bud", i + 1),
      category,
      limit,
      spent,
    };
  });

  // Cash flow: 12 periods (weeks) based on recent transactions.
  const cashFlow: MockCashFlowPoint[] = Array.from({ length: 12 }).map((_, i) => {
    const inflow = 700 + (i % 5) * 350 + (i % 3) * 260;
    const outflow = 420 + (i % 4) * 210 + (i % 2) * 140;
    return {
      label: `W${i + 1}`,
      inflow,
      outflow,
    };
  });

  const projects: MockProject[] = [];
  const projectTitles = [
    "Website redesign",
    "Retainer sprint",
    "SEO audit",
    "Brand refresh",
    "Landing page build",
    "Analytics setup",
    "Invoice automation",
    "Mobile UI polish",
    "Content calendar",
    "Onboarding flow",
    "CRM cleanup",
    "Year-end reconciliation",
  ];

  for (let i = 0; i < 16; i++) {
    const client = pick(clients, i * 2);
    const status: ProjectStatus = i % 6 === 0 ? "done" : i % 3 === 0 ? "doing" : "todo";
    const progress = status === "done" ? 1 : status === "doing" ? clamp01(0.35 + (i % 5) * 0.12) : clamp01(0.05 + (i % 4) * 0.1);
    const deadline = isoDate(addDays(now, (i % 10) * 4 - 8));

    projects.push({
      id: makeId("proj", i + 1),
      clientId: client.id,
      title: `${client.name} • ${pick(projectTitles, i)}`,
      status,
      progress,
      deadline,
    });
  }

  const tasks: MockTask[] = [];
  for (let i = 0; i < 40; i++) {
    const proj = pick(projects, i);
    const client = clients.find((c) => c.id === proj.clientId);
    const status: TaskStatus = i % 9 === 0 ? "blocked" : i % 4 === 0 ? "done" : "open";
    const due = isoDate(addDays(now, (i % 14) - 5));

    tasks.push({
      id: makeId("task", i + 1),
      title: `${pick(["Follow up", "Draft", "Review", "Ship", "Refine", "QA"], i)}: ${proj.title.split(" • ")[1]}`,
      status,
      due,
      clientId: client?.id,
      projectId: proj.id,
    });
  }

  const calendarEvents: MockCalendarEvent[] = Array.from({ length: 16 }).map((_, i) => {
    const t = pick(tasks, i * 2);
    const start = addDays(now, (i % 10) - 4);
    start.setHours(9 + (i % 6), 0, 0, 0);
    return {
      id: makeId("evt", i + 1),
      title: `Work block: ${t.title}`,
      start: isoDateTime(start),
    };
  });

  const complianceForms: MockComplianceForm[] = [
    { id: "form_1099", name: "1099-NEC", status: "in_progress", dueAt: isoDate(addDays(now, 18)) },
    { id: "form_schedc", name: "Schedule C", status: "not_started", dueAt: isoDate(addDays(now, 35)) },
    { id: "form_sales", name: "Sales tax report", status: "complete", dueAt: isoDate(addDays(now, -10)) },
    { id: "form_w9", name: "W-9 collection", status: "in_progress", dueAt: isoDate(addDays(now, 8)) },
  ];

  const auditLog: MockAuditLog[] = Array.from({ length: 18 }).map((_, i) => {
    const at = isoDate(addDays(now, -(2 + i)));
    const client = pick(clients, i);
    const action =
      i % 5 === 0
        ? `Updated budget category (${pick(budgetCategories, i)})`
        : i % 4 === 0
          ? `Saved dashboard preset (mock)`
          : i % 3 === 0
            ? `Sent proposal to ${client.name}`
            : `Marked task complete (${pick(tasks, i).title})`;

    return { id: makeId("audit", i + 1), at, action };
  });

  const marketplacePacks: MockMarketplacePack[] = [
    {
      id: "theme_1",
      kind: "theme",
      name: "Neutral Pro",
      priceLabel: "$0",
      description: "Balanced contrast and spacing (mock pack).",
    },
    {
      id: "theme_2",
      kind: "theme",
      name: "Sponsor Gold",
      priceLabel: "$9",
      description: "Sponsor-ready look (mock pack).",
    },
    {
      id: "preset_1",
      kind: "preset",
      name: "Ops Focus",
      priceLabel: "$0",
      description: "Widgets tuned for tasks + compliance.",
    },
    {
      id: "preset_2",
      kind: "preset",
      name: "Cash Focus",
      priceLabel: "$4",
      description: "More money widgets and cashflow glance.",
    },
    {
      id: "widget_1",
      kind: "widget",
      name: "Client Health Pack",
      priceLabel: "$7",
      description: "Extra client risk widgets (mock).",
    },
    {
      id: "widget_2",
      kind: "widget",
      name: "Tax Season Pack",
      priceLabel: "$5",
      description: "Tax countdown + forms summary widgets (mock).",
    },
  ];

  return {
    clients,
    proposals,
    invoices,
    moneyTransactions,
    budgets,
    cashFlow,
    projects,
    tasks,
    calendarEvents,
    complianceForms,
    auditLog,
    marketplacePacks,
  };
}

export const mockDb: MockDb = buildDb(new Date());
