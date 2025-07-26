"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import type { GaleriAlbumu, GaleriMedya } from '@/types/database';

type UserWithRole = Session["user"] & { role?: string };

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminGaleriClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [albumler, setAlbumler] = useState<GaleriAlbumu[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<GaleriAlbumu | null>(null);
  const [medyalar, setMedyalar] = useState<GaleriMedya[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GaleriAlbumu | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchAlbumler();
  }, [session, status, router]);

  const fetchAlbumler = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('galeri_albumleri')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching albums:', error);
        return;
      }

      setAlbumler(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedyalar = async (albumId: number) => {
    try {
      const { data, error } = await supabase
        .from('galeri_medyalar')
        .select('*')
        .eq('album_id', albumId)
        .order('sira_no', { ascending: true });

      if (error) {
        console.error('Error fetching media:', error);
        return;
      }

      setMedyalar(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteAlbum = async (id: number) => {
    if (!confirm('Bu albümü silmek istediğinizden emin misiniz? Tüm medyalar da silinecek.')) return;
    
    try {
      // Önce albümdeki tüm medyaları sil
      const { error: mediaError } = await supabase
        .from('galeri_medyalar')
        .delete()
        .eq('album_id', id);

      if (mediaError) {
        console.error('Error deleting media:', mediaError);
        return;
      }

      // Sonra albümü sil
      const { error } = await supabase
        .from('galeri_albumleri')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting album:', error);
        return;
      }

      fetchAlbumler();
      if (selectedAlbum?.id === id) {
        setSelectedAlbum(null);
        setMedyalar([]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteMedya = async (id: number) => {
    if (!confirm('Bu medyayı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('galeri_medyalar')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting media:', error);
        return;
      }

      if (selectedAlbum) {
        fetchMedyalar(selectedAlbum.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleAlbumDurum = async (id: number, currentDurum: string) => {
    const yeniDurum = currentDurum === 'aktif' ? 'pasif' : 'aktif';
    
    try {
      const { error } = await supabase
        .from('galeri_albumleri')
        .update({ durum: yeniDurum })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      fetchAlbumler();
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
        <h2 className="text-2xl font-bold">Galeri Yönetimi</h2>
        <button 
          onClick={() => setShowAlbumForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Yeni Albüm Oluştur
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Albümler Listesi */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Albümler</h3>
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : (
            <div className="space-y-3">
              {albumler.map((album) => (
                <div 
                  key={album.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedAlbum?.id === album.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedAlbum(album);
                    fetchMedyalar(album.id);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{album.baslik}</h4>
                      {album.aciklama && (
                        <p className="text-sm text-gray-600 mt-1">{album.aciklama}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          album.durum === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {album.durum === 'aktif' ? 'Aktif' : 'Pasif'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {album.gorunum_tipi}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAlbum(album);
                          setShowAlbumForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAlbum(album.id);
                        }}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {albumler.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Henüz albüm bulunmuyor.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Seçili Albümün Medyaları */}
        <div className="lg:col-span-2">
          {selectedAlbum ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{selectedAlbum.baslik}</h3>
                <button 
                  onClick={() => setShowUploadForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Medya Ekle
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {medyalar.map((medya) => (
                  <div key={medya.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {medya.dosya_tipi === 'image' ? (
                        <img 
                          src={medya.dosya_url} 
                          alt={medya.baslik || 'Galeri görseli'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500">Video</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteMedya(medya.id)}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {medya.baslik && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{medya.baslik}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {medyalar.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Bu albümde henüz medya bulunmuyor.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              Medya görüntülemek için bir albüm seçin.
            </div>
          )}
        </div>
      </div>

      {/* Albüm Ekleme/Düzenleme Formu */}
      {showAlbumForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingAlbum ? 'Albüm Düzenle' : 'Yeni Albüm Oluştur'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Albüm Adı</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingAlbum?.baslik || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea 
                  className="w-full border rounded px-3 py-2 h-20"
                  defaultValue={editingAlbum?.aciklama || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Görünüm Tipi</label>
                <select className="w-full border rounded px-3 py-2">
                  <option value="grid">Grid</option>
                  <option value="slider">Slider</option>
                  <option value="masonry">Masonry</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAlbumForm(false);
                    setEditingAlbum(null);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  {editingAlbum ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medya Yükleme Formu */}
      {showUploadForm && selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Medya Ekle</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dosya Seç</label>
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Başlık (Opsiyonel)</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama (Opsiyonel)</label>
                <textarea 
                  className="w-full border rounded px-3 py-2 h-20"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Yükle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 