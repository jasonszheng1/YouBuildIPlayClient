import {FSVecotr2} from "./libs/intmath"

class UIManager
{
    constructor()
    {
    }
}

class UINode
{
    constructor(imgPath, position)
    {
        this.img = new Image()
        this.img.src = imgPath

        // base property
        this.parent = null
        this.anchor = new FSVecotr2(500, 500)
        this.position = position
        this.scale = scale
        this.rotate = rotate
        this.boundingbox = this.img.width

        // touch
    }
}