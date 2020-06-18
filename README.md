[![npm version](https://img.shields.io/npm/v/cycle-image-loading-driver.svg?style=flat)](https://npmjs.org/package/cycle-image-loading-driver 'View this project on npm')

# [Cycle.js driver](https://cycle.js.org/drivers.html) for preloading images

This driver takes in a sink stream of images to load and returns a source stream that emits whenever an image is loaded.

## Install

### NPM

```sh
npm install --save cycle-image-loading-driver
```

### Yarn

```sh
yarn add cycle-image-loading-driver
```

## Creating the driver

Like any other driver, the (default) function `makeImageLoadingDriver` should be called in the run function.

```js
run(main, {
	imagesToLoad: makeImageLoadingDriver(),
})
```

The function `makeImageLoadingDriver` takes no options.

## Sink

The sink `imagesToLoad` should be a stream emiting an array of image urls.

```js
function main() {
	// ...
	return {
		imagesToLoad: xs.of([url1, url2, url3]),
	}
}
```

## Source

The source stream produced emits an object in which the keys is the image URL and the value an object with properties `loaded` and possibly `error`.

```js
function main(sources) {
	sources.imagesToLoad.map((images) => {
		const isImg1Loaded = images[img1Url].loaded
		//...
	})
	//...
}
```

To loop through all images use `Object.keys`

```js
function main(sources) {
	sources.imagesToLoad.map((images) => {
		const allImages = Object.keys(images).map((key) => {
			const imgObj = images[key]
			return { ...imgObj, id: key }
		})
		//...
	})
	//...
}
```
