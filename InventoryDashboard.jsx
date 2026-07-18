import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  Boxes,
  DollarSign,
  Tag,
  AlertTriangle,
  Sun,
  Moon,
  ChevronRight,
  TrendingDown,
  ShieldAlert,
  Layers,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Source data (aggregated by category, from 100k-SKU catalog)
// ---------------------------------------------------------------------------
const categoryData = [
  { category: "Accessories (Bags, Hats, Belts)", totalProducts: 2901, avgPrice: 494.39, totalStock: 1444399, potentialRevenue: 714096421.61 },
  { category: "Automotive", totalProducts: 3026, avgPrice: 497.29, totalStock: 1506770, potentialRevenue: 749301653.30 },
  { category: "Beauty & Personal Care", totalProducts: 2977, avgPrice: 506.34, totalStock: 1484393, potentialRevenue: 751607551.62 },
  { category: "Bedding & Bath", totalProducts: 2971, avgPrice: 497.00, totalStock: 1492378, potentialRevenue: 741711866.00 },
  { category: "Books & Stationery", totalProducts: 3034, avgPrice: 501.76, totalStock: 1516299, potentialRevenue: 760818186.24 },
  { category: "Cameras & Accessories", totalProducts: 2902, avgPrice: 508.96, totalStock: 1469864, potentialRevenue: 748101981.44 },
  { category: "Camping & Hiking", totalProducts: 2979, avgPrice: 499.50, totalStock: 1487415, potentialRevenue: 742963792.50 },
  { category: "Cleaning Supplies", totalProducts: 2847, avgPrice: 510.69, totalStock: 1457633, potentialRevenue: 744398596.77 },
  { category: "Clothing & Apparel", totalProducts: 2901, avgPrice: 494.90, totalStock: 1470429, potentialRevenue: 727715312.10 },
  { category: "Cycling", totalProducts: 2910, avgPrice: 505.57, totalStock: 1448417, potentialRevenue: 732276182.69 },
  { category: "Fishing & Hunting", totalProducts: 2941, avgPrice: 493.92, totalStock: 1474780, potentialRevenue: 728423337.60 },
  { category: "Fitness Equipment", totalProducts: 2951, avgPrice: 500.13, totalStock: 1472396, potentialRevenue: 736389411.48 },
  { category: "Fragrances", totalProducts: 2972, avgPrice: 503.41, totalStock: 1481354, potentialRevenue: 745728417.14 },
  { category: "Furniture", totalProducts: 2862, avgPrice: 497.83, totalStock: 1441146, potentialRevenue: 717445713.18 },
  { category: "Grooming Tools", totalProducts: 3018, avgPrice: 502.86, totalStock: 1514774, potentialRevenue: 761719253.64 },
  { category: "Haircare", totalProducts: 2951, avgPrice: 494.85, totalStock: 1486223, potentialRevenue: 735457451.55 },
  { category: "Headphones & Earbuds", totalProducts: 2896, avgPrice: 502.37, totalStock: 1445613, potentialRevenue: 726232602.81 },
  { category: "Health & Wellness", totalProducts: 2911, avgPrice: 509.53, totalStock: 1482398, potentialRevenue: 755326252.94 },
  { category: "Home & Kitchen", totalProducts: 2920, avgPrice: 501.74, totalStock: 1454275, potentialRevenue: 729667938.50 },
  { category: "Home Decor", totalProducts: 2969, avgPrice: 498.22, totalStock: 1508842, potentialRevenue: 751735261.24 },
  { category: "Kids' Clothing", totalProducts: 2923, avgPrice: 511.66, totalStock: 1500373, potentialRevenue: 767680849.18 },
  { category: "Kitchen Appliances", totalProducts: 2934, avgPrice: 499.94, totalStock: 1466619, potentialRevenue: 733221502.86 },
  { category: "Laptops & Computers", totalProducts: 2867, avgPrice: 502.28, totalStock: 1442311, potentialRevenue: 724443969.08 },
  { category: "Makeup", totalProducts: 2942, avgPrice: 493.78, totalStock: 1484602, potentialRevenue: 733066775.56 },
  { category: "Men's Clothing", totalProducts: 2927, avgPrice: 498.22, totalStock: 1448012, potentialRevenue: 721428538.64 },
  { category: "Office Supplies", totalProducts: 2935, avgPrice: 494.62, totalStock: 1477464, potentialRevenue: 730783243.68 },
  { category: "Shoes & Footwear", totalProducts: 2915, avgPrice: 503.14, totalStock: 1478375, potentialRevenue: 743829597.50 },
  { category: "Skincare", totalProducts: 3019, avgPrice: 500.97, totalStock: 1488173, potentialRevenue: 745530027.81 },
  { category: "Smartphones", totalProducts: 2887, avgPrice: 503.62, totalStock: 1435043, potentialRevenue: 722716355.66 },
  { category: "Smartwatches", totalProducts: 2968, avgPrice: 496.18, totalStock: 1498524, potentialRevenue: 743537638.32 },
  { category: "Sports & Outdoors", totalProducts: 2980, avgPrice: 499.49, totalStock: 1499032, potentialRevenue: 748751493.68 },
  { category: "Team Sports", totalProducts: 2943, avgPrice: 494.31, totalStock: 1471961, potentialRevenue: 727605041.91 },
  { category: "Toys & Games", totalProducts: 2887, avgPrice: 497.86, totalStock: 1459642, potentialRevenue: 726697366.12 },
  { category: "Women's Clothing", totalProducts: 3034, avgPrice: 503.49, totalStock: 1505469, potentialRevenue: 757988586.81 },
];

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
const fmtUSD = (n) =>
  n >= 1e9
    ? `$${(n / 1e9).toFixed(2)}B`
    : n >= 1e6
    ? `$${(n / 1e6).toFixed(1)}M`
    : `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const fmtNum = (n) => n.toLocaleString();
const fmtPrice = (n) => `$${n.toFixed(2)}`;

// ---------------------------------------------------------------------------
// Risk model
// Note: the source data carries inventory value (price x stock), not unit-sales
// or demand figures. To surface a meaningful "restock priority" signal without
// inventing demand data, we use stock depth per catalog SKU (totalStock /
// totalProducts) as a proxy for buffer thinness -- categories with the fewest
// units on hand per listed product are flagged first.
// ---------------------------------------------------------------------------
function useEnrichedData() {
  return useMemo(() => {
    const withDepth = categoryData.map((c) => ({
      ...c,
      stockPerSku: c.totalStock / c.totalProducts,
    }));
    const sorted = [...withDepth].sort((a, b) => a.stockPerSku - b.stockPerSku);
    const n = sorted.length;
    const q1 = sorted[Math.floor(n * 0.25)].stockPerSku;
    const q2 = sorted[Math.floor(n * 0.5)].stockPerSku;
    const q3 = sorted[Math.floor(n * 0.75)].stockPerSku;

    const tiered = withDepth.map((c) => {
      let tier;
      if (c.stockPerSku <= q1) tier = "Critical";
      else if (c.stockPerSku <= q2) tier = "Watch";
      else if (c.stockPerSku <= q3) tier = "Stable";
      else tier = "Strong";
      return { ...c, tier };
    });

    const restockPriority = [...tiered]
      .sort((a, b) => a.stockPerSku - b.stockPerSku)
      .slice(0, 3);

    return { enriched: tiered, restockPriority, thresholds: { q1, q2, q3 } };
  }, []);
}

const TIER_COLORS = {
  Critical: "#f43f5e",
  Watch: "#fbbf24",
  Stable: "#22d3ee",
  Strong: "#34d399",
};

export default function InventoryDashboard() {
  const [dark, setDark] = useState(true);
  const [selected, setSelected] = useState(null); // category string or null
  const { enriched, restockPriority } = useEnrichedData();

  const selectedRow = selected ? enriched.find((c) => c.category === selected) : null;

  const totals = useMemo(() => {
    const totalRevenue = categoryData.reduce((s, c) => s + c.potentialRevenue, 0);
    const totalProducts = categoryData.reduce((s, c) => s + c.totalProducts, 0);
    const weightedAvgPrice =
      categoryData.reduce((s, c) => s + c.avgPrice * c.totalProducts, 0) / totalProducts;
    const criticalCount = enriched.filter((c) => c.tier === "Critical").length;
    return { totalRevenue, totalProducts, weightedAvgPrice, criticalCount };
  }, [enriched]);

  const tierCounts = useMemo(() => {
    const counts = { Critical: 0, Watch: 0, Stable: 0, Strong: 0 };
    enriched.forEach((c) => (counts[c.tier] += 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [enriched]);

  const barData = useMemo(
    () =>
      [...categoryData]
        .sort((a, b) => b.potentialRevenue - a.potentialRevenue)
        .map((c) => ({
          category: c.category.length > 16 ? c.category.slice(0, 15) + "…" : c.category,
          fullName: c.category,
          value: c.potentialRevenue,
        })),
    []
  );

  // ---- theme tokens ----
  const t = dark
    ? {
        appBg: "bg-slate-950",
        panel: "bg-slate-900/70",
        panelBorder: "border-slate-800",
        text: "text-slate-100",
        subtext: "text-slate-400",
        faint: "text-slate-500",
        hover: "hover:bg-slate-800/60",
        selectedBg: "bg-amber-400/10 border-amber-400/40",
        gridStroke: "#1e293b",
        axisStroke: "#64748b",
        tooltipBg: "#0f172a",
        tooltipBorder: "#1e293b",
      }
    : {
        appBg: "bg-slate-100",
        panel: "bg-white",
        panelBorder: "border-slate-200",
        text: "text-slate-900",
        subtext: "text-slate-500",
        faint: "text-slate-400",
        hover: "hover:bg-slate-100",
        selectedBg: "bg-amber-400/10 border-amber-400/60",
        gridStroke: "#e2e8f0",
        axisStroke: "#94a3b8",
        tooltipBg: "#ffffff",
        tooltipBorder: "#e2e8f0",
      };

  return (
    <div className={`min-h-screen w-full ${t.appBg} ${t.text} font-display transition-colors duration-300`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-data { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-20 border-b ${t.panelBorder} ${t.appBg}/90 backdrop-blur px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-400 flex items-center justify-center">
            <Layers size={18} className="text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight leading-none">Inventory Optimization</h1>
            <p className={`text-xs ${t.subtext} mt-0.5`}>34 categories · 100,000 SKU catalog</p>
          </div>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className={`h-9 w-9 rounded-lg border ${t.panelBorder} ${t.hover} flex items-center justify-center transition-colors`}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <main className="px-6 py-6 max-w-[1400px] mx-auto">
        {/* Active filter pill */}
        {selected && (
          <div className="mb-4 flex items-center gap-2">
            <span className={`text-xs ${t.subtext}`}>Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 text-xs font-medium px-3 py-1">
              {selected}
              <button onClick={() => setSelected(null)} aria-label="Clear filter">
                <X size={12} />
              </button>
            </span>
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            t={t}
            icon={<DollarSign size={16} />}
            label={selectedRow ? "Category Inventory Value" : "Total Inventory Value"}
            value={fmtUSD(selectedRow ? selectedRow.potentialRevenue : totals.totalRevenue)}
            accent="text-cyan-400"
          />
          <KpiCard
            t={t}
            icon={<Boxes size={16} />}
            label={selectedRow ? "Products in Category" : "Total Products Cataloged"}
            value={fmtNum(selectedRow ? selectedRow.totalProducts : totals.totalProducts)}
            accent="text-violet-400"
          />
          <KpiCard
            t={t}
            icon={<Tag size={16} />}
            label={selectedRow ? "Category Avg. Price" : "Average Product Price"}
            value={fmtPrice(selectedRow ? selectedRow.avgPrice : totals.weightedAvgPrice)}
            accent="text-emerald-400"
          />
          <KpiCard
            t={t}
            icon={<AlertTriangle size={16} />}
            label="High-Risk Categories"
            value={`${totals.criticalCount} / ${categoryData.length}`}
            accent="text-rose-400"
            sub="Lowest stock depth per SKU"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* Sidebar category selector */}
          <aside className={`rounded-xl border ${t.panelBorder} ${t.panel} p-3 h-fit lg:sticky lg:top-24 max-h-[70vh] overflow-y-auto`}>
            <p className={`text-xs uppercase tracking-wide ${t.faint} px-2 pb-2 pt-1`}>Categories</p>
            <button
              onClick={() => setSelected(null)}
              className={`w-full text-left px-2.5 py-2 rounded-lg mb-1 text-sm flex items-center justify-between transition-colors ${
                !selected ? `${t.selectedBg} border` : `${t.hover} border border-transparent`
              }`}
            >
              <span className="font-medium">All Categories</span>
              <ChevronRight size={14} className={t.faint} />
            </button>
            {[...enriched]
              .sort((a, b) => b.potentialRevenue - a.potentialRevenue)
              .map((c) => {
                const maxRev = Math.max(...enriched.map((x) => x.potentialRevenue));
                const pct = (c.potentialRevenue / maxRev) * 100;
                const isSelected = selected === c.category;
                return (
                  <button
                    key={c.category}
                    onClick={() => setSelected(isSelected ? null : c.category)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg mb-1 text-sm transition-colors border ${
                      isSelected ? `${t.selectedBg}` : `${t.hover} border-transparent`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{c.category}</span>
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: TIER_COLORS[c.tier] }}
                        title={c.tier}
                      />
                    </div>
                    <div className={`h-1 rounded-full ${dark ? "bg-slate-800" : "bg-slate-200"} mt-1.5 overflow-hidden`}>
                      <div
                        className="h-full rounded-full bg-cyan-400/70"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
          </aside>

          {/* Main content */}
          <div className="flex flex-col gap-5">
            {/* Revenue bar chart */}
            <section className={`rounded-xl border ${t.panelBorder} ${t.panel} p-5`}>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-sm font-semibold">Potential Revenue by Category</h2>
                <span className={`text-xs ${t.faint} font-data`}>sorted · descending</span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} margin={{ top: 4, right: 8, left: 8, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fill: t.axisStroke, fontSize: 10 }}
                    stroke={t.axisStroke}
                  />
                  <YAxis
                    tickFormatter={(v) => fmtUSD(v)}
                    tick={{ fill: t.axisStroke, fontSize: 11 }}
                    stroke={t.axisStroke}
                  />
                  <Tooltip
                    contentStyle={{
                      background: t.tooltipBg,
                      border: `1px solid ${t.tooltipBorder}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => [fmtUSD(value), "Potential revenue"]}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((d) => (
                      <Cell
                        key={d.fullName}
                        fill={selected === d.fullName ? "#fbbf24" : "#22d3ee"}
                        opacity={!selected || selected === d.fullName ? 1 : 0.25}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-5">
              {/* Distribution donut */}
              <section className={`rounded-xl border ${t.panelBorder} ${t.panel} p-5`}>
                <h2 className="text-sm font-semibold mb-1">Inventory Health Distribution</h2>
                <p className={`text-xs ${t.subtext} mb-3`}>
                  Categories grouped by stock depth per SKU (quartiles)
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={tierCounts}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {tierCounts.map((entry) => (
                        <Cell key={entry.name} fill={TIER_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: t.tooltipBg,
                        border: `1px solid ${t.tooltipBorder}`,
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={30}
                      formatter={(value) => <span style={{ color: t.axisStroke, fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </section>

              {/* Insights panel */}
              <section className={`rounded-xl border border-rose-500/30 ${t.panel} p-5`}>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert size={16} className="text-rose-400" />
                  <h2 className="text-sm font-semibold">Restock Priority — Top 3</h2>
                </div>
                <p className={`text-xs ${t.subtext} mb-4`}>
                  Thinnest stock buffer per catalog SKU across all categories
                </p>
                <div className="flex flex-col gap-3">
                  {restockPriority.map((c, i) => (
                    <div
                      key={c.category}
                      className={`rounded-lg border ${t.panelBorder} p-3 flex items-center gap-3 ${
                        selected === c.category ? "ring-1 ring-amber-400/60" : ""
                      }`}
                    >
                      <div className="h-7 w-7 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center text-xs font-data shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{c.category}</p>
                        <p className={`text-xs ${t.subtext} font-data`}>
                          {c.stockPerSku.toFixed(1)} units/SKU · {fmtNum(c.totalProducts)} products
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-rose-400 shrink-0">
                        <TrendingDown size={14} />
                        <span className="text-xs font-data">critical</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function KpiCard({ t, icon, label, value, accent, sub }) {
  return (
    <div className={`rounded-xl border ${t.panelBorder} ${t.panel} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={accent}>{icon}</span>
        <span className={`text-xs ${t.subtext}`}>{label}</span>
      </div>
      <p className="text-2xl font-data font-semibold tracking-tight">{value}</p>
      {sub && <p className={`text-[11px] ${t.faint} mt-1`}>{sub}</p>}
    </div>
  );
}
