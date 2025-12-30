# Скрипт для организации структуры проекта NX-LIB
# Запустите этот файл в PowerShell из папки 122121

Write-Host "🚀 Организация структуры проекта NX-LIB..." -ForegroundColor Cyan

# 1. Создаем папки
Write-Host "`n📁 Создание папок..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "css" -Force | Out-Null
New-Item -ItemType Directory -Path "js" -Force | Out-Null
New-Item -ItemType Directory -Path "docs" -Force | Out-Null
New-Item -ItemType Directory -Path "archive" -Force | Out-Null
Write-Host "✅ Папки созданы: css/, js/, docs/, archive/" -ForegroundColor Green

# 2. Перемещаем CSS файлы
Write-Host "`n🎨 Перемещение CSS файлов..." -ForegroundColor Yellow
Move-Item -Path "style.css" -Destination "css/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "reader-styles.css" -Destination "css/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "accessibility.css" -Destination "css/" -Force -ErrorAction SilentlyContinue
Write-Host "✅ CSS файлы перемещены в css/" -ForegroundColor Green

# 3. Перемещаем JS файлы
Write-Host "`n⚡ Перемещение JS файлов..." -ForegroundColor Yellow
Move-Item -Path "script.js" -Destination "js/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "particles.js" -Destination "js/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "reader-controls.js" -Destination "js/" -Force -ErrorAction SilentlyContinue
Write-Host "✅ JS файлы перемещены в js/" -ForegroundColor Green

# 4. Перемещаем документацию
Write-Host "`n📚 Перемещение документации..." -ForegroundColor Yellow
Move-Item -Path "*.md" -Destination "docs/" -Force -ErrorAction SilentlyContinue
Write-Host "✅ MD файлы перемещены в docs/" -ForegroundColor Green

# 5. Перемещаем старые файлы
Write-Host "`n🗄️ Архивация старых файлов..." -ForegroundColor Yellow
Move-Item -Path "script-old.js" -Destination "archive/" -Force -ErrorAction SilentlyContinue
Write-Host "✅ Старые файлы перемещены в archive/" -ForegroundColor Green

Write-Host "`n✨ Организация завершена!" -ForegroundColor Green
Write-Host "`n⚠️ ВАЖНО: Теперь нужно обновить пути в HTML файлах!" -ForegroundColor Red
Write-Host "Измените:" -ForegroundColor Yellow
Write-Host "  style.css → css/style.css" -ForegroundColor White
Write-Host "  script.js → js/script.js" -ForegroundColor White
Write-Host "  и т.д." -ForegroundColor White

Write-Host "`n📋 Структура проекта:" -ForegroundColor Cyan
tree /F /A
