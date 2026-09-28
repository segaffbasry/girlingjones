#!/bin/sh
# Downloads the homepage photography and brand film from girlingjones.com into public/media.
# Usage: npm run media   (needs curl and ffmpeg; originals are cached in _scrape/, which is git-ignored)
#
# The live hero film is a 50 MB, 1920×1080 H.264 file with an audio track. It plays muted, so it is
# re-encoded without audio at CRF 28 (about 4 MB) plus a 1280px version for small screens, and a poster
# is taken from its first frame so the hero never shows an empty box.
set -e
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
U="https://girlingjones.com/wp-content/uploads"
mkdir -p _scrape public/media

get() { [ -s "_scrape/$2" ] || curl -sfL -A "$UA" -o "_scrape/$2" "$1"; }

get "$U/2026/01/Girling-Jones_exeter.mp4" exeter.mp4
get "$U/2024/09/join-our-team-image.jpg" join-our-team.jpg
get "$U/2023/07/Plymouth.jpg" plymouth.jpg
get "$U/2025/12/Teignmouth_small-1900x640.jpg" teignmouth.jpg   # contact page banner
get "$U/2026/06/SS.png" tool-salary.png
get "$U/2026/06/WTD.png" tool-drive.png
get "$U/2026/06/PC.png" tool-paye.png

ffmpeg -v error -y -i _scrape/exeter.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart public/media/hero-1920.mp4
ffmpeg -v error -y -i _scrape/exeter.mp4 -an -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart public/media/hero-1280.mp4
ffmpeg -v error -y -ss 0.2 -i _scrape/exeter.mp4 -frames:v 1 -vf "scale=1920:-2" -q:v 4 public/media/hero-poster.jpg

# Stills from the same film: the Exeter office and the "give us a tinkle" phone scene.
ffmpeg -v error -y -ss 5.2 -i _scrape/exeter.mp4 -frames:v 1 -q:v 3 public/media/office.jpg
ffmpeg -v error -y -ss 12.4 -i _scrape/exeter.mp4 -frames:v 1 -q:v 3 public/media/tinkle.jpg

cp _scrape/join-our-team.jpg _scrape/plymouth.jpg _scrape/teignmouth.jpg public/media/
for t in salary drive paye; do ffmpeg -v error -y -i "_scrape/tool-$t.png" -q:v 3 "public/media/tool-$t.jpg"; done

ls -la public/media
