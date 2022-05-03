// components/nav-bar/index.js
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },
  data: {
    statusBarHeight: getApp().globlaData.statusBarHeight,
    NavBarHeight: getApp().globlaData.NavBarHeight
  },
  methods: {
    handleLeftClick() {
      this.triggerEvent('click')
    }
  }
})
