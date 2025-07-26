"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import { createClient } from '@supabase/supabase-js';
import type { Mesaj } from '@/types/database';

type UserWithRole = Session["user"] & { role?: string };

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminMesajlarClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMesaj, setSelectedMesaj] = useState<Mesaj | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchMesajlar();
  }, [session, status, router]);

  const fetchMesajlar = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mesajlar')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMesajlar(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMesaj = async (id: number) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('mesajlar')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting message:', error);
        return;
      }

      fetchMesajlar();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('mesajlar')
        .update({ okundu: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking as read:', error);
        return;
      }

      fetchMesajlar();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendReply = async () => {
    if (!selectedMesaj || !replyText.trim()) return;

    try {
      // Burada gerçek bir e-posta gönderme sistemi entegre edilebilir
      // Şimdilik sadece mesajı güncelleyelim
      const { error } = await supabase
        .from('mesajlar')
        .update({ 
          yanitlandi: true,
          yanit_metni: replyText,
          yanit_tarihi: new Date().toISOString()
        })
        .eq('id', selectedMesaj.id);

      if (error) {
        console.error('Error sending reply:', error);
        return;
      }

      setShowReplyForm(false);
      setReplyText('');
      setSelectedMesaj(null);
      fetchMesajlar();
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
        <h2 className="text-2xl font-bold">Mesajlar</h2>
        <div className="text-sm text-gray-600">
          Toplam: {mesajlar.length} | Okunmamış: {mesajlar.filter(m => !m.okundu).length}
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
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konu
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
              {mesajlar.map((mesaj) => (
                <tr key={mesaj.id} className={`hover:bg-gray-50 ${!mesaj.okundu ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mesaj.okundu ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mesaj.okundu ? 'Okundu' : 'Yeni'}
                      </span>
                      {mesaj.yanitlandi && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Yanıtlandı
                        </span>
                      )}
                    </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                     {mesaj.adsoyad}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {mesaj.email}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mesaj.konu}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(mesaj.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMesaj(mesaj)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Görüntüle
                      </button>
                      {!mesaj.okundu && (
                        <button
                          onClick={() => markAsRead(mesaj.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Okundu
                        </button>
                      )}
                      {!mesaj.yanitlandi && (
                        <button
                          onClick={() => {
                            setSelectedMesaj(mesaj);
                            setShowReplyForm(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Yanıtla
                        </button>
                      )}
                      <button
                        onClick={() => deleteMesaj(mesaj.id)}
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
          
          {mesajlar.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Henüz mesaj bulunmuyor.
            </div>
          )}
        </div>
      )}

      {/* Mesaj Detay Modal */}
      {selectedMesaj && !showReplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Mesaj Detayı</h3>
              <button 
                onClick={() => setSelectedMesaj(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                                 <div>
                   <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                   <p className="mt-1 text-sm text-gray-900">{selectedMesaj.adsoyad}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">E-posta</label>
                   <p className="mt-1 text-sm text-gray-900">{selectedMesaj.email}</p>
                 </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMesaj.telefon || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tarih</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedMesaj.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Konu</label>
                <p className="mt-1 text-sm text-gray-900">{selectedMesaj.konu}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mesaj</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedMesaj.mesaj}</p>
              </div>

              {selectedMesaj.yanitlandi && selectedMesaj.yanit_metni && (
                <div className="bg-gray-50 p-4 rounded">
                  <label className="block text-sm font-medium text-gray-700">Yanıt</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedMesaj.yanit_metni}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Yanıt Tarihi: {selectedMesaj.yanit_tarihi ? new Date(selectedMesaj.yanit_tarihi).toLocaleString('tr-TR') : '-'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button 
                onClick={() => setSelectedMesaj(null)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Kapat
              </button>
              {!selectedMesaj.yanitlandi && (
                <button 
                  onClick={() => setShowReplyForm(true)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Yanıtla
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Yanıt Formu Modal */}
      {showReplyForm && selectedMesaj && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Yanıt Gönder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Alıcı</label>
                                 <p className="text-sm text-gray-600">{selectedMesaj.adsoyad} ({selectedMesaj.email})</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yanıt</label>
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-32"
                  placeholder="Yanıtınızı yazın..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button 
                  onClick={sendReply}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 