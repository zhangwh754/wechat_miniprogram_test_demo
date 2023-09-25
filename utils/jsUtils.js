export const createEmptyObjectWithStructure = arr => {
  if (typeof arr !== 'object' || arr === null) {
    // 非对象或 null，直接返回
    return ''
  }

  if (Array.isArray(arr)) {
    // 如果是数组，遍历数组并递归调用函数
    return [createEmptyObjectWithStructure(arr[0])]
  }

  // 如果是对象，遍历对象的键值对并递归调用函数
  const newObj = {}
  for (const key in arr) {
    newObj[key] = createEmptyObjectWithStructure(arr[key])
  }
  return newObj
}
