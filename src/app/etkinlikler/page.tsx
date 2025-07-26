"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import type { Etkinlik } from '@/types/database';

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EtkinliklerPage() {
  const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEtkinlikler();
  }, []);

  const fetchEtkinlikler = async () => {
    try {
      console.log('Fetching etkinlikler...');
      const { data, error } = await supabase
        .from('etkinlikler')
        .select('*')
        .eq('durum', 'aktif')
        .order('tarih', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      console.log('Etkinlikler data:', data);
      setEtkinlikler(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-red-700 text-center">Etkinlikler & Sergiler</h1>
      <p className="mb-6 text-lg text-center">Konser, seminer, söyleşi ve sergilerimizi buradan takip edebilirsiniz.</p>
      
      {loading ? (
        <div className="text-center py-8">Etkinlikler yükleniyor...</div>
      ) : etkinlikler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etkinlikler.map((etkinlik) => (
            <div key={etkinlik.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {etkinlik.afis_url && (
                <div className="h-48 bg-gray-200">
                  <img 
                    src={etkinlik.afis_url} 
                    alt={etkinlik.baslik}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{etkinlik.baslik}</h3>
                {etkinlik.aciklama && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{etkinlik.aciklama}</p>
                )}
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📅</span>
                    <span>{new Date(etkinlik.tarih).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {etkinlik.saat && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">🕒</span>
                      <span>{etkinlik.saat}</span>
                    </div>
                  )}
                  {etkinlik.yer && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">📍</span>
                      <span>{etkinlik.yer}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">👥</span>
                    <span>{etkinlik.katilimci_sayisi} / {etkinlik.kapasite || '∞'} katılımcı</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 shadow text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz Etkinlik Yok</h3>
          <p className="text-gray-500">Yakında yeni etkinlikler eklenecek. Takipte kalın!</p>
        </div>
      )}
    </section>
  );
} 