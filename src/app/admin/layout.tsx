"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import type { Session } from "next-auth";

type UserWithRole = Session["user"] & { role?: string };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    
    // Login sayfasındaysa kontrol etme
    if (pathname === '/admin/login') return;
    
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [session, status, router, pathname]);

  // Login sayfasında layout gösterme
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!session || (session.user as UserWithRole)?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h2>
          <p className="text-gray-600 mb-4">Bu sayfaya erişim için admin yetkisi gereklidir.</p>
          <Link 
            href="/admin/login" 
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen sticky top-0">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">Admin Paneli</h2>
          <p className="text-sm text-gray-600">Hasan Ali Yücel Gençlik Merkezi</p>
        </div>
        
        {/* Kullanıcı Bilgileri */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-1">Hoş geldiniz,</div>
          <div className="font-medium text-gray-900">{session.user?.name || session.user?.email}</div>
          <div className="text-xs text-gray-500 mt-1">Admin</div>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <Link 
            href="/admin/dashboard" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/dashboard' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/basvurular" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/basvurular' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Başvurular
          </Link>
          <Link 
            href="/admin/etkinlikler" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/etkinlikler' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Etkinlikler
          </Link>
          <Link 
            href="/admin/kurslar" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/kurslar' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Kurslar
          </Link>
          <Link 
            href="/admin/duyurular" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/duyurular' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Duyurular
          </Link>
          <Link 
            href="/admin/kullanicilar" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/kullanicilar' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Kullanıcılar
          </Link>
          <Link 
            href="/admin/icerikler" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/icerikler' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            İçerikler
          </Link>
          <Link 
            href="/admin/mesajlar" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/mesajlar' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Mesajlar
          </Link>
          <Link 
            href="/admin/ayarlar" 
            className={`px-3 py-2 rounded-md transition ${
              pathname === '/admin/ayarlar' 
                ? 'bg-red-100 text-red-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
            }`}
          >
            Ayarlar
          </Link>
        </nav>
        
        {/* Çıkış Butonu */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition text-left"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 