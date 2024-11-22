# Run the script by executing:
# .\print-servers.ps1

# Predefined list of file or directory paths
$filePaths = @(
    "C:\Users\Eli\Desktop\app3\api\routes",
    "C:\Users\Eli\Desktop\app3\api\services",
    "C:\Users\Eli\Desktop\app3\api\.env",
    "C:\Users\Eli\Desktop\app3\api\index.js",
    "C:\Users\Eli\Desktop\app3\api\package.json",
    "C:\Users\Eli\Desktop\app3\vercel.json",
    "C:\Users\Eli\Desktop\app3\.env.development",
    "C:\Users\Eli\Desktop\app3\.env.production",
    "C:\Users\Eli\Desktop\app3\src\App.jsx"
)

# Function to process files and print their contents
function Print-FileContent {
    param (
        [string]$FilePath
    )

    if (Test-Path $FilePath) {
        if ((Get-Item $FilePath).PSIsContainer) {
            # If it's a directory, iterate through its files
            Write-Host "`nDirectory: $FilePath" -ForegroundColor Cyan
            Get-ChildItem -Path $FilePath -File | ForEach-Object {
                Write-Host "File: $($_.FullName)" -ForegroundColor Yellow
                Write-Host "Content:" -ForegroundColor Green
                Get-Content -Path $_.FullName | ForEach-Object { Write-Host $_ }
                Write-Host "`n"
            }
        } else {
            # If it's a file, print its content
            Write-Host "`nFile: $FilePath" -ForegroundColor Yellow
            Write-Host "Content:" -ForegroundColor Green
            Get-Content -Path $FilePath | ForEach-Object { Write-Host $_ }
            Write-Host "`n"
        }
    } else {
        Write-Host "Path not found: $FilePath" -ForegroundColor Red
    }
}

# Process each predefined path
if ($filePaths.Count -eq 0) {
    Write-Host "No paths provided. Exiting..." -ForegroundColor Red
    exit
}

Write-Host "`nProcessing paths..." -ForegroundColor Cyan

foreach ($filePath in $filePaths) {
    Print-FileContent -FilePath $filePath
}

Write-Host "Done!" -ForegroundColor Cyan
