#!/bin/bash
# Confere (sem gerar o app) se o código Swift do Buddy compila, nos três
# lugares onde ele entra: app, widget e extensão do cartão. Roda num Mac
# (GitHub Actions, .github/workflows/swift-check.yml). Os erros viram
# anotações do GitHub ("::error file=...").
set -u
cd "$(dirname "$0")/.."
SDK=$(xcrun --sdk iphoneos --show-sdk-path)
SHARED=$(ls targets/buddy-widget/_shared/*.swift)
STATUS=0

check() {
  local name="$1" target="$2"; shift 2
  echo "== $name ($target)"
  if ! xcrun swiftc -typecheck -parse-as-library -sdk "$SDK" -target "$target" -module-name "$name" "$@" 2> "/tmp/$name.log"; then
    STATUS=1
  fi
  cat "/tmp/$name.log"
  sed -E "s#^$PWD/##" "/tmp/$name.log" \
    | sed -nE 's#^([^:]+):([0-9]+):([0-9]+): error: (.*)$#::error file=base-app/\1,line=\2,col=\3::\4#p' \
    | head -40
}

check PaceApp arm64-apple-ios16.4 $SHARED native/ios/app/BuddyAlarm.swift
check PaceBuddyWidget arm64-apple-ios17.0 $SHARED targets/buddy-widget/*.swift
check PaceBuddyIntents arm64-apple-ios26.0 $SHARED targets/buddy-intents/*.swift

exit $STATUS
