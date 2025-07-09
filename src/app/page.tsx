'use client';

import Link from "next/link";
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

export default function Home() {
  const [formAcik, setFormAcik] = useState(false);
  const [seciliKurs, setSeciliKurs] = useState("");
  const [evrakTipi, setEvrakTipi] = useState("online");
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Bilgi Kartları */}
      <section className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 mb-12 justify-center place-items-center">
        <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-red-600">
          <h3 className="text-xl font-bold text-red-700 mb-2">Hizmet Saatleri</h3>
          <p className="text-lg text-gray-700">Her gün 08:30 – 22:00</p>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-blue-600">
          <h3 className="text-xl font-bold text-red-700 mb-2">Lokasyon</h3>
          <p className="text-lg text-gray-700">Atakum, Samsun</p>
        </div>
      </section>

      {/* Hızlı Erişim Linkleri */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Hızlı Erişim</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/kayit" className="bg-red-600 text-white p-6 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 text-center w-full">
            <div className="text-2xl font-bold mb-2">📝</div>
            <div className="font-semibold">Kayıt</div>
          </Link>
          <Link href="/kurslar" className="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-center">
            <div className="text-2xl font-bold mb-2">🎨</div>
            <div className="font-semibold">Kurslar</div>
          </Link>
          <Link href="/kutuphane" className="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 text-center">
            <div className="text-2xl font-bold mb-2">📚</div>
            <div className="font-semibold">Kütüphane</div>
          </Link>
          <Link href="/etkinlikler" className="bg-purple-600 text-white p-6 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 text-center">
            <div className="text-2xl font-bold mb-2">🎭</div>
            <div className="font-semibold">Etkinlikler</div>
          </Link>
          <Link href="/duyurular" className="bg-orange-600 text-white p-6 rounded-lg shadow-lg hover:bg-orange-700 transition duration-300 text-center">
            <div className="text-2xl font-bold mb-2">📢</div>
            <div className="font-semibold">Duyurular</div>
          </Link>
          <Link href="/hakkimizda" className="bg-teal-600 text-white p-6 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300 text-center">
            <div className="text-2xl font-bold mb-2">ℹ️</div>
            <div className="font-semibold">Hakkımızda</div>
          </Link>
          <Link href="/wifi" className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 text-center">
            <div className="text-2xl font-bold mb-2">📶</div>
            <div className="font-semibold">WiFi</div>
          </Link>
          <Link href="/iletisim" className="bg-gray-600 text-white p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 text-center">
            <div className="text-2xl font-bold mb-2">📞</div>
            <div className="font-semibold">İletişim</div>
          </Link>
        </div>
      </section>

      {/* Ek Hizmetler */}
      <section className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Ek Hizmetler</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🧺</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Kuru Temizleme</h3>
              <p className="text-gray-600">Profesyonel kuru temizleme hizmeti</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-3xl">💳</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">AtaKart</h3>
              <p className="text-gray-600">AtaKart ile kolay ödeme</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
