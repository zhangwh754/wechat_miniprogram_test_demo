Page({
  data: {
    formItems: [{ name: '', subItems: [''] }],
  },
  addFormItem() {
    const newItem = { name: '', subItems: [''] }
    this.setData({
      formItems: [...this.data.formItems, newItem],
    })
  },
  removeFormItem(event) {
    const index = event.currentTarget.dataset.index
    this.data.formItems.splice(index, 1)
    this.setData({
      formItems: this.data.formItems,
    })
  },
  addSubItem(event) {
    const index = event.currentTarget.dataset.index
    const newSubItem = ''
    this.setData({
      [`formItems[${index}].subItems`]: [...this.data.formItems[index].subItems, newSubItem],
    })
  },
  removeSubItem(event) {
    const index = event.currentTarget.dataset.index
    const subIndex = event.currentTarget.dataset.subindex
    this.data.formItems[index].subItems.splice(subIndex, 1)
    this.setData({
      [`formItems[${index}].subItems`]: this.data.formItems[index].subItems,
    })
  },
  inputName(event) {
    const index = event.currentTarget.dataset.index
    const newValue = event.detail.value
    this.setData({
      [`formItems[${index}].name`]: newValue,
    })
  },
  inputSubItem(event) {
    const index = event.currentTarget.dataset.index
    const subIndex = event.currentTarget.dataset.subindex
    const newValue = event.detail.value
    this.setData({
      [`formItems[${index}].subItems[${subIndex}]`]: newValue,
    })
  },
  submitForm() {
    // 在这里处理提交逻辑
    console.log(this.data.formItems)
  },
})
