# Define the root directory
$rootDir = "C:\Users\Eli\Desktop\app3"

# Function to print folder and file structure based on conditions
function Print-DirectoryContents {
   param (
       [string]$directoryPath,
       [string[]]$excludeFolders = @()
   )

   # Get all items in the directory 
   $items = Get-ChildItem -Path $directoryPath

   foreach ($item in $items) {
       # Check for special cases (node_modules folder or package-lock.json file)
       if ($item.Name -eq "node_modules" -or $item.Name -eq "package-lock.json") {
           # Just print the name without exploring further
           if ($item.PSIsContainer) {
               Write-Host "`nDirectory (not explored): $($item.FullName)" -ForegroundColor DarkCyan
           } else {
               Write-Host "`nFile (content not shown): $($item.FullName)" -ForegroundColor DarkYellow
           }
           continue
       }

       # Exclude specified folders completely
       if ($excludeFolders -contains $item.Name) {
           continue
       }

       if ($item.PSIsContainer) {
           # Additional condition: Only process 'experiments\editor' and 'experiments\editor-testimonials' in the 'src\components' folder
           if ($item.FullName -like "$rootDir\src\components\*" -and
               $item.FullName -ne "$rootDir\src\components\experiments\editor" -and
               $item.FullName -ne "$rootDir\src\components\experiments\editor-testimonials") {
               continue
           }

           # Check if it's a special case like 'serve'
           if ($item.Name -eq "serve") {
               # Print everything in 'serve' except 'node_modules'
               Write-Host "`nDirectory: $($item.FullName)" -ForegroundColor Cyan
               Print-DirectoryContents -directoryPath $item.FullName -excludeFolders "node_modules"
           } else {
               # Print regular directory
               Write-Host "`nDirectory: $($item.FullName)" -ForegroundColor Cyan
               Print-DirectoryContents -directoryPath $item.FullName -excludeFolders $excludeFolders
           }
       }
       else {
           # Print file path and contents for regular files
           Write-Host "`nFile: $($item.FullName)" -ForegroundColor Yellow
           Write-Host "Contents:" -ForegroundColor Green
           Get-Content -Path $item.FullName
           Write-Host "`n------------------------`n" -ForegroundColor DarkGray
       }
   }
}

# Execute function for the root directory, excluding 'backups' and 'node_modules'
Print-DirectoryContents -directoryPath $rootDir -excludeFolders "backups", "node_modules"