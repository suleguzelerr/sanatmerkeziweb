"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
type UserWithRole = Session["user"] & { role?: string };

export default function AdminPanelClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session || (session.user as UserWithRole)?.role !== "admin") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen sticky top-0">
        <h2 className="text-xl font-bold mb-8 text-center text-red-700">Admin Paneli</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="text-gray-800 hover:text-red-600 font-medium transition">Dashboard</Link>
          <Link href="/admin/basvurular" className="text-gray-800 hover:text-red-600 font-medium transition">Başvurular</Link>
          <Link href="/admin/etkinlikler" className="text-gray-800 hover:text-red-600 font-medium transition">Etkinlikler</Link>
          <Link href="/admin/kurslar" className="text-gray-800 hover:text-red-600 font-medium transition">Kurslar</Link>
          <Link href="/admin/duyurular" className="text-gray-800 hover:text-red-600 font-medium transition">Duyurular</Link>
          <Link href="/admin/kullanicilar" className="text-gray-800 hover:text-red-600 font-medium transition">Kullanıcılar</Link>
          <Link href="/admin/galeri" className="text-gray-800 hover:text-red-600 font-medium transition">Galeri</Link>
          <Link href="/admin/icerikler" className="text-gray-800 hover:text-red-600 font-medium transition">İçerikler</Link>
          <Link href="/admin/mesajlar" className="text-gray-800 hover:text-red-600 font-medium transition">Mesajlar</Link>
          <Link href="/admin/ayarlar" className="text-gray-800 hover:text-red-600 font-medium transition">Ayarlar</Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4 text-red-700">Hoş geldiniz, Admin!</h1>
        <p className="text-lg text-gray-700 text-center max-w-xl">Sol menüden yönetim modüllerine ulaşabilirsiniz.</p>
      </main>
    </div>
  );
} 