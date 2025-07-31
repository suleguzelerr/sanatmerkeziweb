import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Beklenen alanlar: adsoyad, tc, babaAnne, dogumYeri, dogumTarihi, ogrenim, adres, telCep, telEv, telIs, kurs, evrakTipi, kimlikDosyaUrl, ogrenimDosyaUrl, digerDosyaUrl
    const { 
      adsoyad, 
      tc, 
      babaAnne, 
      dogumYeri, 
      dogumTarihi, 
      ogrenim, 
      adres, 
      telCep, 
      telEv, 
      telIs, 
      kurs, 
      evrakTipi,
      kimlikDosyaUrl,
      ogrenimDosyaUrl,
      digerDosyaUrl
    } = data;

    // Basit validasyon
    if (!adsoyad || !tc || !babaAnne || !dogumYeri || !dogumTarihi || !ogrenim || !adres || !telCep || !kurs || !evrakTipi) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }

    // TC kimlik numarası kontrolü
    if (tc.length !== 11 || !/^\d+$/.test(tc)) {
      return NextResponse.json({ error: 'Geçersiz TC kimlik numarası.' }, { status: 400 });
    }

    // Aynı TC ile daha önce başvuru yapılıp yapılmadığını kontrol et
    const { data: existingApplication } = await supabase
      .from('kurs_basvurulari')
      .select('id')
      .eq('tc', tc)
      .single();

    if (existingApplication) {
      return NextResponse.json({ error: 'Bu TC kimlik numarası ile daha önce başvuru yapılmış.' }, { status: 400 });
    }

    // Supabase'e kayıt
    const { data: inserted, error } = await supabase
      .from('kurs_basvurulari')
      .insert([
        {
          adsoyad,
          tc,
          baba_anne: babaAnne,
          dogum_yeri: dogumYeri,
          dogum_tarihi: dogumTarihi,
          ogrenim,
          adres,
          tel_cep: telCep,
          tel_ev: telEv,
          tel_is: telIs,
          kurs,
          evrak_tipi: evrakTipi,
          kimlik_dosya_url: kimlikDosyaUrl,
          ogrenim_dosya_url: ogrenimDosyaUrl,
          diger_dosya_url: digerDosyaUrl,
          durum: 'beklemede',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Veritabanı hatası.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Başvurunuz başarıyla alındı.',
      data: inserted 
    }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
} 