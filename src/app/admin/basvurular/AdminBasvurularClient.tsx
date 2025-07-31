"use client";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import type { KursBasvurusu } from '@/types/database';

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminBasvurularClient() {
  const [basvurular, setBasvurular] = useState<KursBasvurusu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBasvuru, setSelectedBasvuru] = useState<KursBasvurusu | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterDurum, setFilterDurum] = useState("");
  const [filterKurs, setFilterKurs] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBasvurular();
  }, [filterDurum, filterKurs, searchTerm]);

  const fetchBasvurular = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('kurs_basvurulari')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterDurum) {
        query = query.eq('durum', filterDurum);
      }

      if (filterKurs) {
        query = query.eq('kurs', filterKurs);
      }

      if (searchTerm) {
        query = query.or(`adsoyad.ilike.%${searchTerm}%,tc.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      console.log('Fetched applications:', data);
      setBasvurular(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
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

  const handleDetayClick = (basvuru: KursBasvurusu) => {
    setSelectedBasvuru(basvuru);
    setShowModal(true);
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Dosya indirme hatası:', error);
      alert('Dosya indirilemedi.');
    }
  };

  const printBasvuru = (basvuru: KursBasvurusu) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kurs Başvuru ve Kayıt Sözleşmesi - ${basvuru.adsoyad}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f8f9fa;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            padding: 32px;
            border: 2px solid #fecaca;
          }
          .header { 
            text-align: center; 
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 2px solid #fecaca;
          }
          .header h1 {
            font-size: 28px;
            font-weight: bold;
            color: #dc2626;
            margin: 0 0 8px 0;
          }
          .header p {
            color: #6b7280;
            margin: 0;
            font-size: 14px;
          }
          .form-section {
            margin-bottom: 24px;
          }
          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .form-group {
            margin-bottom: 16px;
          }
          .form-group.full-width {
            grid-column: 1 / -1;
          }
          .label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 4px;
          }
          .value {
            display: block;
            padding: 8px 12px;
            background-color: #f9fafb;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            color: #111827;
            min-height: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-beklemede { 
            background-color: #fef3c7; 
            color: #92400e; 
          }
          .status-onaylandi { 
            background-color: #d1fae5; 
            color: #065f46; 
          }
          .status-reddedildi { 
            background-color: #fee2e2; 
            color: #991b1b; 
          }
          .files-section {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
          }
          .files-section h3 {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
          }
          .file-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .file-item:last-child {
            border-bottom: none;
          }
          .file-name {
            font-size: 14px;
            color: #374151;
          }
          .file-url {
            font-size: 12px;
            color: #6b7280;
            word-break: break-all;
          }
          .notes-section {
            margin-top: 24px;
            padding: 16px;
            background-color: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }
          .notes-section .label {
            margin-bottom: 8px;
          }
          .notes-content {
            font-size: 14px;
            color: #374151;
            line-height: 1.5;
          }
          @media print {
            body { 
              background-color: white; 
              margin: 0; 
              padding: 0;
            }
            .container {
              box-shadow: none;
              border: none;
              border-radius: 0;
              padding: 20px;
            }
            .header {
              border-bottom: 1px solid #ccc;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Kurs Başvuru ve Kayıt Sözleşmesi</h1>
            <p>Başvuru Tarihi: ${new Date(basvuru.created_at).toLocaleDateString('tr-TR')} | Başvuru No: ${basvuru.id}</p>
          </div>
          
          <div class="form-section">
            <div class="form-grid">
              <div class="form-group">
                <label class="label">Adı Soyadı</label>
                <div class="value">${basvuru.adsoyad}</div>
              </div>
              
              <div class="form-group">
                <label class="label">TC Kimlik No</label>
                <div class="value">${basvuru.tc}</div>
              </div>
              
              <div class="form-group">
                <label class="label">Baba Adı - Anne Adı</label>
                <div class="value">${basvuru.baba_anne}</div>
              </div>
              
              <div class="form-group">
                <label class="label">Doğum Yeri</label>
                <div class="value">${basvuru.dogum_yeri}</div>
              </div>
              
              <div class="form-group">
                <label class="label">Doğum Tarihi</label>
                <div class="value">${new Date(basvuru.dogum_tarihi).toLocaleDateString('tr-TR')}</div>
              </div>
              
              <div class="form-group">
                <label class="label">Öğrenim Durumu</label>
                <div class="value">${basvuru.ogrenim}</div>
              </div>
              
              <div class="form-group full-width">
                <label class="label">Ev Adresi</label>
                <div class="value">${basvuru.adres}</div>
              </div>
              
              <div class="form-group">
                <label class="label">Tel (Cep)</label>
                <div class="value">${basvuru.tel_cep}</div>
              </div>
              
              ${basvuru.tel_ev ? `
              <div class="form-group">
                <label class="label">Tel (Ev)</label>
                <div class="value">${basvuru.tel_ev}</div>
              </div>
              ` : ''}
              
              ${basvuru.tel_is ? `
              <div class="form-group">
                <label class="label">Tel (İş)</label>
                <div class="value">${basvuru.tel_is}</div>
              </div>
              ` : ''}
              
              <div class="form-group">
                <label class="label">Kurs</label>
                <div class="value">${getKursAdi(basvuru.kurs)}</div>
              </div>
              
              <div class="form-group">
                <label class="label">Evrak Teslim Seçeneği</label>
                <div class="value">${basvuru.evrak_tipi === 'online' ? 'Online Evrak Yükleme' : 'Fiziki Evrak Teslimi'}</div>
              </div>
              
              <div class="form-group">
                <label class="label">Başvuru Durumu</label>
                <div class="value">
                  <span class="status-badge status-${basvuru.durum}">
                    ${basvuru.durum === 'onaylandi' ? 'Onaylandı' : 
                      basvuru.durum === 'reddedildi' ? 'Reddedildi' : 'Beklemede'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          ${basvuru.kimlik_dosya_url || basvuru.ogrenim_dosya_url || basvuru.diger_dosya_url ? `
          <div class="files-section">
            <h3>Yüklenen Dosyalar</h3>
            ${basvuru.kimlik_dosya_url ? `
            <div class="file-item">
              <div>
                <div class="file-name">Kimlik Fotokopisi</div>
                <div class="file-url">${basvuru.kimlik_dosya_url}</div>
              </div>
            </div>
            ` : ''}
            ${basvuru.ogrenim_dosya_url ? `
            <div class="file-item">
              <div>
                <div class="file-name">Öğrenim Belgesi</div>
                <div class="file-url">${basvuru.ogrenim_dosya_url}</div>
              </div>
            </div>
            ` : ''}
            ${basvuru.diger_dosya_url ? `
            <div class="file-item">
              <div>
                <div class="file-name">Diğer Dosya</div>
                <div class="file-url">${basvuru.diger_dosya_url}</div>
              </div>
            </div>
            ` : ''}
          </div>
          ` : ''}
          
          ${basvuru.notlar ? `
          <div class="notes-section">
            <label class="label">Notlar</label>
            <div class="notes-content">${basvuru.notlar}</div>
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getKursAdi = (kursSlug: string) => {
    const kursMap: { [key: string]: string } = {
      'fransizca-a1': 'Fransızca A1',
      'fransizca-a2': 'Fransızca A2',
      'almanca-a1': 'Almanca A1',
      'almanca-a2': 'Almanca A2',
      'hasta-yasli-bakimi': 'Hasta ve Yaşlı Bakımı',
      'isaret-dili': 'İşaret Dili',
      'cocuk-gelisimi': 'Çocuk Gelişimi',
      'cinicilik': 'Çinicilik'
    };
    return kursMap[kursSlug] || kursSlug;
  };

  const filteredBasvurular = basvurular.filter(basvuru => {
    if (filterDurum && basvuru.durum !== filterDurum) return false;
    if (filterKurs && basvuru.kurs !== filterKurs) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return basvuru.adsoyad.toLowerCase().includes(searchLower) ||
             basvuru.tc.includes(searchTerm);
    }
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Başvurular</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ad soyad veya TC ara..."
            className="border rounded px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="border rounded px-3 py-2"
            value={filterDurum}
            onChange={(e) => setFilterDurum(e.target.value)}
          >
            <option value="">Tüm Durumlar</option>
            <option value="beklemede">Beklemede</option>
            <option value="onaylandi">Onaylandı</option>
            <option value="reddedildi">Reddedildi</option>
          </select>
          <select 
            className="border rounded px-3 py-2"
            value={filterKurs}
            onChange={(e) => setFilterKurs(e.target.value)}
          >
            <option value="">Tüm Kurslar</option>
            <option value="fransizca-a1">Fransızca A1</option>
            <option value="fransizca-a2">Fransızca A2</option>
            <option value="almanca-a1">Almanca A1</option>
            <option value="almanca-a2">Almanca A2</option>
            <option value="hasta-yasli-bakimi">Hasta ve Yaşlı Bakımı</option>
            <option value="isaret-dili">İşaret Dili</option>
            <option value="cocuk-gelisimi">Çocuk Gelişimi</option>
            <option value="cinicilik">Çinicilik</option>
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
              {filteredBasvurular.map((basvuru) => (
                <tr key={basvuru.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {basvuru.adsoyad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {basvuru.tc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getKursAdi(basvuru.kurs)}
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
                        className="text-green-600 hover:text-green-900 text-xs"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => updateDurum(basvuru.id, 'reddedildi')}
                        className="text-red-600 hover:text-red-900 text-xs"
                      >
                        Reddet
                      </button>
                      <button 
                        onClick={() => handleDetayClick(basvuru)}
                        className="text-blue-600 hover:text-blue-900 text-xs"
                      >
                        Detay
                      </button>
                      <button 
                        onClick={() => printBasvuru(basvuru)}
                        className="text-purple-600 hover:text-purple-900 text-xs"
                      >
                        Yazdır
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredBasvurular.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterDurum || filterKurs ? 'Arama kriterlerine uygun başvuru bulunamadı.' : 'Henüz başvuru bulunmuyor.'}
            </div>
          )}
        </div>
      )}

      {/* Detay Modal */}
      {showModal && selectedBasvuru && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Başvuru Detayı</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Ad Soyad:</label>
                  <p>{selectedBasvuru.adsoyad}</p>
                </div>
                <div>
                  <label className="font-semibold">TC Kimlik No:</label>
                  <p>{selectedBasvuru.tc}</p>
                </div>
                <div>
                  <label className="font-semibold">Baba Adı - Anne Adı:</label>
                  <p>{selectedBasvuru.baba_anne}</p>
                </div>
                <div>
                  <label className="font-semibold">Doğum Yeri:</label>
                  <p>{selectedBasvuru.dogum_yeri}</p>
                </div>
                <div>
                  <label className="font-semibold">Doğum Tarihi:</label>
                  <p>{new Date(selectedBasvuru.dogum_tarihi).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <label className="font-semibold">Öğrenim Durumu:</label>
                  <p>{selectedBasvuru.ogrenim}</p>
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Adres:</label>
                  <p>{selectedBasvuru.adres}</p>
                </div>
                <div>
                  <label className="font-semibold">Telefon (Cep):</label>
                  <p>{selectedBasvuru.tel_cep}</p>
                </div>
                {selectedBasvuru.tel_ev && (
                  <div>
                    <label className="font-semibold">Telefon (Ev):</label>
                    <p>{selectedBasvuru.tel_ev}</p>
                  </div>
                )}
                {selectedBasvuru.tel_is && (
                  <div>
                    <label className="font-semibold">Telefon (İş):</label>
                    <p>{selectedBasvuru.tel_is}</p>
                  </div>
                )}
                <div>
                  <label className="font-semibold">Kurs:</label>
                  <p>{getKursAdi(selectedBasvuru.kurs)}</p>
                </div>
                <div>
                  <label className="font-semibold">Evrak Tipi:</label>
                  <p>{selectedBasvuru.evrak_tipi === 'online' ? 'Online Evrak Yükleme' : 'Fiziki Evrak Teslimi'}</p>
                </div>
                <div>
                  <label className="font-semibold">Durum:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedBasvuru.durum === 'onaylandi' ? 'bg-green-100 text-green-800' :
                    selectedBasvuru.durum === 'reddedildi' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedBasvuru.durum === 'onaylandi' ? 'Onaylandı' :
                     selectedBasvuru.durum === 'reddedildi' ? 'Reddedildi' : 'Beklemede'}
                  </span>
                </div>
                <div>
                  <label className="font-semibold">Başvuru Tarihi:</label>
                  <p>{new Date(selectedBasvuru.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>

              {/* Dosyalar */}
              {(selectedBasvuru.kimlik_dosya_url || selectedBasvuru.ogrenim_dosya_url || selectedBasvuru.diger_dosya_url) && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Yüklenen Dosyalar:</h4>
                  <div className="space-y-2">
                    {selectedBasvuru.kimlik_dosya_url && (
                      <div className="flex justify-between items-center">
                        <span>Kimlik Fotokopisi</span>
                        <button
                          onClick={() => downloadFile(selectedBasvuru.kimlik_dosya_url!, `kimlik_${selectedBasvuru.tc}.pdf`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          İndir
                        </button>
                      </div>
                    )}
                    {selectedBasvuru.ogrenim_dosya_url && (
                      <div className="flex justify-between items-center">
                        <span>Öğrenim Belgesi</span>
                        <button
                          onClick={() => downloadFile(selectedBasvuru.ogrenim_dosya_url!, `ogrenim_${selectedBasvuru.tc}.pdf`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          İndir
                        </button>
                      </div>
                    )}
                    {selectedBasvuru.diger_dosya_url && (
                      <div className="flex justify-between items-center">
                        <span>Diğer Dosya</span>
                        <button
                          onClick={() => downloadFile(selectedBasvuru.diger_dosya_url!, `diger_${selectedBasvuru.tc}.pdf`)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          İndir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notlar */}
              {selectedBasvuru.notlar && (
                <div className="border-t pt-4">
                  <label className="font-semibold">Notlar:</label>
                  <p className="mt-1">{selectedBasvuru.notlar}</p>
                </div>
              )}

              {/* İşlem Butonları */}
              <div className="border-t pt-4 flex gap-2">
                <button
                  onClick={() => updateDurum(selectedBasvuru.id, 'onaylandi')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Onayla
                </button>
                <button
                  onClick={() => updateDurum(selectedBasvuru.id, 'reddedildi')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reddet
                </button>
                <button
                  onClick={() => printBasvuru(selectedBasvuru)}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Yazdır
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 