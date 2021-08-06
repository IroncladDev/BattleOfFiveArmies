git add -A
git commit -m $(( ( RANDOM % 10000000000000 )  + 1 ))
git push origin