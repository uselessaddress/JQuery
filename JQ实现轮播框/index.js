$(function(){
    $(".seleter").on("click","input",function(){
        clearInterval(id);
        var curIndex = $(this).index();
        console.log(curIndex)
        var marLeft = "-"+curIndex*100+"%";
        console.log(marLeft)
        $(".pic").animate({marginLeft:marLeft});
        $(this).siblings().addClass("before_active-btn").removeClass("active");
        $(this).removeClass("before_active-btn").addClass("active");
    })
    var state = 0;
    var id = setInterval(function(){
        if(state<3){
            state++;
        }else{
            state=0;
        }
        var state_auto = state+1;
        var marLeft_auto = "-"+state*100+"%";
        $(".pic").animate({marginLeft:marLeft_auto});
        $(".seleter input:nth-child("+state_auto+")").siblings().addClass("before_active-btn").removeClass("active");
        $(".seleter input:nth-child("+state_auto+")").removeClass("before_active-btn").addClass("active");
    },2000);
})