@echo off
REM This merges all copilot feature branches into your current branch (main)
SETLOCAL ENABLEDELAYEDEXPANSION

set branches=^
copilot/add-ai-powered-ad-copy-generator ^
copilot/add-apple-music-support ^
copilot/add-auto-refresh-scheduler ^
copilot/add-facebook-ads-integration ^
copilot/add-google-search-display-ads-integration ^
copilot/add-reels-support ^
copilot/add-tiktok-ads-integration ^
copilot/add-tiktok-ads-integration-again ^
copilot/add-youtube-ads-integration ^
copilot/add-analytics-dashboard ^
copilot/add-stripe-payments-service ^
copilot/create-spotify-ad-curator-app

for %%b in (%branches%) do (
    echo Merging origin/%%b ...
    git merge origin/%%b --allow-unrelated-histories --no-edit
    IF ERRORLEVEL 1 (
        echo Merge conflict when merging %%b. Resolve the conflict, then rerun this script.
        pause
        exit /b 1
    )
)
echo All branches merged!
pause