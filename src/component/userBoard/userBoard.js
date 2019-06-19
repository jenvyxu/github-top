export default {
    init: function () {
        this.$element = $('#userBoard')
        this.page = 1
        this.count = 30
        this.isFinish = false
        this.isLoading = false
        this.start()
        this.bind()
    },
    start: function () {
        let _this = this
        this.getData(function (data) {
            _this.renderData(data)
        })
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
    isToBottom: function () {
        return this.$element.find('.container').height() <= this.$element.height() + this.$element.scrollTop() + 20
    },
    getData: function (callback) {
        let _this = this
        if (_this.isLoading) return
        _this.isLoading = true
        _this.$element.find('.loading').show()
        $.ajax({
            url: 'https://api.github.com/search/users?q=followers:>1000+location:china+language:javascript',
            data: { page: this.page },
            dataType: 'jsonp'
        }).done(function (ret) {
            if (_this.index >= ret.total) {
                _this.isFinish = true
            }
            callback && callback(ret)
            _this.page++
            _this.isLoading = false
        }).fail(function () {
            console.log('数据异常')
        }).always(function () {
            _this.$element.find('.loading').hide()
        })
    },
    renderData(data) {
        let _this = this
        data.data.items.forEach(function (item, index) {
            let $node = _this.createNode(item, (_this.page - 1) * _this.count + index + 1)
            _this.$element.find('.container').append($node)
        })
    },
    createNode: function (subject, index) {
        let $node = $(`<div class="item">
          <a href="https://github.com/TryGhost/Ghost">
            <div class="cover"><img src="" alt=""></div>
            <div class="detail">
            <h2>Ghost</h2>
          </a>
        </div> `)
        $node.find('.cover img').attr('src', subject.avatar_url)
        $node.find('a').attr('href', subject.html_url)
        $node.find('.detail h2').text(subject.login)
        return $node
    }
}
