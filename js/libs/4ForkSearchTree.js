import { FSFraction, FSRect, FSVector } from "./intmath"

class FourForkSearchTreeNode {
    constructor(boundingBox, isLeaf) {
        this.boundingBox = boundingBox
        this.isLeaf = isLeaf
        if (!this.isLeaf)
            this.childNodes = [] // order: lt, rt, lb, rb
        else
            this.objs = []
    }

    recursionSearchPoint(point)
    {
        // search end, only single node will hit
        if (this.isLeaf)
            return this
        
        for (let i = 0; i < 4; i++)
        {
            let childNode = this.childNodes[i]
            if (childNode.boundingBox.containPoint(point))
            {
                return childNode.recursionSearchPoint(point)
            }
        }
    }

    recursionSearchRect(rect)
    {
        if (this.isLeaf) {
            return [this]
        }

        // multi node will hit
        let hitNodes = []
        for (let i = 0; i < 4; i++)
        {
            let childNode = this.childNodes[i]
            if (childNode.boundingBox.intersectRect(rect))
                hitNodes.concat(childNode.recursionSearchRect(rect))
        }
        return hitNodes
    }

    recursionSearchLine(p1, p2)
    {
        // multi node will hit
    }
}

class FourForkSearchTree {
    constructor(rootBoundingBox, maxLayer) {

        this.maxLayer = maxLayer

        // init nodes
        // make it simple, use fix layers
        this.rootNode = new FourForkSearchTreeNode(rootBoundingBox, false)
        recursionCreateNodes(this.rootNode, 0)
    }

    recursionCreateNodes(parentNode, layer)
    {
        let parentMin = parentNode.boundingBox.min
        let parentMax = parentNode.boundingBox.max
        let parentCenter = parentMax.sub(parentMin).div(new FSFraction(500))
        for (let i = 0; i < 4; i++)
        {
            let childBoundingBox = null
            if (i == 0)
                childBoundingBox = new FSRect(parentMin, parentCenter)
            else if (i == 1)
                childBoundingBox = new FSRect(new FSVector(centerPoint.x, parentMin.y), new FSVector(parentMax.x, centerPoint.y))
            else if (i == 2)
                childBoundingBox = new FSRect(new FSVector(parentMin.x, parentCenter.y), new FSVector(parentCenter.x, parentMax.y))
            else if (i == 3)
                childBoundingBox = new FSRect(parentCenter, parentMax)
            
            let isLeaf = layer == this.maxLayer
            let childNode = new FourForkSearchTreeNode(childBoundingBox, isLeaf)
            parentNode.childNode.push(childNode)

            if (!isLeaf)
                this.recursionCreateNodes(parentNode, layer++)
        }
    }

    insertObj(obj) {}
    removeObj(obj) {}
    updateObj(obj) {}
}
