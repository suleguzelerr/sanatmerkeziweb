import React from "react";

export default function IletisimPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-red-700">İletişim</h1>
      <p className="mb-6 text-lg">Bize ulaşmak için aşağıdaki iletişim bilgilerini kullanabilir veya formu doldurabilirsiniz.</p>
      <div className="bg-gray-50 rounded-lg p-6 shadow text-gray-700 mb-6">
        <div><strong>Telefon:</strong> (501) 737  52 88 </div> 
        <div><strong>E-posta:</strong> bilgi@atakum.bel.tr</div>
        <div><strong>Adres:</strong> Cumhuriyet, 37. Sk. No:5, 55200 Atakum/Samsun </div>
      </div>
      <div className="mb-8">
        <iframe
          title="Harita"
          src="https://www.google.com/maps?q=Cumhuriyet,+37.+Sk.+No:5,+55200+Atakum%2FSamsun&output=embed"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow border"
        ></iframe>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-red-700 text-center">İletişim Formu</h2>
        <form className="space-y-4 max-w-lg mx-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Adınız Soyadınız*</label>
            <input required name="ad" className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-posta*</label>
            <input required type="email" name="email" className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mesajınız*</label>
            <textarea required name="mesaj" rows={4} className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-400 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 hover:from-red-700 hover:to-orange-500 transition">Gönder</button>
        </form>
        {/* Başarı mesajı için alan */}
        {/* <div className="text-green-600 text-center mt-4">Mesajınız başarıyla gönderildi!</div> */}
      </div>
      <div className="bg-gray-50 rounded-lg p-6 shadow text-gray-500 text-center">
        İletişim formu yakında burada olacak.
      </div>   
    </section>
  );
} 