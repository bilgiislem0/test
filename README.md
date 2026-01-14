# Intel İşlem Gücü Odaklı Sistem Konfigürasyonu

Bu repo, 60,000 TL bütçe ile işlem gücüne odaklanmış bir Intel sistem yapılandırması içerir.

## Dosyalar

- **intel-system-config.txt**: Detaylı sistem bileşenleri ve özellikler (metin formatı)
- **intel-system.ps1**: Sistem konfigürasyonunu görüntüleyen PowerShell scripti
- **run.ps1**: Sistem dil ayarları için mevcut script

## Sistem Özellikleri

### Donanım Bileşenleri

| Bileşen | Model | Fiyat |
|---------|-------|-------|
| İşlemci | Intel Core i7-13700F (16C/24T, 5.2GHz Turbo) | 15,500 TL |
| Anakart | MSI PRO B760M-A WIFI DDR4 | 4,800 TL |
| RAM | Corsair Vengeance LPX 32GB DDR4 3200MHz | 3,200 TL |
| CPU Soğutucu | Deepcool AK400 | 800 TL |
| Güç Kaynağı | Corsair CV650 650W 80+ Bronze | 2,200 TL |
| Kasa | Thermaltake Versa H18 | 1,100 TL |
| SSD | Kingston NV2 500GB NVMe M.2 | 1,400 TL |
| **TOPLAM** | | **29,000 TL** |

### Kalan Bütçe: 31,000 TL

## Kullanım

PowerShell scriptini çalıştırmak için:

```powershell
.\intel-system.ps1
```

Veya metin dosyasını görüntülemek için:

```bash
cat intel-system-config.txt
```

## Önemli Notlar

⚠️ **Dikkat**: Bu sistem yapılandırması SADECE işlem gücüne odaklanmıştır:

- ✅ Yüksek performanslı Intel Core i7-13700F işlemci
- ✅ 16 çekirdek, 24 thread
- ✅ 5.2 GHz'e kadar turbo hız
- ✅ 32GB DDR4 RAM
- ✅ 500GB hızlı NVMe SSD
- ❌ Ekran kartı (GPU) dahil değildir

### Grafik Çözümü Seçenekleri

1. **Harici GPU Ekleme**: Kalan 31,000 TL bütçe ile uygun bir ekran kartı eklenebilir
2. **Alternatif İşlemci**: Intel Core i7-13700 (F olmayan, +1,300 TL) seçilerek entegre Intel UHD Graphics 770 kullanılabilir

## İdeal Kullanım Alanları

- Yoğun hesaplama işlemleri
- Video rendering ve encoding
- 3D modelleme ve simülasyon
- Yazılım geliştirme ve derleme
- Sanal makine çalıştırma
- Veri analizi ve işleme
- Yoğun çoklu görev (multitasking)

## Sistem Gereksinimleri

- Windows 10/11 Pro 64-bit (Önerilen)
- Monitör çıkışı için harici GPU veya F olmayan işlemci modeli gereklidir

## Lisans

Bu proje açık kaynaklıdır.
