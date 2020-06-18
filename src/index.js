import { from, Subject } from 'rxjs'
import { adapt } from '@cycle/run/lib/adapt'

const loadImage = (src) =>
	new Promise((resolve, reject) => {
		const img = new Image()
		img.addEventListener('load', () => resolve(img))
		img.addEventListener('error', (err) => reject(err))
		img.src = src
	})

export const makeImageLoaderDriver = () => {

	const imageLoaderDriver = (sink$) => {
		const imageCache = {}
		const source$ = new Subject()

		from(sink$).subscribe({
			next(images) {
				const imagesPromises = images.map((src) => {
					const imgSuccess = { src, loaded: true }
					if (!!imageCache[src]) return Promise.resolve(imgSuccess)
					return loadImage(src)
						.then(() => {
							imageCache[src] = imgSuccess
						})
						.catch((error) => {
							imageCache[src] = { src, loaded: false, error }
						})
				})

				Promise.all(imagesPromises).then(() => {
					source$.next(imageCache)
				})
			},
		})

		return adapt(source$)
	}

	return imageLoaderDriver
}