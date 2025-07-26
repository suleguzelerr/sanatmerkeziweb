-- Mesajlar tablosunu oluştur
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

-- İndeksler oluştur
CREATE INDEX IF NOT EXISTS idx_mesajlar_email ON mesajlar(email);
CREATE INDEX IF NOT EXISTS idx_mesajlar_okundu ON mesajlar(okundu);
CREATE INDEX IF NOT EXISTS idx_mesajlar_created_at ON mesajlar(created_at);

-- RLS politikaları
ALTER TABLE mesajlar ENABLE ROW LEVEL SECURITY;

-- Herkes mesaj ekleyebilir
CREATE POLICY "Herkes mesaj ekleyebilir" ON mesajlar
  FOR INSERT WITH CHECK (true);

-- Sadece admin kullanıcılar mesajları görebilir
CREATE POLICY "Admin kullanıcılar mesajları görebilir" ON mesajlar
  FOR SELECT USING (auth.role() = 'authenticated');

-- Sadece admin kullanıcılar mesajları güncelleyebilir
CREATE POLICY "Admin kullanıcılar mesajları güncelleyebilir" ON mesajlar
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Sadece admin kullanıcılar mesajları silebilir
CREATE POLICY "Admin kullanıcılar mesajları silebilir" ON mesajlar
  FOR DELETE USING (auth.role() = 'authenticated'); 