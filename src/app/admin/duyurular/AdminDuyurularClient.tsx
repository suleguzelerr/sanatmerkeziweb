"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import type { Duyuru } from '@/types/database';

type UserWithRole = Session["user"] & { role?: string };

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDuyurularClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDuyuru, setEditingDuyuru] = useState<Duyuru | null>(null);
  const [formData, setFormData] = useState({
    baslik: '',
    icerik: '',
    yayin_tarihi: '',
    son_tarih: '',
    onem_derecesi: 'normal',
    durum: 'aktif'
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchDuyurular();
  }, [session, status, router]);

  const fetchDuyurular = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('duyurular')
        .select('*')
        .order('yayin_tarihi', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }

      setDuyurular(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDuyuru = async (id: number) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('duyurular')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting announcement:', error);
        return;
      }

      fetchDuyurular();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleDurum = async (id: number, currentDurum: string) => {
    const yeniDurum = currentDurum === 'aktif' ? 'pasif' : 'aktif';
    
    try {
      const { error } = await supabase
        .from('duyurular')
        .update({ durum: yeniDurum })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      fetchDuyurular();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDuyuru) {
        // Güncelleme
        const { error } = await supabase
          .from('duyurular')
          .update(formData)
          .eq('id', editingDuyuru.id);

        if (error) {
          console.error('Error updating announcement:', error);
          return;
        }
      } else {
        // Yeni ekleme
        const { error } = await supabase
          .from('duyurular')
          .insert(formData);

        if (error) {
          console.error('Error adding announcement:', error);
          return;
        }
      }

      setShowForm(false);
      setEditingDuyuru(null);
      setFormData({
        baslik: '',
        icerik: '',
        yayin_tarihi: '',
        son_tarih: '',
        onem_derecesi: 'normal',
        durum: 'aktif'
      });
      fetchDuyurular();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openEditForm = (duyuru: Duyuru) => {
    setEditingDuyuru(duyuru);
    setFormData({
      baslik: duyuru.baslik,
      icerik: duyuru.icerik,
      yayin_tarihi: duyuru.yayin_tarihi,
      son_tarih: duyuru.son_tarih || '',
      onem_derecesi: duyuru.onem_derecesi,
      durum: duyuru.durum
    });
    setShowForm(true);
  };

  if (status === "loading" || !session || (session.user as UserWithRole)?.role !== "admin") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Duyurular</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Yeni Duyuru Ekle
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
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yayın Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Önem
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
              {duyurular.map((duyuru) => (
                <tr key={duyuru.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {duyuru.baslik}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(duyuru.yayin_tarihi).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      duyuru.onem_derecesi === 'yuksek' ? 'bg-red-100 text-red-800' :
                      duyuru.onem_derecesi === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {duyuru.onem_derecesi === 'yuksek' ? 'Yüksek' :
                       duyuru.onem_derecesi === 'normal' ? 'Normal' : 'Düşük'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      duyuru.durum === 'aktif' ? 'bg-green-100 text-green-800' :
                      duyuru.durum === 'pasif' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {duyuru.durum === 'aktif' ? 'Aktif' :
                       duyuru.durum === 'pasif' ? 'Pasif' : 'Arşiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleDurum(duyuru.id, duyuru.durum)}
                        className={`${
                          duyuru.durum === 'aktif' 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {duyuru.durum === 'aktif' ? 'Pasif Yap' : 'Aktif Yap'}
                      </button>
                      <button 
                        onClick={() => openEditForm(duyuru)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteDuyuru(duyuru.id)}
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
          
          {duyurular.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Henüz duyuru bulunmuyor.
            </div>
          )}
        </div>
      )}

      {/* Duyuru Ekleme/Düzenleme Formu */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingDuyuru ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Başlık *</label>
                  <input 
                    type="text" 
                    name="baslik"
                    value={formData.baslik}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yayın Tarihi *</label>
                  <input 
                    type="date" 
                    name="yayin_tarihi"
                    value={formData.yayin_tarihi}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Son Tarih</label>
                  <input 
                    type="date" 
                    name="son_tarih"
                    value={formData.son_tarih}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Önem Derecesi</label>
                  <select 
                    name="onem_derecesi"
                    value={formData.onem_derecesi}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="dusuk">Düşük</option>
                    <option value="normal">Normal</option>
                    <option value="yuksek">Yüksek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durum</label>
                  <select 
                    name="durum"
                    value={formData.durum}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="pasif">Pasif</option>
                    <option value="arsiv">Arşiv</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İçerik *</label>
                <textarea 
                  name="icerik"
                  value={formData.icerik}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDuyuru(null);
                    setFormData({
                      baslik: '',
                      icerik: '',
                      yayin_tarihi: '',
                      son_tarih: '',
                      onem_derecesi: 'normal',
                      durum: 'aktif'
                    });
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  {editingDuyuru ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 