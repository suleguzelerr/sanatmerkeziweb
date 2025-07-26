"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import type { SayfaIcerigi } from '@/types/database';

type UserWithRole = Session["user"] & { role?: string };

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminIceriklerClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [icerikler, setIcerikler] = useState<SayfaIcerigi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIcerik, setSelectedIcerik] = useState<SayfaIcerigi | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchIcerikler();
  }, [session, status, router]);

  const fetchIcerikler = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sayfa_icerikleri')
        .select('*')
        .order('sayfa_adi', { ascending: true });

      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      setIcerikler(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveIcerik = async (formData: FormData) => {
    if (!selectedIcerik) return;

    try {
      const { error } = await supabase
        .from('sayfa_icerikleri')
        .update({
          baslik: formData.get('baslik') as string,
          icerik: formData.get('icerik') as string,
          meta_aciklama: formData.get('meta_aciklama') as string,
          meta_anahtar_kelimeler: formData.get('meta_anahtar_kelimeler') as string,
          sosyal_medya_facebook: formData.get('sosyal_medya_facebook') as string,
          sosyal_medya_instagram: formData.get('sosyal_medya_instagram') as string,
          sosyal_medya_twitter: formData.get('sosyal_medya_twitter') as string,
          iletisim_telefon: formData.get('iletisim_telefon') as string,
          iletisim_email: formData.get('iletisim_email') as string,
          iletisim_adres: formData.get('iletisim_adres') as string,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedIcerik.id);

      if (error) {
        console.error('Error updating content:', error);
        return;
      }

      setShowForm(false);
      setSelectedIcerik(null);
      fetchIcerikler();
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
        <h2 className="text-2xl font-bold">Sayfa İçerikleri Yönetimi</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* İçerikler Listesi */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sayfalar</h3>
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : (
            <div className="space-y-3">
              {icerikler.map((icerik) => (
                <div 
                  key={icerik.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedIcerik?.id === icerik.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedIcerik(icerik)}
                >
                  <h4 className="font-medium text-gray-900">{icerik.sayfa_adi}</h4>
                  {icerik.baslik && (
                    <p className="text-sm text-gray-600 mt-1">{icerik.baslik}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      Son güncelleme: {new Date(icerik.updated_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
              
              {icerikler.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Henüz içerik bulunmuyor.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Seçili İçeriğin Düzenleme Formu */}
        <div>
          {selectedIcerik ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{selectedIcerik.sayfa_adi}</h3>
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Düzenle
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Başlık</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedIcerik.baslik || 'Belirtilmemiş'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">İçerik</label>
                    <div className="mt-1 text-sm text-gray-900 max-h-32 overflow-y-auto">
                      {selectedIcerik.icerik || 'İçerik bulunmuyor'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meta Açıklama</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedIcerik.meta_aciklama || 'Belirtilmemiş'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">İletişim Bilgileri</label>
                    <div className="mt-1 text-sm text-gray-900 space-y-1">
                      <p>Telefon: {selectedIcerik.iletisim_telefon || 'Belirtilmemiş'}</p>
                      <p>E-posta: {selectedIcerik.iletisim_email || 'Belirtilmemiş'}</p>
                      <p>Adres: {selectedIcerik.iletisim_adres || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              Düzenlemek için bir sayfa seçin.
            </div>
          )}
        </div>
      </div>

      {/* İçerik Düzenleme Formu */}
      {showForm && selectedIcerik && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedIcerik.sayfa_adi} - İçerik Düzenle</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              saveIcerik(new FormData(e.currentTarget));
            }} className="space-y-6">
              
              {/* Temel İçerik */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Başlık</label>
                  <input 
                    type="text" 
                    name="baslik"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={selectedIcerik.baslik || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Anahtar Kelimeler</label>
                  <input 
                    type="text" 
                    name="meta_anahtar_kelimeler"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={selectedIcerik.meta_anahtar_kelimeler || ''}
                    placeholder="virgülle ayırarak yazın"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta Açıklama</label>
                <textarea 
                  name="meta_aciklama"
                  className="w-full border rounded px-3 py-2 h-20"
                  defaultValue={selectedIcerik.meta_aciklama || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">İçerik</label>
                <textarea 
                  name="icerik"
                  className="w-full border rounded px-3 py-2 h-40"
                  defaultValue={selectedIcerik.icerik || ''}
                />
              </div>
              
              {/* Sosyal Medya */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium mb-4">Sosyal Medya</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Facebook</label>
                    <input 
                      type="url" 
                      name="sosyal_medya_facebook"
                      className="w-full border rounded px-3 py-2"
                      defaultValue={selectedIcerik.sosyal_medya_facebook || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Instagram</label>
                    <input 
                      type="url" 
                      name="sosyal_medya_instagram"
                      className="w-full border rounded px-3 py-2"
                      defaultValue={selectedIcerik.sosyal_medya_instagram || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twitter</label>
                    <input 
                      type="url" 
                      name="sosyal_medya_twitter"
                      className="w-full border rounded px-3 py-2"
                      defaultValue={selectedIcerik.sosyal_medya_twitter || ''}
                    />
                  </div>
                </div>
              </div>
              
              {/* İletişim Bilgileri */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium mb-4">İletişim Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon</label>
                    <input 
                      type="tel" 
                      name="iletisim_telefon"
                      className="w-full border rounded px-3 py-2"
                      defaultValue={selectedIcerik.iletisim_telefon || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">E-posta</label>
                    <input 
                      type="email" 
                      name="iletisim_email"
                      className="w-full border rounded px-3 py-2"
                      defaultValue={selectedIcerik.iletisim_email || ''}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Adres</label>
                  <textarea 
                    name="iletisim_adres"
                    className="w-full border rounded px-3 py-2 h-20"
                    defaultValue={selectedIcerik.iletisim_adres || ''}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 