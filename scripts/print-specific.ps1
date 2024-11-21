# Prompt the user for up to 5 file or directory paths
Write-Host "Enter up to 5 file or directory paths (press Enter after each, or leave blank to finish):"

$filePaths = @()
for ($i = 1; $i -le 5; $i++) {
    $input = Read-Host "File/Directory Path #$i"
    if ([string]::IsNullOrWhiteSpace($input)) {
        break
    }
    $filePaths += $input
}

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

# Process each provided path
if ($filePaths.Count -eq 0) {
    Write-Host "No paths provided. Exiting..." -ForegroundColor Red
    exit
}

Write-Host "`nProcessing paths..." -ForegroundColor Cyan

foreach ($filePath in $filePaths) {
    Print-FileContent -FilePath $filePath
}

Write-Host "Done!" -ForegroundColor Cyan
