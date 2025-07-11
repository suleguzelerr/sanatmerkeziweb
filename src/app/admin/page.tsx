import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const isAdmin = user && typeof user === "object" && "role" in user && (user as { role?: string }).role === "admin";
  if (!session || !isAdmin) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>
        <p>Hoş geldiniz, {user && typeof user === "object" && "email" in user ? (user as { email?: string }).email : ""}!</p>
        <p>Buradan yönetim işlemlerini gerçekleştirebilirsiniz.</p>
      </div>
    </div>
  );
} 