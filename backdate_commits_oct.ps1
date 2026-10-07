$dates = @(
    "2026-10-06",
    "2026-10-07",
    "2026-10-08"
)

$messages = @(
    "Polish UI aesthetics and layout",
    "Update AI cloud provider integrations",
    "Implement custom premium dropdown component",
    "Fix Llama API integration",
    "Design robust brutalist components",
    "Refactor state management in ChatPanel",
    "Debug backend server configuration",
    "Test cross-browser compatibility"
)

$logFile = "activity.log"

foreach ($date in $dates) {
    # Random number of commits between 2 and 5
    $numCommits = Get-Random -Minimum 2 -Maximum 6
    
    for ($i = 0; $i -lt $numCommits; $i++) {
        $hour = Get-Random -Minimum 9 -Maximum 23
        $minute = Get-Random -Minimum 0 -Maximum 60
        $second = Get-Random -Minimum 0 -Maximum 60
        
        $timestamp = "{0}T{1:D2}:{2:D2}:{3:D2}" -f $date, $hour, $minute, $second
        
        # Append some text to the log file to create a real change
        "Activity recorded at $timestamp" | Out-File -FilePath $logFile -Append
        
        $msg = $messages | Get-Random
        
        $env:GIT_AUTHOR_DATE = $timestamp
        $env:GIT_COMMITTER_DATE = $timestamp
        
        git add $logFile
        git commit -m $msg
    }
}

git push
