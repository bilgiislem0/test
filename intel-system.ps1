# Intel İşlem Gücü Odaklı Sistem Konfigürasyonu
# Maksimum Bütçe: 60,000 TL

$MaxBudget = 60000

$SystemComponents = @{
    'İşlemci' = @{
        'Model' = 'Intel Core i7-13700'
        'Entegre Grafik' = 'Intel UHD Graphics 770'
        'Çekirdek' = '16 Çekirdek, 24 Thread'
        'Base Clock' = '2.1 GHz'
        'Turbo Clock' = '5.2 GHz'
        'Cache' = '30MB Intel Smart Cache'
        'Soket' = 'LGA1700'
        'Soğutucu' = 'Stock soğutucu dahil'
        'Fiyat' = 16800
        'Link' = 'https://www.hepsiburada.com/intel-core-i7-13700-soket-1700-30mb-onbellek-2-1-ghz-5-2-ghz-islemci-p-HBCV00003B7SLT'
    }
    'Anakart' = @{
        'Model' = 'MSI PRO B760M-A WIFI DDR4'
        'Chipset' = 'Intel B760'
        'Soket' = 'LGA1700'
        'RAM Desteği' = 'DDR4'
        'Fiyat' = 4800
        'Link' = 'https://www.hepsiburada.com/msi-pro-b760m-a-wifi-ddr4-soket-1700-b760-ddr4-4800mhz-oc-m-2-matx-anakart-p-HBCV00003HT1PH'
    }
    'RAM' = @{
        'Model' = 'Kingston Fury Beast 32GB (2x16GB)'
        'Tip' = 'DDR4'
        'Hız' = '3200MHz'
        'CL' = '16'
        'Fiyat' = 2900
        'Link' = 'https://www.hepsiburada.com/kingston-fury-beast-32gb-2x16gb-3200mhz-ddr4-ram-kf432c16bbk2-32-p-HBCV00000YOMHK'
    }
    'Güç Kaynağı' = @{
        'Model' = 'Corsair CV650 650W'
        'Sertifika' = '80+ Bronze'
        'Güç' = '650W'
        'Fiyat' = 2200
        'Link' = 'https://www.hepsiburada.com/corsair-cv650-650w-80-bronze-psu-cp-9020236-eu-p-HBCV00000JJ2YQ'
    }
    'Kasa' = @{
        'Model' = 'Thermaltake Versa H18'
        'Tip' = 'Micro-ATX Mini Tower'
        'Fiyat' = 1100
        'Link' = 'https://www.hepsiburada.com/thermaltake-versa-h18-usb-3-0-micro-tower-kasa-ca-1j4-00s1wn-01-p-HBV00000JHVKF'
    }
    'SSD' = @{
        'Model' = 'Samsung 990 PRO 1TB NVMe M.2'
        'Arayüz' = 'PCIe 4.0 x4 NVMe'
        'Okuma' = '7450 MB/s'
        'Yazma' = '6900 MB/s'
        'Fiyat' = 4200
        'Link' = 'https://www.hepsiburada.com/samsung-990-pro-1tb-7450mb-6900mb-s-nvme-m-2-ssd-mz-v9p1t0bw-p-HBCV00003IY82P'
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INTEL İŞLEM GÜCÜ ODAKLI SİSTEM" -ForegroundColor Yellow
Write-Host "Maksimum Bütçe: $MaxBudget TL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$TotalCost = 0

foreach ($component in $SystemComponents.Keys | Sort-Object) {
    $details = $SystemComponents[$component]
    Write-Host "$component :" -ForegroundColor Yellow
    
    foreach ($key in $details.Keys | Where-Object { $_ -ne 'Fiyat' -and $_ -ne 'Link' }) {
        Write-Host "  $key : $($details[$key])" -ForegroundColor White
    }
    
    Write-Host "  Fiyat: $($details['Fiyat']) TL" -ForegroundColor Green
    if ($details.ContainsKey('Link')) {
        Write-Host "  Link: $($details['Link'])" -ForegroundColor Cyan
    }
    Write-Host ""
    
    $TotalCost += $details['Fiyat']
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TOPLAM MALİYET: $TotalCost TL" -ForegroundColor Magenta
Write-Host "KALAN BÜTÇE: $($MaxBudget - $TotalCost) TL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($TotalCost -le $MaxBudget) {
    Write-Host "✓ Sistem bütçe içinde!" -ForegroundColor Green
} else {
    Write-Host "✗ Sistem bütçeyi aşıyor!" -ForegroundColor Red
}

Write-Host ""
Write-Host "SİSTEM ÖZELLİKLERİ:" -ForegroundColor Yellow
Write-Host "• 16 Çekirdek, 24 Thread ile yüksek işlem gücü"
Write-Host "• 5.2 GHz'e kadar turbo hız"
Write-Host "• Intel UHD Graphics 770 entegre grafik (monitör çıkışı için yeterli)"
Write-Host "• 32GB DDR4 Kingston RAM (çoklu görev için yeterli)"
Write-Host "• 1TB Samsung 990 PRO ultra hızlı NVMe SSD (7450 MB/s okuma)"
Write-Host "• Stock Intel soğutucu (kutu ile birlikte gelir)"
Write-Host "• 650W güç kaynağı"
Write-Host ""
Write-Host "NOT:" -ForegroundColor Green
Write-Host "✓ Entegre grafik ile monitör çıkışı mevcuttur"
Write-Host "✓ Stock soğutucu normal kullanım için yeterlidir"
Write-Host "✓ Tüm parçalar için satın alma linkleri verilmiştir"
Write-Host "✓ Kalan bütçe ile isteğe bağlı ekran kartı eklenebilir"
