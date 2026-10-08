 = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.torah-laneshma.org&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&strategy=mobile'
try {
     = Invoke-WebRequest -Uri  -TimeoutSec 120 -UseBasicParsing
    [System.IO.File]::WriteAllText('C:\Users\User\.gemini\antigravity\scratch\torah-laneshma-test\pagespeed_live.json', .Content)
    Write-Host 'SUCCESS'
} catch {
     = .Exception.Message
    Write-Host  ERROR: 
}