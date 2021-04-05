# Readme

Given lat/lng bounds this will break it up into tiles of a given size, download each tile using
the mapbox static image api and stitch them together. Useful if you need large map sections that exceed the mapbox api dimensions limit. Also extracts OSM data for the region from an osm.pbf file and converts it to geojson

## Dependencies

- Osmosis (OSM Conversion)
- Graphics magic (Image stitching)

## map-utils.config.json

```
{
  "mapsDir": "./maps",
  "pbfDir": "./pbfs",
  "osmosisPath": "/Users/will/opt/osmosis"
}
```

## config.json

```
{
  "zoomLevelReferenceBounds": {
    "1": [-122.503, 37.7298, -122.4367, 37.7823]
  },
  "mapBounds": [
    -122.54556625051363,
    37.69317328462176,
    -122.26201954402832,
    37.86535832880206
  ],
  "imageSize": 640,
  "pbfFile": "us-west-latest.osm.pbf",
  "mapStyle": "mapbox://styles/<user>/<styleId>"
}
```
