import { FSFraction, FSRect, FSVector } from "./intmath"
import {FSVecotr, FSTransform} from "./libs/intmath"

class UIManager
{
    constructor()
    {
        this.fixedUI = new UINode()

        this.dragOffset = [0, 0]
        this.dragableUI = new UINode()

        // collision, 4-fork tree to make collsion search faster, make it simple, use fix size
        this.searchTree = []
    }

    draw(canvas, ctx)
    {
        this.dragableUI.recursionCalculateWorldTransform()
        this.dragableUI.recursionDraw(canvas, ctx, this.dragOffset)

        this.fixedUI.recursionCalculateWorldTransform()
        this.fixedUI.recursionDraw(canvas, ctx, null)
    }
}
uimanager = new UIManager()

class UINode
{
    constructor(imgPath, position)
    {
        if (imgPath != null)
        {
            this.img = new Image()
            this.img.src = imgPath
            this.size = new FSVecotr(this.img.width * 1000, this.img.height * 1000)
        }
        else
        {
            this.img = null
            this.size = new FSVecotr(0, 0)
        }

        // base property, all this are in local space
        this.position = position
        this.scale = new FSVecotr(1000, 1000)
        this.rotation = new FSFraction(0) // inorder to simplize program, we forbiddon to use rotation
        this.anchor = new FSVecotr(500, 500)
        this.zorder = 0

        // transform cache
        this.localTransform = null
        this.worldTransform = null
        this.localTransformDirty = true
        this.worldTransformDirty = false

        // collsion
        this.worldBoundingBox = null
        this.insideSearchTreeNodes = []

        // node layer
        this.parent = null
        this.children = []

        // touch events
        this.onTouchBegin = null
        this.onTouchMove = null
        this.onTouchEnd = null
    }

    ///////////////////////
    // base property settings
    ///////////////////////
    setParent(parent, bKeepWorldPosition)
    {
    }

    setPosition(position)
    {
        this.position = position
        this.localTransformDirty = true
    }

    setScale(scale)
    {
        this.scale = scale
        this.localTransformDirty = true
    }

    setZOrder(zorder)
    {
        if (this.parent == null || this.zorder == zorder)
            return
        this.zorder = zorder

        // find this index in brothers
        brothers = this.parent.children
        if (brothers.length == 1)
            return            
        let indexInBorthers = 0
        for (let i = 0; i < brothers.length; i++)
        {
            if (brothers[i] == this)
            {
                indexInBorthers = i
                break
            }
        }

        // change this index in brothers to keep zorder sort
        for (let i = 0; i < brothers.length; i++)
        {
            if (brothers[i].zorder > this.zorder)
            {
                delete brothers[indexInBorthers]
                brothers.splice(i-1, 0, this)
            }
        }
    }

    //////////////////////////
    // draw
    //////////////////////////
    recursionCalculateWorldTransform()
    {
        // create local transform first
        if (this.localTransformDirty)
        {
            this.localTransform = FSTransform(this.position, this.scale, this.rotation)
            this.worldTransformDirty = true
        }

        if (this.worldTransformDirty)
        {
            // parent's world transform is already calculate done
            if (this.parent != null)
                this.worldTransform = this.localTransform.mul(this.parent.worldTransform)
            else
                this.worldTransform = this.localTransform

            // calculate world bounding box
            let lt = new FSVector(this.size.x.mul(this.anchor.x).neg(), this.size.y.mul(this.anchor.y).neg())
            let rb = new FSVector(this.size.x.mul(new FSFraction(1000).sub(this.anchor.x)).x, this.size.y.mul(new FSFraction(1000).sub(this.anchor.y)))
            let worldLt = this.worldTransform.translatePosition(lt)
            let worldRb = this.worldTransform.translatePosition(rb)
            this.worldBoundingBox = new FSRect(worldLt, worldRb)
        }

        // recursion calculate children's transform
        for (let i = 0; i < this.children.length; i++)
        {
            this.children[i].worldTransformDirty = this.worldTransformDirty
            this.children[i].recursionCalculateWorldTransform()
        }

        this.localTransformDirty = false
        this.worldTransformDirty = false
    }

    recursionDraw(canvas, ctx, offset)
    {
        // draw if inside canvas
        if (this.img != null)
        {
            let width = canvas.width
            let height = canvas.height
            let [minX, minY] = this.worldBoundingBox.min.tofloat()
            let [maxX, maxY] = this.worldBoundingBox.max.tofloat()
            if (offset != null)
            {
                minX += offset[0]
                maxX += offset[0]
                minY += offset[1]
                maxY += offset[1]
            }
            if (maxX > 0 && maxY > 0 && minX < width && minY < height)
                ctx.drawImg(this.img, minX, minY, maxX, maxY)
        }

        // draw childrens, already sort by zorder
        for (let i = 0; i < this.children.length; i++)
        {
            this.children[i].recursionDraw(canvas, ctx, offset)
        }
    }
}