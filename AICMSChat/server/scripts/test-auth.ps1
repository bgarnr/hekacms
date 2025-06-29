param(
  [string]$Email,
  [string]$Password
)

if (-not $Email) {
  $Email = Read-Host "Email"
}
if (-not $Password) {
  $PasswordSecure = Read-Host "Password" -AsSecureString
  $Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($PasswordSecure))
}

$body = @{ email = $Email; password = $Password } | ConvertTo-Json

try {
  Write-Host "`nLogging in as $Email ..." -ForegroundColor Cyan
  $login = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login `
           -ContentType 'application/json' -Body $body
  $access = $login.accessToken
  if (-not $access) { throw "Login failed - no accessToken returned." }
  Write-Host "Login succeeded. Access token acquired." -ForegroundColor Green
  Write-Host "Token (first 20 chars): $($access.Substring(0, [Math]::Min(20, $access.Length)))..." -ForegroundColor Yellow
  Write-Host "User role: $($login.role)" -ForegroundColor Yellow

  Write-Host "`nCalling admin ping ..." -ForegroundColor Cyan
  Write-Host "Authorization header: Bearer $($access.Substring(0, [Math]::Min(20, $access.Length)))..." -ForegroundColor Yellow
  
  try {
    $resp = Invoke-RestMethod -Uri http://localhost:3000/api/admin/ping `
             -Headers @{ Authorization = "Bearer $access" }
    Write-Host "Admin ping response:" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 3 | Write-Host
  } catch {
    Write-Host "Admin ping failed with status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Response content: $($_.Exception.Response | ConvertTo-Json -Depth 2)" -ForegroundColor Red
    throw $_
  }
} catch {
  Write-Error $_
} 