"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const kursDetaylari: Record<string, { title: string; kategori: string }> = {
  "fransizca-a1": { title: "Fransızca A1", kategori: "Yabancı Dil" },
  "fransizca-a2": { title: "Fransızca A2", kategori: "Yabancı Dil" },
  "almanca-a1": { title: "Almanca A1", kategori: "Yabancı Dil" },
  "almanca-a2": { title: "Almanca A2", kategori: "Yabancı Dil" },
  "hasta-yasli-bakimi": { title: "Hasta ve Yaşlı Bakımı", kategori: "Sosyal Kültürel" },
  "isaret-dili": { title: "İşaret Dili", kategori: "Sosyal Kültürel" },
  "cocuk-gelisimi": { title: "Çocuk Gelişimi", kategori: "Sosyal Kültürel" },
  "cinicilik": { title: "Çinicilik", kategori: "Sanat Tasarımı" },
};

const sozlesmeMetni = `İş bu formu doldurmakla söz konusu kursa başvurmuş olmakla birlikte eğitimini alacağım kurs sayısı, kursun tarafıma verilip verilmeyeceği konularında Atakum Belediyesi'nin veya yetkili kıldığı kişilerin herhangi bir gerekçe belirtmeksizin bu hizmeti durdurma veya hiç vermeme hakkı olduğunu; ayrıca kontenjanın sınırlı olması nedeniyle hizmet alamamam gibi durumları peşinen kabul ederim. Bu tür bir durumda hiçbir hak ve alacak talep etmeyeceğimi gayri kabili rücu olmak koşuluyla kabul ederim. Yukarıda beyan ettiğim bilgilerin doğruluğunu onaylıyor ve yanlış, yalan bilgilerimden dolayı doğacak sorumluluğun bana ait olacağını kabul ediyorum. İş bu başvurum sırasında şahsımın başvurduğum merci ve yetkilileri tarafından hiçbir şekilde bağış, yardım, hibe vb. adlarla dahi kurs ücreti talep edilmeyeceği taahhüt edilmiştir. Kursiyerin yararlanacağı eğitim programına göre temin etmesi gereken, kursiyerin kendisi tarafından kullanılacak; defter, kitap, kalem, boya, tuval, müzik enstrümanları vb. kursiyerin temin etmesi gereken tüm ders araç ve gereçlerinin temininin kursiyerin sorumluluğunda olduğu şahsıma bildirilmiş olup, gerekenler tarafından temin edilecektir. Ayrıca kurs programını dersi başladıktan sonra yasal dayanağı olmaksızın herhangi bir gerekçeyle bırakmam, kursa devam etmemem veya yönetmeliklerde belirtilen yasal devamsızlık hakkımı aşmam nedeniyle kaydımın iptal edilmesi durumunda belediyenin kurs merkezine açacağı diğer kurs programlarına kayıt önceliğimi kaybedeceğimi ve bu vesileyle diğer tüm hak sahipleri söz konusu kurslardan yararlanıncaya kadar herhangi bir kurs talebinde bulunmayacağımı kabul ve taahhüt ederim.`;

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

export default function KursDetayPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const kurs = kursDetaylari[slug];
  const [evrakTipi, setEvrakTipi] = useState("online");
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);

  if (!kurs) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Kurs bulunamadı</h2>
        <Link href="/kurslar" className="text-red-700 underline">Kurslara Dön</Link>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-red-700">Kurs Başvuru ve Kayıt Sözleşmesi</h1>
      <form className="bg-white rounded-lg shadow p-6 mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Adı Soyadı*</label>
            <input required className="w-full border rounded px-3 py-2 mt-1" name="adsoyad" />
          </div>
          <div>
            <label className="block text-sm font-medium">TC Kimlik No*</label>
            <input required className="w-full border rounded px-3 py-2 mt-1" name="tc" maxLength={11} />
          </div>
          <div>
            <label className="block text-sm font-medium">Baba Adı - Anne Adı*</label>
            <input required className="w-full border rounded px-3 py-2 mt-1" name="babaAnne" />
          </div>
          <div>
            <label className="block text-sm font-medium">Doğum Yeri - Tarihi*</label>
            <input required className="w-full border rounded px-3 py-2 mt-1" name="dogumYeriTarihi" />
          </div>
          <div>
            <label className="block text-sm font-medium">Öğrenim Durumu*</label>
            <input required className="w-full border rounded px-3 py-2 mt-1" name="ogrenim" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Ev Adresi*</label>
            <input required className="w-full border rounded px-3 py-2 mt-1" name="adres" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tel (Cep)*</label>
            <input required className="w-full border rounded px-3 py-2 mt-1" name="telCep" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tel (Ev)</label>
            <input className="w-full border rounded px-3 py-2 mt-1" name="telEv" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tel (İş)</label>
            <input className="w-full border rounded px-3 py-2 mt-1" name="telIs" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kurs Seçimi*</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {kursGruplari.map((grup) => (
              <div key={grup.baslik}>
                <div className="font-semibold text-xs text-gray-700 mb-1">{grup.baslik}</div>
                {grup.secenekler.map((sec) => (
                  <label key={sec.value} className="flex items-center gap-2 text-sm mb-1">
                    <input type="radio" name="kurs" value={sec.value} defaultChecked={sec.value === slug} required />
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
        <button type="submit" className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition">Başvuruyu Gönder</button>
      </form>
    </section>
  );
} 