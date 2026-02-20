"use client";

import { useBudgetStore } from "@/store/useBudgetStore";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

export default function CollateralCostsPage() {
  const collateralCosts = useBudgetStore((s) => s.collateralCosts);
  const addCollateralCost = useBudgetStore((s) => s.addCollateralCost);
  const updateCollateralCost = useBudgetStore((s) => s.updateCollateralCost);
  const removeCollateralCost = useBudgetStore((s) => s.removeCollateralCost);

  // ── Derived calculations ──
  const costPerUnit = (c: (typeof collateralCosts)[number]) =>
    c.unitsPerPurchase > 0 ? c.costPerPurchase / c.unitsPerPurchase : 0;

  const costPerProduct = (c: (typeof collateralCosts)[number]) =>
    costPerUnit(c) * c.amountUsedPerProduct;

  const totalCollateralCostPerProduct = collateralCosts.reduce(
    (sum, c) => sum + costPerProduct(c),
    0
  );

  // ── Add empty row ──
  const handleAdd = () => {
    addCollateralCost({
      id: crypto.randomUUID(),
      item: "",
      costPerPurchase: 0,
      unitsPerPurchase: 0,
      amountUsedPerProduct: 0,
    });
  };

  // ── Parse numeric input ──
  const handleNum = (
    id: string,
    field: "costPerPurchase" | "unitsPerPurchase" | "amountUsedPerProduct",
    raw: string
  ) => {
    const parsed = parseFloat(raw);
    updateCollateralCost(id, { [field]: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Collateral Costs{" "}
          <span className="font-normal text-muted-foreground">
            (Design, Packaging &amp; Prototypes)
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track variable costs for packaging, labels, stickers, prototypes, and
          other collateral items.
        </p>
      </div>

      {/* ── KPI Card ── */}
      <div className="max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Total Collateral Cost Per Product
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
          {formatCurrency(totalCollateralCostPerProduct)}
        </p>
      </div>

      {/* ── Data Table Card ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Collateral Breakdown</h2>
            <p className="text-xs text-muted-foreground">
              {collateralCosts.length} item
              {collateralCosts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Add Collateral
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 min-w-[170px]">Item Name</th>
                <th className="px-4 py-3 text-right min-w-[130px]">
                  Cost / Purchase
                </th>
                <th className="px-4 py-3 text-right min-w-[120px]">
                  Units / Purchase
                </th>
                <th className="px-4 py-3 text-right min-w-[110px]">
                  Cost / Unit
                </th>
                <th className="px-4 py-3 text-right min-w-[120px]">
                  Amt Used / Product
                </th>
                <th className="px-4 py-3 text-right min-w-[120px]">
                  Cost / Product
                </th>
                <th className="px-4 py-3 w-[60px]" />
              </tr>
            </thead>
            <tbody>
              {collateralCosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No collateral items yet. Click{" "}
                    <span className="font-medium text-foreground">
                      Add Collateral
                    </span>{" "}
                    to get started.
                  </td>
                </tr>
              ) : (
                collateralCosts.map((cost) => {
                  const cpu = costPerUnit(cost);
                  const cpp = costPerProduct(cost);

                  return (
                    <tr
                      key={cost.id}
                      className="group border-b border-neutral-50 transition-colors hover:bg-neutral-50/60"
                    >
                      {/* Item Name */}
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          value={cost.item}
                          onChange={(e) =>
                            updateCollateralCost(cost.id, {
                              item: e.target.value,
                            })
                          }
                          placeholder="e.g. Custom Box"
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Cost Per Purchase */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={cost.costPerPurchase || ""}
                          onChange={(e) =>
                            handleNum(
                              cost.id,
                              "costPerPurchase",
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Units Per Purchase */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={cost.unitsPerPurchase || ""}
                          onChange={(e) =>
                            handleNum(
                              cost.id,
                              "unitsPerPurchase",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          min={0}
                          step={1}
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Cost Per Unit (read-only) */}
                      <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                        {formatCurrency(cpu)}
                      </td>

                      {/* Amount Used Per Product */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={cost.amountUsedPerProduct || ""}
                          onChange={(e) =>
                            handleNum(
                              cost.id,
                              "amountUsedPerProduct",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          min={0}
                          step={0.01}
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
                          onClick={() => removeCollateralCost(cost.id)}
                          className="rounded-md p-1.5 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                          aria-label={`Delete ${cost.item || "collateral"}`}
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
            {collateralCosts.length > 0 && (
              <tfoot>
                <tr className="border-t border-neutral-200 bg-neutral-50/50 font-medium">
                  <td className="px-6 py-3 text-sm">Total</td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-neutral-900">
                    {formatCurrency(totalCollateralCostPerProduct)}
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
