#!/bin/bash
cd commons
npm run build
cd ..
for d in */ ; do
    if [ "$d" != "commons/" ] && [ "$d" != "broker/" ] && [ "$d" != "gateway/" ]; then
        cd $d
        npm rm commons
        npm i ../commons
        cd ..
    fi
done
