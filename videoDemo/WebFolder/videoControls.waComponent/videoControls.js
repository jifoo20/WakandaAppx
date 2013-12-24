
(function Component (id) {// @lock
    var videoWidget = null,
        videoApp = null;

// Add the code that needs to be shared between components here
function constructor (id) {
	this.load = function (data) {// @lock
	
	this.prevBt = $$(this.id + "_prevBt");
	this.nextBt = $$(this.id + "_nextBt");
	this.playBt = $$(this.id + "_playBt");
	this.helpBt = $$(this.id + "_helpBt");	
    this.currentTime = $$(this.id + "_currentTime");
    this.videoTitle = $$(this.id + "_title");
    this.totalTime = $$(this.id + "_totalTime");
    this.slider = $$(this.id + "_progress")
        
    this.playing = false;
    this.needToSeek = false;
	
	this.init = function(videoRef, app) {
		videoWidget = videoRef;
        videoApp = app;
        this.prevBt.disable();
        this.nextBt.disable();
        this.playBt.disable();
		this.bindEvents();
	    
	    // slider is disabled until a video is loaded
	    this.slider.disable();	
	};

    this.togglePlay = function() {
        if (videoWidget) {
            videoWidget.togglePlay();
            if (videoWidget.isPlaying()) {
                $(this.playBt.containerNode).addClass('playing');
            } else {
                $(this.playBt.containerNode).removeClass('playing');
            }
        }
    };

    this.setTitle = function(title) {
        this.videoTitle.setValue(title);
    }
        
    this.getFormattedTime = function(seconds) {
        var res = {
            h:'00',
            m:'00',
            s:''
        };
        
        if (seconds >= 3600) {
            res.h = Math.floor(seconds / 3600);
            if (res.h < 10) {
                res.h = '0' + res.h;
            }
            seconds = seconds % 3600;
        }
        
        if (seconds >= 60) {
            res.m = Math.floor(seconds / 60);
            if (res.m < 10) {
                res.m = '0' + res.m;
            }
            seconds = seconds % 60;
        }
        
        res.s = seconds;
        
        if (res.s < 10) {
            res.s = '0' + res.s;
        }        
        
        return res;
    };
        
    this.updateCurrentTime = function(time){
        var res = this.getFormattedTime(time);
        this.currentTime.setValue(res.h + ':' + res.m + ':' + res.s);
    };
        
    this.updateTotalTime = function(time) {
        var res = this.getFormattedTime(time);
        this.totalTime.setValue(res.h + ':' + res.m + ':' + res.s);
        this.slider.setMax(res.s);
    };
        
	this.bindEvents = function() {
        var that = this;

        console.log('videoControls::bindEvents');
        
        // buttons
		this.playBt.addListener('click', jQuery.proxy(this.togglePlay, this));
        
        this.slider.addListener('slidestart', function() {
            videoWidget.pause();
        });
        
        this.slider.addListener('slide', function(e, data) {
            that.needToSeek = true;            
        });
        
        this.slider.addListener('slidestop', function(e, data) {
            if (that.needToSeek) {
                that.needtoSeek = false;
                videoWidget.play();        
                videoWidget.seekTo(data.value);
                that.updateCurrentTime(data.value);                
            }
        });

        this.nextBt.addListener('click', function() {
            videoApp.gotoNext();
        });

        this.prevBt.addListener('click', function() {
            videoApp.gotoPrev();
        });

		this.helpBt.addListener('click', function() {
			$('#splash').toggleClass('visible');
		});
     
     	$('#splash .close').click(function() {
     		$(this).parent().toggleClass('visible');
     	});
        
        // listen for video events
        videoWidget.addListener('durationChange', function(e) {
            var int = Math.floor(e.duration);
            that.updateTotalTime(int);
            that.slider.setMax(int);
        });
        
        videoWidget.addListener('timeUpdate', function(e) {
            var int = Math.floor(e.time);
            that.updateCurrentTime(int);
            that.slider.setValue(e.time);
        });
        
        videoWidget.addListener('playing', function() { 
            $(that.playBt.containerNode).addClass('playing'); 
            that.playBt.enable();
        });
        
        videoWidget.addListener('ended', function() { 
            $(that.playBt.containerNode).removeClass('playing'); 
            videoApp.gotoNext();
        });
        
        videoWidget.addListener('paused', function() {
            $(that.playBt.containerNode).removeClass('playing');
        });
        
        $(this.domNode).hover(function() {
            videoApp.showVideoList();
        }, function() {
            videoApp.hideVideoList();
        });            
	};
}
}// @startlock
return constructor;
})();// @endlock
