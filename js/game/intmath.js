
// 只涉及到整数运算的数学库
class FSIntMath {
  constructor() {
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
    while (a != 0) {
 
        // Check whether the current value
        // of 'a' can be added or not
        if ((result + a) * (result + a) <= n) {
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
}

let intMath = new FSIntMath()
export {intMath}

// 分数类 为了简化运算 固定分母为1000
class FSFraction {
  constructor(numerator) {
    this.n = numerator
    this.d = 1000
  }

  add(value) {
    let type = typeof(value)
    let result = new FSFraction(0)
	  if (type == 'number')
      result.n = this.n + value * this.d
	  else if (type == 'object')
      result.n = this.n + value.n
    return result
  }

  sub(value) {
    let type = typeof(value)
    let result = new FSFraction(0)
	  if (type == 'number')
		  result.n = this.n - value * this.d
	  else if (type == 'object')
      result.n = this.n - value.n
    return result
  }

  mul(value) {
    let type = typeof(value)
    let result = new FSFraction(0)
	  if (type == 'number')
		  result.n = this.n * value
	  else if (type == 'object')
      result.n = intMath.divide(this.n * value.n, this.d)
    return result
  }

  div(value) {
    let type = typeof(value)
    let result = new FSFraction(0)
	  if (type == 'number')
		  result.n = intMath.divide(this.n, value)
	  else if (type == 'object')
      result.n = intMath.divide(this.n * this.d, value.n)
    return result
  }

  sqrt() {
    let result = new FSFraction(0)
    result.n = intMath.sqrt(this.n * 10) * 10
    return result
  }
}
export {FSFraction as fraction}

