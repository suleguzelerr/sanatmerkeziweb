"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import type { Duyuru } from '@/types/database';

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DuyurularPage() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDuyurular();
  }, []);

  const fetchDuyurular = async () => {
    try {
      console.log('Fetching duyurular...');
      const { data, error } = await supabase
        .from('duyurular')
        .select('*')
        .eq('durum', 'aktif')
        .order('yayin_tarihi', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }

      console.log('Duyurular data:', data);
      setDuyurular(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOnemClass = (onem: string) => {
    switch (onem) {
      case 'yuksek':
        return 'border-l-red-500 bg-red-50';
      case 'normal':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-green-500 bg-green-50';
    }
  };

  const getOnemText = (onem: string) => {
    switch (onem) {
      case 'yuksek':
        return 'Yüksek Öncelik';
      case 'normal':
        return 'Normal';
      default:
        return 'Düşük Öncelik';
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-red-700 text-center">Duyurular & Haberler</h1>
      <p className="mb-6 text-lg text-center">Güncel duyurularımızı ve haberleri buradan takip edebilirsiniz.</p>
      
      {loading ? (
        <div className="text-center py-8">Duyurular yükleniyor...</div>
      ) : duyurular.length > 0 ? (
        <div className="space-y-6">
          {duyurular.map((duyuru) => (
            <div key={duyuru.id} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${getOnemClass(duyuru.onem_derecesi)}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{duyuru.baslik}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  duyuru.onem_derecesi === 'yuksek' ? 'bg-red-100 text-red-800' :
                  duyuru.onem_derecesi === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getOnemText(duyuru.onem_derecesi)}
                </span>
              </div>
              
              <div className="prose max-w-none text-gray-700 mb-4">
                {duyuru.icerik}
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>📅 {new Date(duyuru.yayin_tarihi).toLocaleDateString('tr-TR')}</span>
                {duyuru.son_tarih && (
                  <span>⏰ Son Tarih: {new Date(duyuru.son_tarih).toLocaleDateString('tr-TR')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 shadow text-center">
          <div className="text-4xl mb-4">📢</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz Duyuru Yok</h3>
          <p className="text-gray-500">Yakında yeni duyurular eklenecek. Takipte kalın!</p>
        </div>
      )}
    </section>
  );
} 