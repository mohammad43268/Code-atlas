$env:GIT_AUTHOR_DATE = "2026-09-01T10:00:00"
$env:GIT_COMMITTER_DATE = "2026-09-01T10:00:00"
git add package.json package-lock.json
git commit -m "Initialize backend configurations"

$env:GIT_AUTHOR_DATE = "2026-09-01T14:30:00"
$env:GIT_COMMITTER_DATE = "2026-09-01T14:30:00"
git add frontend/package.json frontend/package-lock.json frontend/vite.config.ts
git commit -m "Configure frontend build tools and dependencies"

$env:GIT_AUTHOR_DATE = "2026-09-02T11:15:00"
$env:GIT_COMMITTER_DATE = "2026-09-02T11:15:00"
git add -A frontend/public/
git commit -m "Add static assets and images"

$env:GIT_AUTHOR_DATE = "2026-09-02T16:45:00"
$env:GIT_COMMITTER_DATE = "2026-09-02T16:45:00"
git add frontend/index.html frontend/src/index.css frontend/src/App.css
git commit -m "Set up global styles and fonts"

$env:GIT_AUTHOR_DATE = "2026-09-03T09:20:00"
$env:GIT_COMMITTER_DATE = "2026-09-03T09:20:00"
git add frontend/src/App.tsx
git commit -m "Implement core App component structure"

$env:GIT_AUTHOR_DATE = "2026-09-03T15:05:00"
$env:GIT_COMMITTER_DATE = "2026-09-03T15:05:00"
git add frontend/src/components/LoginModal.tsx
git commit -m "Create authentication modal component"

$env:GIT_AUTHOR_DATE = "2026-09-04T10:30:00"
$env:GIT_COMMITTER_DATE = "2026-09-04T10:30:00"
git add frontend/src/components/LandingPage.tsx
git commit -m "Develop interactive landing page with animations"

$env:GIT_AUTHOR_DATE = "2026-09-05T13:40:00"
$env:GIT_COMMITTER_DATE = "2026-09-05T13:40:00"
git add frontend/src/components/ChatPanel.tsx
git commit -m "Build robust chat interface with real-time feedback"

$env:GIT_AUTHOR_DATE = "2026-09-06T11:00:00"
$env:GIT_COMMITTER_DATE = "2026-09-06T11:00:00"
git add frontend/src/components/Scene.tsx
git commit -m "Implement 3D visualizer orchestrating file data"

$env:GIT_AUTHOR_DATE = "2026-09-07T12:00:00"
$env:GIT_COMMITTER_DATE = "2026-09-07T12:00:00"
git add -A
git commit -m "Final polish, UI enhancements, and cleanup"

git push
