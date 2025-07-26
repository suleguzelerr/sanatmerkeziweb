# Veritabanı Kurulum Talimatları

## 📋 Gerekli Tablolar

Bu proje için aşağıdaki tablolar oluşturulacak:

### 1. **kurs_basvurulari** - Kurs Başvuruları
- Kurs başvuru formları
- Kişisel bilgiler, evrak bilgileri
- Başvuru durumu takibi

### 2. **kurslar** - Kurs Tanımları  
- Kurs bilgileri (başlık, açıklama, eğitmen)
- Kontenjan ve tarih bilgileri
- Kurs durumu

### 3. **etkinlikler** - Etkinlikler
- Etkinlik bilgileri ve tarihleri
- Katılımcı sayısı takibi
- Afiş dosyaları

### 4. **duyurular** - Duyurular
- Duyuru başlık ve içerikleri
- Yayın tarihleri
- Önem derecesi

### 5. **galeri_albumleri** - Galeri Albümleri
- Albüm başlık ve açıklamaları
- Görünüm tipi ayarları

### 6. **galeri_medyalar** - Galeri Medyaları
- Fotoğraf ve video dosyaları
- Albüm ilişkileri

### 7. **mesajlar** - İletişim Mesajları
- Ziyaretçi mesajları
- Yanıt takibi

### 8. **sayfa_icerikleri** - Sayfa İçerikleri
- Hakkımızda, iletişim sayfaları
- Sosyal medya linkleri
- Footer içerikleri

### 9. **kullanicilar** - Admin Kullanıcıları
- Admin paneli kullanıcıları
- Rol ve yetki yönetimi

## 🚀 Kurulum Adımları

### 1. Supabase Dashboard'a Giriş
1. [Supabase Dashboard](https://supabase.com/dashboard) adresine gidin
2. Projenizi seçin: `lnrflmfmgccuxgtivumi`

### 2. SQL Editor'ü Açın
1. Sol menüden **SQL Editor** seçin
2. **New Query** butonuna tıklayın

### 3. SQL Script'ini Çalıştırın
1. `database_schema.sql` dosyasının içeriğini kopyalayın
2. SQL Editor'e yapıştırın
3. **Run** butonuna tıklayın

### 4. Tabloları Kontrol Edin
1. Sol menüden **Table Editor** seçin
2. Oluşturulan tabloları kontrol edin

## 🔐 Güvenlik Ayarları

Script otomatik olarak şu güvenlik ayarlarını yapar:

- **Row Level Security (RLS)** aktif
- **Politikalar** tanımlanmış:
  - Herkes okuyabilir (kurslar, etkinlikler, duyurular)
  - Sadece admin yazabilir (tüm tablolar)
  - Herkes mesaj gönderebilir
  - Herkes kurs başvurusu yapabilir

## 📊 Örnek Veriler

Script aşağıdaki örnek verileri otomatik ekler:

- **8 adet kurs** (Fransızca, Almanca, Hasta Bakımı, vb.)
- **3 adet sayfa içeriği** (Hakkımızda, İletişim, Footer)

## ✅ Kurulum Sonrası Kontrol

Kurulum tamamlandıktan sonra:

1. **Table Editor**'de tüm tabloların görünür olduğunu kontrol edin
2. **Örnek verilerin** eklendiğini kontrol edin
3. **RLS politikalarının** aktif olduğunu kontrol edin

## 🛠️ Sorun Giderme

### Hata: "relation already exists"
- Bu normal, tablolar zaten mevcut demektir
- Script `IF NOT EXISTS` kullandığı için güvenlidir

### Hata: "permission denied"
- Supabase projenizin sahibi olduğunuzdan emin olun
- Gerekirse yeni bir proje oluşturun

### Hata: "connection failed"
- İnternet bağlantınızı kontrol edin
- Supabase servisinin çalışır durumda olduğunu kontrol edin

## 📞 Destek

Kurulum sırasında sorun yaşarsanız:
1. Supabase dokümantasyonunu kontrol edin
2. Hata mesajlarını not edin
3. Gerekirse yeni bir proje oluşturun

---

**Not:** Bu script'i çalıştırdıktan sonra projeniz tam fonksiyonel hale gelecektir. Admin panelindeki tüm modüller veritabanı ile entegre çalışacaktır. 