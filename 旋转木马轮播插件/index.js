;(function($){
    var Carousel = function(poster){
        //保存单个旋转木马对象
        var self = this;
        this.poster = poster;
        this.posterItemMain = poster.find("ul.poster-list");
        this.nextBtn = poster.find("div.poster-next-btn");
         this.prevBtn = poster.find("div.poster-prev-btn");
         this.posterItems = poster.find("li.poster-item");
         this.posterFirstItem = this.posterItems.first();
         this.posterLastItem = this.posterItems.last();
        //默认配置参数 
        this.setting = {
                        "width":1000,           //幻灯片的宽度
                        "height":563,           //幻灯片高度
                        "posterWidth":640,      //幻灯片第一帧的宽度
                        "posterHeight":270,    //幻灯片第一帧的高度
                        "scale":0.9,            //记录显示比例关系
                        "verticalAlign":"middle",//top,middle,buttom
                        "speed":1000,
                        "autoPlay":true,
                        "delay":3000
                        };
        $.extend(this.setting,this.getSetting());
        //设置配置参数值
        this.setSettingValue();
        this.setPosterPos();
        this.nextBtn.click(function(){
            self.carouseRotate("left");
        });
         this.prevBtn.click(function(){
            self.carouseRotate("right");
        });
        //是否开启自动开放
        if(this.setting.autoPlay){
            this.autoplay();
            this.poster.hover(function(){
                window.clearInterval(self.timer);
            },function(){
                self.autoplay();
            });
        }

    };
    Carousel.prototype = {
        //自动播放
        autoplay:function(){
            var self = this;
            this.timer = window.setInterval(function(){
                self.nextBtn.click();
            },this.setting.delay);
        },

        //设置配置参数值去控制基本的宽度高度
        setSettingValue:function(){
            this.poster.css({
                            width:this.setting.width,
                            height:this.setting.height
                            });
            this.posterItemMain.css({ 
                                    width:this.setting.width,
                                    height:this.setting.height
                                    });
            //计算上下切换按钮的宽度
             var w = (this.setting.width-this.setting.posterWidth)/2;
             this.nextBtn.css({
                                width:w,
                                height:this.setting.height,
                                zIndex:Math.ceil(this.posterItems.size()/2) //向上取整
                                });
             this.prevBtn.css({
                                width:w,
                                 height:this.setting.height,
                               zIndex:Math.ceil(this.posterItems.size()/2)
                                }); 
             //第一帧的宽度高度
             this.posterFirstItem.css({
                                    left:w,
                                    zIndex:Math.floor(this.posterItems.size()/2),//向下取整
                                    width:this.setting.posterWidth,
                                    height:this.setting.posterHeight
                                    });

        },
        //设置剩余的帧的位置关系
        setPosterPos:function(){
            var self = this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size()/2,
                rightSlice = sliceItems.slice(0,sliceSize);
                level = Math.floor(this.posterItems.size()/2);   
                leftSlice = sliceItems.slice(sliceSize);


                //设置右边帧的位置关系和宽度高度top
                var rw = this.setting.posterWidth,
                    rh = this.setting.posterHeight,
                    //间隙
                gap  =((this.setting.width-this.setting.posterWidth)/2)/level;

                var firstLeft  = (this.setting.width - this.setting.posterWidth)/2;
                var fixOffsetLeft = firstLeft + rw;
                rightSlice.each(function(i){
                    level--;
                    rw = rw*self.setting.scale;
                    rh = rh*self.setting.scale;
                    var j = i;
                    $(this).css({
                                zIndex:level,
                                width:rw,
                                height:rh,
                                opacity:1/(++j),
                                left:fixOffsetLeft+(++i)*gap-rw,
                                top:self.setVertucalAlign(rh)
                                });
                });
                //设置左边帧的位置关系和宽度高度top
                var lw = rightSlice.last().width(),
                    lh = rightSlice.last().height(),
                    level_l = Math.floor(this.posterItems.size()/2);
                leftSlice.each(function(i){
                    $(this).css({
                                zIndex:i,
                                width:lw,
                                height:lh,
                                opacity:1/level_l,
                                left:i*gap,
                                top:self.setVertucalAlign(lh)
                                });
                        lw = lw/self.setting.scale;
                        lh = lh/self.setting.scale;
                        level_l--;
                        i++;
                });
        },
        //设置垂直排列对齐
        setVertucalAlign:function(height){
                var verticalType = this.setting.verticalAlign,
                top=0;
                if(verticalType === "middle"){
                    top = (this.setting.height - height)/2;
                }else if(verticalType === "top"){
                    top = 0;
                }else if(verticalType === "bottom"){
                    top = this.setting.height-height;
                }else {
                    top = (this.setting.height -height)/2;
                }
                console.log(top);
                return top;
        },

        //旋转函数
        carouseRotate:function(dir){
            var _this_ = this;
            if(dir === "left"){
                 this.posterItems.each(function(){
                     var self = $(this),
                        prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
                        width = prev.width(),
                        height = prev.height(),
                        zIndex = prev.css("zIndex"),
                        opacity = prev.css("opacity"),
                        left = prev.css("left"),
                        top = prev.css("top");
                        if(!self.is(":animated")){
                            self.animate({zIndex:zIndex,},1,function(){
                                    self.animate({
                                    width:width,
                                    height:height,
                                    opacity:opacity,
                                    left:left,
                                    top:top
                                    },_this_.setting.speed);
                                });
                        }
                        // if(!self.is(":animated")){
                        //     self.animate({zIndex:zIndex,},1,function(){
                        //             self.animate({
                        //             width:width,
                        //             height:height,
                        //             opacity:opacity,
                        //             left:left,
                        //             top:top
                        //                         });
                        //         });
                        // }else{
                        //     self.stop(false,true).animate({zIndex:zIndex,},1,function(){
                        //             self.stop(false,true).animate({
                        //             width:width,
                        //             height:height,
                        //             opacity:opacity,
                        //             left:left,
                        //             top:top
                        //                         });
                        //         });
                        // }
                 });
            }else if(dir === "right"){
                this.posterItems.each(function(){
                     var self = $(this),
                        next = self.next().get(0)?self.next():_this_.posterFirstItem,
                        width = next.width(),
                        height = next.height(),
                        zIndex = next.css("zIndex"),
                        opacity = next.css("opacity"),
                        left = next.css("left"),
                        top = next.css("top");
                        if(!self.is(":animated")){
                            self.animate({zIndex:zIndex,},1,function(){
                                    self.animate({
                                    width:width,
                                    height:height,
                                    opacity:opacity,
                                    left:left,
                                    top:top
                                    },_this_.setting.speed);
                                });
                        }
                        // if(!self.is(":animated")){
                        //     self.animate({zIndex:zIndex,},1,function(){
                        //             self.animate({
                        //             width:width,
                        //             height:height,
                        //             opacity:opacity,
                        //             left:left,
                        //             top:top
                        //                         });
                        //         });
                        // }else{
                        //     self.stop(false,true).animate({zIndex:zIndex,},1,function(){
                        //             self.stop(false,true).animate({
                        //             width:width,
                        //             height:height,
                        //             opacity:opacity,
                        //             left:left,
                        //             top:top
                        //                         });
                        //         });
                        // }

                        
                 });
            }
        },

        //获取人工配置参数
        getSetting:function(){
            var setting = this.poster.attr("data-setting");
            //将参数转换为JSON对象
            if(setting&&setting!=""){
                return $.parseJSON(setting);
            }else{
                return ;
            }
        }
    };
    Carousel.init = function(posters){
        var _this_ = this;
        posters.each(function(){
            new _this_($(this));
        });
    };
    window["Carousel"] = Carousel;
})(jQuery);