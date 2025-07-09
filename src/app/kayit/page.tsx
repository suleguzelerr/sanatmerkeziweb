"use client";
import React, { useState } from "react";

const kursGruplari = [
  {
    baslik: "Yabancı Dil",
    secenekler: [
      { value: "fransizca-a1", label: "Fransızca A1" },
      { value: "fransizca-a2", label: "Fransızca A2" },
      { value: "almanca-a1", label: "Almanca A1" },
      { value: "almanca-a2", label: "Almanca A2" },
    ],
  },
  {
    baslik: "Sosyal Kültürel",
    secenekler: [
      { value: "hasta-yasli-bakimi", label: "Hasta ve Yaşlı Bakımı" },
      { value: "isaret-dili", label: "İşaret Dili" },
      { value: "cocuk-gelisimi", label: "Çocuk Gelişimi" },
    ],
  },
  {
    baslik: "Sanat Tasarımı",
    secenekler: [
      { value: "cinicilik", label: "Çinicilik" },
    ],
  },
];

const sozlesmeMetni = `İş bu formu doldurmakla söz konusu kursa başvurmuş olmakla birlikte eğitimini alacağım kurs sayısı, kursun tarafıma verilip verilmeyeceği konularında Atakum Belediyesi'nin veya yetkili kıldığı kişilerin herhangi bir gerekçe belirtmeksizin bu hizmeti durdurma veya hiç vermeme hakkı olduğunu; ayrıca kontenjanın sınırlı olması nedeniyle hizmet alamamam gibi durumları peşinen kabul ederim. Bu tür bir durumda hiçbir hak ve alacak talep etmeyeceğimi gayri kabili rücu olmak koşuluyla kabul ederim. Yukarıda beyan ettiğim bilgilerin doğruluğunu onaylıyor ve yanlış, yalan bilgilerimden dolayı doğacak sorumluluğun bana ait olacağını kabul ediyorum. İş bu başvurum sırasında şahsımın başvurduğum merci ve yetkilileri tarafından hiçbir şekilde bağış, yardım, hibe vb. adlarla dahi kurs ücreti talep edilmeyeceği taahhüt edilmiştir. Kursiyerin yararlanacağı eğitim programına göre temin etmesi gereken, kursiyerin kendisi tarafından kullanılacak; defter, kitap, kalem, boya, tuval, müzik enstrümanları vb. kursiyerin temin etmesi gereken tüm ders araç ve gereçlerinin temininin kursiyerin sorumluluğunda olduğu şahsıma bildirilmiş olup, gerekenler tarafından temin edilecektir. Ayrıca kurs programını dersi başladıktan sonra yasal dayanağı olmaksızın herhangi bir gerekçeyle bırakmam, kursa devam etmemem veya yönetmeliklerde belirtilen yasal devamsızlık hakkımı aşmam nedeniyle kaydımın iptal edilmesi durumunda belediyenin kurs merkezine açacağı diğer kurs programlarına kayıt önceliğimi kaybedeceğimi ve bu vesileyle diğer tüm hak sahipleri söz konusu kurslardan yararlanıncaya kadar herhangi bir kurs talebinde bulunmayacağımı kabul ve taahhüt ederim.`;

export default function KayitPage() {
  const [seciliKurs, setSeciliKurs] = useState("");
  const [evrakTipi, setEvrakTipi] = useState("online");
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-red-700 text-center">Kurs Başvuru ve Kayıt Sözleşmesi</h1>
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
            {kursGruplari.map((grup) => (
              <div key={grup.baslik}>
                <div className="font-semibold text-xs mb-1 px-2 py-1 rounded bg-red-100 text-red-800 border-red-500">{grup.baslik}</div>
                {grup.secenekler.map((sec) => (
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
    </section>
  );
} 