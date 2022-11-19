import {intMath, fraction} from "./libs/intmath"
let ctx = canvas.getContext('2d')

wx.onSocketOpen((result) => {
  console.log('onSocketOpen', result)
})

wx.onSocketClose((result) => {
  console.log('onSocketClose', result)
})

wx.onSocketError((result) => { 
  console.log('onSocketError', result)
})

/**
 * 游戏主函数 
 */
export default class Main {
  constructor() {
    this.bindTick     = this.tick.bind(this)
    this.aniId = window.requestAnimationFrame(this.bindTick, canvas)
    this.lastTickTime = Date.now()
  }

  // 实现游戏帧循环
  tick() {
    // get delta time
    let now = Date.now()
    let dt = (now - this.lastTickTime) * 0.001
    this.lastTickTime = now

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let img     = new Image()
    img.src = 'images/bullet.png'
    console.log(img.width << 0, img.height)
    ctx.drawImage(img, 10.1, 10, 100, 100)
    
    this.aniId = window.requestAnimationFrame(
      this.bindTick,
      canvas
    )
  }
}
