# Simple Render deployment script
Write-Host "🚀 Preparing for Render.com deployment..." -ForegroundColor Cyan

# 1. Go to root folder
cd "C:\Users\Dell\OneDrive\Desktop\portfolio\wanderway-travels-main\wanderway-travels-main"
Write-Host "📁 Current folder: $(pwd)" -ForegroundColor Green

# 2. Create render.yaml
Write-Host "📝 Creating render.yaml..." -ForegroundColor Yellow
$renderYaml = @'
services:
  - type: web
    name: wanderway-travels
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: gunicorn backend.app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.9.13
      - key: FLASK_ENV
        value: production
      - key: FLASK_DEBUG
        value: false
'@
$renderYaml | Out-File -FilePath "render.yaml" -Encoding UTF8
Write-Host "✅ Created render.yaml" -ForegroundColor Green

# 3. Update Procfile
Write-Host "📝 Updating Procfile..." -ForegroundColor Yellow
"web: gunicorn backend.app:app" | Out-File -FilePath "Procfile" -Encoding UTF8
Write-Host "✅ Updated Procfile" -ForegroundColor Green

# 4. Check app.py
Write-Host "🔍 Checking app.py..." -ForegroundColor Yellow
cd backend
$appContent = Get-Content app.py -Raw

# Check if PORT handling exists
if ($appContent -notmatch "os.environ.get.*PORT") {
    Write-Host "⚠️ Adding PORT handling to app.py..." -ForegroundColor Yellow
    
    # Append PORT handling
    @"

if __name__ == '__main__':
    # Render uses port 10000 by default
    port = int(os.environ.get('PORT', 10000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f'🚀 Starting WanderWay Travels on port {port}')
    print(f'🔧 Debug mode: {debug}')
    
    app.run(host='0.0.0.0', port=port, debug=debug)
"@ | Out-File -FilePath app.py -Encoding UTF8 -Append
    
    Write-Host "✅ Added PORT handling to app.py" -ForegroundColor Green
} else {
    Write-Host "✅ app.py already has PORT handling" -ForegroundColor Green
}

# 5. Go back and commit
cd ..
Write-Host "📤 Committing changes..." -ForegroundColor Cyan
git add .
git commit -m "Deploy to Render.com"
git push origin main

Write-Host "`n🎉 SUCCESS!" -ForegroundColor Green
Write-Host "✅ Files prepared for Render" -ForegroundColor Green
Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green
Write-Host "`n🚀 NOW DEPLOY ON RENDER.COM:" -ForegroundColor Cyan
Write-Host "1. Go to: https://render.com" -ForegroundColor Yellow
Write-Host "2. Sign up with GitHub" -ForegroundColor Yellow
Write-Host "3. Click 'New +' → 'Web Service'" -ForegroundColor Yellow
Write-Host "4. Connect your GitHub repository" -ForegroundColor Yellow
Write-Host "5. Render will auto-detect your settings!" -ForegroundColor Yellow
Write-Host "6. Your site will be: https://wanderway-travels.onrender.com" -ForegroundColor Green