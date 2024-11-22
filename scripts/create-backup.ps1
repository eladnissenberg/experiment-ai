# Get current timestamp in a file friendly format

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

# Set source and the destination paths
$sourceDir = "C:\Users\Eli\Desktop\app3"
$backupRoot = "C:\Users\Eli\Desktop\backups"
$backupDir = Join-Path $backupRoot "backup_$timestamp"

# Create backup root directory if it doesn't exist
if (-not (Test-Path $backupRoot)) {
   New-Item -ItemType Directory -Path $backupRoot
}

# Create new backup directory
New-Item -ItemType Directory -Path $backupDir

# Copy files from source directory to backup directory
Copy-Item -Path "$sourceDir\*" -Destination $backupDir -Recurse -Exclude @("node_modules", "backups", ".git") -Force

Write-Host "Backup created at: $backupDir" -ForegroundColor Green