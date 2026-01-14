# Intel İşlem Gücü Odaklı Sistem Konfigürasyonu
# Maksimum Bütçe: 60,000 TL

$MaxBudget = 60000

$SystemComponents = @{
    'İşlemci' = @{
        'Model' = 'Intel Core i7-13700F'
        'Çekirdek' = '16 Çekirdek, 24 Thread'
        'Base Clock' = '2.1 GHz'
        'Turbo Clock' = '5.2 GHz'
        'Cache' = '30MB Intel Smart Cache'
        'Soket' = 'LGA1700'
        'Fiyat' = 15500
    }
    'Anakart' = @{
        'Model' = 'MSI PRO B760M-A WIFI DDR4'
        'Chipset' = 'Intel B760'
        'Soket' = 'LGA1700'
        'RAM Desteği' = 'DDR4'
        'Fiyat' = 4800
    }
    'RAM' = @{
        'Model' = 'Corsair Vengeance LPX 32GB (2x16GB)'
        'Tip' = 'DDR4'
        'Hız' = '3200MHz'
        'CL' = '16'
        'Fiyat' = 3200
    }
    'CPU Soğutucu' = @{
        'Model' = 'Deepcool AK400'
        'Tip' = 'Kule Tipi Hava Soğutma'
        'TDP Desteği' = '220W'
        'Fiyat' = 800
    }
    'Güç Kaynağı' = @{
        'Model' = 'Corsair CV650 650W'
        'Sertifika' = '80+ Bronze'
        'Güç' = '650W'
        'Fiyat' = 2200
    }
    'Kasa' = @{
        'Model' = 'Thermaltake Versa H18'
        'Tip' = 'Micro-ATX Mini Tower'
        'Fiyat' = 1100
    }
    'SSD' = @{
        'Model' = 'Kingston NV2 500GB NVMe M.2'
        'Arayüz' = 'PCIe 4.0 x4 NVMe'
        'Okuma' = '3500 MB/s'
        'Yazma' = '2100 MB/s'
        'Fiyat' = 1400
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
    
    foreach ($key in $details.Keys | Where-Object { $_ -ne 'Fiyat' }) {
        Write-Host "  $key : $($details[$key])" -ForegroundColor White
    }
    
    Write-Host "  Fiyat: $($details['Fiyat']) TL" -ForegroundColor Green
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
Write-Host "• 32GB DDR4 RAM (çoklu görev için yeterli)"
Write-Host "• 500GB hızlı NVMe SSD"
Write-Host "• Güvenilir soğutma sistemi"
Write-Host "• 650W güç kaynağı"
Write-Host ""
Write-Host "UYARI:" -ForegroundColor Red
Write-Host "Bu sistem SADECE işlem gücüne odaklanmıştır."
Write-Host "Ekran kartı (GPU) dahil değildir."
Write-Host "Intel Core i7-13700F entegre grafik birimine sahip DEĞİLDİR."
Write-Host "Monitöre görüntü çıkışı için harici ekran kartı gerekir."
Write-Host ""

Write-Host "Alternatif: Intel Core i7-13700 (F olmayan) seçilerek" -ForegroundColor Cyan
Write-Host "entegre Intel UHD Graphics 770 kullanılabilir." -ForegroundColor Cyan
Write-Host "(+1,300 TL ek maliyet)" -ForegroundColor Cyan
