
export default {
    init: function () {
        this.$element = $('#repoBoard')
        this.page = 1
        this.count = 30
        this.isLoading = false
        this.isFinish = false
        this.bind()
        this.start()
    },
    bind: function () {
        let _this = this
        let clock
        this.$element.scroll(function () {
            if (clock) {//函数节流
                clearTimeout(clock)
            }
            clock = setTimeout(function () {
                //判断页面是否滚动到底部
                if (_this.isToBottom()) {
                    _this.start()
                }
            }, 300)
        })
    },
    start: function () {
        let _this = this
        this.getData(function (data) {
            _this.renderData(data)
        })
    },
    getData: function (callback) {
        let _this = this
        if (_this.isLoading) return
        _this.isLoading = true
        _this.$element.find('.loading').show()
        $.ajax({
            url: 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc',
            data: {
                page: _this.page
            },
            dataType: 'jsonp'
        }).done(function (ret) {

            if (_this.page >= ret.total) {
                _this.isFinish = true
            }
            callback && callback(ret)
            _this.page++
        }).fail(function () {
            console.log('数据异常')
        }).always(function () {
            _this.isLoading = false
            _this.$element.find('.loading').hide()
        })
    },
    createNode: function (subject, index) {
        let tpl = `
        <div class="item">
          <a href="https://github.com/TryGhost/Ghost">
            <div class="order"><span>1</span></div>
            <div class="detail">
              <h2>Ghost</h2>
              <div class="description">Knockout makes it easier to create rich, responsive UIs with JavaScript</div>
              <div class="extra"><span class="iconfont icon-star"></span><span class="star-count">4196</span></div>  
           </div>
         </a>
        </div> `
        let $node = $(tpl)
        $node.find('.order span').text(index)
        $node.find('a').attr('href', subject.html_url)
        $node.find('.detail h2').text(subject.name)
        $node.find('.detail .description').text(subject.description)
        $node.find('.detail .collection').text(this.toThousand(subject.collect_count))
        $node.find('.detail .star-count').text(this.toThousand(subject.stargazers_count))
        return $node
    },
    renderData: function (data) {
        let _this = this
        data.data.items.forEach(function (item, index) {
            let $node = _this.createNode(item, (_this.page - 1) * _this.count + index + 1)
            _this.$element.find('.container').append($node)
        })
    },
    toThousand: function (num) { //123456 => 123.4k
        if (num <= 1000) return
        let bigNum = Math.floor(num / 1000)
        let smallNum = String(num % 1000).substr(0, 1)
        return bigNum + '.' + smallNum + 'k'
    },
    isToBottom: function () {
        return this.$element.find('.container').height() <= this.$element.height() + this.$element.scrollTop() + 20
    }
}
