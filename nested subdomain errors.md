echo "=== NAMESERVERS ==="
dig NS divisha.org +short

echo "=== NESTED DNS ==="
dig A abc.society.divisha.org +short

echo "=== WORKING DNS ==="
dig A society.divisha.org +short

echo "=== NESTED HTTPS ==="
curl -Iv --http1.1 --max-time 15 \
  https://abc.society.divisha.org/

echo "=== DJANGO API ==="
curl -iG --max-time 15 \
  https://gtbtax.pythonanywhere.com/api/page/ \
  --data-urlencode "host=abc.society.divisha.org"

  