# Install Fast Node Manager (fnm)
winget install Schniz.fnm

# Set execution policy to allow profile scripts to be executed
Set-ExecutionPolicy RemoteSigned

# Ensure the PowerShell profile exists
New-Item -Path $PROFILE -ItemType File -Force

# Add fnm configuration to the PowerShell profile for managing Node.js versions
Add-Content -Path $PROFILE -Value "`n# Set up fnm to manage Node.js versions`nfnm env --use-on-cd | Out-String | Invoke-Expression"

# Reload the PowerShell profile to apply changes
. $PROFILE

# Install and use Node.js version 20 if not already installed
fnm use --install-if-missing 20

# Verify the installed Node.js and npm versions
node -v  # Expected: v20.18.0
npm -v   # Expected: 10.8.2
