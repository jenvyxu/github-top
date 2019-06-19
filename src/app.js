import './common.css'
import repoBoard from './component/repoBoard/repoBoard'
import userBoard from './component/userBoard/userBoard'
import search from './component/search/search'

let app = {
  init: function () {
    this.$tabs = $('footer>div')
    this.$panels = $('section')
    this.bind()

    repoBoard.init()
    userBoard.init()
    search.init()
  },
  bind: function () {
    let _this = this
    this.$tabs.on('click', function () {
      $(this).addClass('active').siblings().removeClass('active')
      _this.$panels.eq($(this).index()).fadeIn().siblings().hide()
    })
  }
}
app.init()
