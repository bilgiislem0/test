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
        'Tahmini Fiyat' = '16,000-18,000 TL'
    }
    'Anakart' = @{
        'Model' = 'MSI PRO B760M-A WIFI DDR4'
        'Chipset' = 'Intel B760'
        'Soket' = 'LGA1700'
        'RAM Desteği' = 'DDR4'
        'Tahmini Fiyat' = '4,500-5,500 TL'
    }
    'RAM' = @{
        'Model' = 'Kingston Fury Beast 32GB (2x16GB)'
        'Tip' = 'DDR4'
        'Hız' = '3200MHz'
        'CL' = '16'
        'Tahmini Fiyat' = '2,500-3,500 TL'
    }
    'Güç Kaynağı' = @{
        'Model' = 'Corsair CV650 650W'
        'Sertifika' = '80+ Bronze'
        'Güç' = '650W'
        'Tahmini Fiyat' = '2,000-2,500 TL'
    }
    'Kasa' = @{
        'Model' = 'Thermaltake Versa H18'
        'Tip' = 'Micro-ATX Mini Tower'
        'Tahmini Fiyat' = '1,000-1,500 TL'
    }
    'SSD' = @{
        'Model' = 'Samsung 990 PRO 1TB NVMe M.2'
        'Arayüz' = 'PCIe 4.0 x4 NVMe'
        'Okuma' = '7450 MB/s'
        'Yazma' = '6900 MB/s'
        'Tahmini Fiyat' = '3,800-4,800 TL'
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INTEL İŞLEM GÜCÜ ODAKLI SİSTEM" -ForegroundColor Yellow
Write-Host "Maksimum Bütçe: $MaxBudget TL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($component in $SystemComponents.Keys | Sort-Object) {
    $details = $SystemComponents[$component]
    Write-Host "$component :" -ForegroundColor Yellow
    
    foreach ($key in $details.Keys) {
        Write-Host "  $key : $($details[$key])" -ForegroundColor White
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TAHMİNİ MALİYET: 29,800-36,800 TL" -ForegroundColor Magenta
Write-Host "BÜTÇE HEDEFİ: 60,000 TL içinde" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  ÖNEMLİ UYARI:" -ForegroundColor Yellow
Write-Host "Yukarıdaki fiyatlar tahminidir ve değişkenlik gösterebilir." -ForegroundColor White
Write-Host "Güncel fiyatları kontrol etmek için aşağıdaki sitelerde arama yapın:" -ForegroundColor White
Write-Host ""
Write-Host "• Hepsiburada.com" -ForegroundColor Cyan
Write-Host "• Trendyol.com" -ForegroundColor Cyan
Write-Host "• N11.com" -ForegroundColor Cyan
Write-Host "• Vatan Bilgisayar" -ForegroundColor Cyan
Write-Host "• İtopya" -ForegroundColor Cyan
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
Write-Host "SATIN ALMA ÖNERİSİ:" -ForegroundColor Green
Write-Host "1. Her bileşenin model numarasını tam olarak arayın"
Write-Host "2. Fiyatları karşılaştırın ve en uygun olanı seçin"
Write-Host "3. Satıcı yorumlarını ve garanti koşullarını kontrol edin"
Write-Host "4. Kampanyaları takip edin"
