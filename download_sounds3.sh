#!/bin/bash
sounds=(
  "classic-alarm:classic alarm"
  "digital-beep:digital beep"
  "nature-wake:nature wake"
  "gentle-chime:gentle chime"
  "rooster:rooster"
  "reminder-pop:reminder pop"
  "success:success"
  "error:error"
)
for sound in "${sounds[@]}"; do
  name=$(echo $sound | cut -d: -f1)
  query=$(echo $sound | cut -d: -f2)
  PREVIEW_URL=$(curl -s "https://freesound.org/apiv2/search/text/?query=$query&fields=id,previews" | grep -o '"lq_mp3":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$PREVIEW_URL" ]; then
    curl -o "public/sounds/$name.mp3" "$PREVIEW_URL"
  fi
done
