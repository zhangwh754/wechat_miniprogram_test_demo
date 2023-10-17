// pages/table/table.js

import { createEmptyObjectWithStructure, request } from '../../utils/index'

Component({
  data: {
    formData: {
      BusiType: 2,
      Yddz: '上海市徐汇区南丹路000号',
      Ydxzyt: '商业/经营',
      Ydfhsy: '一级负荷',
      Rhzfdffs: '',
      Rhkhyh: '',
      Rhzhmc: '',
      Rhyhzh: '',
      Lxr: '',
      Lxdh: '',
      Lxdz: '',
      Yb: '',
    },

    originArray: [
      {
        Dydj: '',
        Dybh: '',
        arr: [
          {
            Byqzjrl: '',
            Ts: '',
          },
        ],
      },
    ],

    improvedArray: [
      {
        Dydj: '',
        Dybh: '',
        arr: [
          {
            Byqzjrl: '',
            Ts: '',
          },
        ],
      },
    ],

    voltageRank: [
      {
        label: '220kV',
        value: '01',
      },
      {
        label: '110kV',
        value: '02',
      },
      {
        label: '45kV',
        value: '03',
      },
      {
        label: '10kV',
        value: '04',
      },
      {
        label: '380V',
        value: '05',
      },
    ],
  },

  methods: {
    async confirm(e) {
      const status = e.currentTarget.dataset.status

      const param = {
        DataStatus: status,
        BusiType: 1,
        OrderIdStr: this.data.OrderId,
        SqbgData: {},
      }

      try {
        const res = await request('保存中', '')
      } catch (error) {
        console.log(error)
      }
    },

    bindInput(e) {
      const key = e.currentTarget.dataset.key

      this.setData({
        [key]: e.detail.value,
      })
    },

    /**
     * @description: 新增电源点或新增变压器
     */
    addRow(e) {
      const type = e.currentTarget.dataset.type
      const subtype = e.currentTarget.dataset.subtype

      if (subtype === undefined) {
        let [...data] = this.data[type]
        data = data.concat(createEmptyObjectWithStructure(this.data[type]))
        this.setData({
          [type]: data,
        })
      } else {
        const index = e.currentTarget.dataset.index

        let [...data] = this.data[type][index][subtype]
        data = data.concat(createEmptyObjectWithStructure(this.data.improvedArray[0][subtype]))
        let updatedItem = `${type}[${index}].${subtype}`
        this.setData({
          [updatedItem]: data,
        })
      }
    },

    /**
     * @description: 移除电源点或新增变压器
     */
    removeRow(e) {
      const type = e.currentTarget.dataset.type
      const subtype = e.currentTarget.dataset.subtype
      const index = e.currentTarget.dataset.index
      const subindex = e.currentTarget.dataset.subindex

      // subtype是undefined，删除的是originArray/improvedArray
      if (subtype === undefined) {
        let [...data] = this.data[type]

        data.splice(index, 1)

        this.setData({
          [type]: data,
        })
      }
      // subtype有值，删除的是里面的arr
      else {
        let [...data] = this.data[type][index][subtype]

        data.splice(subindex, 1)

        let updatedItem = `${type}[${index}].${subtype}`

        this.setData({
          [updatedItem]: data,
        })
      }
    },
  },
})
