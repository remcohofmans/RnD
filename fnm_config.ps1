# Installs fnm (Fast Node Manager) from the package repo to manage Node.js versions (lightweight and fast)
# winget ensures that the latest version of fnm is installed cleanly without needing manual downloads
winget install Schniz.fnm

# Generates the shell environment variables needed for fnm to manage Node.js, when changing directories, 
# fnm will automatically switch to the correct Node.js version specified for that project
# Add the npm configuration between literals to the profile file 
Add-Content -Path $PROFILE -Value 'fnm env --use-on-cd | Out-String | Invoke-Expression'

# Downloads and installs Node.js if not already installed and activates it for use in the current terminal session.
fnm use --install-if-missing 20

# Verifies the right Node.js version is active in the environment
node -v # should print `v20.18.0`

# Verifies the right npm version is in the environment, corresponds to the bundled npm version with the Node.js version
npm -v # should print `10.8.2`