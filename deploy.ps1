# Pyta użytkownika o komentarz, z domyślną wartością "adding dist"
$commitMessage = Read-Host -Prompt "Komentarz odnośnie naszych zmian (domyślny 'adding dist')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "adding dist"
}

npm run buildStaging
git add dist -f
git commit -m $commitMessage
git subtree push --prefix dist origin gh-pages