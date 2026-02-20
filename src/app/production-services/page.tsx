"use client";

import { useBudgetStore } from "@/store/useBudgetStore";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

export default function ProductionServicesPage() {
  const productionServices = useBudgetStore((s) => s.productionServices);
  const addProductionService = useBudgetStore((s) => s.addProductionService);
  const updateProductionService = useBudgetStore(
    (s) => s.updateProductionService
  );
  const removeProductionService = useBudgetStore(
    (s) => s.removeProductionService
  );

  // ── Derived calculations ──
  const costPerProduct = (s: (typeof productionServices)[number]) =>
    s.costPerUnit * s.amountUsed;

  const totalServicesCostPerProduct = productionServices.reduce(
    (sum, s) => sum + costPerProduct(s),
    0
  );

  // ── Add empty row ──
  const handleAdd = () => {
    addProductionService({
      id: crypto.randomUUID(),
      service: "",
      costPerUnit: 0,
      amountUsed: 0,
    });
  };

  // ── Parse numeric input ──
  const handleNum = (
    id: string,
    field: "costPerUnit" | "amountUsed",
    raw: string
  ) => {
    const parsed = parseFloat(raw);
    updateProductionService(id, { [field]: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Production Services{" "}
          <span className="font-normal text-muted-foreground">
            (Utilities &amp; Logistics)
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage variable costs for outsourced production services — delivery,
          electricity, gas, and more.
        </p>
      </div>

      {/* ── KPI Card ── */}
      <div className="max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Total Services Cost Per Product
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
          {formatCurrency(totalServicesCostPerProduct)}
        </p>
      </div>

      {/* ── Data Table Card ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold">Services Breakdown</h2>
            <p className="text-xs text-muted-foreground">
              {productionServices.length} item
              {productionServices.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 min-w-[200px]">Service Name</th>
                <th className="px-4 py-3 text-right min-w-[140px]">
                  Cost / Unit
                </th>
                <th className="px-4 py-3 text-right min-w-[130px]">
                  Amount Used
                </th>
                <th className="px-4 py-3 text-right min-w-[140px]">
                  Cost / Product
                </th>
                <th className="px-4 py-3 w-[60px]" />
              </tr>
            </thead>
            <tbody>
              {productionServices.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No services yet. Click{" "}
                    <span className="font-medium text-foreground">
                      Add Service
                    </span>{" "}
                    to get started.
                  </td>
                </tr>
              ) : (
                productionServices.map((svc) => {
                  const cpp = costPerProduct(svc);

                  return (
                    <tr
                      key={svc.id}
                      className="group border-b border-neutral-50 transition-colors hover:bg-neutral-50/60"
                    >
                      {/* Service Name */}
                      <td className="px-6 py-2">
                        <input
                          type="text"
                          value={svc.service}
                          onChange={(e) =>
                            updateProductionService(svc.id, {
                              service: e.target.value,
                            })
                          }
                          placeholder="e.g. Delivery fee"
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Cost Per Unit */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={svc.costPerUnit || ""}
                          onChange={(e) =>
                            handleNum(svc.id, "costPerUnit", e.target.value)
                          }
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-right text-sm tabular-nums transition-colors placeholder:text-muted-foreground/50 focus:border-neutral-300 focus:bg-white focus:outline-none hover:bg-neutral-50"
                        />
                      </td>

                      {/* Amount Used */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={svc.amountUsed || ""}
                          onChange={(e) =>
                            handleNum(svc.id, "amountUsed", e.target.value)
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
                          onClick={() => removeProductionService(svc.id)}
                          className="rounded-md p-1.5 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                          aria-label={`Delete ${svc.service || "service"}`}
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
            {productionServices.length > 0 && (
              <tfoot>
                <tr className="border-t border-neutral-200 bg-neutral-50/50 font-medium">
                  <td className="px-6 py-3 text-sm">Total</td>
                  <td />
                  <td />
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-neutral-900">
                    {formatCurrency(totalServicesCostPerProduct)}
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
