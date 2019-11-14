import './Zooom.scss'

class Zooom {
  constructor (options) {
    this.element = options.element
    this.padding = options.padding || 80
    this.wrap = 'zooom-wrap'
    this.img = 'zooom-img'
    this.overlay = 'zooom-overlay'

    if (typeof options.overlay === 'undefined') {
      this.color = '#fff'
      this.opacity = '1'
    } else {
      const { color, opacity } = options.overlay
      this.color = color
      this.opacity = opacity
    }

    this.addEventImage()

    window.addEventListener('scroll', () => {
      this.removeWrapper()
    })
  }

  addEventImage () {
    const imageList = document.querySelectorAll(this.element)
    for (const image of imageList) {
      image.addEventListener('click', e => {
        e.stopPropagation()
        this.imageZooom = e.currentTarget
        this.zooomInit()
      })
    }
  }

  createWrapper () {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add(this.wrap)

    this.wrapImage(this.imageZooom, this.wrapper)

    this.imageZooom.classList.add(this.img)
    this.overlayAdd()
  }

  removeWrapper () {
    const wrapZooom = document.querySelector(`.${this.wrap}`)
    const transition = this.transitionEvent()

    if (wrapZooom) {
      const image = document.querySelector(`.${this.img}`)
      image.removeAttribute('style')
      wrapZooom.removeAttribute('style')
      wrapZooom.addEventListener(transition, (e) => {
        wrapZooom.parentElement.appendChild(image)
        e.currentTarget.parentNode.removeChild(e.currentTarget)
        image.classList.remove(this.img)
        this.overlayRemove()
      })
    }
  }

  zooomInit () {
    const wrapZooom = document.querySelector(`.${this.wrap}`)
    if (wrapZooom === null) {
      this.createWrapper()
      this.imageTranslate(this.imageProperty())
      this.imageScale(this.imageProperty())
    } else {
      this.removeWrapper()
    }

    document.body.addEventListener('click', () => {
      this.removeWrapper()
    })
  }

  overlayAdd () {
    const overlay = document.createElement('div')
    overlay.id = this.overlay
    overlay.setAttribute('style', `background-color: ${this.color}; opacity: ${this.opacity}`)
    document.body.appendChild(overlay)
  }

  overlayRemove () {
    const overlay = document.getElementById(this.overlay)
    if (overlay) {
      overlay.parentNode.removeChild(overlay)
    }
  }

  // https://stackoverflow.com/questions/2794148/css3-transition-events
  transitionEvent () {
    const el = document.createElement('template')

    const transitions = {
      WebkitTransition: 'webkitTransitionEnd', // Saf 6, Android Browser
      MozTransition: 'transitionend', // only for FF < 15
      transition: 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
    }

    for (const t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t]
      }
    }
  }

  wrapImage (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el)
    wrapper.appendChild(el)
  }

  imageProperty () {
    const propImage = {
      targetWidth: this.imageZooom.clientWidth,
      targetHeight: this.imageZooom.clientHeight,
      imageWidth: this.imageZooom.naturalWidth,
      imageHeight: this.imageZooom.naturalHeight
    }
    return propImage
  }

  imageScale ({ imageWidth, imageHeight, targetWidth }) {
    const maxScale = imageWidth / targetWidth

    const viewportHeight = window.innerHeight - this.padding
    const viewportWidth = document.documentElement.clientWidth - this.padding

    const imageApectRatio = imageWidth / imageHeight
    const vieportAspectRatio = viewportWidth / viewportHeight

    let imageScale = 1

    if (imageWidth < viewportWidth && imageHeight < viewportHeight) {
      imageScale = maxScale
    } else if (imageApectRatio < vieportAspectRatio) {
      imageScale = (viewportHeight / imageHeight) * maxScale
    } else {
      imageScale = (viewportWidth / imageWidth) * maxScale
    }

    if (imageScale <= 1) {
      imageScale = 1
    }

    this.imageZooom.setAttribute('style', `transform: scale(${imageScale}) translateZ(0);`)
  }

  imageTranslate ({ targetWidth, targetHeight }) {
    const rect = this.imageZooom.getBoundingClientRect()

    const viewportY = window.innerHeight / 2
    const viewportX = document.documentElement.clientWidth / 2

    const imageCenterY = rect.top + (targetHeight / 2)
    const imageCenterX = rect.left + (targetWidth / 2)

    const translateY = viewportY - imageCenterY
    const translateX = viewportX - imageCenterX

    this.wrapper.setAttribute('style', `transform: translate(${translateX}px, ${translateY}px) translateZ(0px);`)
  }
}

export default Zooom
