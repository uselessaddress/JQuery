// 自调用匿名函数
	var Scroll = {};
		(function(win,doc,$){	
			function CusScrollBar(options){
				this._init(options);
			}
			// CusScrollBar.prototype._init = function(options){
			// 	var self = this;
			// 	self.options = {
			// 		scrollDir     : "y", //滚动的方向
			// 		contSelector  : "",  //滚动内容区选择器
			// 		barSelector   : "",	 //滚动条选择器
			// 		sliderSelector: ""   //滚动滑块选择器
			// 	}
			// 	$.extend(true,self.options,options||{});
			// 	console.log(self.options.contSelector);
			// }
			CusScrollBar.prototype = {
				_init:function(options){
					var self = this;
					self.options = {
						scrollDir     : "y", //滚动的方向
						contSelector  : "",  //滚动内容区选择器
						barSelector   : "",	 //滚动条选择器
						sliderSelector: "",   //滚动滑块选择器
						wheelStep	  :	10,   //滚轮步长
						tabItemSelector:'.tab-item',//标题选择器
						tabActiveClass :'tab-active',//选中便签类名
						anchorSelector :'.anchor'//锚点选择器

						//每一篇内容不足以撑开可视区域的内容的话，那么点击tab的话
						// 那么那就还会定位不对的地方，此时我们可以通过css设置为min-height：100%;来解决这个问题
					}
				$.extend(true,self.options,options||{});//true表示进行深拷贝
				self._initDomEvent();
				console.log(self.options.contSelector);
				return self;
				},
				/*初始化DOM引用
				@method _initDomEvent
				@return {CusScrollBar}*/
				_initDomEvent:function(){
					var opts = this.options;
					//滚动内容区对象，必填项
					this.$cont = $(opts.contSelector);
					//滚动条滑块对象，必填项
					this.$slider = $(opts.sliderSelector);
					//滚动条对象
					this.$bar = opts.barSelector ? $(opts.barSelector) :self.$slider.parent();
					//便签项
					this.$tabItem = $(opts.tabItemSelector);
					//锚点项
					this.$anchor = $(opts.anchorSelector);
					//获取文本对象
					this.$doc = $(doc);

					this._initSliderDragEvent()
						._bindContentScroll()
						._initTabEvent()
						this._bindMousewheel();
				},
				/*初始化滑块拖动功能
				@return {[Object]} [this]*/
				_initSliderDragEvent:function(){
					console.log("test");
					var self = this;  //不写报错
					var slider = this.$slider,
						sliderEl = slider[0];
					if(sliderEl){
						var doc = this.$doc,
							dragStartPagePosition,
							dragStartScrollPosition,
							dragContBarRate;
							//e是事件对象
							function mousemoveHandler(e){
								e.preventDefault();
								if(dragStartPagePosition==null){
									return ;
								}
								//内容开始卷曲的高度+rate*(鼠标释放的位置-开始的位置) == 内容滑块的位置
								self.scrollTo(dragStartScrollPosition+(e.pageY-dragStartPagePosition)*dragContBarRate);
							}

							/*
							滑块移动距离   		内容滚动高度
							——————————————   =	——————————————
							滑块可移动距离		   内容可滚动高度

							rate = 内容可滚动高度/滑块可移动距离
							rata*滑块移动距离 = 内容滚动高度
							内容开始卷曲的高度+rate*(鼠标释放的位置-开始的位置) == 内容滑块的位置

							*/
						slider.on("mousedown",function(e){
							e.preventDefault();
							//获取鼠标的点击开始位置
							dragStartPagePosition = e.pageY;
							//获取内容区域的向上卷曲的高度
							dragStartScrollPosition = self.$cont[0].scrollTop;
							// console.log(dragStartScrollPosition)
							dragContBarRate = self.getMaxScrollPosition()/self.getMaxSliderPosition();
							//绑定在doc上的原因是为了持续触发
							doc.on("mousemove.scroll",mousemoveHandler).on("mouseup.scroll",function(){
								doc.off(".scroll");
							})
						})
						return self;
					}	
				},
				//初始化便签切换功能
				_initTabEvent:function(){
					var self = this;
					self.$tabItem.on('click',function(e){
						e.preventDefault();
						var index = $(this).index();
						self.changeTabSelect(index);
						//点击锚点，滚到对应的内容：已经滚出可视区的内容高度+指定锚点与内容容器的距离
						self.scrollTo(self.$cont[0].scrollTop+self.getAnchorPosition(index));
					})
					return self;
				},
				//切换便签的选中
				changeTabSelect:function(index){
					var self = this;
					active = self.options.tabActiveClass;
					self.$tabItem.eq(index).addClass(active).siblings().removeClass(active);
				},
				//获取锚点内容与上边界的像素数（锚点h3）
				getAnchorPosition:function(index){
					//position()获取相对于它最近的具有相对位置(position:relative或position:absolute)的父级元素的距离，
					//如果找不到这样的元素，则返回相对于浏览器的距离。
					return this.$anchor.eq(index).position().top;
				},
				//获取每个锚点位置信息的数组
				getAllAnchorPosition:function(){
					var self = this,
						allPositionArr = [];
					for(var i = 0;i < self.$anchor.length;i++){
						allPositionArr.push(self.$cont[0].scrollTop + self.getAnchorPosition(i))
					}
					return allPositionArr;
				},

				//计算滑块当前位置
				getSliderPosition:function(){
					var self = this,
							//滑块可以移动的距离
							   maxSliderPosition = self.getMaxSliderPosition();
					return Math.min(maxSliderPosition,maxSliderPosition*self.$cont[0].scrollTop/self.getMaxScrollPosition());
				},

				//内容可滚动的高度
				getMaxScrollPosition:function(){
					var self = this;
					// console.log(self.$cont.height())
					// console.log(self.$cont[0].scrollHeight)
					return Math.max(self.$cont.height(),self.$cont[0].scrollHeight)-self.$cont.height();

				},

				//滑块可滚动的距离
				getMaxSliderPosition:function(){
					var self = this;
					return self.$bar.height() - self.$slider.height();
				},
				//监听内容的滚动，同步滑块的位置
				_bindContentScroll:function(){
					var self = this;
					self.$cont.on('scroll',function(){
						var sliderEl = self.$slider && self.$slider[0];
						if(sliderEl){
							sliderEl.style.top = self.getSliderPosition()+'px';
						}
					});
					return self;
				},
				//鼠标滚动事件
				_bindMousewheel:function(){
					var self = this;
					//on监听事件,多个事件利用空格分开
					self.$cont.on('mousewheel DOMMouseScroll',function(e){
						e.preventDefault();
						//判断原生事件对象的属性
						var oEv = e.originalEvent,//指向原生事件
						//原生事件对象，（其他浏览器负数向下，Firefox正数向下，所以在wheelDelta前面有负数）
						//想要达到的效果，鼠标向下滚动，内容向上走
						//Firefox 鼠标滚轮向上滚动是-3，向下滚动是3
						//Chrome 鼠标滚轮向上滚动是120，向下滚动是-120
						wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detal || 0)/3;
						self.scrollTo(self.$cont[0].scrollTop + wheelRange*self.options.wheelStep)
					});
				},

				/*同步内容的高度*/
				scrollTo:function(positionVal){
					var self = this;
					//获取锚点位置的数组
					var posArr = self.getAllAnchorPosition();
					len = posArr.length;
					function getIndex(positionVal){
						//判断滑动到哪个锚点位置
						for(var i = len-1;i>=0;i--){
							if(positionVal >= posArr[i]){
								//判断条件，当scrollTop的值大于锚点定位的位置,则表示内容在那个锚点范围里面
								return i;
							}
						}
					}
					//锚点数与标签数相同
					if(posArr.length === self.$tabItem.length){
						//标签选择事件
						self.changeTabSelect(getIndex(positionVal));
					}
					self.$cont.scrollTop(positionVal);
				}
			};
			Scroll.CusScrollBar=CusScrollBar;
		})(window,document,jQuery);

		new Scroll.CusScrollBar({
			contSelector  : ".scroll-cont",//滚动内容区选择器
			barSelector   : ".scroll-bar", //滚动条选择器
			sliderSelector: ".scroll-slider"//滚动滑块选择器
		});