-- Galeri ile ilgili tüm veritabanı tablolarını kaldırma
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. Galeri medyaları tablosunu kaldır (önce bu kaldırılmalı çünkü foreign key var)
DROP TABLE IF EXISTS galeri_medyalar CASCADE;

-- 2. Galeri albümleri tablosunu kaldır
DROP TABLE IF EXISTS galeri_albumleri CASCADE;

-- 3. Galeri ile ilgili RLS politikalarını kaldır
DROP POLICY IF EXISTS "Galeri herkese açık" ON galeri_albumleri;
DROP POLICY IF EXISTS "Galeri medyaları herkese açık" ON galeri_medyalar;
DROP POLICY IF EXISTS "Admin galeri yönetimi" ON galeri_albumleri;
DROP POLICY IF EXISTS "Admin galeri medyaları yönetimi" ON galeri_medyalar;

-- 4. Galeri ile ilgili indeksleri kaldır (varsa)
-- Not: Bu tablolar için özel indeks tanımlanmamış, sadece primary key indeksleri var

-- 5. Galeri ile ilgili trigger'ları kaldır (varsa)
-- Not: Bu tablolar için özel trigger tanımlanmamış

-- Tamamlandı mesajı
SELECT 'Galeri tabloları başarıyla kaldırıldı!' as durum; 