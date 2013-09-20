roller
======

> jQuery定时滚动解决方案，丰富的参数设置，可根据实际需求精细化定制。

# 参数 & Params
<table>
    <thead>
        <tr>
            <th class="left">参 数</th>
            <th class="right">描 述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td width="150">list</td>
            <td>必填项。列表选择器</td>
        </tr>
        <tr>
            <td>timer</td>
            <td>计时器，默认5s</td>
        </tr>
        <tr>
            <td>speed</td>
            <td>滚动速度，默认400ms</td>
        </tr>
        <tr class="">
            <td>showNum</td>
            <td>显示个数（可见区域内），默认4</td>
        </tr>
        <tr class="">
            <td>rollNum</td>
            <td>单次滚动个数，默认1</td>
        </tr>
        <tr>
            <td>columnWidth</td>
            <td>列宽度(水平滚动方向时)</td>
        </tr>
        <tr class="">
            <td>rowHeight</td>
            <td>行高度(竖直滚动方向时)</td>
        </tr>
        <tr class="">
            <td>auto</td>
            <td>是否自动滚动，默认自动</td>
        </tr>
        <tr class="">
            <td>direction</td>
            <td>默认滚动方向，默认向左(left,right,up,down)</td>
        </tr>
        <tr class="">
            <td>cycle</td>
            <td>是否循环，默认循环</td>
        </tr>
        <tr class="">
            <td>cycleMode</td>
            <td>循环滚动模式[normal,back]，默认无缝连续滚动</td>
        </tr>
        <tr>
            <td>trigger</td>
            <td>按键触发方式，默认单击触发</td>
        </tr>
        <tr>
            <td>hover</td>
            <td>是否鼠标悬停时停止滚动，默认是</td>
        </tr>
        <tr>
            <td>buttonA</td>
            <td>左[上]按键</td>
        </tr>
        <tr>
            <td>buttonB</td>
            <td>右[下]按键</td>
        </tr>
        <tr>
            <td>disableClass</td>
            <td>按键控制class(到达临界状态)</td>
        </tr>
        <tr>
            <td>buttonAutoHide</td>
            <td>长度不够时，是否自动隐藏按键，默认否</td>
        </tr>
        <tr>
            <td>focus</td>
            <td>焦点模式（显示个数及滚动个数都为1时可用，即showNum:1,rollNum:1），默认关闭</td>
        </tr>
        <tr>
            <td>focusOn</td>
            <td>焦点模式当前class，默认'current'</td>
        </tr>
        <tr>
            <td>focusTrigger</td>
            <td>焦点触发方式，默认鼠标经过触发</td>
        </tr>
        <tr>
            <td>callBack</td>
            <td>回调函数（滚动执行完时调用，第一个参数为滚动过的次数，第二个参数为当前滚动方向），默认无</td>
        </tr>
    </tbody>
</table>

# 栗子 & Example
HTML:

    <div id="roller">
        <ul>
            <li>1111</li>
            <li>2222</li>
            <li>3333</li>
    		<li>4444</li>
            <li>5555</li>
            <li>6666</li>
            <li>7777</li>
            <li>8888</li>
            <li>9999</li>
        </ul>
    </div>

Javascript:

```javascript
<script type='text/javascript'>
    $('#roller').roller({
        list: '.roller li',
        timer: 5000,
        speed: 400,
        showNum: 4,
        rollNum: 1,
        columnWidth: 157,
        rowHeight: 152
    });
</script>
```

# 更新日志 & ChangeLog

# License
本项目基于MIT协议发布

MIT: [http://rem.mit-license.org](http://rem.mit-license.org/) 详见 [LICENSE](/LICENSE) 文件