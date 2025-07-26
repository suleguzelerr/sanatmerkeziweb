"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import type { Kurs } from '@/types/database';

type UserWithRole = Session["user"] & { role?: string };

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminKurslarClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kurslar, setKurslar] = useState<Kurs[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKurs, setEditingKurs] = useState<Kurs | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchKurslar();
  }, [session, status, router]);

  const fetchKurslar = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kurslar')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      setKurslar(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteKurs = async (id: number) => {
    if (!confirm('Bu kursu silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('kurslar')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting course:', error);
        return;
      }

      fetchKurslar();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleDurum = async (id: number, currentDurum: string) => {
    const yeniDurum = currentDurum === 'aktif' ? 'pasif' : 'aktif';
    
    try {
      const { error } = await supabase
        .from('kurslar')
        .update({ durum: yeniDurum })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      fetchKurslar();
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
        <h2 className="text-2xl font-bold">Kurslar</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Yeni Kurs Ekle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kurs Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eğitmen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontenjan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kurslar.map((kurs) => (
                <tr key={kurs.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {kurs.baslik}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {kurs.kategori}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {kurs.egitmen || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {kurs.kontenjan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      kurs.durum === 'aktif' ? 'bg-green-100 text-green-800' :
                      kurs.durum === 'pasif' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {kurs.durum === 'aktif' ? 'Aktif' :
                       kurs.durum === 'pasif' ? 'Pasif' : 'Tam'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleDurum(kurs.id, kurs.durum)}
                        className={`${
                          kurs.durum === 'aktif' 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {kurs.durum === 'aktif' ? 'Pasif Yap' : 'Aktif Yap'}
                      </button>
                      <button 
                        onClick={() => setEditingKurs(kurs)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteKurs(kurs.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {kurslar.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Henüz kurs bulunmuyor.
            </div>
          )}
        </div>
      )}

      {/* Kurs Ekleme/Düzenleme Formu */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingKurs ? 'Kurs Düzenle' : 'Yeni Kurs Ekle'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kurs Adı</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingKurs?.baslik || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select className="w-full border rounded px-3 py-2">
                  <option value="Yabancı Dil">Yabancı Dil</option>
                  <option value="Sosyal Kültürel">Sosyal Kültürel</option>
                  <option value="Sanat Tasarımı">Sanat Tasarımı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Eğitmen</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingKurs?.egitmen || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kontenjan</label>
                <input 
                  type="number" 
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingKurs?.kontenjan || 20}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingKurs(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingKurs ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 