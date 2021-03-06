import { from, Subject } from 'rxjs'

const loadImage = (src) =>
	new Promise((resolve, reject) => {
		const img = new Image()
		img.addEventListener('load', () => resolve(img))
		img.addEventListener('error', (err) => reject(err))
		img.src = src
	})

export const makeImageLoadingDriver = () => {

	const imageLoaderDriver = (sink$) => {
		const imageCache = {}
		const source$ = new Subject()

		from(sink$).subscribe({
			next(images) {
				const imagesPromises = images.map((src) => {
					const imgSuccess = { src, loaded: true, loading: false }
					if (!!imageCache[src]) return Promise.resolve(imgSuccess)
					imageCache[src] = { src, loaded: false, loading: true }
					source$.next(imageCache)
					return loadImage(src)
						.then(() => {
							imageCache[src] = imgSuccess
						})
						.catch((error) => {
							imageCache[src] = { src, loaded: false, loading: false, error }
						})
				})

				Promise.all(imagesPromises).then(() => {
					source$.next(imageCache)
				})
			},
		})

		return source$
	}

	return imageLoaderDriver
}
