#!/bin/bash
sounds=(
  "classic-alarm:alarm"
  "digital-beep:beep"
  "nature-wake:nature"
  "gentle-chime:chime"
  "rooster:rooster"
  "reminder-pop:pop"
  "success:success"
  "error:error"
)
for sound in "${sounds[@]}"; do
  name=$(echo $sound | cut -d: -f1)
  search=$(echo $sound | cut -d: -f2)
  DOWNLOAD_URL=$(curl -A "Mozilla/5.0" -s "https://pixabay.com/sound-effects/search/$search/" | grep -o 'href="/sound-effects/download/[^"]*"' | head -1 | sed 's|href="|https://pixabay.com|')
  if [ -n "$DOWNLOAD_URL" ]; then
    curl -o "public/sounds/$name.mp3" "$DOWNLOAD_URL"
  fi
done
