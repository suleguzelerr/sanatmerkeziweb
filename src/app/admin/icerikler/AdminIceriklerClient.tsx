"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminIceriklerClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session || (session.user as any)?.role !== "admin") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">İçerikler</h2>
      <p>Sayfa içerikleri yönetimi burada olacak.</p>
    </div>
  );
} 