"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
type UserWithRole = Session["user"] & { role?: string };

export default function AdminDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, today: 0, courses: 0, events: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }

    // Supabase client'ı sadece client-side'da oluştur
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const { count: total } = await supabase
          .from("kurs_basvurulari")
          .select("*", { count: "exact", head: true });

        const todayStr = new Date().toISOString().slice(0, 10);
        const { count: today } = await supabase
          .from("kurs_basvurulari")
          .select("*", { count: "exact", head: true })
          .gte("created_at", todayStr + "T00:00:00")
          .lte("created_at", todayStr + "T23:59:59");

        const { count: courses } = await supabase
          .from("kurslar")
          .select("*", { count: "exact", head: true });

        const { count: events } = await supabase
          .from("etkinlikler")
          .select("*", { count: "exact", head: true });

        setStats({
          total: total ?? 0,
          today: today ?? 0,
          courses: courses ?? 0,
          events: events ?? 0,
        });
      } catch (error) {
        setStats({ total: 0, today: 0, courses: 0, events: 0 });
      }
      setLoadingStats(false);
    };

    fetchStats();
  }, [session, status, router]);

  if (status === "loading" || !session || (session.user as UserWithRole)?.role !== "admin") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-red-600">
          <span className="text-4xl font-bold text-red-700">{loadingStats ? "..." : stats.total}</span>
          <span className="mt-2 text-lg text-gray-700">Toplam Başvuru</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-orange-400">
          <span className="text-4xl font-bold text-orange-500">{loadingStats ? "..." : stats.today}</span>
          <span className="mt-2 text-lg text-gray-700">Bugünkü Başvurular</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-blue-600">
          <span className="text-4xl font-bold text-blue-700">{loadingStats ? "..." : stats.courses}</span>
          <span className="mt-2 text-lg text-gray-700">Aktif Kurslar</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-green-600">
          <span className="text-4xl font-bold text-green-700">{loadingStats ? "..." : stats.events}</span>
          <span className="mt-2 text-lg text-gray-700">Etkinlikler</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Yeni Başvuru Görüntüle
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Kurs Ekle
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Etkinlik Ekle
          </button>
        </div>
      </div>
    </div>
  );
} 