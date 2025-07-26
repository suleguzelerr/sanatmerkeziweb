"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import type { Etkinlik } from '@/types/database';

type UserWithRole = Session["user"] & { role?: string };

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminEtkinliklerClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEtkinlik, setEditingEtkinlik] = useState<Etkinlik | null>(null);
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    tarih: '',
    saat: '',
    yer: '',
    kapasite: 50,
    katilimci_sayisi: 0,
    afis_url: '',
    durum: 'aktif'
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchEtkinlikler();
  }, [session, status, router]);

  const fetchEtkinlikler = async () => {
    setLoading(true);
    try {
      console.log('Admin: Fetching etkinlikler...');
      const { data, error } = await supabase
        .from('etkinlikler')
        .select('*')
        .order('tarih', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      console.log('Admin: Etkinlikler data:', data);
      setEtkinlikler(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEtkinlik = async (id: number) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('etkinlikler')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        return;
      }

      fetchEtkinlikler();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleDurum = async (id: number, currentDurum: string) => {
    const yeniDurum = currentDurum === 'aktif' ? 'pasif' : 'aktif';
    
    try {
      const { error } = await supabase
        .from('etkinlikler')
        .update({ durum: yeniDurum })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      fetchEtkinlikler();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Form submit - formData:', formData);
      
      if (editingEtkinlik) {
        // Güncelleme
        console.log('Updating event with ID:', editingEtkinlik.id);
        const { error } = await supabase
          .from('etkinlikler')
          .update(formData)
          .eq('id', editingEtkinlik.id);

        if (error) {
          console.error('Error updating event:', error);
          return;
        }
        console.log('Event updated successfully');
      } else {
        // Yeni ekleme
        console.log('Adding new event');
        const { error } = await supabase
          .from('etkinlikler')
          .insert(formData);

        if (error) {
          console.error('Error adding event:', error);
          return;
        }
        console.log('Event added successfully');
      }

      setShowForm(false);
      setEditingEtkinlik(null);
      setFormData({
        baslik: '',
        aciklama: '',
        tarih: '',
        saat: '',
        yer: '',
        kapasite: 50,
        katilimci_sayisi: 0,
        afis_url: '',
        durum: 'aktif'
      });
      fetchEtkinlikler();
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

  const openEditForm = (etkinlik: Etkinlik) => {
    setEditingEtkinlik(etkinlik);
    setFormData({
      baslik: etkinlik.baslik,
      aciklama: etkinlik.aciklama || '',
      tarih: etkinlik.tarih,
      saat: etkinlik.saat || '',
      yer: etkinlik.yer || '',
      kapasite: etkinlik.kapasite || 50,
      katilimci_sayisi: etkinlik.katilimci_sayisi,
      afis_url: etkinlik.afis_url || '',
      durum: etkinlik.durum
    });
    setShowForm(true);
  };

  if (status === "loading" || !session || (session.user as UserWithRole)?.role !== "admin") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Etkinlikler</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Yeni Etkinlik Ekle
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
                  Etkinlik Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Katılımcı
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
              {etkinlikler.map((etkinlik) => (
                <tr key={etkinlik.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {etkinlik.baslik}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(etkinlik.tarih).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {etkinlik.saat || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {etkinlik.yer || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {etkinlik.katilimci_sayisi} / {etkinlik.kapasite || '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      etkinlik.durum === 'aktif' ? 'bg-green-100 text-green-800' :
                      etkinlik.durum === 'pasif' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {etkinlik.durum === 'aktif' ? 'Aktif' :
                       etkinlik.durum === 'pasif' ? 'Pasif' : 'Tamamlandı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleDurum(etkinlik.id, etkinlik.durum)}
                        className={`${
                          etkinlik.durum === 'aktif' 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {etkinlik.durum === 'aktif' ? 'Pasif Yap' : 'Aktif Yap'}
                      </button>
                      <button 
                        onClick={() => openEditForm(etkinlik)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteEtkinlik(etkinlik.id)}
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
          
          {etkinlikler.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Henüz etkinlik bulunmuyor.
            </div>
          )}
        </div>
      )}

      {/* Etkinlik Ekleme/Düzenleme Formu */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingEtkinlik ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Etkinlik Adı *</label>
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
                  <label className="block text-sm font-medium mb-1">Tarih *</label>
                  <input 
                    type="date" 
                    name="tarih"
                    value={formData.tarih}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Saat</label>
                  <input 
                    type="time" 
                    name="saat"
                    value={formData.saat}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yer</label>
                  <input 
                    type="text" 
                    name="yer"
                    value={formData.yer}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kapasite</label>
                  <input 
                    type="number" 
                    name="kapasite"
                    value={formData.kapasite}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    min="1"
                  />
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
                    <option value="tamamlandi">Tamamlandı</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Afiş URL</label>
                  <input 
                    type="url" 
                    name="afis_url"
                    value={formData.afis_url}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="https://example.com/afis.jpg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea 
                  name="aciklama"
                  value={formData.aciklama}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEtkinlik(null);
                    setFormData({
                      baslik: '',
                      aciklama: '',
                      tarih: '',
                      saat: '',
                      yer: '',
                      kapasite: 50,
                      katilimci_sayisi: 0,
                      afis_url: '',
                      durum: 'aktif'
                    });
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editingEtkinlik ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 