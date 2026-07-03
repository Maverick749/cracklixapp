#!/bin/bash

# Cracklix APK Build Script
set -e

# The Android bundle is produced with `output: 'export'` (BUILD_TARGET=android).
# Static export is incompatible with server-only code (API route handlers,
# 'use server' actions and middleware), so we temporarily move those paths
# aside for the export only and restore them right after. The exported bundle
# is what the APK ships and serves locally (offline). This mirrors the stash
# logic in .github/workflows/android-apk.yml so local builds match CI.
stash_server_code() {
  mkdir -p .ci-stash
  [ -d src/app/api ] && mv src/app/api .ci-stash/api || true
  [ -f src/middleware.ts ] && mv src/middleware.ts .ci-stash/middleware.ts || true
  # Genkit AI flows are marked "use server". Static export rejects Server
  # Actions, so strip only the directive; git restores the originals below.
  find src/ai -type f -name '*.ts' -exec sed -i "/^['\"]use server['\"];\?/d" {} +
}

restore_server_code() {
  [ -d .ci-stash/api ] && mv .ci-stash/api src/app/api || true
  [ -f .ci-stash/middleware.ts ] && mv .ci-stash/middleware.ts src/middleware.ts || true
  rm -rf .ci-stash
  git checkout -- src/ai || true
}

# Always restore the stashed server code, even if the build fails.
trap restore_server_code EXIT

echo "🔨 Preparing Web Assets..."
stash_server_code
npm run build:android
restore_server_code
trap - EXIT

echo "📦 Syncing with Capacitor..."
# Synchronize using the 'out' directory as configured in capacitor.config.ts
npx cap sync android

echo "🏗️ Building Debug APK..."
cd android
./gradlew clean assembleDebug

if [ $? -eq 0 ]; then
    cd ..
    cp android/app/build/outputs/apk/debug/app-debug.apk cracklix.apk
    echo "✅ Debug APK built successfully!"
    echo "📍 Location: cracklix.apk (also android/app/build/outputs/apk/debug/app-debug.apk)"
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 Process complete!"
