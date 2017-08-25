#!/bin/sh

react-native bundle --entry-file index.android.js \
  --platform "android" \
  --dev false \
  --assets-dest ./android/app/src/main/res \
  --bundle-output ./android/app/src/main/assets/index.android.bundle
