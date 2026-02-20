"use client";

import { useBudgetStore } from "@/store/useBudgetStore";
import { formatCurrency } from "@/lib/format";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  // ── Pull everything from global state ──
  const operatingCosts = useBudgetStore((s) => s.operatingCosts);
  const directCosts = useBudgetStore((s) => s.directCosts);
  const collateralCosts = useBudgetStore((s) => s.collateralCosts);
  const productionServices = useBudgetStore((s) => s.productionServices);
  const marketingCosts = useBudgetStore((s) => s.marketingCosts);
  const assumptions = useBudgetStore((s) => s.businessAssumptions);
  const setAssumptions = useBudgetStore((s) => s.setBusinessAssumptions);

  // ══════════════════════════════════════════
  //  AGGREGATION MATH
  // ══════════════════════════════════════════

  // 1. Total Fixed Costs (sum of actualMonthly)
  const totalFixedCosts = operatingCosts.reduce(
    (sum, c) => sum + c.actualMonthly,
    0
  );

  // 2. Total Direct Cost per product
  const totalDirectCost = directCosts.reduce((sum, c) => {
    const cpu = c.unitsPerPurchase > 0 ? c.costPerPurchase / c.unitsPerPurchase : 0;
    return sum + cpu * c.amountUsedPerProduct;
  }, 0);

  // 3. Total Collateral Cost per product
  const totalCollateralCost = collateralCosts.reduce((sum, c) => {
    const cpu = c.unitsPerPurchase > 0 ? c.costPerPurchase / c.unitsPerPurchase : 0;
    return sum + cpu * c.amountUsedPerProduct;
  }, 0);

  // 4. Total Services Cost per product
  const totalServicesCost = productionServices.reduce(
    (sum, s) => sum + s.costPerUnit * s.amountUsed,
    0
  );

  // 5. Total Marketing Cost per product
  const totalMarketingCost = marketingCosts.reduce((sum, c) => {
    return sum + (c.amountPerBatch > 0 ? c.budgetPerBatch / c.amountPerBatch : 0);
  }, 0);

  // 6. TOTAL VARIABLE COST PER UNIT
  const totalVariableCost =
    totalDirectCost + totalCollateralCost + totalServicesCost + totalMarketingCost;

  // ══════════════════════════════════════════
  //  BUSINESS FORMULAS
  // ══════════════════════════════════════════

  const marginPerSale = assumptions.ticketPrice - totalVariableCost;
  const isNegativeMargin = totalVariableCost >= assumptions.ticketPrice;

  const projectedUnitSales =
    assumptions.potentialClients * (assumptions.conversionRate / 100);
  const grossRevenue = projectedUnitSales * assumptions.ticketPrice;
  const totalMonthlyVariableCosts = projectedUnitSales * totalVariableCost;
  const grossProfit = grossRevenue - totalMonthlyVariableCosts;
  const netProfit = grossProfit - totalFixedCosts;

  // Breakeven (only valid when margin > 0)
  const breakevenUnits =
    !isNegativeMargin && marginPerSale > 0
      ? Math.ceil(totalFixedCosts / marginPerSale)
      : 0;
  const breakevenRevenue = breakevenUnits * assumptions.ticketPrice;

  // ── Parse numeric input ──
  const handleAssumption = (
    field: "ticketPrice" | "potentialClients" | "conversionRate",
    raw: string
  ) => {
    const parsed = parseFloat(raw);
    setAssumptions({ [field]: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Business Viability &amp; Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Aggregated view of costs, profitability projections, and breakeven
          analysis.
        </p>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/*  SECTION 1: Top KPI Cards                 */}
      {/* ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label="Total Fixed Overhead"
          value={formatCurrency(totalFixedCosts)}
          sublabel="Sum of actual monthly operating costs"
        />
        <KpiCard
          label="Total Variable Cost Per Unit"
          value={formatCurrency(totalVariableCost)}
          sublabel="Direct + Collateral + Services + Marketing"
        />
      </div>

      {/* Variable cost breakdown mini-table */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-base font-semibold">
            Variable Cost Breakdown{" "}
            <span className="font-normal text-muted-foreground">
              (per unit)
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-px bg-neutral-100 sm:grid-cols-4">
          <BreakdownCell label="Direct Costs" value={formatCurrency(totalDirectCost)} />
          <BreakdownCell label="Collateral" value={formatCurrency(totalCollateralCost)} />
          <BreakdownCell label="Services" value={formatCurrency(totalServicesCost)} />
          <BreakdownCell label="Marketing" value={formatCurrency(totalMarketingCost)} />
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/*  SECTION 2: Business Assumptions          */}
      {/* ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-base font-semibold">Business Assumptions</h2>
          <p className="text-xs text-muted-foreground">
            Set your pricing and sales model to project profitability
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
          <InputField
            label="Ticket Price"
            prefix="$"
            value={assumptions.ticketPrice}
            onChange={(v) => handleAssumption("ticketPrice", v)}
            step={0.01}
          />
          <InputField
            label="Potential Clients (Leads)"
            value={assumptions.potentialClients}
            onChange={(v) => handleAssumption("potentialClients", v)}
            step={1}
          />
          <InputField
            label="Conversion Rate"
            suffix="%"
            value={assumptions.conversionRate}
            onChange={(v) => handleAssumption("conversionRate", v)}
            step={0.1}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/*  SECTION 3: Profitability & Breakeven     */}
      {/* ══════════════════════════════════════════ */}

      {/* Negative margin alert */}
      {isNegativeMargin && assumptions.ticketPrice > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Negative Margin Alert
            </p>
            <p className="mt-0.5 text-sm text-red-700">
              Variable costs ({formatCurrency(totalVariableCost)}) exceed your
              ticket price ({formatCurrency(assumptions.ticketPrice)}). Increase
              price or reduce unit costs to achieve profitability.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Profitability Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h2 className="text-base font-semibold">Profitability</h2>
          </div>
          <div className="flex flex-col gap-0 divide-y divide-neutral-100">
            <MetricRow
              label="Margin Per Sale"
              value={formatCurrency(marginPerSale)}
              negative={marginPerSale < 0}
            />
            <MetricRow
              label="Projected Unit Sales"
              value={projectedUnitSales.toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}
            />
            <MetricRow
              label="Gross Revenue"
              value={formatCurrency(grossRevenue)}
            />
            <MetricRow
              label="Gross Profit"
              value={formatCurrency(grossProfit)}
              negative={grossProfit < 0}
            />
            <MetricRow
              label="Net Profit"
              value={formatCurrency(netProfit)}
              negative={netProfit < 0}
              bold
            />
          </div>
        </div>

        {/* Breakeven Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h2 className="text-base font-semibold">Breakeven Analysis</h2>
          </div>

          {isNegativeMargin || assumptions.ticketPrice === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <AlertTriangle className="mb-3 h-8 w-8 text-neutral-300" />
              <p className="text-sm text-muted-foreground">
                {assumptions.ticketPrice === 0
                  ? "Set a ticket price to see breakeven analysis."
                  : "Breakeven cannot be calculated with a negative margin."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-0 divide-y divide-neutral-100">
              <MetricRow
                label="Breakeven Units"
                value={breakevenUnits.toLocaleString("en-US")}
              />
              <div className="px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Breakeven Revenue
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-900">
                  {formatCurrency(breakevenRevenue)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  Sub-components                            */
/* ═══════════════════════════════════════════ */

function KpiCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
      )}
    </div>
  );
}

function BreakdownCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function InputField({
  label,
  prefix,
  suffix,
  value,
  onChange,
  step,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (v: string) => void;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          min={0}
          step={step}
          className={`w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-400 focus:bg-white focus:outline-none ${
            prefix ? "pl-7 pr-3" : suffix ? "pl-3 pr-8" : "px-3"
          }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  negative,
  bold,
}: {
  label: string;
  value: string;
  negative?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5">
      <span
        className={`text-sm ${bold ? "font-semibold" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? "text-base font-bold" : "text-sm font-medium"} ${
          negative ? "text-red-500/80" : "text-neutral-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
