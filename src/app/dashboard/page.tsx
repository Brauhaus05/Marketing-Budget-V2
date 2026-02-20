export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Main Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of your financial performance and budget allocation.
      </p>
      <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center text-sm text-muted-foreground">
        Dashboard widgets will be built in a future phase.
      </div>
    </div>
  );
}
