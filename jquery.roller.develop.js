/*
 * =========== 【定时滚动解决方案】插件可设置参数及默认值 ===========
 * list:'selector', //列表选择器,必填项
 * timer : 5000, // 计时器，默认5s
 * speed : 400, // 滚动速度，默认400ms
 * showNum : 4, // 显示个数（可见区域内），默认4
 * rollNum : 1, // 单次滚动个数，默认1
 * columnWidth : '', // 列宽度(水平滚动方向时)
 * rowHeight : '', // 行高度(竖直滚动方向时)
 * auto : true, // 是否自动滚动，默认自动
 * direction : 'left', // 滚动方向，默认向左
 * cycle : true, // 是否循环，默认循环
 * cycleMode : 'normal', // 循环滚动模式[normal,back]，默认无缝连续滚动
 * trigger : 'click', // 按键触发方式，默认单击触发
 * hover : true, // 是否鼠标悬停时停止滚动，默认是
 * buttonA : '#buttonLeft', // 左[上]按键
 * buttonB : '#buttonRight', // 右[下]按键
 * disableClass : '', // 按键控制class(到达临界状态添加)
 * buttonAutoHide : false, // 长度不够时，是否自动隐藏按键，默认否
 * focus : '', // 焦点模式（显示个数及滚动个数都为1时可用，即showNum:1,rollNum:1），默认关闭
 * focusOn : 'current', // 焦点模式当前class，默认'current'
 * focusTrigger : 'mouseover', // 焦点触发方式，默认鼠标经过触发
 * callBack : '' // 回调函数（滚动执行完时调用，第一个参数为滚动过的次数，第二个参数为当前滚动方向），默认无
 * ====================================
 * 插件版本：V 1.2
 * @作者:柳裟
 * QQ:1599538531
 * 2012-06-22
 * 访问 http://www.jsfor.com/ 获取最新版本
 * ====================================
*/
;(function($){
	$.fn.roller = function( opt ){			
		var obj = $(this);
		if( !obj.length || !opt instanceof Object ){ return obj }; //对象不存在返回
		
		// 参数初始化
		opt = $.extend({
			list : '', //列表选择器,必填
			timer : 5000, // 计时器，默认5s
			speed : 400, // 滚动速度，默认400ms
			showNum : 4, // 显示个数（可见区域内），默认4
			rollNum : 1, // 单次滚动个数，默认1
			columnWidth : '', // 列宽度(水平滚动方向时)
			rowHeight : '', // 行高度(竖直滚动方向时)
			auto : true, // 是否自动滚动，默认自动
			direction : 'left', // 默认滚动方向，默认向左[left,right]
			cycle : true, // 是否循环，默认循环
			cycleMode : 'normal', // 循环滚动模式[normal,back]，默认无缝连续滚动
			trigger : 'click', // 按键触发方式，默认单击触发
			hover : true, // 是否鼠标悬停时停止滚动，默认是
			buttonA : '', // 左[上]按键
			buttonB : '', // 右[下]按键
			disableClass : '', // 按键控制class(到达临界状态添加)，默认无
			buttonAutoHide : false, // 长度不够时，是否自动隐藏按键，默认否
			focus : '', // 焦点模式（显示个数及滚动个数都为1时可用，即showNum:1,rollNum:1），默认关闭
			focusOn : 'current', // 焦点模式当前class，默认'current'
			focusTrigger : 'mouseover', // 焦点触发方式，默认鼠标经过触发
			callBack : '' // 回调函数（滚动执行完时调用，第一个参数为滚动过的次数，第二个参数为当前滚动方向），默认无
		},opt);
		
		var list = $(opt.list);
		if( !list.length ){ return obj }; //列表项不存在返回
		
		// 按键自动隐藏
		if( opt.buttonAutoHide && list.length <= opt.showNum ){ 
			$(opt.buttonA).hide();
			$(opt.buttonB).hide();
			return obj;
		};
		
		// 列宽[行高]初始化
		opt.columnWidth = opt.columnWidth == '' ? $(opt.list).eq(0).outerWidth(true) : opt.columnWidth;
		opt.rowHeight = opt.rowHeight == '' ? $(opt.list).eq(0).outerHeight(true) : opt.rowHeight;
		
		var cycle = opt.cycle,
			rollNum = opt.rollNum,
			buttonA = $(opt.buttonA),
			buttonB = $(opt.buttonB),
			parElement = list.parent(), //父层元素
			elLen = list.length, // 实际数量
			remainder = elLen - opt.showNum, // 余数（实际总个数-显示区个数）
			isLevel = opt.direction == 'left' || opt.direction == 'right', // 是否水平方向
			isFocus = ( $(opt.focus).length && rollNum == 1 && opt.showNum == 1 ), // 是否焦点模式
			isCallBack = ( opt.callBack && typeof opt.callBack == 'function'  ), // 是否回调
			colRow = isLevel ? opt.columnWidth : opt.rowHeight, // 列宽或行高
			sinRollValue = colRow * rollNum, // 单次滚动值
			dir = isLevel ? 'margin-left' : 'margin-top', // 滚动方向
			rollTime,// 定时器
			rollType, // 用于记录当前滚动方向
			rolled = 0, // 滚动次数
			oldIndex = 0; // 焦点模式上一次的索引
		
		// 初始化对象样式
		obj.css( isLevel ? 'width' : 'height',( opt.showNum * colRow ) + 'px' ).css('overflow','hidden');
		
		// 非循环且余数小于单次滚动个数 则执行DOM复制
		if( cycle && ( opt.cycleMode === 'normal' || remainder < rollNum ) ){
			parElement.append( list.clone(true) );
			elLen *= 2;
		};
		
		// 子元素父层宽度[高度]处理
		parElement.css( isLevel ? 'width' : 'height',( elLen * colRow ) + 'px' );
		
		// 限制单次滚动的个数（不能大于可见区域内显示数量）
		rollNum = rollNum > opt.showNum ? opt.showNum : rollNum;
		
		// 是否可切换按钮状态
		var changeBtnClass = ( ( !cycle || cycle && opt.cycleMode === 'back' && opt.auto ) && opt.disableClass instanceof Object && opt.disableClass.leftUp && opt.disableClass.rightDown && buttonA.length && buttonB.length );
		if( changeBtnClass ){
			buttonA.addClass( opt.disableClass.leftUp );
		};
		
		// 左[上]方向处理过程
		var leftUp = function(){
			if( parElement.is(":animated") ){ return false };
			var disableScroll = false, // 禁止滚动标识
				num = rollNum, // 滚动宽度乘基数
				theRest = remainder - rolled; // 剩余数目
			
			// 动画前置动作，滚动次数为0时 执行后半部移至头部
			if( cycle && opt.cycleMode === 'normal' ){
				if( rolled == 0 ){
					parElement.prepend( $(opt.list + ':gt(' + ( elLen / 2 - 1 ) + ')') ).css(dir, - ( elLen / 2 ) * colRow + 'px');
				};
			}else if( !cycle && rolled == 0 ){
				return false;
			};
			
			// 滚动次数小于单次滚动数
			if( ( !cycle || ( cycle && opt.cycleMode === 'back' ) ) && rolled < rollNum ){
				num = rolled;
				disableScroll = true;
			};
			
			rollType = leftUp; // 记录当前方向
			
			// 动画参数对象
			var aniConfig = {};
			aniConfig[dir] = '+=' + num * colRow + 'px';
			
			parElement.animate(aniConfig,opt.speed,function(){
				rolled = disableScroll ? 0 : rolled - rollNum;
				if( cycle ){
					if( opt.cycleMode === 'normal' ){
						if( rolled < 0 ){ rolled = elLen / 2 - rollNum };
					}else if( opt.auto && opt.cycleMode === 'back' ){
						if( rolled == 0 ){
							clearInterval(rollTime);
							rollTime = setInterval( rightDown,opt.timer );
						};
					};	
				};
				// 按键状态切换
				if( changeBtnClass ){ toggleClass(rolled) };
				// 焦点模式执行
				if( isFocus ){ curClass(rolled) };
				// 回调
				if( isCallBack ){ opt.callBack(rolled,isLevel ? 'right' : 'down') };
			});
		},
		// 右[下]方向处理过程
		rightDown = function(){
			if( parElement.is(":animated") ){ return false };
			var disableScroll = false, // 禁止滚动标识
				num = rollNum, // 滚动宽度乘基数
				theRest = remainder - rolled; // 剩余数目
				
			// 非循环模式 剩余数目等于0
			if( !cycle && theRest == 0 ){
				return false;
			};
				
			// 剩余数目小于单次滚动数
			if( ( !cycle || ( cycle && opt.cycleMode === 'back' ) ) && theRest < rollNum ){
				num = theRest;
				disableScroll = true;
			};
			
			rollType = rightDown; // 记录当前方向
			
			// 动画参数对象
			var aniConfig = {};
			aniConfig[dir] = '-=' + num * colRow + 'px';
			
			parElement.animate(aniConfig,opt.speed,function(){
				rolled = disableScroll ? remainder : rolled + rollNum;
				if( cycle ){
					if( opt.cycleMode === 'normal' ){
						// 滚动次数大于或等于元素个数时 执行前半部移至尾部
						if( rolled >= elLen / 2 ){
							var restRolled = rolled - elLen / 2;
							parElement.append( $(opt.list + ':lt('+ elLen / 2 +')') ).css(dir,( restRolled * colRow ) + 'px');
							rolled = restRolled;
						};
						if( isFocus && rolled > remainder ){ rolled = 0 };
					}else if( opt.auto && opt.cycleMode === 'back' ){
						if( rolled == remainder ){
							clearInterval(rollTime);
							rollTime = setInterval( leftUp,opt.timer );
						};
					};
				};
				// 按键状态切换
				if( changeBtnClass ){ toggleClass(rolled) };
				// 焦点模式执行
				if( isFocus ){ curClass(rolled) };
				// 回调
				if( isCallBack ){ opt.callBack(rolled,isLevel ? 'left' : 'up') };
			});
		};
		
		// 绑定左按键
		if( opt.buttonA && buttonA.length  ){
			buttonA[opt.trigger](function(){
				leftUp();
			});
		};
		
		// 绑定右按键
		if( opt.buttonB && buttonB.length  ){
			buttonB[opt.trigger](function(){
				rightDown();
			});
		};
		
		// 按键状态处理
		function toggleClass( rolled ){
			if( rolled == 0 ){
				buttonB.removeClass( opt.disableClass.rightDown );
				buttonA.addClass(opt.disableClass.leftUp);
			}else if( rolled == remainder ){
				buttonA.removeClass( opt.disableClass.leftUp );
				buttonB.addClass(opt.disableClass.rightDown);
			}else{
				buttonA.add(buttonB).removeClass(opt.disableClass.leftUp + " " + opt.disableClass.rightDown);
			};
		};
		
		// 焦点模式处理过程
		if( isFocus ){
			var numList = $(opt.focus),
				// class切换
				curClass = function(index){
					numList.eq(oldIndex).removeClass(opt.focusOn).end().eq(index).addClass(opt.focusOn);
					oldIndex = index;
				};
				
			// 初始给第一个焦点加上class	
			numList.eq(0).addClass(opt.focusOn);
			
			// 焦点处理
			numList[opt.focusTrigger](function(){
				var index = $(this).index(opt.focus), differ = ( oldIndex - index > 0 );
				// 若是当前焦点则不作处理
				if( index == oldIndex ){ return false };
				if( changeBtnClass ){ toggleClass(index) };
				// 动画参数对象
				var aniConfig = {};
				aniConfig[dir] = '-' + index * colRow + 'px';
				curClass(index);
				parElement.stop().animate(aniConfig,opt.speed,function(){
					rolled = index;
					// 回调
					if( isCallBack ){ opt.callBack(index,isLevel ? ( differ ? 'right' : 'left' ) : ( differ ? 'down' : 'up' )) };
				});
			});
		};
		
		// 初始化当前方向
		rollType = leftUp; 
		
		// 模式判断
		if( opt.auto ){
			// 鼠标悬停
			if( opt.hover ){
				obj.add(buttonA).add(buttonB).add($(opt.focus)).hover(
					function(){
						clearInterval(rollTime);
					},
					function(){
						clearInterval(rollTime);
						rollTime = setInterval( rollType,opt.timer );
					}
				);
			};
			// 启动定时器
			rollTime = setInterval( opt.direction === 'left' || opt.direction === 'up' ? rightDown : leftUp,opt.timer );
		};
	};
})(jQuery);