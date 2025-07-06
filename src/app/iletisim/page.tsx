import React from "react";

export default function IletisimPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-blue-700">İletişim</h1>
      <p className="mb-6 text-lg">Bize ulaşmak için aşağıdaki iletişim bilgilerini kullanabilir veya formu doldurabilirsiniz.</p>
      <div className="bg-gray-50 rounded-lg p-6 shadow text-gray-700 mb-6">
        <div><strong>Telefon:</strong> (xxx) xxx xx xx</div>
        <div><strong>E-posta:</strong> info@atakum.bel.tr</div>
        <div><strong>Adres:</strong> Atakum, Samsun</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 shadow text-gray-500 text-center">
        İletişim formu yakında burada olacak.
      </div>
    </section>
  );
} 