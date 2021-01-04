# Downloading OpenStreetMap data

Use [Overpass Turbo](http://overpass-turbo.eu/), an interface for the OpenStreetMap database.
You can run queries using [Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL)
and export results in `.geojson` format.

The following query was used to create `map-sources/africa.json`:

```
area["ISO3166-1"~"GA|NG|CM|CG|CD|GQ"]->.a;
(
  nwr(area.a)[boundary=administrative][admin_level=2];
  nwr(area.a)[boundary=national_park];
  nwr(area.a)[boundary=protected_area];
);
out geom;
```
