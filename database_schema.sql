-- Sanat Merkezi Web Sitesi Veritabanı Şeması
-- Supabase PostgreSQL

-- 1. Kurs Başvuruları Tablosu
CREATE TABLE IF NOT EXISTS kurs_basvurulari (
    id SERIAL PRIMARY KEY,
    adsoyad VARCHAR(100) NOT NULL,
    tc VARCHAR(11) NOT NULL UNIQUE,
    baba_anne VARCHAR(100) NOT NULL,
    dogum_yeri VARCHAR(50) NOT NULL,
    dogum_tarihi DATE NOT NULL,
    ogrenim VARCHAR(50) NOT NULL,
    adres TEXT NOT NULL,
    tel_cep VARCHAR(15) NOT NULL,
    tel_ev VARCHAR(15),
    tel_is VARCHAR(15),
    kurs VARCHAR(50) NOT NULL,
    evrak_tipi VARCHAR(20) NOT NULL, -- 'online' veya 'fiziki'
    durum VARCHAR(20) DEFAULT 'beklemede', -- 'beklemede', 'onaylandi', 'reddedildi'
    kimlik_dosya_url TEXT,
    ogrenim_dosya_url TEXT,
    diger_dosya_url TEXT,
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Kurslar Tablosu
CREATE TABLE IF NOT EXISTS kurslar (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    baslik VARCHAR(100) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    aciklama TEXT,
    egitmen VARCHAR(100),
    kontenjan INTEGER DEFAULT 20,
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    gunler VARCHAR(100), -- 'Pazartesi, Çarşamba'
    saatler VARCHAR(100), -- '14:00-16:00'
    ucret DECIMAL(10,2) DEFAULT 0,
    durum VARCHAR(20) DEFAULT 'aktif', -- 'aktif', 'pasif', 'tam'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Etkinlikler Tablosu
CREATE TABLE IF NOT EXISTS etkinlikler (
    id SERIAL PRIMARY KEY,
    baslik VARCHAR(200) NOT NULL,
    aciklama TEXT,
    tarih DATE NOT NULL,
    saat VARCHAR(20),
    yer VARCHAR(100),
    kapasite INTEGER,
    katilimci_sayisi INTEGER DEFAULT 0,
    afis_url TEXT,
    durum VARCHAR(20) DEFAULT 'aktif', -- 'aktif', 'pasif', 'tamamlandi'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Duyurular Tablosu
CREATE TABLE IF NOT EXISTS duyurular (
    id SERIAL PRIMARY KEY,
    baslik VARCHAR(200) NOT NULL,
    icerik TEXT NOT NULL,
    yayin_tarihi DATE NOT NULL,
    son_tarih DATE,
    onem_derecesi VARCHAR(20) DEFAULT 'normal', -- 'dusuk', 'normal', 'yuksek'
    durum VARCHAR(20) DEFAULT 'aktif', -- 'aktif', 'pasif', 'arsiv'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Galeri Albümleri Tablosu
CREATE TABLE IF NOT EXISTS galeri_albumleri (
    id SERIAL PRIMARY KEY,
    baslik VARCHAR(200) NOT NULL,
    aciklama TEXT,
    kapak_fotografi_url TEXT,
    gorunum_tipi VARCHAR(20) DEFAULT 'grid', -- 'grid', 'slider', 'masonry'
    durum VARCHAR(20) DEFAULT 'aktif', -- 'aktif', 'pasif'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Galeri Medyaları Tablosu
CREATE TABLE IF NOT EXISTS galeri_medyalar (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES galeri_albumleri(id) ON DELETE CASCADE,
    dosya_url TEXT NOT NULL,
    dosya_tipi VARCHAR(20) NOT NULL, -- 'image', 'video'
    baslik VARCHAR(200),
    aciklama TEXT,
    sira_no INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Mesajlar Tablosu
CREATE TABLE IF NOT EXISTS mesajlar (
    id SERIAL PRIMARY KEY,
    adsoyad VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefon VARCHAR(15),
    konu VARCHAR(200),
    mesaj TEXT NOT NULL,
    durum VARCHAR(20) DEFAULT 'okunmadi', -- 'okunmadi', 'okundu', 'yanitlandi', 'spam'
    yanit TEXT,
    yanit_tarihi TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Sayfa İçerikleri Tablosu
CREATE TABLE IF NOT EXISTS sayfa_icerikleri (
    id SERIAL PRIMARY KEY,
    sayfa_adi VARCHAR(50) UNIQUE NOT NULL, -- 'hakkimizda', 'iletisim', 'footer'
    baslik VARCHAR(200),
    icerik TEXT,
    meta_aciklama TEXT,
    meta_anahtar_kelimeler TEXT,
    sosyal_medya_facebook VARCHAR(200),
    sosyal_medya_instagram VARCHAR(200),
    sosyal_medya_twitter VARCHAR(200),
    iletisim_telefon VARCHAR(15),
    iletisim_email VARCHAR(100),
    iletisim_adres TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Kullanıcılar Tablosu (Admin kullanıcıları için)
CREATE TABLE IF NOT EXISTS kullanicilar (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    adsoyad VARCHAR(100) NOT NULL,
    sifre_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'admin', -- 'admin', 'moderator'
    durum VARCHAR(20) DEFAULT 'aktif', -- 'aktif', 'pasif'
    son_giris TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_kurs_basvurulari_tc ON kurs_basvurulari(tc);
CREATE INDEX IF NOT EXISTS idx_kurs_basvurulari_durum ON kurs_basvurulari(durum);
CREATE INDEX IF NOT EXISTS idx_kurs_basvurulari_created_at ON kurs_basvurulari(created_at);
CREATE INDEX IF NOT EXISTS idx_kurslar_slug ON kurslar(slug);
CREATE INDEX IF NOT EXISTS idx_kurslar_kategori ON kurslar(kategori);
CREATE INDEX IF NOT EXISTS idx_etkinlikler_tarih ON etkinlikler(tarih);
CREATE INDEX IF NOT EXISTS idx_duyurular_yayin_tarihi ON duyurular(yayin_tarihi);
CREATE INDEX IF NOT EXISTS idx_mesajlar_durum ON mesajlar(durum);
CREATE INDEX IF NOT EXISTS idx_mesajlar_created_at ON mesajlar(created_at);

-- Örnek veriler
INSERT INTO kurslar (slug, baslik, kategori, aciklama, egitmen, kontenjan) VALUES
('fransizca-a1', 'Fransızca A1', 'Yabancı Dil', 'Temel Fransızca seviyesi', 'Marie Dubois', 15),
('fransizca-a2', 'Fransızca A2', 'Yabancı Dil', 'Orta seviye Fransızca', 'Marie Dubois', 15),
('almanca-a1', 'Almanca A1', 'Yabancı Dil', 'Temel Almanca seviyesi', 'Hans Mueller', 15),
('almanca-a2', 'Almanca A2', 'Yabancı Dil', 'Orta seviye Almanca', 'Hans Mueller', 15),
('hasta-yasli-bakimi', 'Hasta ve Yaşlı Bakımı', 'Sosyal Kültürel', 'Profesyonel hasta bakım eğitimi', 'Dr. Ayşe Yılmaz', 20),
('isaret-dili', 'İşaret Dili', 'Sosyal Kültürel', 'Türk İşaret Dili eğitimi', 'Mehmet Kaya', 25),
('cocuk-gelisimi', 'Çocuk Gelişimi', 'Sosyal Kültürel', 'Çocuk gelişimi ve eğitimi', 'Fatma Demir', 20),
('cinicilik', 'Çinicilik', 'Sanat Tasarımı', 'Geleneksel çinicilik sanatı', 'Osman Usta', 12);

-- Sayfa içerikleri için örnek veriler
INSERT INTO sayfa_icerikleri (sayfa_adi, baslik, icerik, meta_aciklama) VALUES
('hakkimizda', 'Hakkımızda', 'Atakum Belediyesi Sanat Merkezi, vatandaşlarımıza kaliteli eğitim ve kültür hizmetleri sunmak amacıyla kurulmuştur.', 'Atakum Belediyesi Sanat Merkezi hakkında bilgi'),
('iletisim', 'İletişim', 'Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.', 'Atakum Belediyesi Sanat Merkezi iletişim bilgileri'),
('footer', 'Footer', '© 2024 Atakum Belediyesi Sanat Merkezi. Tüm hakları saklıdır.', 'Footer içeriği');

-- RLS (Row Level Security) Politikaları
ALTER TABLE kurs_basvurulari ENABLE ROW LEVEL SECURITY;
ALTER TABLE kurslar ENABLE ROW LEVEL SECURITY;
ALTER TABLE etkinlikler ENABLE ROW LEVEL SECURITY;
ALTER TABLE duyurular ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri_albumleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri_medyalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesajlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE sayfa_icerikleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE kullanicilar ENABLE ROW LEVEL SECURITY;

-- Genel okuma politikaları (herkes okuyabilir)
CREATE POLICY "Kurslar herkese açık" ON kurslar FOR SELECT USING (true);
CREATE POLICY "Etkinlikler herkese açık" ON etkinlikler FOR SELECT USING (true);
CREATE POLICY "Duyurular herkese açık" ON duyurular FOR SELECT USING (true);
CREATE POLICY "Galeri herkese açık" ON galeri_albumleri FOR SELECT USING (true);
CREATE POLICY "Galeri medyaları herkese açık" ON galeri_medyalar FOR SELECT USING (true);
CREATE POLICY "Sayfa içerikleri herkese açık" ON sayfa_icerikleri FOR SELECT USING (true);

-- Admin yazma politikaları (sadece admin yazabilir)
CREATE POLICY "Admin kurs başvuruları yönetimi" ON kurs_basvurulari FOR ALL USING (true);
CREATE POLICY "Admin kurslar yönetimi" ON kurslar FOR ALL USING (true);
CREATE POLICY "Admin etkinlikler yönetimi" ON etkinlikler FOR ALL USING (true);
CREATE POLICY "Admin duyurular yönetimi" ON duyurular FOR ALL USING (true);
CREATE POLICY "Admin galeri yönetimi" ON galeri_albumleri FOR ALL USING (true);
CREATE POLICY "Admin galeri medyaları yönetimi" ON galeri_medyalar FOR ALL USING (true);
CREATE POLICY "Admin mesajlar yönetimi" ON mesajlar FOR ALL USING (true);
CREATE POLICY "Admin sayfa içerikleri yönetimi" ON sayfa_icerikleri FOR ALL USING (true);
CREATE POLICY "Admin kullanıcılar yönetimi" ON kullanicilar FOR ALL USING (true);

-- Mesajlar için herkes yazabilir
CREATE POLICY "Herkes mesaj gönderebilir" ON mesajlar FOR INSERT WITH CHECK (true);
CREATE POLICY "Mesajlar okunabilir" ON mesajlar FOR SELECT USING (true);

-- Kurs başvuruları için herkes yazabilir
CREATE POLICY "Herkes kurs başvurusu yapabilir" ON kurs_basvurulari FOR INSERT WITH CHECK (true);
CREATE POLICY "Kurs başvuruları okunabilir" ON kurs_basvurulari FOR SELECT USING (true); 