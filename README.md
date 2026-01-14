# Intel İşlem Gücü Odaklı Sistem Konfigürasyonu

Bu repo, 60,000 TL bütçe ile işlem gücüne odaklanmış bir Intel sistem yapılandırması içerir.

## Dosyalar

- **intel-system-config.txt**: Detaylı sistem bileşenleri ve özellikler (metin formatı)
- **intel-system.ps1**: Sistem konfigürasyonunu görüntüleyen PowerShell scripti

## Sistem Özellikleri

### Donanım Bileşenleri

| Bileşen | Model | Fiyat | Link |
|---------|-------|-------|------|
| İşlemci | Intel Core i7-13700 (16C/24T, 5.2GHz, iGPU) | 16,800 TL | [Hepsiburada](https://www.hepsiburada.com/intel-core-i7-13700-soket-1700-30mb-onbellek-2-1-ghz-5-2-ghz-islemci-p-HBCV00003B7SLT) |
| Anakart | MSI PRO B760M-A WIFI DDR4 | 4,800 TL | [Hepsiburada](https://www.hepsiburada.com/msi-pro-b760m-a-wifi-ddr4-soket-1700-b760-ddr4-4800mhz-oc-m-2-matx-anakart-p-HBCV00003HT1PH) |
| RAM | Kingston Fury Beast 32GB DDR4 3200MHz | 2,900 TL | [Hepsiburada](https://www.hepsiburada.com/kingston-fury-beast-32gb-2x16gb-3200mhz-ddr4-ram-kf432c16bbk2-32-p-HBCV00000YOMHK) |
| Güç Kaynağı | Corsair CV650 650W 80+ Bronze | 2,200 TL | [Hepsiburada](https://www.hepsiburada.com/corsair-cv650-650w-80-bronze-psu-cp-9020236-eu-p-HBCV00000JJ2YQ) |
| Kasa | Thermaltake Versa H18 | 1,100 TL | [Hepsiburada](https://www.hepsiburada.com/thermaltake-versa-h18-usb-3-0-micro-tower-kasa-ca-1j4-00s1wn-01-p-HBV00000JHVKF) |
| SSD | Samsung 990 PRO 1TB NVMe M.2 | 4,200 TL | [Hepsiburada](https://www.hepsiburada.com/samsung-990-pro-1tb-7450mb-6900mb-s-nvme-m-2-ssd-mz-v9p1t0bw-p-HBCV00003IY82P) |
| **TOPLAM** | | **32,000 TL** | |

### Kalan Bütçe: 28,000 TL

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

✅ **Sistem Özellikleri**:

- ✅ Yüksek performanslı Intel Core i7-13700 işlemci
- ✅ 16 çekirdek, 24 thread
- ✅ 5.2 GHz'e kadar turbo hız
- ✅ Intel UHD Graphics 770 entegre grafik (monitör çıkışı için yeterli)
- ✅ 32GB DDR4 Kingston RAM
- ✅ 1TB Samsung 990 PRO ultra hızlı NVMe SSD (7450 MB/s)
- ✅ Stock Intel soğutucu (kutu ile birlikte gelir)

### Satın Alma

Tüm bileşenler için Hepsiburada linkleri yukarıdaki tabloda verilmiştir. Her bir linke tıklayarak doğrudan sepete ekleyebilirsiniz.

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
- Entegre grafik ile monitör çıkışı mevcuttur
- İsteğe bağlı olarak harici GPU eklenebilir (28,000 TL kalan bütçe)

## Lisans

Bu proje açık kaynaklıdır.
