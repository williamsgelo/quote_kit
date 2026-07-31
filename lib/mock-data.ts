export type QuoteStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Accepted"
  | "Rejected"
  | "Expired";

export type Quote = {
  id: string;
  number: string;
  customer: string;
  company: string;
  status: QuoteStatus;
  issueDate: string;
  expiryDate: string;
  total: number;
};

export const quotes: Quote[] = [
  {
    id: "q-1048",
    number: "QK-1048",
    customer: "Amelia Hart",
    company: "Hart & Finch",
    status: "Viewed",
    issueDate: "28 Jul 2026",
    expiryDate: "11 Aug 2026",
    total: 51635,
  },
  {
    id: "q-1047",
    number: "QK-1047",
    customer: "Thabo Ndlovu",
    company: "Ndlovu Projects",
    status: "Sent",
    issueDate: "26 Jul 2026",
    expiryDate: "09 Aug 2026",
    total: 24350,
  },
  {
    id: "q-1046",
    number: "QK-1046",
    customer: "Mia Petersen",
    company: "Common Ground Studio",
    status: "Accepted",
    issueDate: "21 Jul 2026",
    expiryDate: "04 Aug 2026",
    total: 78200,
  },
  {
    id: "q-1045",
    number: "QK-1045",
    customer: "James Okoro",
    company: "Northstar Labs",
    status: "Draft",
    issueDate: "19 Jul 2026",
    expiryDate: "02 Aug 2026",
    total: 16900,
  },
  {
    id: "q-1044",
    number: "QK-1044",
    customer: "Leila Jacobs",
    company: "Fynbos Retail",
    status: "Rejected",
    issueDate: "12 Jul 2026",
    expiryDate: "26 Jul 2026",
    total: 31500,
  },
  {
    id: "q-1043",
    number: "QK-1043",
    customer: "Oliver Chen",
    company: "Signal House",
    status: "Expired",
    issueDate: "02 Jul 2026",
    expiryDate: "16 Jul 2026",
    total: 12400,
  },
];

export const customers = [
  {
    id: "cus-1",
    name: "Amelia Hart",
    company: "Hart & Finch",
    email: "amelia@hartandfinch.co.za",
    phone: "+27 82 441 0932",
    quotes: 4,
    activity: "Viewed quote 2h ago",
    initials: "AH",
  },
  {
    id: "cus-2",
    name: "Thabo Ndlovu",
    company: "Ndlovu Projects",
    email: "thabo@ndlovuprojects.co.za",
    phone: "+27 71 885 2044",
    quotes: 7,
    activity: "Quote sent 1d ago",
    initials: "TN",
  },
  {
    id: "cus-3",
    name: "Mia Petersen",
    company: "Common Ground Studio",
    email: "mia@commonground.studio",
    phone: "+27 83 119 8450",
    quotes: 3,
    activity: "Accepted quote 3d ago",
    initials: "MP",
  },
  {
    id: "cus-4",
    name: "James Okoro",
    company: "Northstar Labs",
    email: "james@northstarlabs.io",
    phone: "+27 79 331 6810",
    quotes: 2,
    activity: "Added 5d ago",
    initials: "JO",
  },
  {
    id: "cus-5",
    name: "Leila Jacobs",
    company: "Fynbos Retail",
    email: "leila@fynbosretail.co.za",
    phone: "+27 60 728 1457",
    quotes: 6,
    activity: "Replied 1w ago",
    initials: "LJ",
  },
];

export const catalogItems = [
  {
    id: "item-1",
    name: "Brand strategy workshop",
    description: "Half-day discovery and positioning workshop",
    category: "Strategy",
    price: 8500,
    status: "Active",
  },
  {
    id: "item-2",
    name: "Website design",
    description: "Responsive five-page marketing website design",
    category: "Design",
    price: 28000,
    status: "Active",
  },
  {
    id: "item-3",
    name: "Development retainer",
    description: "Ten hours of frontend development support",
    category: "Development",
    price: 12000,
    status: "Active",
  },
  {
    id: "item-4",
    name: "Copywriting",
    description: "Conversion copy for one core website page",
    category: "Content",
    price: 4200,
    status: "Active",
  },
  {
    id: "item-5",
    name: "Legacy hosting plan",
    description: "Annual hosting on the previous infrastructure",
    category: "Hosting",
    price: 3600,
    status: "Archived",
  },
];

export const recentActivity = [
  {
    id: "act-1",
    title: "Amelia Hart viewed QK-1048",
    detail: "Hart & Finch · 2 hours ago",
    tone: "blue",
  },
  {
    id: "act-2",
    title: "QK-1046 was accepted",
    detail: "Common Ground Studio · 3 days ago",
    tone: "emerald",
  },
  {
    id: "act-3",
    title: "New customer added",
    detail: "Northstar Labs · 5 days ago",
    tone: "violet",
  },
];

export const quoteLineItems = [
  {
    id: "line-1",
    name: "Brand strategy workshop",
    description: "Discovery, positioning, and messaging alignment",
    quantity: 1,
    unitPrice: 8500,
  },
  {
    id: "line-2",
    name: "Website design",
    description: "Responsive design system and five core page templates",
    quantity: 1,
    unitPrice: 28000,
  },
  {
    id: "line-3",
    name: "Copywriting",
    description: "Conversion copy for three core website pages",
    quantity: 3,
    unitPrice: 2800,
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}
