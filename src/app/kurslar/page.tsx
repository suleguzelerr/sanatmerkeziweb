"use client";

import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import type { Kurs } from '@/types/database';

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sozlesmeMetni = `İş bu formu doldurmakla söz konusu kursa başvurmuş olmakla birlikte eğitimini alacağım kurs sayısı, kursun tarafıma verilip verilmeyeceği konularında Atakum Belediyesi'nin veya yetkili kıldığı kişilerin herhangi bir gerekçe belirtmeksizin bu hizmeti durdurma veya hiç vermeme hakkı olduğunu; ayrıca kontenjanın sınırlı olması nedeniyle hizmet alamamam gibi durumları peşinen kabul ederim. Bu tür bir durumda hiçbir hak ve alacak talep etmeyeceğimi gayri kabili rücu olmak koşuluyla kabul ederim. Yukarıda beyan ettiğim bilgilerin doğruluğunu onaylıyor ve yanlış, yalan bilgilerimden dolayı doğacak sorumluluğun bana ait olacağını kabul ediyorum. İş bu başvurum sırasında şahsımın başvurduğum merci ve yetkilileri tarafından hiçbir şekilde bağış, yardım, hibe vb. adlarla dahi kurs ücreti talep edilmeyeceği taahhüt edilmiştir. Kursiyerin yararlanacağı eğitim programına göre temin etmesi gereken, kursiyerin kendisi tarafından kullanılacak; defter, kitap, kalem, boya, tuval, müzik enstrümanları vb. kursiyerin temin etmesi gereken tüm ders araç ve gereçlerinin temininin kursiyerin sorumluluğunda olduğu şahsıma bildirilmiş olup, gerekenler tarafından temin edilecektir. Ayrıca kurs programını dersi başladıktan sonra yasal dayanağı olmaksızın herhangi bir gerekçeyle bırakmam, kursa devam etmemem veya yönetmeliklerde belirtilen yasal devamsızlık hakkımı aşmam nedeniyle kaydımın iptal edilmesi durumunda belediyenin kurs merkezine açacağı diğer kurs programlarına kayıt önceliğimi kaybedeceğimi ve bu vesileyle diğer tüm hak sahipleri söz konusu kurslardan yararlanıncaya kadar herhangi bir kurs talebinde bulunmayacağımı kabul ve taahhüt ederim.`;

export default function KurslarPage() {
  const [kurslar, setKurslar] = useState<Kurs[]>([]);
  const [loading, setLoading] = useState(true);
  const [seciliKurs, setSeciliKurs] = useState<string>("");
  const [evrakTipi, setEvrakTipi] = useState("online");
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);
  const [formAcik, setFormAcik] = useState(false);

  useEffect(() => {
    fetchKurslar();
  }, []);

  const fetchKurslar = async () => {
    try {
      const { data, error } = await supabase
        .from('kurslar')
        .select('*')
        .eq('durum', 'aktif')
        .order('kategori', { ascending: true });

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

  // Kursları kategorilere göre grupla
  const kursGruplari = kurslar.reduce((groups: Record<string, Array<{value: string, label: string, kurs: typeof kurslar[0]}>>, kurs) => {
    const kategori = kurs.kategori;
    if (!groups[kategori]) {
      groups[kategori] = [];
    }
    groups[kategori].push({
      value: kurs.slug,
      label: kurs.baslik,
      kurs: kurs
    });
    return groups;
  }, {});

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-red-700 text-center drop-shadow">Kurslar</h1>
      <p className="mb-6 text-lg text-center">MEB sertifikalı, dönemsel ve ücretsiz kurslarımız hakkında bilgi alın ve başvuru yapın.</p>
      <div className="flex justify-center mb-10">
        {!formAcik ? (
          <button
            className="bg-gradient-to-r from-red-600 to-orange-400 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 hover:from-red-700 hover:to-orange-500 transition text-xl border-4 border-white"
            onClick={() => setFormAcik((a) => !a)}
            type="button"
          >
            Kurs Başvuru ve Kayıt Sözleşmesi
          </button>
        ) : (
          <div className="w-full max-w-2xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-red-700 text-center">Kurs Başvuru ve Kayıt Sözleşmesi</h2>
            <form className="bg-white rounded-2xl shadow-2xl p-8 space-y-4 border-2 border-red-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Adı Soyadı*</label>
                  <input required className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="adsoyad" />
                </div>
                <div>
                  <label className="block text-sm font-medium">TC Kimlik No*</label>
                  <input required className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="tc" maxLength={11} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Baba Adı - Anne Adı*</label>
                  <input required className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="babaAnne" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Doğum Yeri*</label>
                  <input required className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="dogumYeri" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Doğum Tarihi*</label>
                  <input required type="date" className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="dogumTarihi" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Öğrenim Durumu*</label>
                  <input required className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="ogrenim" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium">Ev Adresi*</label>
                  <input required className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="adres" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tel (Cep)*</label>
                  <input required className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="telCep" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tel (Ev)</label>
                  <input className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="telEv" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tel (İş)</label>
                  <input className="w-full border-2 border-gray-200 rounded px-3 py-2 mt-1 focus:border-red-400 focus:outline-none" name="telIs" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kurs Seçimi*</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.entries(kursGruplari).map(([kategori, secenekler]: [string, Array<{value: string, label: string, kurs: typeof kurslar[0]}>]) => (
                    <div key={kategori}>
                      <div className={`font-semibold text-xs mb-1 px-2 py-1 rounded bg-red-100 text-red-800 border-red-500`}>{kategori}</div>
                      {secenekler.map((sec: {value: string, label: string, kurs: typeof kurslar[0]}) => (
                        <label key={sec.value} className="flex items-center gap-2 text-sm mb-1">
                          <input
                            type="radio"
                            name="kurs"
                            value={sec.value}
                            checked={seciliKurs === sec.value}
                            onChange={() => setSeciliKurs(sec.value)}
                            required
                          />
                          {sec.label}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Evrak Teslim Seçeneği*</label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="evrakTipi" value="online" checked={evrakTipi === "online"} onChange={() => setEvrakTipi("online")}/>
                    Online Evrak Yükleme
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="evrakTipi" value="fiziki" checked={evrakTipi === "fiziki"} onChange={() => setEvrakTipi("fiziki")}/>
                    Fiziki Evrak Teslimi
                  </label>
                </div>
                {evrakTipi === "online" && (
                  <div className="space-y-2">
                    <label className="block text-sm">Kimlik Fotokopisi (PDF/JPG) <span className="text-red-600">*</span>
                      <input required type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" name="kimlik" />
                    </label>
                    <label className="block text-sm">Öğrenim Belgesi <span className="text-red-600">*</span>
                      <input required type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" name="ogrenimBelgesi" />
                    </label>
                    <label className="block text-sm">Diğer (Opsiyonel)
                      <input type="file" className="block mt-1" name="diger" />
                    </label>
                  </div>
                )}
              </div>
              <div className="bg-gray-100 rounded p-4 text-xs text-gray-700 whitespace-pre-line border border-gray-300">
                {sozlesmeMetni}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" required checked={sozlesmeOnay} onChange={e => setSozlesmeOnay(e.target.checked)} />
                <span className="text-sm">Yukarıdaki sözleşme metnini okudum, kabul ediyorum.</span>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-400 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 hover:from-red-700 hover:to-orange-500 transition">Başvuruyu Gönder</button>
            </form>
            <div className="flex justify-center mt-4">
              <button className="text-red-600 underline" type="button" onClick={() => setFormAcik(false)}>
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <div className="text-center py-8">Kurslar yükleniyor...</div>
      ) : (
        <div className="space-y-10 mb-12">
          {Object.entries(kursGruplari).map(([kategori, secenekler]: [string, Array<{value: string, label: string, kurs: typeof kurslar[0]}>]) => (
            <div key={kategori}>
              <h2 className="text-xl font-bold mb-4 px-4 py-2 rounded shadow inline-block border-l-8 bg-red-100 text-red-800 border-red-500">{kategori}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {secenekler.map((kurs: {value: string, label: string, kurs: typeof kurslar[0]}) => (
                  <div key={kurs.value} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-2 border-gray-100 hover:border-red-400 transition">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">🎓</span>
                      <h3 className="text-lg font-bold text-gray-800 mb-1 tracking-wide uppercase">{kurs.label}</h3>
                      {kurs.kurs.egitmen && (
                        <p className="text-sm text-gray-600">Eğitmen: {kurs.kurs.egitmen}</p>
                      )}
                      {kurs.kurs.kontenjan && (
                        <p className="text-sm text-gray-600">Kontenjan: {kurs.kurs.kontenjan}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 