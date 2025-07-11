"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPanel = pathname.startsWith("/admin");

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        {/* Logo/Başlık */}
        <div>
          <Image src="/logo.png/logo.png" alt="Atakum Belediyesi Logo" height={90} width={180} className="h-16 w-auto" />
        </div>
        {/* Menü veya Admin Paneli */}
        {!isAdminPanel ? (
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-800 hover:text-red-600 font-medium transition">Anasayfa</Link>
            <Link href="/hakkimizda" className="text-gray-800 hover:text-red-600 font-medium transition">Hakkımızda</Link>
            <Link href="/kurslar" className="text-gray-800 hover:text-red-600 font-medium transition">Kurslar</Link>
            <Link href="/etkinlikler" className="text-gray-800 hover:text-red-600 font-medium transition">Etkinlikler</Link>
            <Link href="/duyurular" className="text-gray-800 hover:text-red-600 font-medium transition">Duyurular</Link>
            <Link href="/iletisim" className="text-gray-800 hover:text-red-600 font-medium transition">İletişim</Link>
          </nav>
        ) : (
          <button
            className="text-gray-800 font-bold text-lg px-4 py-2 rounded hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(true)}
            aria-label="Admin Paneli Menüsünü Aç"
          >
            Admin Paneli
          </button>
        )}
      </div>
      {/* Sidebar (Admin Paneli) */}
      {isAdminPanel && sidebarOpen && (
        <div className="fixed inset-0 z-50 flex flex-row">
          {/* Sidebar */}
          <aside className="relative w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen animate-slide-in-left">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
              onClick={() => setSidebarOpen(false)}
              aria-label="Kapat"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-8 text-center text-red-700">Admin Paneli</h2>
            <nav className="flex flex-col gap-4">
              <Link href="/admin/dashboard" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
              <Link href="/admin/basvurular" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Başvurular</Link>
              <Link href="/admin/etkinlikler" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Etkinlikler</Link>
              <Link href="/admin/kurslar" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Kurslar</Link>
              <Link href="/admin/duyurular" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Duyurular</Link>
              <Link href="/admin/kullanicilar" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Kullanıcılar</Link>
              <Link href="/admin/galeri" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Galeri</Link>
              <Link href="/admin/icerikler" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>İçerikler</Link>
              <Link href="/admin/mesajlar" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Mesajlar</Link>
              <Link href="/admin/ayarlar" className="text-gray-800 hover:text-red-600 font-medium transition" onClick={() => setSidebarOpen(false)}>Ayarlar</Link>
            </nav>
          </aside>
          {/* Beyaz arka plan ve ortada logo */}
          <div className="flex-1 flex items-center justify-center bg-white" onClick={() => setSidebarOpen(false)}>
            <Image src="/logo.png/logo.png" alt="Atakum Belediyesi Logo" width={512} height={256} className="h-64 w-auto drop-shadow-xl" />
          </div>
        </div>
      )}
    </div>
  );
} 