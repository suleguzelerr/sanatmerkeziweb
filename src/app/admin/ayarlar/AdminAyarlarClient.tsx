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

export default function AdminAyarlarClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [siteAyarlari, setSiteAyarlari] = useState<SayfaIcerigi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as UserWithRole)?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    
    fetchSiteAyarlari();
  }, [session, status, router]);

  const fetchSiteAyarlari = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sayfa_icerikleri')
        .select('*')
        .eq('sayfa_adi', 'site_ayarlari')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching site settings:', error);
        return;
      }

      setSiteAyarlari(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAyarlar = async (formData: FormData) => {
    setSaving(true);
    try {
      const ayarlarData = {
        sayfa_adi: 'site_ayarlari',
        baslik: formData.get('site_baslik') as string,
        meta_aciklama: formData.get('meta_aciklama') as string,
        meta_anahtar_kelimeler: formData.get('meta_anahtar_kelimeler') as string,
        iletisim_telefon: formData.get('iletisim_telefon') as string,
        iletisim_email: formData.get('iletisim_email') as string,
        iletisim_adres: formData.get('iletisim_adres') as string,
        sosyal_medya_facebook: formData.get('sosyal_medya_facebook') as string,
        sosyal_medya_instagram: formData.get('sosyal_medya_instagram') as string,
        sosyal_medya_twitter: formData.get('sosyal_medya_twitter') as string,
        updated_at: new Date().toISOString()
      };

      let result;
      if (siteAyarlari) {
        // Güncelle
        result = await supabase
          .from('sayfa_icerikleri')
          .update(ayarlarData)
          .eq('id', siteAyarlari.id);
      } else {
        // Yeni oluştur
        result = await supabase
          .from('sayfa_icerikleri')
          .insert(ayarlarData);
      }

      if (result.error) {
        console.error('Error saving settings:', result.error);
        return;
      }

      fetchSiteAyarlari();
      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !session || (session.user as UserWithRole)?.role !== "admin") {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Site Ayarları</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <form onSubmit={(e) => {
            e.preventDefault();
            saveAyarlar(new FormData(e.currentTarget));
          }} className="space-y-8">
            
            {/* Genel Site Ayarları */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Genel Site Ayarları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Başlığı</label>
                  <input 
                    type="text" 
                    name="site_baslik"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={siteAyarlari?.baslik || ''}
                    placeholder="Sanat Merkezi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Anahtar Kelimeler</label>
                  <input 
                    type="text" 
                    name="meta_anahtar_kelimeler"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={siteAyarlari?.meta_anahtar_kelimeler || ''}
                    placeholder="sanat, kurs, eğitim, merkez"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Meta Açıklama</label>
                <textarea 
                  name="meta_aciklama"
                  className="w-full border rounded px-3 py-2 h-20"
                  defaultValue={siteAyarlari?.meta_aciklama || ''}
                  placeholder="Site açıklaması..."
                />
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <input 
                    type="tel" 
                    name="iletisim_telefon"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={siteAyarlari?.iletisim_telefon || ''}
                    placeholder="+90 555 123 45 67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">E-posta</label>
                  <input 
                    type="email" 
                    name="iletisim_email"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={siteAyarlari?.iletisim_email || ''}
                    placeholder="info@sanatmerkezi.com"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Adres</label>
                <textarea 
                  name="iletisim_adres"
                  className="w-full border rounded px-3 py-2 h-20"
                  defaultValue={siteAyarlari?.iletisim_adres || ''}
                  placeholder="Tam adres bilgisi..."
                />
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Facebook</label>
                  <input 
                    type="url" 
                    name="sosyal_medya_facebook"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={siteAyarlari?.sosyal_medya_facebook || ''}
                    placeholder="https://facebook.com/sanatmerkezi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram</label>
                  <input 
                    type="url" 
                    name="sosyal_medya_instagram"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={siteAyarlari?.sosyal_medya_instagram || ''}
                    placeholder="https://instagram.com/sanatmerkezi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Twitter</label>
                  <input 
                    type="url" 
                    name="sosyal_medya_twitter"
                    className="w-full border rounded px-3 py-2"
                    defaultValue={siteAyarlari?.sosyal_medya_twitter || ''}
                    placeholder="https://twitter.com/sanatmerkezi"
                  />
                </div>
              </div>
            </div>

            {/* Kaydet Butonu */}
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 