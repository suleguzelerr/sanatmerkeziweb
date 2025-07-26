// Veritabanı tabloları için TypeScript tip tanımları

export interface KursBasvurusu {
  id: number;
  adsoyad: string;
  tc: string;
  baba_anne: string;
  dogum_yeri: string;
  dogum_tarihi: string;
  ogrenim: string;
  adres: string;
  tel_cep: string;
  tel_ev?: string;
  tel_is?: string;
  kurs: string;
  evrak_tipi: 'online' | 'fiziki';
  durum: 'beklemede' | 'onaylandi' | 'reddedildi';
  kimlik_dosya_url?: string;
  ogrenim_dosya_url?: string;
  diger_dosya_url?: string;
  notlar?: string;
  created_at: string;
  updated_at: string;
}

export interface Kurs {
  id: number;
  slug: string;
  baslik: string;
  kategori: string;
  aciklama?: string;
  egitmen?: string;
  kontenjan: number;
  baslangic_tarihi?: string;
  bitis_tarihi?: string;
  gunler?: string;
  saatler?: string;
  ucret: number;
  durum: 'aktif' | 'pasif' | 'tam';
  created_at: string;
  updated_at: string;
}

export interface Etkinlik {
  id: number;
  baslik: string;
  aciklama?: string;
  tarih: string;
  saat?: string;
  yer?: string;
  kapasite?: number;
  katilimci_sayisi: number;
  afis_url?: string;
  durum: 'aktif' | 'pasif' | 'tamamlandi';
  created_at: string;
  updated_at: string;
}

export interface Duyuru {
  id: number;
  baslik: string;
  icerik: string;
  yayin_tarihi: string;
  son_tarih?: string;
  onem_derecesi: 'dusuk' | 'normal' | 'yuksek';
  durum: 'aktif' | 'pasif' | 'arsiv';
  created_at: string;
  updated_at: string;
}

export interface GaleriAlbumu {
  id: number;
  baslik: string;
  aciklama?: string;
  kapak_fotografi_url?: string;
  gorunum_tipi: 'grid' | 'slider' | 'masonry';
  durum: 'aktif' | 'pasif';
  created_at: string;
  updated_at: string;
}

export interface GaleriMedya {
  id: number;
  album_id: number;
  dosya_url: string;
  dosya_tipi: 'image' | 'video';
  baslik?: string;
  aciklama?: string;
  sira_no: number;
  created_at: string;
}

export interface Mesaj {
  id: number;
  adsoyad: string;
  email: string;
  telefon?: string;
  konu?: string;
  mesaj: string;
  durum: 'okunmadi' | 'okundu' | 'yanitlandi' | 'spam';
  yanit?: string;
  yanit_tarihi?: string;
  created_at: string;
}

export interface SayfaIcerigi {
  id: number;
  sayfa_adi: string;
  baslik?: string;
  icerik?: string;
  meta_aciklama?: string;
  meta_anahtar_kelimeler?: string;
  sosyal_medya_facebook?: string;
  sosyal_medya_instagram?: string;
  sosyal_medya_twitter?: string;
  iletisim_telefon?: string;
  iletisim_email?: string;
  iletisim_adres?: string;
  updated_at: string;
}

export interface Kullanici {
  id: number;
  email: string;
  adsoyad: string;
  sifre_hash: string;
  rol: 'admin' | 'moderator';
  durum: 'aktif' | 'pasif';
  son_giris?: string;
  created_at: string;
  updated_at: string;
}

// API yanıt tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form tipleri
export interface KursBasvuruForm {
  adsoyad: string;
  tc: string;
  babaAnne: string;
  dogumYeri: string;
  dogumTarihi: string;
  ogrenim: string;
  adres: string;
  telCep: string;
  telEv?: string;
  telIs?: string;
  kurs: string;
  evrakTipi: 'online' | 'fiziki';
}

export interface MesajForm {
  adsoyad: string;
  email: string;
  telefon?: string;
  konu?: string;
  mesaj: string;
}

// Filtre tipleri
export interface KursBasvuruFilter {
  durum?: string;
  kurs?: string;
  tarih_baslangic?: string;
  tarih_bitis?: string;
  search?: string;
}

export interface MesajFilter {
  durum?: string;
  tarih_baslangic?: string;
  tarih_bitis?: string;
  search?: string;
} 