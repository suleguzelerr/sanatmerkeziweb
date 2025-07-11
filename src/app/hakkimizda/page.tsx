import React from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function HakkimizdaPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-400 to-yellow-400 drop-shadow">Hakkımızda</h1>
      <div className="space-y-4 text-lg">
        <p className="indent-8">
          Hasan Ali Yücel Gençlik Bilim ve Sanat Merkezi, Atakum Belediyesi bünyesinde faaliyet gösteren, her yaştan bireyin <span className="font-semibold text-orange-600">ücretsiz</span> olarak faydalanabileceği çağdaş ve çok yönlü bir yaşam, eğitim ve kültür merkezidir.
        </p>
        <p className="indent-8">
          Merkezimiz, sabah <span className="font-semibold text-red-600">08:30</span>&apos;dan akşam <span className="font-semibold text-red-600">22:00</span>&apos;ye kadar hizmet vererek; öğrencilere, sanatseverlere, araştırmacılara ve her yaştan ziyaretçiye bilim, sanat, eğitim ve sosyal imkanları bir arada sunar.
        </p>
        <p className="indent-8">
          <span className="font-semibold text-orange-600">135 kişilik</span> konforlu oturma kapasitesine sahip kütüphanemiz, zengin arşivi ve sessiz çalışma ortamıyla hem ders çalışanlar hem de kitap tutkunları için ideal bir alandır. Ayrıca ödünç kitap hizmeti, ücretsiz fotokopi ve sınavlara hazırlanan gençler için test kitapları desteği sağlanmaktadır.
        </p>
        <p className="indent-8">
          Merkezimizde sunulan <span className="font-semibold text-orange-600">MEB onaylı ücretsiz meslek kursları</span>, farklı yaş gruplarına hitap etmekte ve istihdam olanaklarını artırmayı hedeflemektedir. Kursları başarıyla tamamlayan katılımcılar, sertifikalarına <span className="font-semibold text-red-600">e-Devlet</span> üzerinden erişebilir.
        </p>
        <p className="indent-8">
          Sergi ve konferans salonumuz, sanatçılara ev sahipliği yaparken; eğitim, seminer ve topluluk etkinlikleri için ücretsiz olarak hizmete sunulmaktadır. Ayrıca Atakum’da yaşayan üniversite öğrencilerine özel olarak <span className="font-semibold text-orange-600">ücretsiz çamaşırhane</span> hizmeti sunulmaktadır.
        </p>
        <p className="indent-8">
          Tüm alanlarımızda <span className="font-semibold text-orange-600">kesintisiz ve hızlı WiFi</span> internet erişimi, ziyaretçilere dijital dünyaya kolayca bağlanma imkânı tanır.
        </p>
        <p className="indent-8">
          <span className="font-semibold text-red-600">Genç Atakart</span> uygulamamız ile Atakum’da ikamet eden öğrenciler; restoranlar, sosyal tesisler ve çeşitli etkinliklerde özel indirim ve avantajlardan faydalanabilir.
        </p>
        <p className="indent-8">
          Ayrıca sosyal destek anlayışımızla hayata geçirdiğimiz <span className="font-semibold text-orange-600">Kent Lokantası</span>, hem bütçe dostu hem de lezzetli yemek seçenekleriyle halkımıza hizmet vermektedir.
        </p>
        <p className="indent-8 mb-8">
          <span className="font-semibold text-orange-600">Hasan Ali Yücel Gençlik Bilim ve Sanat Merkezi</span> olarak, bilgiye erişimin, sanatın, dayanışmanın ve eğitimin herkes için ulaşılabilir olduğu bir toplum inşa etmeyi amaçlıyoruz.
        </p>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-center text-red-700 flex items-center justify-center gap-2">
          <span> Sosyal Medyada Bizi Takip Edin </span>
          <span className="text-2xl">🚀</span>
        </h2>
        <ul className="flex flex-wrap justify-center gap-6 text-lg">
          <li className="flex items-center gap-2">
            <FaInstagram className="text-pink-500 text-2xl" />
            <span className="font-semibold">Instagram:</span> <span className="text-blue-600 underline">@hasanaliyucelgenclikmerkezi</span>
          </li>
          <li className="flex items-center gap-2">
            <FaFacebook className="text-blue-700 text-2xl" />
            <span className="font-semibold">Facebook:</span> <span className="text-blue-600 underline">Hasan Ali Yücel Gençlik Bilim ve Sanat Merkezi</span>
          </li>
        </ul>
      </div>
    </section>
  );
} 