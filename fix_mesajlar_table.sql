-- Önce mevcut mesajlar tablosunu kontrol et ve gerekirse düzelt
-- Eğer tablo yoksa oluştur
CREATE TABLE IF NOT EXISTS mesajlar (
  id SERIAL PRIMARY KEY,
  adsoyad VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefon VARCHAR(20),
  konu VARCHAR(255),
  mesaj TEXT NOT NULL,
  okundu BOOLEAN DEFAULT FALSE,
  yanitlandi BOOLEAN DEFAULT FALSE,
  yanit_metni TEXT,
  yanit_tarihi TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Eğer tablo varsa ama sütunlar eksikse ekle
DO $$ 
BEGIN
    -- okundu sütunu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesajlar' AND column_name = 'okundu') THEN
        ALTER TABLE mesajlar ADD COLUMN okundu BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- yanitlandi sütunu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesajlar' AND column_name = 'yanitlandi') THEN
        ALTER TABLE mesajlar ADD COLUMN yanitlandi BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- yanit_metni sütunu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesajlar' AND column_name = 'yanit_metni') THEN
        ALTER TABLE mesajlar ADD COLUMN yanit_metni TEXT;
    END IF;
    
    -- yanit_tarihi sütunu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesajlar' AND column_name = 'yanit_tarihi') THEN
        ALTER TABLE mesajlar ADD COLUMN yanit_tarihi TIMESTAMP;
    END IF;
    
    -- created_at sütunu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesajlar' AND column_name = 'created_at') THEN
        ALTER TABLE mesajlar ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
    END IF;
    
    -- updated_at sütunu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'mesajlar' AND column_name = 'updated_at') THEN
        ALTER TABLE mesajlar ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    END IF;
END $$;

-- İndeksler oluştur (eğer yoksa)
CREATE INDEX IF NOT EXISTS idx_mesajlar_email ON mesajlar(email);
CREATE INDEX IF NOT EXISTS idx_mesajlar_okundu ON mesajlar(okundu);
CREATE INDEX IF NOT EXISTS idx_mesajlar_created_at ON mesajlar(created_at);

-- RLS politikaları
ALTER TABLE mesajlar ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları sil (eğer varsa)
DROP POLICY IF EXISTS "Herkes mesaj ekleyebilir" ON mesajlar;
DROP POLICY IF EXISTS "Admin kullanıcılar mesajları görebilir" ON mesajlar;
DROP POLICY IF EXISTS "Admin kullanıcılar mesajları güncelleyebilir" ON mesajlar;
DROP POLICY IF EXISTS "Admin kullanıcılar mesajları silebilir" ON mesajlar;

-- Yeni politikalar oluştur
CREATE POLICY "Herkes mesaj ekleyebilir" ON mesajlar
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin kullanıcılar mesajları görebilir" ON mesajlar
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin kullanıcılar mesajları güncelleyebilir" ON mesajlar
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin kullanıcılar mesajları silebilir" ON mesajlar
  FOR DELETE USING (auth.role() = 'authenticated'); 