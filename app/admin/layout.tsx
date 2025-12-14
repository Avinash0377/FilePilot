import Sidebar from '@/components/admin/Sidebar';

export const metadata = {
    title: 'Admin Dashboard - FilePilot',
    robots: { index: false, follow: false }
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#f8f9fb]">
            <Sidebar />
            {/* Main content - add top padding on mobile for header bar */}
            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
