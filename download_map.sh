# usage: ./osm_bz2_to_minified_json.sh [URL of osm.pbf file](default: http://download.geofabrik.de/africa/gabon-latest.osm.pbf)
OSM_PBF_URL=${1:-http://download.geofabrik.de/africa/gabon-latest.osm.pbf}

npm install -g osmtogeojson
wget $OSM_PBF_URL
osmtogeojson -m gabon-latest.osm.pbf > gabon-latest-minified.json
rm gabon-latest.osm.pbf
mv gabon-latest-minified.json resources