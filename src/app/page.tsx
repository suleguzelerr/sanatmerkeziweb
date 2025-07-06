import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <section className="w-full max-w-3xl px-4 py-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-red-700">
          Hasan Ali Yücel Gençlik Bilim ve Sanat Merkezi
        </h1>
        <p className="mb-6 text-lg md:text-xl">
          Atakum Belediyesi bünyesinde faaliyet gösteren, her yaştan bireyin faydalanabileceği çağdaş, katılımcı ve sosyal bir merkez.
        </p>
        <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <span className="block font-semibold text-red-700">Hizmet Saatleri</span>
            <span className="text-gray-700">Her gün 08:30 – 22:00</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <span className="block font-semibold text-gray-800">Lokasyon</span>
            <span className="text-gray-600">Atakum, Samsun</span>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <span className="block font-semibold text-gray-800">Kapasite</span>
            <span className="text-gray-600">135 kişilik alan</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/kayit" className="px-6 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 transition">Kayıt</Link>
          <Link href="/kurslar" className="px-6 py-2 bg-white text-red-600 border border-red-600 rounded shadow-sm hover:bg-red-50 transition">Kurslar</Link>
          <Link href="/kutuphane" className="px-6 py-2 bg-gray-100 text-gray-800 rounded shadow-sm hover:bg-gray-200 transition">Kütüphane</Link>
          <Link href="/etkinlikler" className="px-6 py-2 bg-white text-gray-800 rounded shadow-sm hover:bg-gray-100 transition">Etkinlikler</Link>
          <Link href="/duyurular" className="px-6 py-2 bg-gray-100 text-red-700 rounded shadow-sm hover:bg-gray-200 transition">Duyurular</Link>
          <Link href="/hakkimizda" className="px-6 py-2 bg-white text-gray-800 rounded shadow-sm hover:bg-gray-100 transition">Hakkımızda</Link>
          <Link href="/wifi" className="px-6 py-2 bg-gray-100 text-gray-800 rounded shadow-sm hover:bg-gray-200 transition">WiFi</Link>
          <Link href="/iletisim" className="px-6 py-2 bg-white text-gray-800 rounded shadow-sm hover:bg-gray-100 transition">İletişim</Link>
        </div>
      </section>
    </main>
  );
}
