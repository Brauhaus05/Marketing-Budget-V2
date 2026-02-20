"use client";

import { useBudgetStore } from "@/store/useBudgetStore";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

export default function MarketingCostsPage() {
  const marketingCosts = useBudgetStore((s) => s.marketingCosts);
  const addMarketingCost = useBudgetStore((s) => s.addMarketingCost);
  const updateMarketingCost = useBudgetStore((s) => s.updateMarketingCost);
  const removeMarketingCost = useBudgetStore((s) => s.removeMarketingCost);

  // ── Derived calculations ──
  const costPerProduct = (c: (typeof marketingCosts)[number]) =>
    c.amountPerBatch > 0 ? c.budgetPerBatch / c.amountPerBatch : 0;

  const totalMarketingCostPerProduct = marketingCosts.reduce(
    (sum, c) => sum + costPerProduct(c),
    0
  );

  // ── Add empty row ──
  const handleAdd = () => {
    addMarketingCost({
      id: crypto.randomUUID(),
      channel: "",
      budgetPerBatch: 0,
      amountPerBatch: 0,
    });
  };

  // ── Parse numeric input ──
  const handleNum = (
    id: string,
    field: "budgetPerBatch" | "amountPerBatch",
    raw: string
  ) => {
    const parsed = parseFloat(raw);
    updateMarketingCost(id, { [field]: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Marketing Costs{" "}
          <span className="font-normal text-muted-foreground">
            (Batch Allocation)
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Plan and track your marketing spend across channels — ads, social
          media, influencers, and events.
        </p>
      </div>

      {/* ── KPI Card ── */}
      <div className="max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Total Marketing Cost Per Product
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
          {formatCurrency(totalMarketingCostPerProduct)}
        </p>
      </div>

      {/* ── Data Table Card ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Channel Breakdown</h2>
            <p className="text-xs text-muted-foreground">
              {marketingCosts.length} channel
              {marketingCosts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Add Channel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 min-w-[200px]">Channel</th>
                <th className="px-4 py-3 text-right min-w-[150px]">
                  Budget / Batch
                </th>
                <th className="px-4 py-3 text-right min-w-[140px]">
                  Amount / Batch
                </th>
                <th className="px-4 py-3 text-right min-w-[140px]">
                  Cost / Product
                </th>
                <th className="px-4 py-3 w-[60px]" />
              </tr>
            </thead>
            <tbody>
              {marketingCosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No channels yet. Click{" "}
                    <span className="font-medium text-foreground">
                      Add Channel
                    </span>{" "}
                    to get started.
                  </td>
                </tr>
              ) : (
                marketingCosts.map((cost) => {
                  const cpp = costPerProduct(cost);

                  return (
                    <tr
                      key={cost.id}
                      className="group border-b border-neutral-50 transition-colors hover:bg-neutral-50/60"
                    >
                      {/* Channel */}
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          value={cost.channel}
                          onChange={(e) =>
                            updateMarketingCost(cost.id, {
                              channel: e.target.value,
                            })
                          }
                          placeholder="e.g. TikTok Ads"
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Budget Per Batch */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={cost.budgetPerBatch || ""}
                          onChange={(e) =>
                            handleNum(cost.id, "budgetPerBatch", e.target.value)
                          }
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Amount Per Batch */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={cost.amountPerBatch || ""}
                          onChange={(e) =>
                            handleNum(cost.id, "amountPerBatch", e.target.value)
                          }
                          placeholder="0"
                          min={0}
                          step={1}
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Cost Per Product (read-only) */}
                      <td className="px-4 py-2 text-right tabular-nums font-medium text-neutral-900">
                        {formatCurrency(cpp)}
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => removeMarketingCost(cost.id)}
                          className="rounded-md p-1.5 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                          aria-label={`Delete ${cost.channel || "channel"}`}
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
            {marketingCosts.length > 0 && (
              <tfoot>
                <tr className="border-t border-neutral-200 bg-neutral-50/50 font-medium">
                  <td className="px-6 py-3 text-sm">Total</td>
                  <td />
                  <td />
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-neutral-900">
                    {formatCurrency(totalMarketingCostPerProduct)}
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
