import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bilgi Kartları */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-red-600">
          <h3 className="text-xl font-bold text-red-700 mb-2">Hizmet Saatleri</h3>
          <p className="text-lg text-gray-700">Her gün 08:30 – 22:00</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-600">
          <h3 className="text-xl font-bold text-red-700 mb-2">Lokasyon</h3>
          <p className="text-lg text-gray-700">Atakum, Samsun</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-600">
          <h3 className="text-xl font-bold text-green-700 mb-2">Kapasite</h3>
          <p className="text-lg text-gray-700">135 kişilik alan</p>
        </div>
      </section>

      {/* Hızlı Erişim Linkleri */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Hızlı Erişim</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/kayit" className="bg-red-600 text-white p-6 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 text-center">
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
