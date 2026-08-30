"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import type { LucideIcon } from "lucide-react";

import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  Leaf,
  LineChart,
  Map as MapIcon,
  MapPin,
  Menu,
  Minus,
  Package,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShoppingCart,
  Star,
  Store,
  Trash2,
  Truck,
  Upload,
  User,
  UserCircle,
  X,
  XCircle,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./Buyer.css";

/* =========================================================
   TYPES
========================================================= */

type View =
  | "Dashboard"
  | "Marketplace"
  | "Procurement"
  | "Orders"
  | "Shipment"
  | "Analytics"
  | "Help"
  | "Profile";

type OrderType = "Marketplace" | "Procurement";

type OrderStatus =
  | "Confirmed"
  | "Processing"
  | "In Transit"
  | "Delivered"
  | "Pending";

type RequirementStatus =
  | "Draft"
  | "Searching"
  | "Matched"
  | "Pending"
  | "Confirmed"
  | "Not Found"
  | "Closed";

type OfferStatus =
  | "Not Sent"
  | "Requested"
  | "Negotiating"
  | "Accepted"
  | "Rejected";

type AnalyticsRange = "week" | "month" | "custom";
type RequirementUnit = "g" | "kg" | "ton";

interface FarmerListing {
  id: string;
  produce: string;
  availableQuantity: number;
  pricePerKg: number;
  unit: "kg";
}

interface Farmer {
  id: string;
  name: string;
  phoneNumber: string;
  location: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  verified: boolean;
  avatar: string;
  farm: string;
  about: string;
  listings: FarmerListing[];
}

interface Product {
  id: string;
  listingId: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  quantityAvailable: number;
  pricePerKg: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  image: string;
}

interface CartItem {
  id: string;
  productId: string;
  farmerId: string;
  farmerName: string;
  product: string;
  quantity: number;
  pricePerKg: number;
  deliveryTime: string;
  image: string;
}

interface RequirementItem {
  id: string;
  produce: string;
  quantity: number;
  unit?: RequirementUnit;
  minPrice: number;
  maxPrice: number;
  requiredBy: string;
  location: string;
}

interface Requirement {
  id: string;
  buyerId: string;
  createdAt: string;
  status: RequirementStatus;
  items: RequirementItem[];
}

interface FarmerOffer {
  id: string;
  requirementId: string;
  farmerId: string;
  selectedListingIds: string[];
  selectedQuantities?: Record<string, number>;
  offeredPrice: number;
  buyerConfirmed: boolean;
  farmerConfirmed: boolean;
  status: OfferStatus;
}

interface Order {
  id: string;
  type: OrderType;
  product: string;
  quantity: number;
  unit: "kg";
  cost: number;
  seller: string;
  sellerId: string;
  buyer: string;
  buyerId: string;
  deliveryDate: string;
  status: OrderStatus;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "shipment" | "system";
  read: boolean;
  createdAt: string;
}

interface BuyerSession {
  username: string;
  phoneNumber: string;
  buyerId: string;
  profileImage?: string;
  email?: string;
  company?: string;
  location?: string;
  language?: string;
}

/* =========================================================
   MOCK DATA
   ---------------------------------------------------------
   Replace these arrays with API responses later.
========================================================= */

const MOCK_BUYER: BuyerSession = {
  username: "KhetLink Buyer",
  phoneNumber: "+91 98765 43210",
  buyerId: "BUY-2026-0001",
  company: "KhetLink Buyer",
  language: "English",
};

const MOCK_FARMERS: Farmer[] = [
  {
    id: "FAR-1001",
    name: "Rajesh Kumar",
    phoneNumber: "+91 98765 11001",
    location: "Nashik, Maharashtra",
    distanceKm: 14,
    rating: 4.8,
    reviews: 126,
    verified: true,
    avatar: "RK",
    farm: "Kumar Fresh Farms",
    about:
      "Family-owned farm supplying fresh vegetables directly to local buyers.",
    listings: [
      {
        id: "L-1001",
        produce: "Tomato",
        availableQuantity: 250,
        pricePerKg: 32,
        unit: "kg",
      },
      {
        id: "L-1002",
        produce: "Potato",
        availableQuantity: 180,
        pricePerKg: 28,
        unit: "kg",
      },
      {
        id: "L-1003",
        produce: "Onion",
        availableQuantity: 300,
        pricePerKg: 30,
        unit: "kg",
      },
    ],
  },
  {
    id: "FAR-1002",
    name: "Suresh Patil",
    phoneNumber: "+91 98765 11002",
    location: "Pune, Maharashtra",
    distanceKm: 38,
    rating: 4.6,
    reviews: 94,
    verified: true,
    avatar: "SP",
    farm: "Patil Agro Farm",
    about:
      "Produces seasonal vegetables and maintains direct supply relationships.",
    listings: [
      {
        id: "L-2001",
        produce: "Potato",
        availableQuantity: 500,
        pricePerKg: 25,
        unit: "kg",
      },
      {
        id: "L-2002",
        produce: "Tomato",
        availableQuantity: 120,
        pricePerKg: 35,
        unit: "kg",
      },
      {
        id: "L-2003",
        produce: "Carrot",
        availableQuantity: 160,
        pricePerKg: 42,
        unit: "kg",
      },
    ],
  },
  {
    id: "FAR-1003",
    name: "Anita Sharma",
    phoneNumber: "+91 98765 11003",
    location: "Ahmednagar, Maharashtra",
    distanceKm: 61,
    rating: 4.9,
    reviews: 182,
    verified: true,
    avatar: "AS",
    farm: "Sharma Organic Fields",
    about:
      "Organic produce supplier focusing on quality-controlled vegetables.",
    listings: [
      {
        id: "L-3001",
        produce: "Onion",
        availableQuantity: 420,
        pricePerKg: 27,
        unit: "kg",
      },
      {
        id: "L-3002",
        produce: "Tomato",
        availableQuantity: 200,
        pricePerKg: 31,
        unit: "kg",
      },
      {
        id: "L-3003",
        produce: "Spinach",
        availableQuantity: 90,
        pricePerKg: 24,
        unit: "kg",
      },
    ],
  },
  {
    id: "FAR-1004",
    name: "Vijay More",
    phoneNumber: "+91 98765 11004",
    location: "Satara, Maharashtra",
    distanceKm: 74,
    rating: 4.5,
    reviews: 71,
    verified: false,
    avatar: "VM",
    farm: "More Vegetable Farm",
    about:
      "Small and medium-scale vegetable producer serving nearby markets.",
    listings: [
      {
        id: "L-4001",
        produce: "Cabbage",
        availableQuantity: 220,
        pricePerKg: 22,
        unit: "kg",
      },
      {
        id: "L-4002",
        produce: "Potato",
        availableQuantity: 260,
        pricePerKg: 29,
        unit: "kg",
      },
    ],
  },
];

/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

const toKg = (quantity: number, unit: RequirementUnit = "kg") => {
  if (unit === "g") return quantity / 1000;
  if (unit === "ton") return quantity * 1000;
  return quantity;
};

const formatQuantity = (quantity: number, unit: RequirementUnit = "kg") =>
  `${Number.isInteger(quantity) ? quantity : Number(quantity.toFixed(2))} ${unit}`;

const isImageSource = (value: string) =>
  value.startsWith("http://") ||
  value.startsWith("https://") ||
  value.startsWith("data:image/") ||
  value.startsWith("/");

const getProductImage = (product: string) => {
  const normalized = product.toLowerCase();
  const images: Record<string, string> = {
    tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85",
    potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85",
    onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=85",
    spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=85",
    carrot: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85",
    cabbage: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=900&q=85",
    mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85",
    banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85",
    apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85",
    orange: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=85",
    grapes: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=900&q=85",
  };
  const key = Object.keys(images).find((name) => normalized.includes(name));
  return key ? images[key] : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85";
};

const renderAvatar = (value: string, name: string) =>
  isImageSource(value) ? <img src={value} alt={name} /> : (value || getInitials(name));

const downloadPdf = (filename: string, title: string, lines: string[]) => {
  const escape = (value: string) =>
    value
      .replace(/₹/g, "INR ")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");

  const allLines = [title, "", ...lines];
  const chunks: string[][] = [];
  for (let index = 0; index < allLines.length; index += 46) {
    chunks.push(allLines.slice(index, index + 46));
  }
  if (chunks.length === 0) chunks.push([title]);

  const pageObjects: string[] = [];
  const contentObjects: string[] = [];
  chunks.forEach((chunk) => {
    let stream = "BT\n/F1 10 Tf\n50 760 Td\n";
    chunk.forEach((line, index) => {
      if (index) stream += "0 -15 Td\n";
      stream += `(${escape(line)}) Tj\n`;
    });
    stream += "ET";
    contentObjects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
  ];
  const pageRefs: string[] = [];
  let objectNumber = 3;
  chunks.forEach((_, index) => {
    const pageObjectNumber = objectNumber++;
    const contentObjectNumber = objectNumber++;
    pageRefs.push(`${pageObjectNumber} 0 R`);
    pageObjects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${2 + chunks.length * 2 + 1} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`,
    );
  });

  objects[1] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${chunks.length} >>`;
  pageObjects.forEach((page) => objects.push(page));
  contentObjects.forEach((content) => objects.push(content));
  const fontObjectNumber = objects.length + 1;
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  // Correct page font references now that the final font object number is known.
  const pageStart = 2;
  for (let index = 0; index < chunks.length; index += 1) {
    const pageObjectIndex = pageStart + index;
    objects[pageObjectIndex] = objects[pageObjectIndex].replace(/\/F1 \d+ 0 R/, `/F1 ${fontObjectNumber} 0 R`);
  }

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const todayString = () => {
  const date = new Date();

  return date.toISOString().slice(0, 10);
};

const futureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
};

const downloadTextFile = (
  filename: string,
  content: string,
  type = "text/plain",
) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

/*
 * Browser-only PDF fallback.
 *
 * Later replace this function with a real PDF library such as
 * jsPDF or a backend-generated PDF endpoint.
 */
const exportOrdersPdf = (orders: Order[], selectedOrder?: Order) => {
  const target = selectedOrder ? [selectedOrder] : orders;
  const lines = target.flatMap((order) => [
    `Order ID: ${order.id}`,
    `Type: ${order.type}`,
    `Product: ${order.product}`,
    `Quantity: ${order.quantity} kg`,
    `Cost: ${formatCurrency(order.cost)}`,
    `Seller: ${order.seller}`,
    `Buyer: ${order.buyer}`,
    `Delivery: ${order.deliveryDate}`,
    `Status: ${order.status}`,
    `Created: ${new Date(order.createdAt).toLocaleString("en-IN")}`,
    "----------------------------------------",
  ]);
  downloadPdf(selectedOrder ? `khetlink-order-${selectedOrder.id}.pdf` : `khetlink-all-orders-${todayString()}.pdf`, selectedOrder ? "KHETLINK — ORDER DETAIL" : "KHETLINK — ALL ORDERS REPORT", lines);
};

const exportAnalytics = (orders: Order[], barData: { name: string; quantity: number }[], pieData: { name: string; value: number }[]) => {
  const lines = [
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    `Orders: ${orders.length}`,
    `Total Quantity: ${orders.reduce((sum, order) => sum + order.quantity, 0)} kg`,
    `Total Spend: ${formatCurrency(orders.reduce((sum, order) => sum + order.cost, 0))}`,
    "", "PRODUCT QUANTITY", ...barData.map((item) => `${item.name}: ${item.quantity} kg`),
    "", "ORDER STATUS", ...pieData.map((item) => `${item.name}: ${item.value}`),
  ];
  downloadPdf(`khetlink-analytics-${todayString()}.pdf`, "KHETLINK — ANALYTICS REPORT", lines);
};

/* =========================================================
   NAVIGATION
========================================================= */

const navItems: {
  label: Exclude<View, "Profile">;
  icon: LucideIcon;
}[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Marketplace",
    icon: Store,
  },
  {
    label: "Procurement",
    icon: ClipboardList,
  },
  {
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    label: "Shipment",
    icon: Truck,
  },
  {
    label: "Analytics",
    icon: LineChart,
  },
  {
    label: "Help",
    icon: CircleHelp,
  },
];

/* =========================================================
   URL NAVIGATION
   ---------------------------------------------------------
   Keeps the existing in-memory navigation/state intact while
   giving every buyer view its own reloadable URL.
========================================================= */

const VIEW_QUERY_VALUES: Record<Exclude<View, "Profile"> | "Profile", string> = {
  Dashboard: "dashboard",
  Marketplace: "marketplace",
  Procurement: "procurement",
  Orders: "orders",
  Shipment: "shipment",
  Analytics: "analytics",
  Help: "help",
  Profile: "profile",
};

const viewFromLocation = (): View => {
  if (typeof window === "undefined") return "Dashboard";

  const value = new URLSearchParams(window.location.search).get("view");
  const match = (Object.keys(VIEW_QUERY_VALUES) as View[]).find(
    (view) => VIEW_QUERY_VALUES[view] === value,
  );

  return match ?? "Dashboard";
};

const viewHref = (view: View) => {
  if (view === "Dashboard") {
    return "/buyer";
  }

  return `/buyer?view=${VIEW_QUERY_VALUES[view]}`;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Buyer() {
  const [activeTab, setActiveTab] =
    useState<View>(() => viewFromLocation());

  const [session, setSession] =
    useState<BuyerSession>(MOCK_BUYER);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [selectedFarmer, setSelectedFarmer] =
    useState<Farmer | null>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [requirements, setRequirements] =
    useState<Requirement[]>([]);

  const [offers, setOffers] =
    useState<FarmerOffer[]>([]);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [toast, setToast] =
    useState<string | null>(null);

  const [orderFilter, setOrderFilter] =
    useState("All");

  const [orderSearch, setOrderSearch] =
    useState("");

  const [analyticsRange, setAnalyticsRange] =
    useState<AnalyticsRange>("week");

  const [customStart, setCustomStart] =
    useState("");

  const [customEnd, setCustomEnd] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [marketplaceSearch, setMarketplaceSearch] =
    useState("");

  const [showCart, setShowCart] =
    useState(false);

  /* -------------------------------------------------------
     INITIAL MOCK STATE
  ------------------------------------------------------- */

  useEffect(() => {
    const storedSession =
      window.localStorage.getItem(
        "khetlink-mock-buyer",
      );

    if (storedSession) {
      try {
        setSession(
          JSON.parse(storedSession) as BuyerSession,
        );
      } catch {
        // Keep mock session.
      }
    }

    const storedCart =
      window.localStorage.getItem(
        "khetlink-buyer-cart",
      );

    if (storedCart) {
      try {
        setCart(
          JSON.parse(storedCart) as CartItem[],
        );
      } catch {
        // Ignore malformed local data.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "khetlink-mock-buyer",
      JSON.stringify(session),
    );
  }, [session]);

  useEffect(() => {
    window.localStorage.setItem(
      "khetlink-buyer-cart",
      JSON.stringify(cart),
    );
  }, [cart]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  /* -------------------------------------------------------
     DERIVED PRODUCT CATALOG
  ------------------------------------------------------- */

  const products = useMemo<Product[]>(() => {
    const base = MOCK_FARMERS.flatMap((farmer) =>
      farmer.listings.map((listing) => ({
        id: `P-${listing.id}`,
        listingId: listing.id,
        farmerId: farmer.id,
        farmerName: farmer.name,
        name: listing.produce,
        category: "Vegetables",
        quantityAvailable:
          listing.availableQuantity,
        pricePerKg: listing.pricePerKg,
        rating: farmer.rating,
        reviews: farmer.reviews,
        deliveryTime: "1–2 days",
        image: getProductImage(listing.produce),
      })),
    );

    const fruits: Product[] = [
      { id: "P-FR-1", listingId: "FR-1", farmerId: "FAR-1001", farmerName: "Rajesh Kumar", name: "Mango", category: "Fruits", quantityAvailable: 180, pricePerKg: 95, rating: 4.8, reviews: 126, deliveryTime: "1–2 days", image: getProductImage("Mango") },
      { id: "P-FR-2", listingId: "FR-2", farmerId: "FAR-1002", farmerName: "Suresh Patil", name: "Banana", category: "Fruits", quantityAvailable: 320, pricePerKg: 48, rating: 4.6, reviews: 94, deliveryTime: "1 day", image: getProductImage("Banana") },
      { id: "P-FR-3", listingId: "FR-3", farmerId: "FAR-1003", farmerName: "Anita Sharma", name: "Apple", category: "Fruits", quantityAvailable: 140, pricePerKg: 125, rating: 4.9, reviews: 182, deliveryTime: "2–3 days", image: getProductImage("Apple") },
      { id: "P-FR-4", listingId: "FR-4", farmerId: "FAR-1004", farmerName: "Vijay More", name: "Orange", category: "Fruits", quantityAvailable: 220, pricePerKg: 68, rating: 4.5, reviews: 71, deliveryTime: "1–2 days", image: getProductImage("Orange") },
      { id: "P-FR-5", listingId: "FR-5", farmerId: "FAR-1003", farmerName: "Anita Sharma", name: "Grapes", category: "Fruits", quantityAvailable: 110, pricePerKg: 82, rating: 4.9, reviews: 182, deliveryTime: "2 days", image: getProductImage("Grapes") },
    ];

    return [...base, ...fruits];
  }, []);

  const categories = useMemo(() => {
    return ["All", "Vegetables", "Fruits", "Herbs", "Organic"];
  }, [products]);

  /* -------------------------------------------------------
     NOTIFICATIONS
  ------------------------------------------------------- */

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const pushNotification = (
    input: Omit<
      Notification,
      "id" | "createdAt" | "read"
    >,
  ) => {
    setNotifications((current) => [
      {
        ...input,
        id: createId("NOT"),
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...current,
    ]);
  };

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  const navigate = (view: View) => {
    setActiveTab(view);
    setMobileMenuOpen(false);
    setNotificationOpen(false);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (view === "Dashboard") {
        url.searchParams.delete("view");
      } else {
        url.searchParams.set("view", VIEW_QUERY_VALUES[view]);
      }
      window.history.pushState({ view }, "", `${url.pathname}${url.search}${url.hash}`);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(viewFromLocation());
      setMobileMenuOpen(false);
      setNotificationOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;
    const timers = orders.filter((order) => order.status === "Confirmed").map((order) => {
      const delay = 2000 + Math.floor(Math.random() * 5000);
      return window.setTimeout(() => {
        const next = ["Processing", "In Transit", "Delivered"][Math.floor(Math.random() * 3)] as OrderStatus;
        setOrders((current) => current.map((item) => item.id === order.id && item.status === "Confirmed" ? { ...item, status: next } : item));
      }, delay);
    });
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [orders.length]);

  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  const addToCart = (
    product: Product,
    quantity: number,
  ) => {
    const safeQuantity = Math.max(
      1,
      Math.min(
        quantity,
        product.quantityAvailable,
      ),
    );

    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.productId === product.id,
      );

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + safeQuantity,
                  product.quantityAvailable,
                ),
              }
            : item,
        );
      }

      return [
        {
          id: createId("CART"),
          productId: product.id,
          farmerId: product.farmerId,
          farmerName: product.farmerName,
          product: product.name,
          quantity: safeQuantity,
          pricePerKg: product.pricePerKg,
          deliveryTime: product.deliveryTime,
          image: product.image,
        },
        ...current,
      ];
    });

    setSelectedProduct(null);
    showToast(
      `${product.name} added to your cart.`,
    );
  };

  const updateCartQuantity = (
    itemId: string,
    change: number,
  ) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          const product = products.find(
            (productItem) =>
              productItem.id === item.productId,
          );

          const maximum =
            product?.quantityAvailable ?? 999999;

          return {
            ...item,
            quantity: Math.min(
              maximum,
              Math.max(1, item.quantity + change),
            ),
          };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((current) =>
      current.filter((item) => item.id !== itemId),
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        item.quantity * item.pricePerKg,
      0,
    );
  }, [cart]);

  const purchaseCart = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    const newOrders: Order[] = cart.map(
      (item, index) => ({
        id: `MKT-${Date.now()}-${index + 1}`,
        type: "Marketplace",
        product: item.product,
        quantity: item.quantity,
        unit: "kg",
        cost:
          item.quantity * item.pricePerKg,
        seller: item.farmerName,
        sellerId: item.farmerId,
        buyer: session.username,
        buyerId: session.buyerId,
        deliveryDate: futureDate(2),
        status: "Confirmed",
        createdAt:
          new Date().toISOString(),
      }),
    );

    setOrders((current) => [
      ...newOrders,
      ...current,
    ]);

    newOrders.forEach((order) => {
      pushNotification({
        title: "Purchase confirmed",
        message: `${order.product} purchase from ${order.seller} was confirmed.`,
        type: "order",
      });
    });

    setCart([]);
    setShowCart(false);

    showToast(
      "Purchase successful. Your orders are confirmed.",
    );
  };

  /* -------------------------------------------------------
     PROCUREMENT
  ------------------------------------------------------- */

  const [requirementForm, setRequirementForm] =
    useState<RequirementItem>({
      id: "",
      produce: "",
      quantity: 1,
      unit: "kg",
      minPrice: 1,
      maxPrice: 100,
      requiredBy: futureDate(7),
      location: "",
    });

  const [editingRequirementItemId, setEditingRequirementItemId] =
    useState<string | null>(null);

  const resetRequirementForm = () => {
    setRequirementForm({
      id: "",
      produce: "",
      quantity: 1,
      unit: "kg",
      minPrice: 1,
      maxPrice: 100,
      requiredBy: futureDate(7),
      location: "",
    });

    setEditingRequirementItemId(null);
  };

  const addOrUpdateRequirementItem = () => {
    const produce =
      requirementForm.produce.trim();

    if (!produce) {
      showToast("Enter a produce name.");
      return;
    }

    if (requirementForm.quantity <= 0) {
      showToast(
        "Quantity must be greater than zero.",
      );
      return;
    }

    if (
      requirementForm.minPrice < 0 ||
      requirementForm.maxPrice < 0 ||
      requirementForm.minPrice >
        requirementForm.maxPrice
    ) {
      showToast(
        "Enter a valid price range.",
      );
      return;
    }

    if (!requirementForm.requiredBy) {
      showToast(
        "Select a required-by date.",
      );
      return;
    }

    if (!requirementForm.location.trim()) {
      showToast("Enter a delivery location.");
      return;
    }

    const item: RequirementItem = {
      ...requirementForm,
      id:
        editingRequirementItemId ??
        createId("REQ-ITEM"),
      produce,
      location:
        requirementForm.location.trim(),
    };

    setRequirements((current) => {
      const draftIndex = current.findIndex(
        (requirement) =>
          requirement.status === "Draft",
      );

      if (draftIndex === -1) {
        return [
          {
            id: createId("REQ"),
            buyerId: session.buyerId,
            createdAt:
              new Date().toISOString(),
            status: "Draft",
            items: [item],
          },
          ...current,
        ];
      }

      const next = [...current];
      const draft = next[draftIndex];

      if (editingRequirementItemId) {
        next[draftIndex] = {
          ...draft,
          items: draft.items.map(
            (existing) =>
              existing.id ===
              editingRequirementItemId
                ? item
                : existing,
          ),
        };
      } else {
        next[draftIndex] = {
          ...draft,
          items: [...draft.items, item],
        };
      }

      return next;
    });

    resetRequirementForm();

    showToast(
      editingRequirementItemId
        ? "Requirement item updated."
        : "Requirement item added.",
    );
  };

  const draftRequirement =
    requirements.find(
      (requirement) =>
        requirement.status === "Draft",
    );

  const updateRequirementItem = (
    item: RequirementItem,
  ) => {
    setRequirementForm(item);
    setEditingRequirementItemId(item.id);
  };

  const deleteRequirementItem = (
    itemId: string,
  ) => {
    setRequirements((current) =>
      current
        .map((requirement) => {
          if (
            requirement.status !== "Draft"
          ) {
            return requirement;
          }

          return {
            ...requirement,
            items: requirement.items.filter(
              (item) => item.id !== itemId,
            ),
          };
        })
        .filter(
          (requirement) =>
            requirement.items.length > 0,
        ),
    );

    if (
      editingRequirementItemId === itemId
    ) {
      resetRequirementForm();
    }

    showToast("Requirement item removed.");
  };

  const submitRequirement = (
    requirementId: string,
  ) => {
    const requirement =
      requirements.find(
        (item) => item.id === requirementId,
      );

    if (
      !requirement ||
      requirement.items.length === 0
    ) {
      showToast(
        "Add at least one requirement.",
      );
      return;
    }

    setRequirements((current) =>
      current.map((item) =>
        item.id === requirementId
          ? {
              ...item,
              status: "Searching",
            }
          : item,
      ),
    );

    /*
     * Mock search:
     * A farmer qualifies when they have at least
     * one listing whose produce matches and whose
     * available quantity meets the requirement.
     *
     * The backend can later implement this same
     * rule with a database query.
     */
    const matchedFarmers =
      MOCK_FARMERS.filter((farmer) =>
        farmer.listings.some((listing) =>
          requirement.items.some(
            (item) =>
              listing.produce.toLowerCase() ===
                item.produce.toLowerCase() &&
              listing.availableQuantity >=
                toKg(item.quantity, item.unit),
          ),
        ),
      );

    setRequirements((current) =>
      current.map((item) =>
        item.id === requirementId
          ? {
              ...item,
              status:
                matchedFarmers.length > 0
                  ? "Matched"
                  : "Not Found",
            }
          : item,
      ),
    );

    showToast(
      matchedFarmers.length > 0
        ? `${matchedFarmers.length} matching farmers found.`
        : "No farmers currently match your requirements.",
    );
  };

  const getEligibleListings = (
    farmer: Farmer,
    requirement: Requirement,
  ) => {
    return farmer.listings.filter(
      (listing) =>
        requirement.items.some(
          (item) =>
            listing.produce.toLowerCase() ===
              item.produce.toLowerCase() &&
            listing.availableQuantity >=
              toKg(item.quantity, item.unit),
        ),
    );
  };

  const [selectedListingIds, setSelectedListingIds] =
    useState<Record<string, string[]>>({});

  const [selectedListingQuantities, setSelectedListingQuantities] = useState<Record<string, Record<string, number>>>({});

  const toggleListing = (
    farmerId: string,
    listingId: string,
  ) => {
    setSelectedListingIds((current) => {
      const selected =
        current[farmerId] ?? [];

      return {
        ...current,
        [farmerId]: selected.includes(
          listingId,
        )
          ? selected.filter(
              (id) => id !== listingId,
            )
          : [...selected, listingId],
      };
    });
  };

  const setListingQuantity = (farmerId: string, listingId: string, quantity: number) => {
    setSelectedListingQuantities((current) => ({ ...current, [farmerId]: { ...(current[farmerId] ?? {}), [listingId]: quantity } }));
  };

  const sendProcurementRequest = (
    requirement: Requirement,
    farmer: Farmer,
  ) => {
    const eligible =
      getEligibleListings(
        farmer,
        requirement,
      );

    const selected =
      selectedListingIds[farmer.id] ??
      [];

    const finalListingIds =
      selected.length > 0
        ? selected.filter((id) =>
            eligible.some(
              (listing) =>
                listing.id === id,
            ),
          )
        : eligible.map(
            (listing) => listing.id,
          );

    if (finalListingIds.length === 0) {
      showToast(
        "Select at least one matching produce.",
      );
      return;
    }

    const selectedListings =
      farmer.listings.filter((listing) =>
        finalListingIds.includes(
          listing.id,
        ),
      );

    const averagePrice =
      selectedListings.reduce(
        (sum, listing) =>
          sum + listing.pricePerKg,
        0,
      ) /
      Math.max(
        selectedListings.length,
        1,
      );

    const existingOffer =
      offers.find(
        (offer) =>
          offer.requirementId ===
            requirement.id &&
          offer.farmerId === farmer.id,
      );

    const newOffer: FarmerOffer = {
      id:
        existingOffer?.id ??
        createId("OFFER"),
      requirementId: requirement.id,
      farmerId: farmer.id,
      selectedListingIds: finalListingIds,
      selectedQuantities: Object.fromEntries(
        finalListingIds.map((id) => {
          const listing = farmer.listings.find((item) => item.id === id);
          const requirementItem = requirement.items.find(
            (item) => item.produce.toLowerCase() === listing?.produce.toLowerCase(),
          );
          const requestedKg = requirementItem
            ? toKg(requirementItem.quantity, requirementItem.unit ?? "kg")
            : listing?.availableQuantity ?? 0;
          return [
            id,
            selectedListingQuantities[farmer.id]?.[id] ??
              Math.min(requestedKg, listing?.availableQuantity ?? requestedKg),
          ];
        }),
      ),
      offeredPrice: Math.round(
        averagePrice,
      ),
      buyerConfirmed: false,
      farmerConfirmed: false,
      status: "Requested",
    };

    setOffers((current) =>
      existingOffer
        ? current.map((offer) =>
            offer.id === existingOffer.id
              ? newOffer
              : offer,
          )
        : [newOffer, ...current],
    );

    pushNotification({
      title: "Procurement request sent",
      message: `Your request was sent to ${farmer.name}.`,
      type: "order",
    });

    showToast(
      `Request sent to ${farmer.name}.`,
    );
  };

  const negotiateOffer = (
    requirementId: string,
    farmerId: string,
    price: number,
  ) => {
    const offer = offers.find((item) => item.requirementId === requirementId && item.farmerId === farmerId);
    const farmer = MOCK_FARMERS.find((item) => item.id === farmerId);
    const originalPrice = offer?.offeredPrice ?? farmer?.listings[0]?.pricePerKg ?? price;
    const negotiatedPrice = Math.max(1, price);

    if (negotiatedPrice === originalPrice) {
      setOffers((current) => current.map((item) => item.requirementId === requirementId && item.farmerId === farmerId ? { ...item, offeredPrice: originalPrice, status: "Negotiating", farmerConfirmed: true, buyerConfirmed: false } : item));
      pushNotification({ title: "Negotiation accepted", message: `${farmer?.name ?? "Farmer"} accepted the original price of ${formatCurrency(originalPrice)}/kg.`, type: "order" });
      showToast("The negotiated price matches the original price.");
      return;
    }

    const outcome = Math.random();
    if (negotiatedPrice > originalPrice || outcome < 0.34) {
      setOffers((current) => current.map((item) => item.requirementId === requirementId && item.farmerId === farmerId ? { ...item, offeredPrice: negotiatedPrice, status: "Negotiating", farmerConfirmed: true, buyerConfirmed: false } : item));
      pushNotification({ title: "Negotiated price accepted", message: `${farmer?.name ?? "Farmer"} accepted ${formatCurrency(negotiatedPrice)}/kg.`, type: "order" });
      showToast("Farmer accepted your negotiated price.");
      return;
    }

    if (outcome < 0.67) {
      const counter = Math.max(1, Math.round(negotiatedPrice + Math.random() * (originalPrice - negotiatedPrice)));
      setOffers((current) => current.map((item) => item.requirementId === requirementId && item.farmerId === farmerId ? { ...item, offeredPrice: counter, status: "Negotiating", farmerConfirmed: false, buyerConfirmed: false } : item));
      pushNotification({ title: "Farmer counter offer", message: `${farmer?.name ?? "Farmer"} countered at ${formatCurrency(counter)}/kg.`, type: "order" });
      showToast(`Farmer countered at ${formatCurrency(counter)}/kg.`);
      return;
    }

    setOffers((current) => current.map((item) => item.requirementId === requirementId && item.farmerId === farmerId ? { ...item, offeredPrice: negotiatedPrice, status: "Rejected", farmerConfirmed: false, buyerConfirmed: false } : item));
    pushNotification({ title: "Negotiation declined", message: `${farmer?.name ?? "Farmer"} declined the negotiated price.`, type: "order" });
    showToast("Farmer declined the negotiated price.");
  };

  const farmerAcceptOffer = (
    requirementId: string,
    farmerId: string,
  ) => {
    const offer = offers.find((item) => item.requirementId === requirementId && item.farmerId === farmerId);
    const farmer = MOCK_FARMERS.find((item) => item.id === farmerId);
    if (Math.random() < 0.2) {
      setOffers((current) => current.map((item) => item.requirementId === requirementId && item.farmerId === farmerId ? { ...item, status: "Rejected", farmerConfirmed: false } : item));
      pushNotification({ title: "Farmer declined", message: `${farmer?.name ?? "Farmer"} declined the request.`, type: "order" });
      showToast("Farmer declined the request.");
      return;
    }
    setOffers((current) => current.map((item) => item.requirementId === requirementId && item.farmerId === farmerId ? { ...item, farmerConfirmed: true, status: item.buyerConfirmed ? "Accepted" : "Negotiating" } : item));
    pushNotification({ title: "Farmer accepted price", message: `${farmer?.name ?? "Farmer"} accepted at ${formatCurrency(offer?.offeredPrice ?? 0)}/kg.`, type: "order" });
    showToast("Farmer accepted the current price.");
  };

  const finalizeProcurementOrder = (
    requirementId: string,
    farmerId: string,
  ) => {
    const requirement =
      requirements.find(
        (item) => item.id === requirementId,
      );

    const offer = offers.find(
      (item) =>
        item.requirementId ===
          requirementId &&
        item.farmerId === farmerId,
    );

    const farmer =
      MOCK_FARMERS.find(
        (item) => item.id === farmerId,
      );

    if (
      !requirement ||
      !offer ||
      !farmer
    ) {
      return;
    }

    const listings =
      farmer.listings.filter(
        (listing) =>
          offer.selectedListingIds.includes(
            listing.id,
          ),
      );

    const matchedItems =
      requirement.items.filter(
        (item) =>
          listings.some(
            (listing) =>
              listing.produce.toLowerCase() ===
              item.produce.toLowerCase(),
          ),
      );

    if (matchedItems.length === 0) {
      showToast(
        "No selected procurement items found.",
      );
      return;
    }

    const newOrders: Order[] =
      matchedItems.map(
        (item, index) => ({
          id: `${requirement.id}-O${Date.now()}-${index + 1}`,
          type: "Procurement",
          product: item.produce,
          quantity: Math.max(0.01, toKg(offer.selectedQuantities?.[item.id] ?? item.quantity, item.unit ?? "kg")),
          unit: "kg",
          cost: Math.max(0.01, toKg(offer.selectedQuantities?.[item.id] ?? item.quantity, item.unit ?? "kg")) * offer.offeredPrice,
          seller: farmer.name,
          sellerId: farmer.id,
          buyer: session.username,
          buyerId: session.buyerId,
          deliveryDate:
            item.requiredBy,
          status: "Confirmed",
          createdAt:
            new Date().toISOString(),
        }),
      );

    setOrders((current) => [
      ...newOrders,
      ...current,
    ]);

    setRequirements((current) =>
      current.map((item) => {
        if (item.id !== requirementId) return item;
        const alreadyFulfilled = orders
          .filter((order) => order.id.startsWith(`${requirementId}-O`))
          .reduce((sum, order) => sum + order.quantity, 0);
        const newlyFulfilled = newOrders.reduce((sum, order) => sum + order.quantity, 0);
        const requiredQuantity = item.items.reduce((sum, reqItem) => sum + toKg(reqItem.quantity, reqItem.unit ?? "kg"), 0);
        return { ...item, status: alreadyFulfilled + newlyFulfilled >= requiredQuantity ? "Confirmed" : "Matched" };
      }),
    );

    setOffers((current) =>
      current.map((item) =>
        item.requirementId ===
            requirementId &&
        item.farmerId === farmerId
          ? {
              ...item,
              buyerConfirmed: true,
              farmerConfirmed: true,
              status: "Accepted",
            }
          : item,
      ),
    );

    newOrders.forEach((order) => {
      pushNotification({
        title:
          "Procurement order confirmed",
        message: `${order.product} from ${order.seller} is confirmed under ${requirementId}.`,
        type: "order",
      });
    });

    showToast(
      "Both parties confirmed. Procurement order created.",
    );
  };

  const declineOffer = (requirementId: string, farmerId: string) => {
    const farmer = MOCK_FARMERS.find((item) => item.id === farmerId);
    setOffers((current) => current.map((item) => item.requirementId === requirementId && item.farmerId === farmerId ? { ...item, status: "Rejected", buyerConfirmed: false, farmerConfirmed: false } : item));
    pushNotification({ title: "Negotiation declined", message: `You declined the offer from ${farmer?.name ?? "farmer"}.`, type: "order" });
    showToast("Offer declined.");
  };

  const closeRequirement = (requirementId: string) => {
    setRequirements((current) => current.map((item) => item.id === requirementId ? { ...item, status: "Closed" } : item));
    showToast("Requirement closed.");
  };

  /* -------------------------------------------------------
     ORDER FILTERING
  ------------------------------------------------------- */

  const filteredOrders =
    useMemo(() => {
      const query =
        orderSearch
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const statusMatch =
            orderFilter === "All" ||
            order.status ===
              orderFilter;

          const searchMatch =
            !query ||
            `${order.id} ${order.product} ${order.seller} ${order.type} ${order.buyer}`
              .toLowerCase()
              .includes(query);

          return (
            statusMatch &&
            searchMatch
          );
        },
      );
    }, [
      orders,
      orderFilter,
      orderSearch,
    ]);

  /* -------------------------------------------------------
     ANALYTICS
  ------------------------------------------------------- */

  const analyticsOrders =
    useMemo(() => {
      const now =
        Date.now();

      let start = 0;
      let end = now;

      if (
        analyticsRange ===
        "week"
      ) {
        start =
          now -
          7 *
            24 *
            60 *
            60 *
            1000;
      }

      if (
        analyticsRange ===
        "month"
      ) {
        start =
          now -
          30 *
            24 *
            60 *
            60 *
            1000;
      }

      if (
        analyticsRange ===
        "custom"
      ) {
        if (customStart) {
          start =
            new Date(
              `${customStart}T00:00:00`,
            ).getTime();
        }

        if (customEnd) {
          end =
            new Date(
              `${customEnd}T23:59:59`,
            ).getTime();
        }
      }

      return orders.filter(
        (order) => {
          const time =
            new Date(
              order.createdAt,
            ).getTime();

          return (
            time >= start &&
            time <= end
          );
        },
      );
    }, [
      analyticsRange,
      customStart,
      customEnd,
      orders,
    ]);

  const barData =
    useMemo(() => {
      const map =
        new Map<
          string,
          number
        >();

      analyticsOrders.forEach(
        (order) => {
          map.set(
            order.product,
            (map.get(
              order.product,
            ) ?? 0) +
              order.quantity,
          );
        },
      );

      return Array.from(
        map.entries(),
      ).map(
        ([name, quantity]) => ({
          name,
          quantity,
        }),
      );
    }, [analyticsOrders]);

  const pieData = useMemo(() => {
  const colors = [
    "#16834a",
    "#f1b51b",
    "#3b82f6",
    "#ef8b2c",
    "#9ca3af",
  ];

  const map = new Map<string, number>();

  analyticsOrders.forEach((order) => {
    map.set(
      order.status,
      (map.get(order.status) ?? 0) + 1,
    );
  });

  return Array.from(map.entries()).map(
    ([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }),
  );
}, [analyticsOrders]);

  /* -------------------------------------------------------
     DASHBOARD METRICS
  ------------------------------------------------------- */

  const totalSpend =
    orders.reduce(
      (sum, order) =>
        sum + order.cost,
      0,
    );

  const totalQuantity =
    orders.reduce(
      (sum, order) =>
        sum + order.quantity,
      0,
    );

  const activeShipments =
    orders.filter(
      (order) =>
        order.status ===
        "In Transit",
    ).length;

  const confirmedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Confirmed",
    ).length;

  /* -------------------------------------------------------
     MARKETPLACE FILTER
  ------------------------------------------------------- */

  const filteredProducts =
    useMemo(() => {
      const query =
        marketplaceSearch
          .trim()
          .toLowerCase();

      const filtered = products.filter((product) => {
        const categoryMatch = category === "All" || product.category === category || (category === "Organic" && product.farmerName.toLowerCase().includes("sharma"));
        const searchMatch = !query || `${product.name} ${product.farmerName} ${product.category}`.toLowerCase().includes(query);
        return categoryMatch && searchMatch;
      });
      return filtered.sort((a, b) => {
        if (!query) return a.name.localeCompare(b.name);
        const rank = (product: Product) => { const name = product.name.toLowerCase(); if (name === query) return 0; if (name.startsWith(query)) return 1; if (name.includes(query)) return 2; if (product.farmerName.toLowerCase().startsWith(query)) return 3; return 4; };
        return rank(a) - rank(b) || a.name.localeCompare(b.name);
      });
    }, [
      products,
      category,
      marketplaceSearch,
    ]);

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="buyer-page">
      <Header
        activeTab={activeTab}
        session={session}
        unreadCount={unreadCount}
        notificationOpen={
          notificationOpen
        }
        notifications={
          notifications
        }
        onMenu={() =>
          setMobileMenuOpen(true)
        }
        onNavigate={navigate}
        onProfile={() =>
          navigate("Profile")
        }
        onNotifications={() => {
          setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
          setNotificationOpen((value) => !value);
        }}
        onMarkNotifications={() =>
          setNotifications(
            (current) =>
              current.map(
                (notification) => ({
                  ...notification,
                  read: true,
                }),
              ),
          )
        }
      />

      {notificationOpen && (
        <NotificationPanel
          notifications={
            notifications
          }
          onClose={() =>
            setNotificationOpen(
              false,
            )
          }
        />
      )}

      <div className="buyer-layout">
        <Sidebar
          activeTab={activeTab}
          open={mobileMenuOpen}
          onClose={() =>
            setMobileMenuOpen(false)
          }
          onNavigate={navigate}
        />

        <main className="buyer-content">
          {activeTab ===
            "Dashboard" && (
            <Dashboard
              session={session}
              orders={orders}
              requirements={requirements}
              farmers={
                MOCK_FARMERS
              }
              totalSpend={
                totalSpend
              }
              totalQuantity={
                totalQuantity
              }
              confirmedOrders={
                confirmedOrders
              }
              activeShipments={
                activeShipments
              }
              onNavigate={
                navigate
              }
              onFarmer={
                setSelectedFarmer
              }
            />
          )}

          {activeTab ===
            "Marketplace" && (
            <Marketplace
              products={
                filteredProducts
              }
              categories={
                categories
              }
              category={
                category
              }
              search={
                marketplaceSearch
              }
              cartCount={
                cart.length
              }
              onCategory={
                setCategory
              }
              onSearch={
                setMarketplaceSearch
              }
              onProduct={
                setSelectedProduct
              }
              onAddToCart={
                addToCart
              }
              onCart={() =>
                setShowCart(true)
              }
            />
          )}

          {activeTab ===
            "Procurement" && (
            <Procurement
              form={
                requirementForm
              }
              draft={
                draftRequirement
              }
              requirements={
                requirements
              }
              farmers={
                MOCK_FARMERS
              }
              offers={
                offers
              }
              selectedListingIds={selectedListingIds}
              selectedListingQuantities={selectedListingQuantities}
              editingItemId={
                editingRequirementItemId
              }
              onFormChange={
                setRequirementForm
              }
              onAdd={
                addOrUpdateRequirementItem
              }
              onUpdate={
                updateRequirementItem
              }
              onDelete={
                deleteRequirementItem
              }
              onSubmit={
                submitRequirement
              }
              onToggleListing={toggleListing}
              onSetQuantity={setListingQuantity}
              onSendRequest={
                sendProcurementRequest
              }
              onNegotiate={
                negotiateOffer
              }
              onFarmerAccept={
                farmerAcceptOffer
              }
              onConfirm={finalizeProcurementOrder}
              onDeclineOffer={declineOffer}
              onCloseRequirement={closeRequirement}
              onFarmer={
                setSelectedFarmer
              }
            />
          )}

          {activeTab ===
            "Orders" && (
            <Orders
              orders={
                filteredOrders
              }
              allOrders={
                orders
              }
              filter={
                orderFilter
              }
              search={
                orderSearch
              }
              onFilter={
                setOrderFilter
              }
              onSearch={
                setOrderSearch
              }
            />
          )}

          {activeTab ===
            "Shipment" && (
            <Shipment
              orders={orders}
            />
          )}

          {activeTab ===
            "Analytics" && (
            <Analytics
              orders={
                analyticsOrders
              }
              barData={
                barData
              }
              pieData={
                pieData
              }
              range={
                analyticsRange
              }
              customStart={
                customStart
              }
              customEnd={
                customEnd
              }
              onRange={
                setAnalyticsRange
              }
              onStart={
                setCustomStart
              }
              onEnd={
                setCustomEnd
              }
              onExport={() =>
                exportAnalytics(
                  analyticsOrders,
                  barData,
                  pieData,
                )
              }
            />
          )}

          {activeTab ===
            "Help" && (
            <Help
              onNavigate={
                navigate
              }
            />
          )}

          {activeTab ===
            "Profile" && (
            <Profile
              session={
                session
              }
              orders={
                orders
              }
              onSessionChange={
                setSession
              }
              onNavigate={
                navigate
              }
              showToast={
                showToast
              }
            />
          )}
        </main>
      </div>

      {selectedFarmer && (
        <FarmerModal
          farmer={
            selectedFarmer
          }
          onClose={() =>
            setSelectedFarmer(
              null,
            )
          }
          onNavigate={
            navigate
          }
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={
            selectedProduct
          }
          onClose={() =>
            setSelectedProduct(
              null,
            )
          }
          onAdd={(
            quantity,
          ) =>
            addToCart(
              selectedProduct,
              quantity,
            )
          }
        />
      )}

      {showCart && (
        <CartModal
          cart={cart}
          total={cartTotal}
          onClose={() =>
            setShowCart(false)
          }
          onIncrease={(
            id,
          ) =>
            updateCartQuantity(
              id,
              1,
            )
          }
          onDecrease={(
            id,
          ) =>
            updateCartQuantity(
              id,
              -1,
            )
          }
          onRemove={
            removeFromCart
          }
          onPurchase={
            purchaseCart
          }
        />
      )}

      {toast && (
        <div className="buyer-toast">
          <CheckCircle2
            size={17}
          />
          <span>
            {toast}
          </span>
          <button
            type="button"
            onClick={() =>
              setToast(null)
            }
          >
            <X
              size={15}
            />
          </button>
        </div>
      )}
    </div>
  );

  function showToast(
    message: string,
  ) {
    setToast(message);
  }
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  activeTab,
  session,
  unreadCount,
  notificationOpen,
  notifications,
  onMenu,
  onNavigate,
  onProfile,
  onNotifications,
  onMarkNotifications,
}: {
  activeTab: View;
  session: BuyerSession;
  unreadCount: number;
  notificationOpen: boolean;
  notifications: Notification[];
  onMenu: () => void;
  onNavigate: (view: View) => void;
  onProfile: () => void;
  onNotifications: () => void;
  onMarkNotifications: () => void;
}) {
  return (
    <header className="buyer-header">
      <div className="buyer-header-inner">
        <button
          type="button"
          className="buyer-mobile-menu-button"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <button
          type="button"
          className="buyer-brand"
          onClick={() =>
            onNavigate("Dashboard")
          }
        >
          <span className="buyer-brand-mark">
            <Leaf size={22} />
          </span>

          <span>
            <strong>KhetLink</strong>
            <small>Buyer Portal</small>
          </span>
        </button>

        <nav className="buyer-top-nav" aria-label="Buyer navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href={viewHref(label)}
              className={activeTab === label ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(label);
              }}
            >
              <Icon size={14} strokeWidth={2} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="buyer-header-spacer" />

        <div className="buyer-header-actions">
          <div className="buyer-notification-wrapper">
            <button
              type="button"
              className={`buyer-icon-button ${
                notificationOpen
                  ? "active"
                  : ""
              }`}
              onClick={
                onNotifications
              }
              aria-label="Notifications"
            >
              <Bell size={20} />

              {unreadCount >
                0 && (
                <span className="buyer-notification-count">
                  {unreadCount >
                  9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="buyer-notification-dropdown">
                <div className="notification-dropdown-header">
                  <div>
                    <strong>
                      Notifications
                    </strong>
                    <small>
                      {unreadCount} unread
                    </small>
                  </div>

                  {notifications.length >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        onMarkNotifications
                      }
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length ===
                0 ? (
                  <div className="notification-empty">
                    <Bell
                      size={25}
                    />
                    <p>
                      No notifications
                      yet.
                    </p>
                  </div>
                ) : (
                  notifications
                    .slice(0, 6)
                    .map(
                      (
                        notification,
                      ) => (
                        <div
                          className={`notification-item ${
                            notification.read
                              ? ""
                              : "unread"
                          }`}
                          key={
                            notification.id
                          }
                        >
                          <span>
                            <CheckCircle2
                              size={
                                17
                              }
                            />
                          </span>

                          <div>
                            <strong>
                              {
                                notification.title
                              }
                            </strong>
                            <p>
                              {
                                notification.message
                              }
                            </p>
                          </div>
                        </div>
                      ),
                    )
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="buyer-profile-button"
            onClick={onProfile}
          >
            <span className="buyer-profile-avatar">
              {session.profileImage ? (
                <img
                  src={
                    session.profileImage
                  }
                  alt={
                    session.username
                  }
                />
              ) : (
                getInitials(
                  session.username,
                )
              )}
            </span>

            <span className="buyer-profile-copy">
              <strong>
                {session.username}
              </strong>
              <small>
                {activeTab}
              </small>
            </span>

            <ChevronDown
              size={15}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activeTab,
  open,
  onClose,
  onNavigate,
}: {
  activeTab: View;
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="buyer-sidebar-backdrop"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`buyer-sidebar ${
          open
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="buyer-sidebar-mobile-header">
          <strong>
            Buyer Menu
          </strong>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="buyer-sidebar-label">
          Workspace
        </p>

        <nav className="buyer-sidebar-nav">
          {navItems.map(
            ({
              label,
              icon: Icon,
            }) => (
              <button
                type="button"
                key={label}
                className={
                  activeTab ===
                  label
                    ? "active"
                    : ""
                }
                onClick={() =>
                  onNavigate(
                    label,
                  )
                }
              >
                <Icon
                  size={18}
                  strokeWidth={
                    2
                  }
                />
                <span>
                  {label}
                </span>
              </button>
            ),
          )}
        </nav>

        <div className="buyer-sidebar-bottom">
          <div className="buyer-sidebar-help">
            <CircleHelp
              size={18}
            />
            <div>
              <strong>
                Need help?
              </strong>
              <span>
                KhetLink Support
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  session,
  orders,
  requirements,
  farmers,
  totalSpend,
  totalQuantity,
  confirmedOrders,
  activeShipments,
  onNavigate,
  onFarmer,
}: {
  session: BuyerSession;
  orders: Order[];
  requirements: Requirement[];
  farmers: Farmer[];
  totalSpend: number;
  totalQuantity: number;
  confirmedOrders: number;
  activeShipments: number;
  onNavigate: (view: View) => void;
  onFarmer: (farmer: Farmer) => void;
}) {
  const [summaryRange, setSummaryRange] = useState<"week" | "month">("month");
  const summaryStart = Date.now() - (summaryRange === "week" ? 7 : 30) * 24 * 60 * 60 * 1000;
  const summaryOrders = orders.filter((order) => new Date(order.createdAt).getTime() >= summaryStart);
  const summarySpend = summaryOrders.reduce((sum, order) => sum + order.cost, 0);
  const summaryQuantity = summaryOrders.reduce((sum, order) => sum + order.quantity, 0);

  const hasData = orders.length > 0;

  return (
    <div className="buyer-main dashboard-main">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <p className="eyebrow">
            SMARTER PROCUREMENT
          </p>

          <h1>
            Smarter Procurement
            <span> for a Fresh Tomorrow.</span>
          </h1>

          <p>
            Source fresh, quality produce directly from reliable farmers and logistics partners — all in one place.
          </p>
        </div>

        <div className="dashboard-quick-actions">
          <button
            type="button"
            className="buyer-primary-button"
            onClick={() =>
              onNavigate(
                "Marketplace",
              )
            }
          >
            <Store size={17} />
            Marketplace
          </button>

          <button
            type="button"
            className="buyer-outline-button"
            onClick={() =>
              onNavigate(
                "Procurement",
              )
            }
          >
            <ClipboardList
              size={17}
            />
            Procurement
          </button>
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        <DashboardMetric
          label="Total Spend"
          value={
            hasData
              ? formatCurrency(
                  totalSpend,
                )
              : "—"
          }
          icon={
            <ShoppingCart />
          }
        />

        <DashboardMetric
          label="Total Quantity"
          value={
            hasData
              ? `${totalQuantity} kg`
              : "—"
          }
          icon={
            <Package />
          }
        />

        <DashboardMetric
          label="Confirmed Orders"
          value={
            hasData
              ? String(
                  confirmedOrders,
                )
              : "—"
          }
          icon={
            <CheckCircle2 />
          }
        />

        <DashboardMetric
          label="Active Shipments"
          value={
            hasData
              ? String(
                  activeShipments,
                )
              : "—"
          }
          icon={<Truck />}
        />
      </section>

      <section className="dashboard-two-column">
        <article className="buyer-card dashboard-orders-card">
          <SectionHeader
            title="Recent Orders"
            action="View All"
            onClick={() =>
              onNavigate("Orders")
            }
          />

          {orders.length === 0 ? (
            <InlineEmpty
              icon={
                <ShoppingCart />
              }
              text="Your confirmed marketplace and procurement orders will appear here."
            />
          ) : (
            <div className="recent-orders-table">
              <div className="recent-orders-row recent-orders-head">
                <span>
                  Order ID
                </span>
                <span>
                  Product
                </span>
                <span>
                  Quantity
                </span>
                <span>
                  Status
                </span>
                <span>
                  Delivery
                </span>
              </div>

              {orders
                .slice(0, 5)
                .map(
                  (order) => (
                    <div
                      className="recent-orders-row"
                      key={
                        order.id
                      }
                    >
                      <strong>
                        {order.id}
                      </strong>
                      <span>
                        {
                          order.product
                        }
                      </span>
                      <span>
                        {
                          order.quantity
                        }{" "}
                        kg
                      </span>
                      <StatusBadge
                        status={
                          order.status
                        }
                      />
                      <span>
                        {
                          order.deliveryDate
                        }
                      </span>
                    </div>
                  ),
                )}
            </div>
          )}
        </article>

        <article className="buyer-card procurement-summary-card">
          <div className="section-header">
            <div><h2>Procurement Summary</h2></div>
            <button type="button" onClick={() => onNavigate("Analytics")}>Analytics <ArrowRight size={14} /></button>
          </div>
          <div className="dashboard-summary-toggle"><button type="button" className={summaryRange === "week" ? "active" : ""} onClick={() => setSummaryRange("week")}>This Week</button><button type="button" className={summaryRange === "month" ? "active" : ""} onClick={() => setSummaryRange("month")}>This Month</button></div>

          <SummaryMetric
            icon={
              <ShoppingCart />
            }
            label="Total Spend"
            value={
              summaryOrders.length > 0
                ? formatCurrency(summarySpend)
                : "—"
            }
          />

          <SummaryMetric
            icon={
              <Package />
            }
            label="Cost per Kg"
            value={
              summaryOrders.length > 0
                ? formatCurrency(Math.round(summarySpend / Math.max(summaryQuantity, 1)))
                : "—"
            }
          />

          <SummaryMetric icon={<Truck />} label="Avg. Delivery Time" value={summaryOrders.length ? "1.5 Days" : "—"} />

          <SummaryMetric icon={<Star />} label="Supplier Score" value={farmers.length ? `${(farmers.reduce((sum, farmer) => sum + farmer.rating, 0) / farmers.length).toFixed(1)}/5` : "—"} />
        </article>
      </section>

      <section className="dashboard-three-column">
        <article className="buyer-card shipment-mini-card">
          <SectionHeader
            title="Shipment Tracking"
            action="View All"
            onClick={() =>
              onNavigate(
                "Shipment",
              )
            }
          />

          {activeShipments ===
          0 ? (
            <InlineEmpty
              icon={<Truck />}
              text="Live shipment tracking will appear after a confirmed order enters transit."
            />
          ) : (
            <div className="mini-shipment">
              <div className="mini-map">
                <MapIcon size={30} />
                <span>
                  Live delivery
                </span>
              </div>
            </div>
          )}
        </article>

        <article className="buyer-card trusted-suppliers-card">
          <SectionHeader
            title="Your Trusted Suppliers"
            action="View All"
            onClick={() =>
              onNavigate(
                "Marketplace",
              )
            }
          />

          {farmers
            .slice(0, 3)
            .map(
              (farmer) => (
                <button
                  type="button"
                  className="supplier-row"
                  key={
                    farmer.id
                  }
                  onClick={() =>
                    onFarmer(
                      farmer,
                    )
                  }
                >
                  <span className="supplier-avatar">{renderAvatar(farmer.avatar, farmer.name)}</span>

                  <span className="supplier-info">
                    <strong>
                      {
                        farmer.name
                      }
                    </strong>

                    <small>
                      {
                        farmer.location
                      }
                    </small>
                  </span>

                  <span className="supplier-rating">
                    <Star
                      size={13}
                      fill="currentColor"
                    />
                    {
                      farmer.rating
                    }
                  </span>
                </button>
              ),
            )}
        </article>

        <article className="buyer-card dashboard-help-card">
          <div className="dashboard-help-icon">
            <HelpCircle
              size={28}
            />
          </div>

          <p className="eyebrow">
            KHETLINK SUPPORT
          </p>

          <h3>
            Need assistance?
          </h3>

          <p>
            Get help with
            purchases,
            procurement or
            shipments.
          </p>

          <button
            type="button"
            onClick={() =>
              onNavigate("Help")
            }
          >
            Open Help
            <ArrowRight
              size={15}
            />
          </button>
        </article>
      </section>
    </div>
  );
}

function DashboardInsights({ orders, requirements }: { orders: Order[]; requirements: Requirement[] }) {
  const [range, setRange] = useState<"week" | "month">("week");
  const now = Date.now();
  const span = range === "week" ? 7 : 30;
  const start = now - span * 24 * 60 * 60 * 1000;
  const previousStart = start - span * 24 * 60 * 60 * 1000;
  const current = orders.filter((order) => new Date(order.createdAt).getTime() >= start);
  const previous = orders.filter((order) => { const time = new Date(order.createdAt).getTime(); return time >= previousStart && time < start; });
  const demand = current.reduce((sum, order) => sum + order.quantity, 0);
  const previousDemand = previous.reduce((sum, order) => sum + order.quantity, 0);
  const change = previousDemand === 0 ? (demand > 0 ? 100 : 0) : Math.round(((demand - previousDemand) / previousDemand) * 100);
  const quantityMap = new Map<string, number>();
  current.forEach((order) => quantityMap.set(order.product, (quantityMap.get(order.product) ?? 0) + order.quantity));
  const quantityData = Array.from(quantityMap.entries()).map(([name, quantity]) => ({ name, quantity }));
  const statusData = ["Confirmed", "Processing", "In Transit", "Delivered"].map((name) => ({ name, value: current.filter((order) => order.status === name).length }));
  const requirementData = ["Matched", "Pending", "Not Found", "Confirmed", "Closed"].map((name) => ({ name, value: requirements.filter((item) => name === "Pending" ? ["Draft", "Searching", "Pending"].includes(item.status) : item.status === name).length }));
  const colors = ["#16834a", "#f1b51b", "#3b82f6", "#ef8b2c", "#8b5cf6", "#0f766e"];
  return (
    <section className="dashboard-insights">
      <article className="buyer-card dashboard-chart-card dashboard-demand-card">
        <div className="section-header"><div><h2>Demand Overview</h2><p>Product quantity by selected period</p></div><div className="dashboard-period-toggle"><button type="button" className={range === "week" ? "active" : ""} onClick={() => setRange("week")}>This Week</button><button type="button" className={range === "month" ? "active" : ""} onClick={() => setRange("month")}>This Month</button></div></div>
        <div className="dashboard-demand-summary"><span>Total Demand</span><strong>{demand.toLocaleString("en-IN")} kg</strong><em className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs previous {range}</em></div>
        <div className="dashboard-chart-container">{quantityData.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={quantityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis label={{ value: "Quantity (kg)", angle: -90, position: "insideLeft" }} /><Tooltip /><Bar dataKey="quantity" radius={[6,6,0,0]}>{quantityData.map((item,index)=><Cell key={`${item.name}-${index}`} fill={colors[index % colors.length]} />)}</Bar></BarChart></ResponsiveContainer> : <ChartEmpty text="Product demand will appear after your first order." />}</div>
      </article>
      <article className="buyer-card dashboard-chart-card"><SectionHeader title="Order Distribution" /><div className="dashboard-pie-layout"><ResponsiveContainer width="58%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" outerRadius={78}>{statusData.map((item,index)=><Cell key={item.name} fill={colors[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="dashboard-legend">{statusData.map((item,index)=><span key={item.name}><i style={{ background: colors[index] }} />{item.name}<b>{item.value}</b></span>)}</div></div></article>
      <article className="buyer-card dashboard-chart-card"><SectionHeader title="Requirement Status" /><div className="dashboard-pie-layout"><ResponsiveContainer width="58%" height="100%"><PieChart><Pie data={requirementData} dataKey="value" nameKey="name" outerRadius={78}>{requirementData.map((item,index)=><Cell key={item.name} fill={colors[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="dashboard-legend">{requirementData.map((item,index)=><span key={item.name}><i style={{ background: colors[index] }} />{item.name}<b>{item.value}</b></span>)}</div></div></article>
    </section>
  );
}

/* =========================================================
   MARKETPLACE
========================================================= */

function Marketplace({
  products,
  categories,
  category,
  search,
  cartCount,
  onCategory,
  onSearch,
  onProduct,
  onAddToCart,
  onCart,
}: {
  products: Product[];
  categories: string[];
  category: string;
  search: string;
  cartCount: number;
  onCategory: (
    category: string,
  ) => void;
  onSearch: (
    value: string,
  ) => void;
  onProduct: (
    product: Product,
  ) => void;
  onAddToCart: (
    product: Product,
    quantity: number,
  ) => void;
  onCart: () => void;
}) {
  const [sortBy, setSortBy] = useState("relevance");
  const displayProducts = useMemo(() => {
    const list = [...products];
    const deliveryDays = (value: string) => Number(value.match(/\d+/)?.[0] ?? 99);
    if (sortBy === "delivery") list.sort((a, b) => deliveryDays(a.deliveryTime) - deliveryDays(b.deliveryTime));
    if (sortBy === "produce") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sortBy === "price") list.sort((a, b) => a.pricePerKg - b.pricePerKg);
    if (sortBy === "quantity") list.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
    return list;
  }, [products, sortBy]);

  return (
    <div className="buyer-main marketplace-main">
      <section className="marketplace-hero">
        <p className="eyebrow green">
          KHETLINK MARKETPLACE
        </p>

        <h1>
          Fresh produce,
          <span>
            {" "}
            directly from farmers.
          </span>
        </h1>

        <p className="marketplace-description">
          Buy everyday produce
          from verified farmers
          and manage your
          purchases in one place.
        </p>

        <div className="marketplace-search">
          <Search size={19} />
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search produce or farmer" />
        </div>
        <div className="marketplace-cart-row">
          <span>Fresh produce from verified farmers</span>
          <button type="button" onClick={onCart}>
            <ShoppingCart size={18} /> My Cart
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </div>
      </section>

      <div className="marketplace-category-row">
        {categories.map(
          (item) => (
            <button
              type="button"
              key={item}
              className={
                category ===
                item
                  ? "active"
                  : ""
              }
              onClick={() =>
                onCategory(item)
              }
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="marketplace-sort-row">
        <span>Sort by</span>
        <button type="button" className={sortBy === "delivery" ? "active" : ""} onClick={() => setSortBy("delivery")}>Delivery Time</button>
        <button type="button" className={sortBy === "produce" ? "active" : ""} onClick={() => setSortBy("produce")}>Produce</button>
        <button type="button" className={sortBy === "rating" ? "active" : ""} onClick={() => setSortBy("rating")}>Ratings</button>
        <button type="button" className={sortBy === "price" ? "active" : ""} onClick={() => setSortBy("price")}>Price</button>
        <button type="button" className={sortBy === "quantity" ? "active" : ""} onClick={() => setSortBy("quantity")}>Quantity Available</button>
      </div>

      <div className="marketplace-heading">
        <div>
          <p className="eyebrow">
            AVAILABLE NOW
          </p>

          <h2>
            Fresh from farmers
          </h2>
        </div>

        <span>
          {displayProducts.length}{" "}
          products
        </span>
      </div>

      {products.length ===
      0 ? (
        <section className="buyer-card empty-state-large">
          <Search
            size={40}
          />
          <h2>
            No products found
          </h2>
          <p>
            Try another
            search or category.
          </p>
        </section>
      ) : (
        <div className="product-grid">
          {displayProducts.map(
            (product) => (
              <ProductCard
                key={
                  product.id
                }
                product={
                  product
                }
                onView={() =>
                  onProduct(
                    product,
                  )
                }
                onAdd={(quantity) => onAddToCart(product, quantity)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onView,
  onAdd,
}: {
  product: Product;
  onView: () => void;
  onAdd: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <article className="product-card">
      <div className="product-image"><img src={product.image} alt={product.name} /></div>

      <div className="product-content">
        <div className="product-top">
          <div>
            <h3>
              {product.name}
            </h3>

            <p>
              {product.farmerName}
            </p>
          </div>

          <span className="product-rating">
            <Star
              size={12}
              fill="currentColor"
            />
            {product.rating}
          </span>
          <small className="product-review-count">{product.reviews} reviews</small>
        </div>

        <div className="product-location">
          <Truck size={13} />
          {product.deliveryTime}
        </div>

        <div className="product-price">
          <strong>
            {formatCurrency(
              product.pricePerKg,
            )}
          </strong>
          <span>
            / kg
          </span>
        </div>

        <small className="product-availability">
          {product.quantityAvailable}{" "}
          kg available
        </small>

        <div className="product-card-quantity">
          <span>Quantity</span>
          <div>
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={13} /></button>
            <strong>{quantity} kg</strong>
            <button type="button" onClick={() => setQuantity((value) => Math.min(product.quantityAvailable, value + 1))}><Plus size={13} /></button>
          </div>
        </div>

        <div className="product-actions">
          <button
            type="button"
            className="product-details-btn"
            onClick={onView}
          >
            <Eye size={14} />
            Details
          </button>

          <button
            type="button"
            className="product-cart-btn"
            onClick={() => onAdd(quantity)}
          >
            <ShoppingCart
              size={14}
            />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   PROCUREMENT
========================================================= */

function Procurement({
  form,
  draft,
  requirements,
  farmers,
  offers,
  selectedListingIds,
  selectedListingQuantities,
  editingItemId,
  onFormChange,
  onAdd,
  onUpdate,
  onDelete,
  onSubmit,
  onToggleListing,
  onSetQuantity,
  onSendRequest,
  onNegotiate,
  onFarmerAccept,
  onConfirm,
  onDeclineOffer,
  onCloseRequirement,
  onFarmer,
}: {
  form: RequirementItem;
  draft?: Requirement;
  requirements: Requirement[];
  farmers: Farmer[];
  offers: FarmerOffer[];
  selectedListingIds: Record<string, string[]>;
  selectedListingQuantities: Record<string, Record<string, number>>;
  editingItemId: string | null;
  onFormChange: (
    value: RequirementItem,
  ) => void;
  onAdd: () => void;
  onUpdate: (
    item: RequirementItem,
  ) => void;
  onDelete: (
    itemId: string,
  ) => void;
  onSubmit: (
    requirementId: string,
  ) => void;
  onToggleListing: (farmerId: string, listingId: string) => void;
  onSetQuantity: (farmerId: string, listingId: string, quantity: number) => void;
  onSendRequest: (
    requirement: Requirement,
    farmer: Farmer,
  ) => void;
  onNegotiate: (
    requirementId: string,
    farmerId: string,
    price: number,
  ) => void;
  onFarmerAccept: (
    requirementId: string,
    farmerId: string,
  ) => void;
  onConfirm: (requirementId: string, farmerId: string) => void;
  onDeclineOffer: (requirementId: string, farmerId: string) => void;
  onCloseRequirement: (requirementId: string) => void;
  onFarmer: (
    farmer: Farmer,
  ) => void;
}) {
  const submittedRequirements =
    requirements.filter(
      (requirement) =>
        requirement.status !==
        "Draft",
    );

  return (
    <div className="buyer-main procurement-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow green">
            BULK PROCUREMENT
          </p>

          <h1>
            Procure at scale
          </h1>

          <p>
            Create multiple
            requirements,
            discover matching
            farmers and negotiate
            the final price.
          </p>
        </div>
      </div>

      <section className="procurement-stepper buyer-card">
        {[["1", "Define Requirement"], ["2", "Buyer Process"], ["3", "Supplier Selection"], ["4", "Negotiation"], ["5", "Summary"]].map(([number, label], index) => (
          <div className="procurement-stepper-item" key={number}>
            <span>{number}</span>
            <strong>{label}</strong>
            {index < 4 && <ArrowRight size={15} />}
          </div>
        ))}
      </section>

      <section className="procurement-form buyer-card">
        <div className="section-heading">
          <div>
            <h2>
              Create Requirement
            </h2>
            <p>
              Add each product
              separately.
            </p>
          </div>

          <span className="requirement-step">
            Step 1
          </span>
        </div>

        <div className="procurement-input-grid">
          <Field label="Produce">
            <input list="buyer-produce-options" value={form.produce} onChange={(event) => onFormChange({ ...form, produce: event.target.value })} placeholder="Type or select produce" />
            <datalist id="buyer-produce-options">
              {[...new Set(farmers.flatMap((farmer) => farmer.listings.map((listing) => listing.produce)).concat(["Mango", "Banana", "Apple", "Orange", "Grapes"]))].map((produce) => <option value={produce} key={produce} />)}
            </datalist>
          </Field>

          <Field label="Quantity">
            <div className="buyer-quantity-control">
              <button type="button" onClick={() => onFormChange({ ...form, quantity: Math.max(1, form.quantity - 1) })}><Minus size={14} /></button>
              <input type="number" min="1" value={form.quantity} onChange={(event) => onFormChange({ ...form, quantity: Math.max(1, Number(event.target.value)) })} />
              <button type="button" onClick={() => onFormChange({ ...form, quantity: form.quantity + 1 })}><Plus size={14} /></button>
              <select value={form.unit ?? "kg"} onChange={(event) => onFormChange({ ...form, unit: event.target.value as RequirementUnit })}><option value="g">g</option><option value="kg">kg</option><option value="ton">ton</option></select>
            </div>
          </Field>

          <Field
            label="Minimum Price / kg"
          >
            <input
              type="number"
              min="0"
              value={
                form.minPrice
              }
              onChange={(event) =>
                onFormChange({
                  ...form,
                  minPrice:
                    Number(
                      event.target
                        .value,
                    ),
                })
              }
            />
          </Field>

          <Field
            label="Maximum Price / kg"
          >
            <input
              type="number"
              min="0"
              value={
                form.maxPrice
              }
              onChange={(event) =>
                onFormChange({
                  ...form,
                  maxPrice:
                    Number(
                      event.target
                        .value,
                    ),
                })
              }
            />
          </Field>

          <Field
            label="Required By"
          >
            <input
              type="date"
              min={todayString()}
              value={
                form.requiredBy
              }
              onChange={(event) =>
                onFormChange({
                  ...form,
                  requiredBy:
                    event.target
                      .value,
                })
              }
            />
          </Field>

          <Field
            label="Delivery Location"
          >
            <input
              value={
                form.location
              }
              onChange={(event) =>
                onFormChange({
                  ...form,
                  location:
                    event.target
                      .value,
                })
              }
              placeholder="e.g. Pune"
            />
          </Field>
        </div>

        <div className="procurement-form-actions">
          {editingItemId && (
            <button
              type="button"
              className="buyer-outline-button"
              onClick={() =>
                onFormChange({
                  id: "",
                  produce: "",
                  quantity: 1,
                  unit: "kg",
                  minPrice: 1,
                  maxPrice: 100,
                  requiredBy:
                    futureDate(
                      7,
                    ),
                  location: "",
                })
              }
            >
              Cancel Update
            </button>
          )}

          <button
            type="button"
            className="buyer-primary-button"
            onClick={onAdd}
          >
            {editingItemId ? (
              <>
                <Check
                  size={16}
                />
                Update Item
              </>
            ) : (
              <>
                <Plus
                  size={16}
                />
                Add Requirement
              </>
            )}
          </button>
        </div>
      </section>

      {draft && (
        <section className="procurement-requirement-box buyer-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                DRAFT REQUIREMENT
              </p>

              <h2>
                Your procurement
                list
              </h2>

              <small>
                {draft.id}
              </small>
            </div>

            <span className="requirement-status draft">
              Draft
            </span>
          </div>

          <div className="requirement-items">
            {draft.items.map(
              (item) => (
                <div
                  className="requirement-item"
                  key={item.id}
                >
                  <div className="requirement-product-icon">
                    {
                      getProductEmoji(
                        item.produce,
                      )
                    }
                  </div>

                  <div className="requirement-item-copy">
                    <strong>
                      {
                        item.produce
                      }
                    </strong>

                    <span>
                      {formatQuantity(item.quantity, item.unit ?? "kg")}
                    </span>

                    <small>
                      ₹
                      {
                        item.minPrice
                      } – ₹
                      {
                        item.maxPrice
                      }{" "}
                      / kg
                    </small>
                  </div>

                  <div className="requirement-item-meta">
                    <span>
                      <MapPin
                        size={
                          13
                        }
                      />
                      {
                        item.location
                      }
                    </span>

                    <span>
                      <Clock3
                        size={
                          13
                        }
                      />
                      {
                        item.requiredBy
                      }
                    </span>
                  </div>

                  <div className="requirement-item-actions">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdate(
                          item,
                        )
                      }
                      title="Update"
                    >
                      <Pencil
                        size={
                          15
                        }
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          item.id,
                        )
                      }
                      title="Remove"
                    >
                      <Trash2
                        size={
                          15
                        }
                      />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="requirement-submit-row">
            <span>
              {draft.items.length}{" "}
              item
              {draft.items.length !==
              1
                ? "s"
                : ""}{" "}
              added
            </span>

            <button
              type="button"
              className="buyer-primary-button"
              disabled={
                draft.items.length ===
                0
              }
              onClick={() =>
                onSubmit(
                  draft.id,
                )
              }
            >
              <Send size={16} />
              Submit Request
            </button>
          </div>
        </section>
      )}

      {submittedRequirements.length > 0 && (
        <section className="procurement-submitted-list buyer-card">
          <div className="section-heading"><div><p className="eyebrow">YOUR REQUIREMENTS</p><h2>Submitted Requirements</h2></div><span>{submittedRequirements.length} active</span></div>
          <div className="submitted-requirement-table">
            {submittedRequirements.map((requirement) => (
              <div className="submitted-requirement-row" key={requirement.id}>
                <strong>{requirement.id}</strong>
                <span>{requirement.items.map((item) => `${item.produce} · ${formatQuantity(item.quantity, item.unit ?? "kg")}`).join(" | ")}</span>
                <span className={`requirement-status ${requirement.status.toLowerCase().replace(/\s+/g, "-")}`}>{requirement.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {submittedRequirements.map(
        (requirement) => (
          <ProcurementRequest
            key={
              requirement.id
            }
            requirement={
              requirement
            }
            farmers={farmers}
            offers={offers}
            selectedListingIds={selectedListingIds}
            selectedListingQuantities={selectedListingQuantities}
            onToggleListing={onToggleListing}
            onSetQuantity={onSetQuantity}
            onSendRequest={
              onSendRequest
            }
            onNegotiate={
              onNegotiate
            }
            onFarmerAccept={
              onFarmerAccept
            }
            onConfirm={onConfirm}
            onDeclineOffer={onDeclineOffer}
            onCloseRequirement={onCloseRequirement}
            onFarmer={
              onFarmer
            }
          />
        ),
      )}
    </div>
  );
}

/* =========================================================
   PROCUREMENT REQUEST + MATCHING
========================================================= */

function ProcurementRequest({
  requirement,
  farmers,
  offers,
  selectedListingIds,
  selectedListingQuantities,
  onToggleListing,
  onSetQuantity,
  onSendRequest,
  onNegotiate,
  onFarmerAccept,
  onConfirm,
  onDeclineOffer,
  onCloseRequirement,
  onFarmer,
}: {
  requirement: Requirement;
  farmers: Farmer[];
  offers: FarmerOffer[];
  selectedListingIds: Record<string, string[]>;
  selectedListingQuantities: Record<string, Record<string, number>>;
  onToggleListing: (farmerId: string, listingId: string) => void;
  onSetQuantity: (farmerId: string, listingId: string, quantity: number) => void;
  onSendRequest: (
    requirement: Requirement,
    farmer: Farmer,
  ) => void;
  onNegotiate: (
    requirementId: string,
    farmerId: string,
    price: number,
  ) => void;
  onFarmerAccept: (
    requirementId: string,
    farmerId: string,
  ) => void;
  onConfirm: (requirementId: string, farmerId: string) => void;
  onDeclineOffer: (requirementId: string, farmerId: string) => void;
  onCloseRequirement: (requirementId: string) => void;
  onFarmer: (
    farmer: Farmer,
  ) => void;
}) {
  const matchedFarmers = farmers
    .filter((farmer) =>
      farmer.listings.some((listing) =>
        requirement.items.some(
          (item) =>
            listing.produce.toLowerCase() ===
              item.produce.toLowerCase() &&
            listing.availableQuantity >=
              toKg(item.quantity, item.unit),
        ),
      ),
    )
    .sort((a, b) => {
      const satisfied = (farmer: Farmer) =>
        requirement.items.reduce((sum, item) => {
          const listing = farmer.listings.find(
            (candidate) =>
              candidate.produce.toLowerCase() ===
              item.produce.toLowerCase(),
          );
          return (
            sum +
            Math.min(
              toKg(item.quantity, item.unit),
              listing?.availableQuantity ?? 0,
            )
          );
        }, 0);

      const price = (farmer: Farmer) =>
        Math.min(
          ...farmer.listings.map(
            (listing) => listing.pricePerKg,
          ),
        );

      return (
        satisfied(b) -
        satisfied(a) ||
        b.rating - a.rating ||
        price(a) - price(b) ||
        a.distanceKm - b.distanceKm
      );
    });

  return (
    <section className="procurement-results buyer-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            REQUIREMENT
          </p>

          <h2>
            {requirement.id}
          </h2>

          <p>
            {requirement.items.length}{" "}
            product
            {requirement.items.length !==
            1
              ? "s"
              : ""}{" "}
            requested
          </p>
        </div>

        <span
          className={`requirement-status ${requirement.status
            .toLowerCase()
            .replace(
              /\s+/g,
              "-",
            )}`}
        >
          {requirement.status}
        </span>
        {requirement.status !== "Closed" && requirement.status !== "Confirmed" && (
          <button type="button" className="buyer-outline-button small" onClick={() => onCloseRequirement(requirement.id)}>Close Requirement</button>
        )}
      </div>

      {requirement.status === "Not Found" || requirement.status === "Closed" ? (
        <InlineEmpty
          icon={
            <XCircle />
          }
          text="No farmer currently matches these requirements."
        />
      ) : (
        <>
          <div className="matching-header">
            <div>
              <h3>
                Matching Farmers
              </h3>

              <p>
                A farmer qualifies
                when they match at
                least one requested
                product.
              </p>
            </div>

            <strong>
              {
                matchedFarmers.length
              }{" "}
              matches
            </strong>
          </div>

          <div className="matched-farmer-grid">
            {matchedFarmers.map(
              (farmer) => (
                <MatchedFarmerCard
                  key={
                    farmer.id
                  }
                  farmer={
                    farmer
                  }
                  requirement={
                    requirement
                  }
                  offer={offers.find(
                    (offer) =>
                      offer.requirementId ===
                        requirement.id &&
                      offer.farmerId ===
                        farmer.id,
                  )}
                  selected={selectedListingIds[farmer.id] ?? []}
                  selectedQuantities={selectedListingQuantities[farmer.id] ?? {}}
                  onView={() =>
                    onFarmer(
                      farmer,
                    )
                  }
                  onToggle={(
                    listingId,
                  ) =>
                    onToggleListing(
                      farmer.id,
                      listingId,
                    )
                  }
                  onSetQuantity={(
                    listingId,
                    quantity,
                  ) =>
                    onSetQuantity(
                      farmer.id,
                      listingId,
                      quantity,
                    )
                  }
                  onSend={() =>
                    onSendRequest(
                      requirement,
                      farmer,
                    )
                  }
                  onNegotiate={(
                    price,
                  ) =>
                    onNegotiate(
                      requirement.id,
                      farmer.id,
                      price,
                    )
                  }
                  onFarmerAccept={() =>
                    onFarmerAccept(
                      requirement.id,
                      farmer.id,
                    )
                  }
                  onConfirm={() => onConfirm(requirement.id, farmer.id)}
                  onDecline={() => onDeclineOffer(requirement.id, farmer.id)}
                />
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
}

function MatchedFarmerCard({
  farmer,
  requirement,
  offer,
  selected,
  selectedQuantities,
  onView,
  onToggle,
  onSetQuantity,
  onSend,
  onNegotiate,
  onFarmerAccept,
  onConfirm,
  onDecline,
}: {
  farmer: Farmer;
  requirement: Requirement;
  offer?: FarmerOffer;
  selected: string[];
  selectedQuantities: Record<string, number>;
  onView: () => void;
  onToggle: (listingId: string) => void;
  onSetQuantity: (listingId: string, quantity: number) => void;
  onSend: () => void;
  onNegotiate: (
    price: number,
  ) => void;
  onFarmerAccept: () => void;
  onConfirm: () => void;
  onDecline: () => void;
}) {
  const eligible =
    farmer.listings.filter(
      (listing) =>
        requirement.items.some(
          (item) =>
            item.produce.toLowerCase() ===
              listing.produce.toLowerCase() &&
            listing.availableQuantity >=
              toKg(item.quantity, item.unit),
        ),
    );

  const [price, setPrice] =
    useState(
      offer?.offeredPrice ??
        eligible[0]?.pricePerKg ??
        1,
    );

  useEffect(() => {
    if (offer) {
      setPrice(
        offer.offeredPrice,
      );
    }
  }, [offer]);

  return (
    <article className="matched-farmer-card">
      <div className="farmer-photo">
        <span>{renderAvatar(farmer.avatar, farmer.name)}</span>

        {farmer.verified && (
          <em>
            Verified
          </em>
        )}
      </div>

      <div className="matched-farmer-copy">
        <div className="matched-title">
          <strong>
            {farmer.name}
          </strong>

          <button
            type="button"
            onClick={onView}
            title="View farmer"
          >
            <Eye size={14} />
          </button>
        </div>

        <small>
          {farmer.location}{" "}
          •{" "}
          {
            farmer.distanceKm
          }{" "}
          km
        </small>

        <div className="farmer-rating">
          <Star
            size={13}
            fill="currentColor"
          />
          {
            farmer.rating
          }{" "}
          ({farmer.reviews})
        </div>

        <div className="matching-listings">
          {eligible.map(
            (listing) => (
              <label
                key={
                  listing.id
                }
              >
                <input
                  type="checkbox"
                  checked={selected.includes(
                    listing.id,
                  )}
                  onChange={() =>
                    onToggle(
                      listing.id,
                    )
                  }
                />

                <span>
                  <b>{listing.produce}</b>{" "}
                  {listing.availableQuantity} kg @ {formatCurrency(listing.pricePerKg)}/kg
                </span>
                <div className="matching-quantity-control">
                  <button type="button" onClick={(event) => { event.preventDefault(); onToggle(listing.id); }}>{selected.includes(listing.id) ? "✓" : "Select"}</button>
                  <input type="number" min="0" max={listing.availableQuantity} value={selectedQuantities[listing.id] ?? 0} onChange={(event) => { const next = Math.max(0, Math.min(listing.availableQuantity, Number(event.target.value))); if (next > 0 && !selected.includes(listing.id)) onToggle(listing.id); if (next === 0 && selected.includes(listing.id)) onToggle(listing.id); onSetQuantity(listing.id, next); }} />
                  <span>kg</span>
                </div>
              </label>
            ),
          )}
        </div>

        <button
          type="button"
          className="buyer-primary-button small"
          onClick={onSend}
        >
          <Send size={14} />
          Send Request
        </button>

        {offer && (
          <div className="farmer-negotiation-box">
            <div>
              <span>
                Negotiated price
              </span>

              <div className="negotiation-input">
                <span>
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  value={
                    price
                  }
                  onChange={(
                    event,
                  ) =>
                    setPrice(
                      Number(
                        event
                          .target
                          .value,
                      ),
                    )
                  }
                />

                <span>
                  /kg
                </span>
              </div>
            </div>

            <StatusOffer
              status={
                offer.status
              }
            />

            <div className="negotiation-actions">
              {offer.status !==
                "Accepted" && (
                <button
                  type="button"
                  onClick={() =>
                    onNegotiate(
                      price,
                    )
                  }
                >
                  Negotiate
                </button>
              )}

              {!offer.buyerConfirmed && offer.status === "Negotiating" && (
                <button type="button" onClick={onDecline}>Decline\</button>
              )}

              {!offer.farmerConfirmed && (
                <button
                  type="button"
                  onClick={
                    onFarmerAccept
                  }
                >
                  Farmer Accept
                </button>
              )}

              {!offer.buyerConfirmed && (
                <button
                  type="button"
                  className="buyer-primary-button small"
                  onClick={
                    onConfirm
                  }
                >
                  Confirm
                </button>
              )}
            </div>

            <AcceptanceStatus
              farmer={farmer}
              offer={offer}
            />
          </div>
        )}
      </div>
    </article>
  );
}

function StatusOffer({
  status,
}: {
  status: OfferStatus;
}) {
  return (
    <span
      className={`offer-status ${status
        .toLowerCase()
        .replace(
          /\s+/g,
          "-",
        )}`}
    >
      {status}
    </span>
  );
}

function AcceptanceStatus({
  farmer,
  offer,
}: {
  farmer: Farmer;
  offer?: FarmerOffer;
}) {
  return (
    <div className="acceptance-row">
      <span className="supplier-avatar">{renderAvatar(farmer.avatar, farmer.name)}</span>

      <div>
        <strong>
          {farmer.name}
        </strong>

        <small>
          Request:{" "}
          {offer
            ? "Sent"
            : "Not sent"}
        </small>
      </div>

      <div className="acceptance-steps">
        <span
          className={
            offer?.buyerConfirmed ||
            offer?.status ===
              "Accepted"
              ? "done"
              : ""
          }
        >
          <Check size={12} />
          Buyer confirmed
        </span>

        <span
          className={
            offer?.farmerConfirmed ||
            offer?.status ===
              "Accepted"
              ? "done"
              : ""
          }
        >
          <Check size={12} />
          Farmer accepted
        </span>

        <span
          className={
            offer?.status ===
            "Accepted"
              ? "done"
              : ""
          }
        >
          <Check size={12} />
          Contract confirmed
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   ORDERS
========================================================= */

function Orders({
  orders,
  allOrders,
  filter,
  search,
  onFilter,
  onSearch,
}: {
  orders: Order[];
  allOrders: Order[];
  filter: string;
  search: string;
  onFilter: (
    value: string,
  ) => void;
  onSearch: (
    value: string,
  ) => void;
}) {
  const filters = [
    "All",
    "Confirmed",
    "Processing",
    "In Transit",
    "Delivered",
  ];

  const marketplace =
    orders.filter(
      (order) =>
        order.type ===
        "Marketplace",
    );

  const procurement =
    orders.filter(
      (order) =>
        order.type ===
        "Procurement",
    );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id ?? null);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];

  return (
    <div className="buyer-main orders-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow green">
            ORDERS
          </p>

          <h1>
            Orders & Live
            Delivery
          </h1>

          <p>
            Marketplace purchases
            and confirmed
            procurement orders stay
            connected to the same
            order history.
          </p>
        </div>

        <div className="orders-export-actions">
          <button type="button" className="buyer-outline-button" onClick={() => exportOrdersPdf(allOrders, selectedOrder)}><Download size={16} /> Export Order PDF</button>
          <button type="button" className="buyer-primary-button" onClick={() => exportOrdersPdf(allOrders)}><Download size={16} /> Export All</button>
        </div>
      </div>

      <div className="order-toolbar">
        <div className="order-filters">
          {filters.map(
            (item) => (
              <button
                type="button"
                key={item}
                className={
                  filter === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  onFilter(
                    item,
                  )
                }
              >
                {item}
              </button>
            ),
          )}
        </div>

        <div className="order-search">
          <Search size={16} />

          <input
            value={search}
            onChange={(event) =>
              onSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search order, seller or product"
          />
        </div>
      </div>

      <OrderGroup
        title="Marketplace Orders"
        orders={marketplace}
        selectedOrderId={selectedOrderId}
        onSelect={setSelectedOrderId}
      />

      <OrderGroup
        title="Procurement Orders"
        orders={procurement}
        selectedOrderId={selectedOrderId}
        onSelect={setSelectedOrderId}
      />

      <aside className="orders-live-panel buyer-card">
        {selectedOrder ? (
          <>
            <div className="live-map order-live-map"><MapIcon size={28} /><strong>{selectedOrder.id}</strong><span>Live Order Map</span><small>{selectedOrder.seller} → {selectedOrder.buyer}</small></div>
            <h3>Live Order Status</h3>
            <div className="selected-order-status"><StatusBadge status={selectedOrder.status} /><strong>{selectedOrder.product}</strong><span>{selectedOrder.quantity} kg · {formatCurrency(selectedOrder.cost)}</span></div>
            <TimelineItem title="Order confirmed" time="Confirmed" done />
            <TimelineItem title="Processing" time="Preparing order" done={selectedOrder.status !== "Confirmed"} />
            <TimelineItem title="In transit" time="Live logistics update" done={selectedOrder.status === "In Transit" || selectedOrder.status === "Delivered"} />
            <TimelineItem title="Delivered" time={selectedOrder.deliveryDate} done={selectedOrder.status === "Delivered"} />
          </>
        ) : <InlineEmpty icon={<Truck />} text="No confirmed orders yet." />}
      </aside>
    </div>
  );
}

function OrderGroup({
  title,
  orders,
  selectedOrderId,
  onSelect,
}: {
  title: string;
  orders: Order[];
  selectedOrderId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="buyer-card order-group">
      <SectionHeader
        title={title}
      />

      {orders.length ===
      0 ? (
        <InlineEmpty
          icon={
            <ShoppingCart />
          }
          text={`No ${title.toLowerCase()} yet.`}
        />
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  Order ID
                </th>
                <th>
                  Date
                </th>
                <th>
                  Product
                </th>
                <th>
                  Seller
                </th>
                <th>
                  Quantity
                </th>
                <th>
                  Cost
                </th>
                <th>
                  Status
                </th>
                <th>
                  Delivery
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map(
                (order) => (
                  <tr key={order.id} className={selectedOrderId === order.id ? "selected" : ""} onClick={() => onSelect(order.id)}>
                    <td>
                      <strong>
                        {
                          order.id
                        }
                      </strong>
                    </td>

                    <td>
                      {new Date(
                        order.createdAt,
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month:
                            "short",
                        },
                      )}
                    </td>

                    <td>
                      {
                        order.product
                      }
                    </td>

                    <td>
                      {
                        order.seller
                      }
                    </td>

                    <td>
                      {
                        order.quantity
                      }{" "}
                      kg
                    </td>

                    <td>
                      {formatCurrency(
                        order.cost,
                      )}
                    </td>

                    <td>
                      <StatusBadge
                        status={
                          order.status
                        }
                      />
                    </td>

                    <td>
                      {
                        order.deliveryDate
                      }
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   SHIPMENT
========================================================= */

function Shipment({
  orders,
}: {
  orders: Order[];
}) {
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(sortedOrders[0]?.id ?? null);
  const active = sortedOrders.find((order) => order.id === selectedOrderId) ?? sortedOrders[0];

  return (
    <div className="buyer-main shipment-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow green">
            SHIPMENT
          </p>

          <h1>
            Shipment Tracking
          </h1>

          <p>
            Track confirmed orders
            and connect this section
            to your logistics API for
            live coordinates and
            events.
          </p>
        </div>

        <button
          type="button"
          className="buyer-outline-button"
          onClick={() =>
            window.location.reload()
          }
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {sortedOrders.length > 0 && (
        <section className="shipment-order-strip buyer-card">
          <div className="section-heading"><div><h2>Recent Orders</h2><p>Newest first · select an order to track</p></div><span>{sortedOrders.length} orders</span></div>
          <div className="shipment-order-strip-list">
            {sortedOrders.map((order) => (
              <button type="button" key={order.id} className={selectedOrderId === order.id ? "active" : ""} onClick={() => setSelectedOrderId(order.id)}><strong>{order.id}</strong><span>{order.product} · {order.quantity} kg</span><StatusBadge status={order.status} /></button>
            ))}
          </div>
        </section>
      )}

      {!active ? (
        <section className="buyer-card empty-state-large">
          <Truck size={38} />

          <h2>
            No active shipment
          </h2>

          <p>
            Once a marketplace or
            procurement order is
            dispatched, live tracking
            will appear here.
          </p>
        </section>
      ) : (
        <section className="shipment-detail-grid">
          <article className="buyer-card shipment-card">
            <div className="shipment-heading">
              <div>
                <span className="small-label">
                  ACTIVE ORDER
                </span>

                <h2>
                  {active.id} —{" "}
                  {
                    active.product
                  }
                </h2>

                <p>
                  {
                    active.seller
                  }{" "}
                  →{" "}
                  {
                    active.buyer
                  }
                </p>
              </div>

              <StatusBadge
                status={
                  active.status
                }
              />
            </div>

            <div className="shipment-map-placeholder">
              <MapIcon size={42} />

              <strong>
                Live Order Map
              </strong>

              <span>
                Connect Google Maps
                or Mapbox coordinates
                from the logistics
                backend here.
              </span>

              <div className="route-line">
                <i />
                <i />
                <i />
              </div>
            </div>

            <div className="shipment-steps">
              <ShipmentStep
                title="Order Confirmed"
                done
              />

              <ShipmentStep
                title="Picked Up"
                done={
                  active.status !==
                  "Confirmed"
                }
              />

              <ShipmentStep
                title="In Transit"
                done={
                  active.status ===
                    "In Transit" ||
                  active.status ===
                    "Delivered"
                }
              />

              <ShipmentStep
                title="Delivered"
                done={
                  active.status ===
                  "Delivered"
                }
              />
            </div>
          </article>

          <aside className="buyer-card shipment-side">
            <h3>
              Live Updates
            </h3>

            <TimelineItem
              title="Order confirmed"
              time="System event"
              done
            />

            <TimelineItem
              title="Dispatch pending"
              time="Waiting for logistics update"
              done={
                active.status !==
                "Confirmed"
              }
            />

            <TimelineItem
              title="In transit"
              time="Live location will appear here"
              done={
                active.status ===
                  "In Transit" ||
                active.status ===
                  "Delivered"
              }
            />

            <TimelineItem
              title="Delivery complete"
              time={
                active.deliveryDate
              }
              done={
                active.status ===
                "Delivered"
              }
            />
          </aside>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   ANALYTICS
========================================================= */

function Analytics({
  orders,
  barData,
  pieData,
  range,
  customStart,
  customEnd,
  onRange,
  onStart,
  onEnd,
  onExport,
}: {
  orders: Order[];
  barData: {
    name: string;
    quantity: number;
  }[];
  pieData: {
    name: string;
    value: number;
  }[];
  range: AnalyticsRange;
  customStart: string;
  customEnd: string;
  onRange: (
    range: AnalyticsRange,
  ) => void;
  onStart: (
    value: string,
  ) => void;
  onEnd: (
    value: string,
  ) => void;
  onExport: () => void;
}) {
  const totalQuantity =
    orders.reduce(
      (sum, order) =>
        sum + order.quantity,
      0,
    );

  const totalSpend =
    orders.reduce(
      (sum, order) =>
        sum + order.cost,
      0,
    );

  return (
    <div className="buyer-main analytics-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow green">
            ANALYTICS
          </p>

          <h1>
            Purchase Analytics
          </h1>

          <p>
            Understand your order
            volume, product demand
            and order status.
          </p>
        </div>

        <button
          type="button"
          className="buyer-outline-button"
          onClick={onExport}
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="analytics-range-bar buyer-card">
        <div className="analytics-range-buttons">
          <button
            type="button"
            className={
              range === "week"
                ? "active"
                : ""
            }
            onClick={() =>
              onRange("week")
            }
          >
            This Week
          </button>

          <button
            type="button"
            className={
              range === "month"
                ? "active"
                : ""
            }
            onClick={() =>
              onRange("month")
            }
          >
            This Month
          </button>

          <button
            type="button"
            className={
              range === "custom"
                ? "active"
                : ""
            }
            onClick={() =>
              onRange("custom")
            }
          >
            Custom
          </button>
        </div>

        {range ===
          "custom" && (
          <div className="analytics-custom-range">
            <input
              type="date"
              value={
                customStart
              }
              onChange={(
                event,
              ) =>
                onStart(
                  event.target
                    .value,
                )
              }
            />

            <span>
              to
            </span>

            <input
              type="date"
              value={
                customEnd
              }
              onChange={(
                event,
              ) =>
                onEnd(
                  event.target
                    .value,
                )
              }
            />
          </div>
        )}
      </div>

      <div className="analytics-kpi-grid">
        <Kpi
          title="Total Orders"
          value={String(
            orders.length,
          )}
        />

        <Kpi
          title="Total Quantity"
          value={`${totalQuantity} kg`}
        />

        <Kpi
          title="Total Spend"
          value={formatCurrency(
            totalSpend,
          )}
        />

        <Kpi
          title="Products Ordered"
          value={String(
            barData.length,
          )}
        />
      </div>

      <div className="analytics-chart-grid">
        <article className="buyer-card analytics-chart-card">
          <SectionHeader
            title="Product Quantity"
          />

          {barData.length ===
          0 ? (
            <ChartEmpty text="Your product volume chart will appear after you place an order." />
          ) : (
            <div className="chart-container">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={
                    barData
                  }
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis label={{ value: "Quantity (kg)", angle: -90, position: "insideLeft" }} />

                  <Tooltip />

                  <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                    {barData.map((item, index) => (
                      <Cell key={`${item.name}-${index}`} fill={["#16834a", "#f1b51b", "#3b82f6", "#ef8b2c", "#8b5cf6", "#0f766e"][index % 6]} />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="buyer-card analytics-chart-card">
          <SectionHeader
            title="Order Distribution"
          />

          {pieData.length ===
          0 ? (
            <ChartEmpty text="Your order status distribution will appear after your first purchase." />
          ) : (
            <div className="chart-container">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </div>

      <article className="buyer-card analytics-table-card">
        <SectionHeader
          title="Order Breakdown"
        />

        {orders.length ===
        0 ? (
          <InlineEmpty
            icon={
              <LineChart />
            }
            text="No analytics data yet."
          />
        ) : (
          <table className="analytics-table">
            <thead>
              <tr>
                <th>
                  Product
                </th>
                <th>
                  Quantity
                </th>
                <th>
                  Orders
                </th>
                <th>
                  Spend
                </th>
              </tr>
            </thead>

            <tbody>
              {barData.map(
                (item) => {
                  const matching =
                    orders.filter(
                      (order) =>
                        order.product ===
                        item.name,
                    );

                  return (
                    <tr
                      key={
                        item.name
                      }
                    >
                      <td>
                        <strong>
                          {
                            item.name
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          item.quantity
                        }{" "}
                        kg
                      </td>

                      <td>
                        {
                          matching.length
                        }
                      </td>

                      <td>
                        {formatCurrency(
                          matching.reduce(
                            (
                              sum,
                              order,
                            ) =>
                              sum +
                              order.cost,
                            0,
                          ),
                        )}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        )}
      </article>
    </div>
  );
}

function Kpi({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <article className="kpi-card">
      <small>
        {title}
      </small>

      <strong>
        {value}
      </strong>

      <span>
        Based on selected
        timeline
      </span>
    </article>
  );
}

/* =========================================================
   HELP
========================================================= */

function Help({
  onNavigate,
}: {
  onNavigate: (
    view: View,
  ) => void;
}) {
  return (
    <div className="buyer-main help-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow green">
            KHETLINK SUPPORT
          </p>

          <h1>
            How can we help?
          </h1>

          <p>
            Use Marketplace for
            daily purchases and
            Procurement for
            negotiated bulk supply.
          </p>
        </div>
      </div>

      <div className="help-grid">
        <HelpCard
          icon={<Store />}
          title="Marketplace"
          text="Choose a farmer listing, set quantity, add it to your cart and purchase."
          button="Open Marketplace"
          onClick={() =>
            onNavigate(
              "Marketplace",
            )
          }
        />

        <HelpCard
          icon={
            <ClipboardList />
          }
          title="Bulk Procurement"
          text="Add multiple requirements, submit once, select matching farmers and negotiate."
          button="Open Procurement"
          onClick={() =>
            onNavigate(
              "Procurement",
            )
          }
        />

        <HelpCard
          icon={<Truck />}
          title="Orders & Shipment"
          text="Confirmed Marketplace and Procurement orders are separated by type and connected to delivery tracking."
          button="View Orders"
          onClick={() =>
            onNavigate(
              "Orders",
            )
          }
        />
      </div>

      <section className="buyer-card support-contact-card">
        <div>
          <div className="support-contact-icon">
            <Phone
              size={22}
            />
          </div>

          <div>
            <h2>
              KhetLink Support
            </h2>

            <p>
              Need help with an
              order, farmer or
              procurement request?
            </p>
          </div>
        </div>

        <button
          type="button"
          className="buyer-outline-button"
        >
          Contact Support
        </button>
      </section>
    </div>
  );
}

function HelpCard({
  icon,
  title,
  text,
  button,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <article className="buyer-card help-card">
      <div className="help-card-icon">
        {icon}
      </div>

      <h2>
        {title}
      </h2>

      <p>
        {text}
      </p>

      <button
        type="button"
        onClick={onClick}
      >
        {button}
        <ArrowRight
          size={15}
        />
      </button>
    </article>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function Profile({
  session,
  orders,
  onSessionChange,
  onNavigate,
  showToast,
}: {
  session: BuyerSession;
  orders: Order[];
  onSessionChange: (
    session: BuyerSession,
  ) => void;
  onNavigate: (
    view: View,
  ) => void;
  showToast: (
    message: string,
  ) => void;
}) {
  const [image, setImage] =
    useState(
      session.profileImage ??
        "",
    );

  const [username, setUsername] =
    useState(
      session.username,
    );

  const [phone, setPhone] =
    useState(
      session.phoneNumber,
    );

  const [email, setEmail] =
    useState(
      session.email ?? "",
    );

  const [company, setCompany] =
    useState(
      session.company ??
        session.username,
    );

  const [location, setLocation] =
    useState(
      session.location ??
        "",
    );

  const [language, setLanguage] =
    useState(
      session.language ??
        "English",
    );

  useEffect(() => {
    setImage(
      session.profileImage ??
        "",
    );

    setUsername(
      session.username,
    );

    setPhone(
      session.phoneNumber,
    );

    setEmail(
      session.email ??
        "",
    );

    setCompany(
      session.company ??
        session.username,
    );

    setLocation(
      session.location ??
        "",
    );

    setLanguage(
      session.language ??
        "English",
    );
  }, [session]);

  const handleImage = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      showToast(
        "Please select an image file.",
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setImage(
        String(
          reader.result,
        ),
      );
    };

    reader.readAsDataURL(
      file,
    );
  };

  const saveProfile = () => {
    const nextSession: BuyerSession =
      {
        ...session,
        username:
          username.trim() ||
          session.username,
        phoneNumber:
          phone.trim(),
        email:
          email.trim() ||
          undefined,
        company:
          company.trim() ||
          undefined,
        location:
          location.trim() ||
          undefined,
        language,
        profileImage:
          image ||
          undefined,
      };

    onSessionChange(
      nextSession,
    );

    showToast(
      "Profile updated successfully.",
    );
  };

  const totalOrders =
    orders.length;

  return (
    <div className="buyer-main profile-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow green">
            ACCOUNT
          </p>

          <h1>
            Profile
          </h1>

          <p>
            Manage your buyer
            identity and account
            information.
          </p>
        </div>
      </div>

      <section className="profile-cover buyer-card">
        <div className="profile-avatar-section">
          <div className="buyer-profile-avatar-large">
            {image ? (
              <img
                src={image}
                alt={
                  username
                }
              />
            ) : (
              getInitials(
                username,
              )
            )}
          </div>

          <label className="profile-upload-button">
            <Upload
              size={15}
            />
            Upload Photo

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImage
              }
            />
          </label>
        </div>

        <div className="profile-identity">
          <span className="verified-pill">
            <Check
              size={12}
            />
            Buyer Account
          </span>

          <h2>
            {username}
          </h2>

          <p>
            Buyer ID:{" "}
            <strong>
              {
                session.buyerId
              }
            </strong>
          </p>

          <small>
            {phone}
          </small>
        </div>

        <div className="profile-mini-stat">
          <strong>
            {totalOrders}
          </strong>
          <span>
            Total Orders
          </span>
        </div>
      </section>

      <section className="profile-content-grid">
        <article className="buyer-card profile-form-card">
          <div className="section-heading">
            <div>
              <h2>
                Personal Information
              </h2>
              <p>
                Update the information
                associated with your
                buyer account.
              </p>
            </div>
          </div>

          <div className="profile-form-grid">
            <Field
              label="Username"
            >
              <input value={username} readOnly disabled onChange={(
                  event,
                ) =>
                  setUsername(
                    event
                      .target
                      .value,
                  )
                }
              />
            </Field>

            <Field
              label="Phone Number"
            >
              <input value={phone} readOnly disabled onChange={(
                  event,
                ) =>
                  setPhone(
                    event
                      .target
                      .value,
                  )
                }
              />
            </Field>

            <Field
              label="Email"
            >
              <input type="email" value={email} readOnly disabled onChange={(
                  event,
                ) =>
                  setEmail(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="buyer@example.com"
              />
            </Field>

            <Field
              label="Company / Organization"
            >
              <input
                value={
                  company
                }
                onChange={(
                  event,
                ) =>
                  setCompany(
                    event
                      .target
                      .value,
                  )
                }
              />
            </Field>

            <Field
              label="Location"
            >
              <input
                value={
                  location
                }
                onChange={(
                  event,
                ) =>
                  setLocation(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="City, State"
              />
            </Field>

            <Field
              label="Language"
            >
              <select
                value={
                  language
                }
                onChange={(
                  event,
                ) =>
                  setLanguage(
                    event
                      .target
                      .value,
                  )
                }
              >
                <option>
                  English
                </option>
                <option>
                  Hindi
                </option>
                <option>
                  Marathi
                </option>
              </select>
            </Field>
          </div>

          <button
            type="button"
            className="buyer-primary-button"
            onClick={
              saveProfile
            }
          >
            <Check size={16} />
            Save Changes
          </button>
        </article>

        <aside className="buyer-card profile-side-card">
          <h3>
            Account Details
          </h3>

          <ProfileInfo
            icon={
              <UserCircle />
            }
            label="Buyer ID"
            value={
              session.buyerId
            }
          />

          <ProfileInfo
            icon={
              <Phone />
            }
            label="Phone"
            value={
              session.phoneNumber
            }
          />

          <ProfileInfo
            icon={
              <MapPin />
            }
            label="Location"
            value={
              session.location ||
              "Not added"
            }
          />

          <ProfileInfo
            icon={
              <Settings />
            }
            label="Account Type"
            value="Buyer"
          />

          <button
            type="button"
            className="buyer-outline-button profile-orders-button"
            onClick={() =>
              onNavigate(
                "Orders",
              )
            }
          >
            View My Orders
            <ArrowRight
              size={15}
            />
          </button>
        </aside>
      </section>
    </div>
  );
}

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="profile-info-row">
      <span>
        {icon}
      </span>

      <div>
        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =========================================================
   MODALS
========================================================= */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [onClose]);

  return (
    <div
      className="buyer-modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="buyer-modal">
        <div className="buyer-modal-header">
          <h2>
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <div className="buyer-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

function FarmerModal({
  farmer,
  onClose,
  onNavigate,
}: {
  farmer: Farmer;
  onClose: () => void;
  onNavigate: (
    view: View,
  ) => void;
}) {
  const totalAvailable =
    farmer.listings.reduce(
      (sum, listing) =>
        sum +
        listing.availableQuantity,
      0,
    );

  const lowestPrice =
    Math.min(
      ...farmer.listings.map(
        (listing) =>
          listing.pricePerKg,
      ),
    );

  return (
    <Modal
      title="Farmer Profile"
      onClose={onClose}
    >
      <div className="farmer-modal-grid">
        <div className="farmer-modal-avatar">{renderAvatar(farmer.avatar, farmer.name)}</div>

        <div>
          <div className="modal-title-line">
            <h3>
              {farmer.name}
            </h3>

            {farmer.verified && (
              <span className="verified-pill">
                <Check
                  size={12}
                />
                Verified
              </span>
            )}
          </div>

          <p>
            {farmer.farm}
          </p>

          <div className="modal-rating">
            <Star
              size={15}
              fill="currentColor"
            />
            {
              farmer.rating
            }{" "}
            •{" "}
            {
              farmer.reviews
            }{" "}
            reviews
          </div>

          <div className="modal-location">
            <MapPin
              size={15}
            />
            {
              farmer.location
            }
          </div>

          <p className="modal-about">
            {farmer.about}
          </p>
        </div>
      </div>

      <div className="modal-stats">
        <div>
          <small>
            Available
          </small>
          <strong>
            {
              totalAvailable
            }{" "}
            kg
          </strong>
        </div>

        <div>
          <small>
            Starting Rate
          </small>
          <strong>
            {formatCurrency(
              lowestPrice,
            )}
            /kg
          </strong>
        </div>

        <div>
          <small>
            Listings
          </small>
          <strong>
            {
              farmer.listings
                .length
            }
          </strong>
        </div>
      </div>

      <div className="modal-crops">
        {farmer.listings.map(
          (listing) => (
            <span
              key={
                listing.id
              }
            >
              {
                listing.produce
              }
              :{" "}
              {
                listing.availableQuantity
              }{" "}
              kg @{" "}
              {formatCurrency(
                listing.pricePerKg,
              )}
              /kg
            </span>
          ),
        )}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="buyer-outline-button"
          onClick={onClose}
        >
          Close
        </button>

        <button
          type="button"
          className="buyer-primary-button"
          onClick={() => {
            onClose();
            onNavigate(
              "Procurement",
            );
          }}
        >
          Create Bulk Requirement
          <ArrowRight
            size={15}
          />
        </button>
      </div>
    </Modal>
  );
}

function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (
    quantity: number,
  ) => void;
}) {
  return (
    <Modal
      title="Product Details"
      onClose={onClose}
    >
      <div className="product-modal-grid">
        <div className="product-modal-image"><img src={product.image} alt={product.name} /></div>

        <div>
          <p className="eyebrow green">
            {product.category}
          </p>

          <h2>
            {product.name}
          </h2>

          <p>
            Sold by{" "}
            <strong>
              {
                product.farmerName
              }
            </strong>
          </p>

          {(() => {
            const farmer = MOCK_FARMERS.find((item) => item.id === product.farmerId);
            return farmer ? (
              <div className="product-modal-farmer">
                <span className="supplier-avatar">{renderAvatar(farmer.avatar, farmer.name)}</span>
                <div><strong>{farmer.farm}</strong><small>{farmer.location} · {farmer.distanceKm} km · {farmer.rating} ★ · {farmer.reviews} reviews</small></div>
              </div>
            ) : null;
          })()}

          <div className="modal-rating">
            <Star
              size={15}
              fill="currentColor"
            />
            {
              product.rating
            }{" "}
            (
            {
              product.reviews
            }{" "}
            reviews)
          </div>

          <div className="product-modal-price">
            {formatCurrency(
              product.pricePerKg,
            )}
            <span>
              /kg
            </span>
          </div>

          <p>
            {
              product.quantityAvailable
            }{" "}
            kg available
          </p>

          <p>
            Delivery:
            {" "}
            {
              product.deliveryTime
            }
          </p>
        </div>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="buyer-outline-button"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="buyer-primary-button"
          onClick={() => onAdd(1)}
        >
          <ShoppingCart
            size={16}
          />
          Add to Cart
        </button>
      </div>
    </Modal>
  );
}

function CartModal({
  cart,
  total,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onPurchase,
}: {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onIncrease: (
    id: string,
  ) => void;
  onDecrease: (
    id: string,
  ) => void;
  onRemove: (
    id: string,
  ) => void;
  onPurchase: () => void;
}) {
  return (
    <Modal
      title="Your Cart"
      onClose={onClose}
    >
      {cart.length ===
      0 ? (
        <div className="cart-empty">
          <ShoppingCart
            size={42}
          />

          <h3>
            Your cart is empty
          </h3>

          <p>
            Add products from
            Marketplace to
            continue.
          </p>
        </div>
      ) : (
        <>
          <div className="modal-cart-items">
            {cart.map(
              (item) => (
                <div
                  className="modal-cart-item"
                  key={
                    item.id
                  }
                >
                  <div className="modal-cart-image"><img src={item.image} alt={item.product} /></div>

                  <div className="modal-cart-copy">
                    <strong>
                      {
                        item.product
                      }
                    </strong>

                    <small>
                      {
                        item.farmerName
                      }
                    </small>

                    <span>
                      {formatCurrency(
                        item.pricePerKg,
                      )}
                      /kg
                    </span>
                  </div>

                  <div className="modal-cart-quantity">
                    <button
                      type="button"
                      onClick={() =>
                        onDecrease(
                          item.id,
                        )
                      }
                    >
                      <Minus
                        size={14}
                      />
                    </button>

                    <strong>
                      {
                        item.quantity
                      }
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        onIncrease(
                          item.id,
                        )
                      }
                    >
                      <Plus
                        size={14}
                      />
                    </button>
                  </div>

                  <strong className="modal-cart-total">
                    {formatCurrency(
                      item.quantity *
                        item.pricePerKg,
                    )}
                  </strong>

                  <button
                    type="button"
                    className="remove-cart"
                    onClick={() =>
                      onRemove(
                        item.id,
                      )
                    }
                  >
                    <Trash2
                      size={16}
                    />
                  </button>
                </div>
              ),
            )}
          </div>

          <div className="cart-summary">
            <span>
              Total
            </span>

            <strong>
              {formatCurrency(
                total,
              )}
            </strong>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="buyer-outline-button"
              onClick={onClose}
            >
              Continue Shopping
            </button>

            <button
              type="button"
              className="buyer-primary-button"
              onClick={
                onPurchase
              }
            >
              Buy Now
              <ArrowRight
                size={15}
              />
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationPanel({
  notifications,
  onClose,
}: {
  notifications: Notification[];
  onClose: () => void;
}) {
  return (
    <div
      className="notification-panel-overlay"
      onClick={onClose}
    >
      <div
        className="notification-panel"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="notification-panel-header">
          <div>
            <h2>
              Notifications
            </h2>

            <p>
              KhetLink updates
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {notifications.length ===
        0 ? (
          <InlineEmpty
            icon={<Bell />}
            text="You don't have any notifications yet."
          />
        ) : (
          notifications.map(
            (notification) => (
              <div
                className={`notification-panel-item ${
                  notification.read
                    ? ""
                    : "unread"
                }`}
                key={
                  notification.id
                }
              >
                <div>
                  <CheckCircle2
                    size={18}
                  />
                </div>

                <section>
                  <strong>
                    {
                      notification.title
                    }
                  </strong>

                  <p>
                    {
                      notification.message
                    }
                  </p>

                  <small>
                    {new Date(
                      notification.createdAt,
                    ).toLocaleString(
                      "en-IN",
                    )}
                  </small>
                </section>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL SHARED COMPONENTS
========================================================= */

function DashboardMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <article className="dashboard-metric buyer-card">
      <span>
        {icon}
      </span>

      <div>
        <p>
          {label}
        </p>

        <strong>
          {value}
        </strong>
      </div>
    </article>
  );
}

function SectionHeader({
  title,
  action,
  onClick,
}: {
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-header">
      <h2>
        {title}
      </h2>

      {action &&
        onClick && (
          <button
            type="button"
            onClick={onClick}
          >
            {action}
            <ArrowRight
              size={14}
            />
          </button>
        )}
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="summary-metric">
      <span>
        {icon}
      </span>

      <div>
        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      className={`status-badge ${status
        .toLowerCase()
        .replace(
          /\s+/g,
          "-",
        )}`}
    >
      {status}
    </span>
  );
}

function InlineEmpty({
  icon,
  text,
}: {
  icon?: ReactNode;
  text: string;
}) {
  return (
    <div className="inline-empty">
      {icon && (
        <span>
          {icon}
        </span>
      )}

      <p>
        {text}
      </p>
    </div>
  );
}

function ChartEmpty({
  text,
}: {
  text: string;
}) {
  return (
    <div className="chart-empty">
      <LineChart
        size={36}
      />

      <p>
        {text}
      </p>
    </div>
  );
}

function ShipmentStep({
  title,
  done,
}: {
  title: string;
  done: boolean;
}) {
  return (
    <div
      className={`shipment-step ${
        done
          ? "done"
          : ""
      }`}
    >
      <span className="shipment-step-circle">
        {done ? (
          <Check
            size={16}
          />
        ) : (
          <Clock3
            size={16}
          />
        )}
      </span>

      <p>
        {title}
      </p>
    </div>
  );
}

function TimelineItem({
  title,
  time,
  done,
}: {
  title: string;
  time: string;
  done: boolean;
}) {
  return (
    <div
      className={`timeline-item ${
        done
          ? "done"
          : ""
      }`}
    >
      <span>
        {done ? (
          <Check
            size={13}
          />
        ) : (
          <Clock3
            size={13}
          />
        )}
      </span>

      <div>
        <strong>
          {title}
        </strong>

        <small>
          {time}
        </small>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="buyer-field">
      <span>
        {label}
      </span>

      {children}
    </label>
  );
}

/* =========================================================
   PRODUCT EMOJIS
========================================================= */

function getProductEmoji(
  product: string,
) {
  const normalized =
    product.toLowerCase();

  if (
    normalized.includes(
      "tomato",
    )
  ) {
    return "🍅";
  }

  if (
    normalized.includes(
      "potato",
    )
  ) {
    return "🥔";
  }

  if (
    normalized.includes(
      "onion",
    )
  ) {
    return "🧅";
  }

  if (
    normalized.includes(
      "carrot",
    )
  ) {
    return "🥕";
  }

  if (
    normalized.includes(
      "spinach",
    )
  ) {
    return "🥬";
  }

  if (
    normalized.includes(
      "cabbage",
    )
  ) {
    return "🥬";
  }

  return "🌱";
}