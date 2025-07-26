"use client";
import React, { useState } from "react";

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    adsoyad: '',
    email: '',
    telefon: '',
    konu: '',
    mesaj: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log('Gönderilen veri:', formData);

      const response = await fetch('/api/mesajlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setFormData({ adsoyad: '', email: '', telefon: '', konu: '', mesaj: '' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Bilinmeyen bir hata oluştu.' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({ type: 'error', text: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Telefon numarası formatlaması
    if (e.target.name === 'telefon') {
      // Sadece rakamları al
      const numbers = value.replace(/\D/g, '');
      
      // Türkiye telefon formatı: 05XX XXX XX XX
      if (numbers.length <= 11) {
        if (numbers.length >= 4) {
          value = numbers.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        } else if (numbers.length >= 1) {
          value = numbers.replace(/(\d{4})(\d{3})(\d{2})/, '$1 $2 $3');
        }
      } else {
        value = value.slice(0, 15); // Maksimum 15 karakter
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

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
        
        {message && (
          <div className={`mb-4 p-3 rounded text-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Adınız Soyadınız*</label>
            <input 
              required 
              name="adsoyad" 
              value={formData.adsoyad}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">E-posta*</label>
            <input 
              required 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input 
              type="tel" 
              name="telefon" 
              value={formData.telefon}
              onChange={handleChange}
              maxLength={15}
              placeholder="05XX XXX XX XX"
              className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Konu</label>
            <input 
              type="text" 
              name="konu" 
              value={formData.konu}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mesajınız*</label>
            <textarea 
              required 
              name="mesaj" 
              rows={4} 
              value={formData.mesaj}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-red-400 focus:outline-none"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-400 text-white py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 hover:from-red-700 hover:to-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </div>
    </section>
  );
} 