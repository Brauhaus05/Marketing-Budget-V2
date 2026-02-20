"use client";

import { useBudgetStore } from "@/store/useBudgetStore";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

export default function OperatingCostsPage() {
  const operatingCosts = useBudgetStore((s) => s.operatingCosts);
  const addOperatingCost = useBudgetStore((s) => s.addOperatingCost);
  const updateOperatingCost = useBudgetStore((s) => s.updateOperatingCost);
  const removeOperatingCost = useBudgetStore((s) => s.removeOperatingCost);

  // ── Derived totals ──
  const totalBudgeted = operatingCosts.reduce(
    (sum, c) => sum + c.budgetedMonthly,
    0
  );
  const totalActual = operatingCosts.reduce(
    (sum, c) => sum + c.actualMonthly,
    0
  );

  // ── Add empty row ──
  const handleAdd = () => {
    addOperatingCost({
      id: crypto.randomUUID(),
      category: "",
      budgetedMonthly: 0,
      actualMonthly: 0,
    });
  };

  // ── Update a numeric field (parse safely) ──
  const handleNumericChange = (
    id: string,
    field: "budgetedMonthly" | "actualMonthly",
    raw: string
  ) => {
    const parsed = parseFloat(raw);
    updateOperatingCost(id, { [field]: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Operating Costs{" "}
          <span className="font-normal text-muted-foreground">
            (Fixed Overhead)
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your fixed monthly operating expenses — rent, utilities,
          salaries, and more.
        </p>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label="Total Budgeted Monthly"
          value={formatCurrency(totalBudgeted)}
        />
        <KpiCard
          label="Total Actual Monthly"
          value={formatCurrency(totalActual)}
          highlight
        />
      </div>

      {/* ── Data Table Card ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Expense Breakdown</h2>
            <p className="text-xs text-muted-foreground">
              {operatingCosts.length} item
              {operatingCosts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 min-w-[180px]">Category</th>
                <th className="px-4 py-3 text-right min-w-[140px]">
                  Budgeted / mo
                </th>
                <th className="px-4 py-3 text-right min-w-[140px]">
                  Actual / mo
                </th>
                <th className="px-4 py-3 text-right min-w-[130px]">
                  Variance / mo
                </th>
                <th className="px-4 py-3 text-right min-w-[130px]">
                  Yearly Budgeted
                </th>
                <th className="px-4 py-3 text-right min-w-[130px]">
                  Yearly Actual
                </th>
                <th className="px-4 py-3 w-[60px]" />
              </tr>
            </thead>
            <tbody>
              {operatingCosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No expenses yet. Click{" "}
                    <span className="font-medium text-foreground">
                      Add Expense
                    </span>{" "}
                    to get started.
                  </td>
                </tr>
              ) : (
                operatingCosts.map((cost) => {
                  const variance =
                    cost.budgetedMonthly - cost.actualMonthly;

                  return (
                    <tr
                      key={cost.id}
                      className="group border-b border-neutral-50 transition-colors hover:bg-neutral-50/60"
                    >
                      {/* Category */}
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          value={cost.category}
                          onChange={(e) =>
                            updateOperatingCost(cost.id, {
                              category: e.target.value,
                            })
                          }
                          placeholder="e.g. Rent"
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Budgeted Monthly */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={cost.budgetedMonthly || ""}
                          onChange={(e) =>
                            handleNumericChange(
                              cost.id,
                              "budgetedMonthly",
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Actual Monthly */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={cost.actualMonthly || ""}
                          onChange={(e) =>
                            handleNumericChange(
                              cost.id,
                              "actualMonthly",
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Variance */}
                      <td className="px-4 py-2 text-right tabular-nums">
                        <span
                          className={
                            variance < 0
                              ? "text-red-500/80"
                              : variance > 0
                                ? "text-emerald-600/80"
                                : "text-muted-foreground"
                          }
                        >
                          {formatCurrency(variance)}
                        </span>
                      </td>

                      {/* Yearly Budgeted */}
                      <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(cost.budgetedMonthly * 12)}
                      </td>

                      {/* Yearly Actual */}
                      <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(cost.actualMonthly * 12)}
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => removeOperatingCost(cost.id)}
                          className="rounded-md p-1.5 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                          aria-label={`Delete ${cost.category || "expense"}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals footer */}
            {operatingCosts.length > 0 && (
              <tfoot>
                <tr className="border-t border-neutral-200 bg-neutral-50/50 font-medium">
                  <td className="px-6 py-3 text-sm">Totals</td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums">
                    {formatCurrency(totalBudgeted)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums">
                    {formatCurrency(totalActual)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums">
                    <span
                      className={
                        totalBudgeted - totalActual < 0
                          ? "text-red-500/80"
                          : totalBudgeted - totalActual > 0
                            ? "text-emerald-600/80"
                            : "text-muted-foreground"
                      }
                    >
                      {formatCurrency(totalBudgeted - totalActual)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-muted-foreground">
                    {formatCurrency(totalBudgeted * 12)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-muted-foreground">
                    {formatCurrency(totalActual * 12)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── KPI Card component ── */
function KpiCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-bold tabular-nums ${
          highlight ? "text-neutral-900" : "text-neutral-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
