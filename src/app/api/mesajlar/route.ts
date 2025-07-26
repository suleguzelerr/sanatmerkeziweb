import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lnrflmfmgccuxgtivumi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucmZsbWZtZ2NjdXhndGl2dW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjk5NzIsImV4cCI6MjA2NzgwNTk3Mn0.G3LWMFYAAv6lFWI9TEsyDGVYyJgnr2zZHHEnk-NMP0Q";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    console.log('API endpoint called');
    
    const body = await req.json();
    console.log('Received body:', body);
    
    const { adsoyad, email, telefon, konu, mesaj } = body;

    // Validasyon
    if (!adsoyad || !email || !mesaj) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { success: false, error: 'Ad soyad, e-posta ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email validation failed');
      return NextResponse.json(
        { success: false, error: 'Geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    console.log('Attempting to insert message into database...');

    // Mesajı veritabanına kaydet - sadece temel alanlar
    const { error } = await supabase
      .from('mesajlar')
      .insert({
        adsoyad: adsoyad.trim(),
        email: email.trim(),
        telefon: telefon ? telefon.trim() : null,
        konu: konu ? konu.trim() : 'İletişim Formu',
        mesaj: mesaj.trim()
      });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: `Veritabanı hatası: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Message inserted successfully');

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi.'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
} 