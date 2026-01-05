# PowerShell Script to Test API
# Usage: .\scripts\test-api.ps1

$baseUrl = "http://localhost:3000"
$token = ""

Write-Host "=== Sports Degens API Test Script ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    Write-Host "   ✅ Health Check: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Health Check Failed: $_" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 2: Register User
Write-Host "2. Registering User..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Method POST -Uri "$baseUrl/api/auth/register" `
        -ContentType "application/json" -Body $registerBody -UseBasicParsing
    Write-Host "   ✅ User Registered: $($response.StatusCode)" -ForegroundColor Green
    $registerData = $response.Content | ConvertFrom-Json
    Write-Host "   User ID: $($registerData.data.user.id)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   ⚠️  User might already exist (this is OK)" -ForegroundColor Yellow
    } else {
        Write-Host "   ❌ Registration Failed: $_" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Login
Write-Host "3. Logging In..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Method POST -Uri "$baseUrl/api/auth/login" `
        -ContentType "application/json" -Body $loginBody -UseBasicParsing
    Write-Host "   ✅ Login Successful: $($response.StatusCode)" -ForegroundColor Green
    $loginData = $response.Content | ConvertFrom-Json
    $token = $loginData.data.token
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Login Failed: $_" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 4: Get Sports (Protected Route)
Write-Host "4. Testing Protected Route (Get Sports)..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/sports-tools/sports" `
        -Headers $headers -UseBasicParsing
    Write-Host "   ✅ Get Sports: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response received (check if tools access is enabled)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ⚠️  Tools Access Required (403)" -ForegroundColor Yellow
        Write-Host "   This is expected if user doesn't have tools access yet" -ForegroundColor Gray
    } elseif ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ❌ Unauthorized (401) - Token might be invalid" -ForegroundColor Red
    } else {
        Write-Host "   ❌ Request Failed: $_" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "=== Tests Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check server logs for any errors" -ForegroundColor White
Write-Host "2. To enable tools access, implement Stripe subscription" -ForegroundColor White
Write-Host "3. Or manually set hasToolsAccess in MongoDB for testing" -ForegroundColor White

