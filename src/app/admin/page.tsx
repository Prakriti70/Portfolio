import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin · Art Journal", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <main id="main" className="mx-auto min-h-dvh max-w-4xl px-5 py-10">
      <AdminDashboard />
    </main>
  );
}
