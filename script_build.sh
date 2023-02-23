folder="CONTENT_03"
if [ "$1" ]; then
  folder=$1
fi

echo $folder



mkdir -p MINIFY && rm -rf "MINIFY/$folder" && cp -R $folder "MINIFY/$folder"
./node_modules/.bin/minify "MINIFY/$folder/js_build" -t {{filename}}.{{ext}} && rm -rf "MINIFY/$folder/js"
cp "$folder/js_build/config.js"  "MINIFY/$folder/js_build/config.js"

mkdir -p UNMINIFY && rm -rf "UNMINIFY/$folder" && cp -R $folder "UNMINIFY/$folder" && rm -rf "UNMINIFY/$folder/js"
cp "$folder/js_build/config.js"  "UNMINIFY/$folder/js_build/config.js"
