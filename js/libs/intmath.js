// fs means frame sync

// 只涉及到整数运算的数学库
class FSIntMath 
{
  constructor() 
  {
    // sin在0到pi/2之间的值*1000, 总共分割成157份 
    this.sinValues = [0, 10, 20, 30, 40, 50, 59, 69, 79, 89, 99, 109, 119, 129, 139, 149, 159, 169, 179, 188, 198, 208, 218, 228, 237, 247, 257, 266, 276, 286, 295, 305, 314, 324, 333, 343, 352, 361, 371, 380, 389, 398, 407, 417, 426, 435, 444, 453, 461, 470, 479, 488, 497, 505, 514, 522, 531, 539, 548, 556, 564, 573, 581, 589, 597, 605, 613, 621, 629, 636, 644, 652, 659, 667, 674, 681, 689, 696, 703, 710, 717, 724, 731, 738, 744, 751, 758, 764, 771, 777, 783, 789, 795, 801, 807, 813, 819, 825, 830, 836, 841, 847, 852, 857, 862, 867, 872, 877, 882, 886, 891, 895, 900, 904, 908, 913, 917, 920, 924, 928, 932, 935, 939, 942, 945, 949, 952, 955, 958, 961, 963, 966, 968, 971, 973, 975, 978, 980, 981, 983, 985, 987, 988, 990, 991, 992, 993, 994, 995, 996, 997, 998, 998, 999, 999, 999, 1000]
    
    // random
    this.randomSeed = 123456
    this.randomCallNum = 0
  }

  sin(fraction)
  {
	  // round to 2pi
	  let radian = fraction.n % 6280

	  // pi/2
	  if (radian < 1570)
		  return new FSFraction(this.sinValues[this.divide(radian, 10)])
	  
	  // pi/2 ~ pi
	  radian -= 1570
	  if (radian < 1570)
		  return new FSFraction(this.sinValues[156 - this.divide(radian, 10)])
	  
	  // pi ~ pi*3/4
	  radian -= 1570
	  if (radian < 1570)
		  return new FSFraction(-this.sinValues[this.divide(radian, 10)])
	
	  // pi*3/4 ~ pi*2
	  radian -= 1570
	  return new FSFraction(-this.sinValues[156 - this.divide(radian, 10)])
  }

  cos(fraction)
  {
	  // round to 2pi
	  let radian = fraction.n % 6280

	  // pi/2
	  if (radian < 1570)
		  return new FSFraction(this.sinValues[156 - this.divide(radian, 10)])
	  
	  // pi/2 ~ pi
	  radian -= 1570
	  if (radian < 1570)
		  return new FSFraction(-this.sinValues[this.divide(radian, 10)])
	  
	  // pi ~ pi*3/4
	  radian -= 1570
	  if (radian < 1570)
		  return new FSFraction(-this.sinValues[156 - this.divide(radian, 10)])
	
	  // pi*3/4 ~ pi*2
	  radian -= 1570
	  return new FSFraction(this.sinValues[this.divide(radian, 10)])
  }

  pi()
  {
	  return new FSFraction(3145)
  }

  divide(a, b)
  {
    let quotient = 1;
    let neg = a * b < 0 ? -1 : 1
    let tempa = a < 0 ? -a : a
    let tempb = b < 0 ? -b : b
    if (tempa == tempb)
      return 1
    if (tempa < tempb)
      return 0
    while(tempb<<1 <= tempa)
    {
      tempb = tempb << 1
      quotient = quotient << 1
    }

    // Call division recursively
    if(a < 0)
        quotient = quotient*neg + this.divide(-(tempa-tempb), b);
    else
        quotient = quotient*neg + this.divide(tempa-tempb, b);

    return quotient
  }

  sqrt(n)
  {
    if (n <= 0)
      return 0

    // Find MSB (Most significant Bit) of N
    let mask = 0
    let msb = 0
    for (; msb < 31; msb++)
    {
      mask |= (1 << msb)
      if ((n & ~mask) == 0)
        break
    }
 
    // (a = 2^msb)
    let a = 1 << msb
    let result = 0
    while (a != 0) 
    {
        // Check whether the current value
        // of 'a' can be added or not
        if ((result + a) * (result + a) <= n) 
        {
            result += a
        }
 
        // (a = a/2)
        a >>= 1
    }
 
    // Return the result
    return result
  }

  getRandom(max){
    this.randomCallNum++;
    if (max == 0)
      return 0
    this.randomSeed = ((this.randomSeed * 0x472e396d) + 0x3039) % 0x7fffffff
    return (this.randomSeed >> 0x10) % max
  }

  max(v1, v2) { return v1.n >= v2.n ? v1 : v2 }
  min(v1, v2) { return v1.n <= v2.n ? v1 : v2 }
}
let intMath = new FSIntMath()
export {intMath as FSIntMath}

// 分数类 替换float运算 为了简化运算 固定分母为1000
class FSFraction {
  constructor(numerator) {
    this.n = numerator
    this.d = 1000
  }

  add(value) { return new FSFraction(this.n + value.n) }
  sub(value) { return new FSFraction(this.n - value.n) }
  mul(value) { return new FSFraction(intMath.divide(this.n * value.n, this.d)) }
  div(value) { return new FSFraction(intMath.divide(this.n * this.d, value.n)) }
  neg() { return new FSFraction(-this.n) }

  sqrt() { return new FSFraction(intMath.sqrt(this.n * 10) * 10) }
  tofloat() { return this.n / this.d }

  less(v) { return this.n < v.n }
  lessEqual(v) { return this.n <= v.n }
  greater(v) { return this.n > v.n }
  greaterEqual(v) { return this.n >= v.n }
  equal(v) { return this.n == v.n }
}
export {FSFraction}

// vector
class FSVector 
{
  constructor(x, y) 
  {
    let type = typeof(x)
    if (type == 'number')
    {
      this.x = new FSFraction(x)
      this.y = new FSFraction(y)
    }
    else
    {
      this.x = x; this.y = y 
    }
  }
  add(v) { return new FSVector2(this.x.add(v.x), this.y.add(v.y)) } 
  sub(v) { return new FSVector2(this.x.sub(v.x), this.y.sub(v.y)) }
  mul(v) { return new FSVector2(this.x.mul(v), this.y.mul(v)) }
  div(v) { return new FSVector2(this.x.div(v), this.y.div(v)) }
  dot(v) { return this.x.mul(v.x).add(this.y.mul(v.y)) }
  rot(r) {
    let sin = intMath.sin(r)
    let cos = intMath.cos(r)
    return new FSVector2(this.x.mul(cos).sub(this.y.mul(sin)), this.x.mul(sin).add(this.y.mul(cos))) 
  }
  tofloat() { return [this.x.tofloat(), this.y.tofloat()] }

  equal(v) { return this.x.equal(v.x) && this.y.equal(v.y)}
}
export {FSVector}

// 2d transform 3x3 matix
class FSTransform {
  constructor(position, scale, rotation)
  {
    // translate matrix
    let row0 = [ new FSFraction(1000), new FSFraction(0), new FSFraction(0) ]
    let row1 = [ new FSFraction(0), new FSFraction(1000), new FSFraction(0) ]
    let row2 = [ position.x, position.y, new FSFraction(1000) ]
    let translateMatrix = [ row0, row1, row2 ]

    // scale matrix
    row0 = [ scale.x, new FSFraction(0), new FSFraction(0) ]
    row1 = [ new FSFraction(0), scale.y, new FSFraction(0) ]
    row2 = [ new FSFraction(0), new FSFraction(0), new FSFraction(1000) ]
    let scaleMatrix = [ row0, row1, row2 ]

    // rotate matrix
    let cos = intMath.cos(rotation)
    let sin = intMath.sin(rotation)
    row0 = [ cos, sin, new FSFraction(0) ]
    row1 = [ sin.neg(), cos, new FSFraction(0) ]
    row2 = [ new FSFraction(0), new FSFraction(0), new FSFraction(1000) ]
    let rotateMatrix = [ row0, row1, row2 ]

    this.matrix = this.mulMatrix(this.mulMatrix(rotateMatrix, scaleMatrix), translateMatrix)
  }

  mulMatrix(m1, m2)
  {
    let row00 = m1[0][0].mul(m2[0][0]).add(m1[0][1].mul(m2[1][0])).add(m1[0][2].mul(m2[2][0]))
    let row01 = m1[0][0].mul(m2[0][1]).add(m1[0][1].mul(m2[1][1])).add(m1[0][2].mul(m2[2][1]))
    let row02 = m1[0][0].mul(m2[0][2]).add(m1[0][1].mul(m2[1][2])).add(m1[0][2].mul(m2[2][2]))

    let row10 = m1[1][0].mul(m2[0][0]).add(m1[1][1].mul(m2[1][0])).add(m1[1][2].mul(m2[2][0]))
    let row11 = m1[1][0].mul(m2[0][1]).add(m1[1][1].mul(m2[1][1])).add(m1[1][2].mul(m2[2][1]))
    let row12 = m1[1][0].mul(m2[0][2]).add(m1[1][1].mul(m2[1][2])).add(m1[1][2].mul(m2[2][2]))

    let row20 = m1[2][0].mul(m2[0][0]).add(m1[2][1].mul(m2[1][0])).add(m1[2][2].mul(m2[2][0]))
    let row21 = m1[2][0].mul(m2[0][1]).add(m1[2][1].mul(m2[1][1])).add(m1[2][2].mul(m2[2][1]))
    let row22 = m1[2][0].mul(m2[0][2]).add(m1[2][1].mul(m2[1][2])).add(m1[2][2].mul(m2[2][2]))

    return [[row00, row01, row02], [row10, row11, row12], [row20, row21, row22]]
  }

  mul(transform) {
     let newTransform = new FSTransform
     newTransform.matrix = this.mulMatrix(this.matrix, transform.matrix)
     return newTransform
  }

  invert() {

  }

  translatePosition(position) {
    let m1 = [position.x, position.y, new FSFraction(1000)]
    let m2 = this.matrix
    let x = m2[0][0].mul(m1[0]).add(m2[0][1].mul(m1[1])).add(m2[0][2].mul(m1[2]))
    let y = m2[1][0].mul(m1[0]).add(m2[1][1].mul(m1[1])).add(m2[1][2].mul(m1[2]))
    return new FSVector(x, y)
  }
}

// rect whit minPoint and maxPoint
class FSRect {
  constructor(min, max)
  {
    this.min = min
    this.max = max
  }

  expandWithRect(r) {
    this.min.x = intMath.min(this.min.x, r.min.x)
    this.min.y = intMath.min(this.min.y, r.min.y)
    this.max.x = intMath.max(this.max.x, r.max.x)
    this.max.y = intMath.max(this.max.y, r.max.y)
  }

  intersectRect(rect)
  {
    if (this.min.x.greater(rect.max.x) || rect.min.x.greater(this.max.x))
      return false
    if (this.min.y.greater(rect.max.y) || rect.min.y.greater(this.max.y))
      return false
    return true
  }

  intersectLine(line)
  {

  }

  containPoint(point)
  {
    if (point.x.less(this.min.x) || point.x.greater(this.max.x))
      return false
    if (point.y.less(this.min.y) || point.y.greater(this.max.y))
      return false
    return true
  }
}
export {FSRect}