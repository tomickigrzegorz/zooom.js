import './Zooom.scss'
import './ReplaceWithPolyfill'

class Zooom {
  constructor (options) {
    this.zooomElement = options.zooomElement
    this.zooomImgPadding = options.zooomImgPadding
    this.zooomWrap = 'zooom-wrap'
    this.zooomImg = 'zooom-img'
    this.zooomOverlay = 'zooom-overlay'
    const { color, opacity } = options.zooomOverlay

    this.color = color || '#fff'
    this.opacity = opacity || '1'

    this.addEventImage()

    window.addEventListener('scroll', () => {
      this.removeWrapper()
    })
  }

  addEventImage () {
    const imageList = document.querySelectorAll(this.zooomElement)
    for (let image of imageList) {
      image.addEventListener('click', e => {
        e.stopPropagation()
        this.imageZooom = e.currentTarget
        // init zooom image
        this.zooomInit()
      })
    }
  }

  createWrapper () {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add(this.zooomWrap)

    this.wrapImage(this.imageZooom, this.wrapper)

    this.imageZooom.classList.add(this.zooomImg)
    this.overlayAdd()
  }

  removeWrapper () {
    const wrapZooom = document.querySelector(`.${this.zooomWrap}`)
    const transition = this.transitionEvent()

    if (wrapZooom) {
      const image = document.querySelector(`.${this.zooomImg}`)
      image.removeAttribute('style')
      wrapZooom.removeAttribute('style')
      wrapZooom.addEventListener(transition, () => {
        // wrapZooom.outerHTML = wrapZooom.innerHTML
        wrapZooom.replaceWith(...wrapZooom.childNodes)
        image.classList.remove(this.zooomImg)
        this.overlayRemove()
      })
    }
  }

  zooomInit () {
    const wrapZooom = document.querySelector(`.${this.zooomWrap}`)
    if (wrapZooom === null) {
      this.createWrapper()
      this.imageTransform()
    } else {
      this.removeWrapper()
    }
  }

  overlayAdd () {
    const overlay = document.createElement('div')
    overlay.id = this.zooomOverlay
    overlay.setAttribute('style', `background-color: ${this.color}; opacity: ${this.opacity}`)
    document.body.appendChild(overlay)
  }

  overlayRemove () {
    const overlay = document.getElementById(this.zooomOverlay)
    if (overlay) {
      overlay.parentNode.removeChild(overlay)
    }
  }

  // https://stackoverflow.com/questions/2794148/css3-transition-events
  transitionEvent () {
    let el = document.createElement('fakeelement')

    let transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    }

    for (let t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t]
      }
    }
  }

  wrapImage (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el)
    wrapper.appendChild(el)
  }

  imageTransform () {
    const targetWidth = this.imageZooom.clientWidth
    const targetHeight = this.imageZooom.clientHeight
    const imageWidth = this.imageZooom.naturalWidth
    const imageHeight = this.imageZooom.naturalHeight

    const rect = this.imageZooom.getBoundingClientRect()

    const viewportY = window.innerHeight / 2
    const viewportX = document.documentElement.clientWidth / 2

    const imageCenterY = rect.top + (targetHeight / 2)
    const imageCenterX = rect.left + (targetWidth / 2)

    const translateY = viewportY - imageCenterY
    const translateX = viewportX - imageCenterX

    const maxScale = imageWidth / targetWidth

    const viewportHeight = window.innerHeight - this.zooomImgPadding
    const viewportWidth = document.documentElement.clientWidth - this.zooomImgPadding

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

    this.wrapper.setAttribute('style', `transform: translate(${translateX}px, ${translateY}px) translateZ(0px);`)

    this.imageZooom.setAttribute('style', `transform: scale(${imageScale})`)
  }
}

export default Zooom
