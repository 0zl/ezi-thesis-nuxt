
import Dashboard from "@/components/Dashboard";
// We reuse the Dashboard component but wrapping it properly in the new layout

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Cek Gizi Balita</h2>
                <div className="flex items-center space-x-2">
                    {/* Actions if needed */}
                </div>
            </div>
            <Dashboard />
        </div>
    );
}
