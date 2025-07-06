import React from "react";

export default function KutuphanePage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-red-700">Kütüphane</h1>
      <p className="mb-6 text-lg">135 kişilik konforlu alanımızda kitap ödünç alma, ücretsiz fotokopi ve test kitabı desteği sunuyoruz.</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Kitap ödünç alma: 30 gün / 2 kitap</li>
        <li>Günlük 20 sayfa ücretsiz fotokopi</li>
        <li>Ücretsiz test kitabı desteği</li>
      </ul>
    </section>
  );
} 