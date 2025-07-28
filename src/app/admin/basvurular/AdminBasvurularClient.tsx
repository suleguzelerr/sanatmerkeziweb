"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import type { KursBasvurusu } from '@/types/database';

type UserWithRole = Session["user"] & { role?: string };

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminBasvurularClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [basvurular, setBasvurular] = useState<KursBasvurusu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchBasvurular();
  }, [session, status, router]);

  const fetchBasvurular = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kurs_basvurulari')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      setBasvurular(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDurum = async (id: number, yeniDurum: string) => {
    try {
      const { error } = await supabase
        .from('kurs_basvurulari')
        .update({ durum: yeniDurum })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      // Listeyi yenile
      fetchBasvurular();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (status === "loading" || !session || (session.user as UserWithRole)?.role !== "admin") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Başvurular</h2>
        <div className="flex gap-2">
          <select 
            className="border rounded px-3 py-2"
            onChange={() => {
              // Filtreleme işlemi burada yapılacak
            }}
          >
            <option value="">Tüm Durumlar</option>
            <option value="beklemede">Beklemede</option>
            <option value="onaylandi">Onaylandı</option>
            <option value="reddedildi">Reddedildi</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {basvurular.map((basvuru) => (
                <tr key={basvuru.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {basvuru.adsoyad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {basvuru.tc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {basvuru.kurs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      basvuru.durum === 'onaylandi' ? 'bg-green-100 text-green-800' :
                      basvuru.durum === 'reddedildi' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {basvuru.durum === 'onaylandi' ? 'Onaylandı' :
                       basvuru.durum === 'reddedildi' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(basvuru.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateDurum(basvuru.id, 'onaylandi')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => updateDurum(basvuru.id, 'reddedildi')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reddet
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Detay
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {basvurular.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Henüz başvuru bulunmuyor.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 