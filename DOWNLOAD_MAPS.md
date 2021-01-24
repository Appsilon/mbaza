# Downloading OpenStreetMap data

Use [Overpass Turbo](http://overpass-turbo.eu/), an interface for the OpenStreetMap database.
You can run queries using [Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL)
and export results in `.geojson` format.

Download national borders and parks for 6 Central Africa countries using the following query:
```
area["ISO3166-1"~"CD|CG|CM|GA|GQ|NG"]->.a;
(
  nwr(area.a)[boundary=administrative][admin_level=2];
  nwr(area.a)[boundary=national_park];
  nwr(area.a)[boundary=protected_area];
);
out geom;
```

Afterwards, you download the national borders for the remaining African countries
(in batches, to fit in API quotas):
```
AO|BF|BI|BJ|BW|CF|CI|CV|DJ|DZ|EG|ER|ET
GH|GM|GN|GW|KE|KM|LR|LS|LY|MA|MG|ML|MR
MU|MW|MZ|NA|NE|RE|RW|SC|SD|SH|SL|SN|SO
SS|ST|SZ|TD|TG|TN|TZ|UG|YT|ZA|ZM|ZW
```

Lastly, use [geojson-merge](https://github.com/mapbox/geojson-merge) to merge the files and
[mapshaper](https://mapshaper.org/) to simplify the polygons and decrease the file size.
