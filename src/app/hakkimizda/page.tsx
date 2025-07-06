import React from "react";

export default function HakkimizdaPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-red-700">Hakkımızda</h1>
      <p className="mb-6 text-lg">Hasan Ali Yücel Gençlik Bilim ve Sanat Merkezi, Atakum Belediyesi ile ilişkili çağdaş ve sosyal bir yapıdır.</p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Vizyonumuz</h2>
        <p className="text-gray-700">Her yaştan bireyin gelişimine katkı sağlayan, yenilikçi ve katılımcı bir merkez olmak.</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Misyonumuz</h2>
        <p className="text-gray-700">Toplumsal fayda ve bireysel gelişim için ücretsiz eğitim, kültürel etkinlik ve sosyal destek hizmetleri sunmak.</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 shadow text-gray-500 text-center">
        Ekip bilgisi yakında burada olacak.
      </div>
    </section>
  );
} 