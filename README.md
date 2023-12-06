# Weather Forecast "app"

This app pulls data from weather.gov and displays it similarly to the weather forecast display on weather.gov.

There is an XML source and a JSON API, but neither have all the data shown on this forecast, so we just use what we can.

[https://www.damontgomery.com/weather-forecast](https://www.damontgomery.com/weather-forecast/)

## App usage

If the browser supports location, the user will be prompted to use that.

`lat` and `lon` query parameters can be provided to override the default / browser location.

There is also "invisible" buttons to zoom in / out and move forward / back through the days. These are in the top / bottom / left / right parts of the screen.

## Dev Ops

See `package.json` for build and local dev scripts.

## App structure

The app is inspired by declarative frameworks like React, but does not use React.

In this sense, there are many component functions in `src/components` that return DOM elements (SVG).

I've also tried to split the data from the UI components so we could switch if needed.

The compiled code uses ES6 modules, so there are a bunch of smaller files delivered to the client.

I could try a different build process like webpack or rollup, but I tried to keep this pretty simple.

A lot of the scaffolding is from `yarn init` and `tsc --init`.

## Credits

Icon by [iconixar](https://www.flaticon.com/authors/iconixar)
