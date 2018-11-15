// /**
//  * # Utilities
//  *
//  * Helper functions
//  */

// /**
//  * [getSelector description]
//  * @param  {Object} node     - [description]
//  * @param  {Array}  selector - [description]
//  * @return {String}          - [description]
//  */
export function getSelector(node: any, selector = [node.name]): any {
  const parent = node.parent
  if (parent) {
    const children = parent.children
    const matches = children.filter((child: any) => child.name === node.name)
    if (matches.length > 1) {
      for (let i = 0, l = matches.length; i < l; i++) {
        if (matches[i] === node) {
          selector[0] = (`${selector[0]}:nth-of-type(${i + 1})`)
          break
        }
      }
    }
    selector.unshift(parent.name)
  }
  return parent && parent.parent ? getSelector(parent, selector) : selector.join(' > ')
}

// /**
//  * [getDepth description]
//  * @param  {Object} node - [description]
//  * @return {Number}      - [description]
//  */
export function getDepth(node: any) {
  let level = 1 // level: 0
  while (node.parent) {
    level += 1
    node = node.parent
  }
  return level
}

// /**
//  * Changes the the values in the nested collection
//  * @param {Immutable.Map} map     - [description]
//  * @param {Array}         listKey - [description]
//  * @param {Array}         keyPath - [description]
//  * @param {*|Function}    value   - [description]
//  */
// export function setDeep (map, listKey, keyPath, value) {
//   if (!Array.isArray(listKey)) {
//     listKey = [listKey]
//   }
//   const change = (typeof value === 'function') ? 'updateIn' : 'setIn'
//   const subPaths = getPaths(map, listKey, keyPath)
//   return map.withMutations((map) => {
//     subPaths.forEach((keyPath) => map[change](keyPath, value))
//   })

//   function getPaths (map, listKeys, keyPath, overview = [keyPath]) {
//     const list = map.getIn(listKeys)
//     if (list) {
//       const size = list.size
//       for (var i = 0; i < size; i++) {
//         overview.push([...listKeys, i, ...keyPath])
//         getPaths(map, [...listKeys, i, listKeys[0]], keyPath, overview)
//       }
//     }
//     return overview
//   }
// }
