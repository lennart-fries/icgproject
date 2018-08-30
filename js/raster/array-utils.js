import { Vector } from '../primitives/vector.js'

/**
 * Turn an array of vectors into an array of numbers x, y, z, w, optionally checking its length
 * @param  {Array.<Vector>} vecArray - array of vectors
 * @param  {number} minLength                - minimum number of vectors in the input array
 * @param  {number} end                      - last component per vector to use, exclusive (2 = y; 3 = z; 4 = w)
 * @param  {number} begin                    - first component per vector to use (0 = x; 1 = y; 2 = z; 3 = w)
 * @return {Array.<number>}                    array with corresponding numbers
 */
export function vecArrayToNumArray (vecArray, minLength = -1, end = 4, begin = 0) {
  // get numbers into array format
  if (minLength > 0 && vecArray.length < minLength) {
    console.error('Too few elements')
  }
  let numArray = []
  vecArray.forEach(vector => {
    numArray = numArray.concat(vector.valueOf().slice(begin, end))
  })
  return numArray
}

/**
 * Turn a single vector or array of vectors into an array of numbers with the correct length, repeating values if necessary
 * @param  {Vector | Array.<Vector>} vecOrVecArray - vector or array of vectors
 * @param  {number} minLength                      - minimum number of vectors to output
 * @param  {number} end                            - last component per vector to use, exclusive (2 = y; 3 = z; 4 = w)
 * @param  {number} begin                          - first component per vector to use (0 = x; 1 = y; 2 = z; 3 = w)
 * @return {Array.<number>}                          array with corresponding numbers
 */
export function vecOrVecArrayToNumArrayRepeating (vecOrVecArray, minLength = -1, end = 4, begin = 0) {
  let vecArray

  // convert vector to 1-element array
  if (vecOrVecArray instanceof Vector) { // single vector
    vecArray = [vecOrVecArray]
  } else if (vecOrVecArray instanceof Array && vecOrVecArray[0] instanceof Vector) { // array of vectors
    vecArray = vecOrVecArray
  } else {
    console.error('Wrong format')
    return null
  }

  // stretch to correct number of vectors
  vecArray = stretchArray(vecArray, minLength)

  return vecArrayToNumArray(vecArray, minLength, end, begin)
}

/**
 * Stretches array to have a minimum number of elements, repeating values if necessary
 * @param  {Array} array      - array to stretch
 * @param  {number} minLength - minimum number of elements to output
 * @return {Array}              stretched array
 */
export function stretchArray (array, minLength) {
  if (array.length < minLength) {
    let newArray = Array(minLength)
    let multiplier = Math.ceil(minLength / array.length)
    for (let i in array) {
      newArray = newArray.fill(array[i], multiplier * i, multiplier * (i + 1))
    }
    return newArray
  } else {
    return array
  }
}

/**
 * Stretches array to have a minimum number of elements, repeating values if necessary
 * @param  {Vector | Array.<Vector>} array - array to stretch
 * @param  {number} minLength              - minimum number of elements to output
 * @return {Array.<number>}                  stretched array
 */
export function multiArray (array, minLength) {
  if (array.length < minLength) {
    let newArray = []
    let multiplier = Math.ceil(minLength / array.length)
    for (let i in newArray) {
      let offset = multiplier * i
      newArray = newArray.fill(array[i], offset, offset + 1)
    }
    return newArray
  } else {
    return array
  }
}
