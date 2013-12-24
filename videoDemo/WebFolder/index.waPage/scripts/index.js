WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		new VideoDemoApp($$('video1'), $$('toolbar'));	
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
    
// @endregion
};// @endlock


VideoDemoApp = function(video, toolbar) {
    this.YT_CHANNEL_URL = 'http://gdata.youtube.com/feeds/api/videos?author=trailers&max-results=9&orderby=published&v=2&alt=jsonc';
    
	this.videoWidget = video;
	this.toolbarComponent = toolbar;

    this.listTimeout = null;	
	this.currentIndex = 0;
	
	this.init();
}

VideoDemoApp.prototype = {
	init: function() {
        var that = this;
        
		this.$videoList = $('#videoList');
        this.$overlay = $('<div class="overlayInfo"/>').appendTo('body');
		
		this.bindEvents();
		
		// init the toolbar with a reference to the video widget
  		this.toolbarComponent.init(this.videoWidget, this);
  
  		// get video feed
        this.getVideos().done(jQuery.proxy(this.onVideosReady, this));
	},

	onVideosReady: function() {
        $('#videoList a').css('-webkit-transform', 'translateX(0px)');
        this.showVideoList(true);
	},   

    hideLoading: function() {
        $('#noVideo').addClass('hidden');
        
        setTimeout(function() {
            $('#noVideo').css('display', 'none');
        }, 1000);
    },

    showLoading: function() {
        setTimeout(function() {
            $('#noVideo').css('display', 'block');
        }, 1000);        
        $('#noVideo').removeClass('hidden');
    },
    
	bindEvents: function() {
        var that = this;
        
        /* KB shortcuts */
        $(document).keydown(function(event) {
            switch(event.keyCode) {
                case 32:
                	event.preventDefault();
                    that.toolbarComponent.togglePlay();
                    that.showOverlay(that.videoWidget.isPlaying() === true ? 'play' : 'pause');
                break;
                    
                case 37:
                    that.gotoPrev();
                    that.showOverlay('prev');
                break;
                    
                case 39:
                    that.gotoNext();
                    that.showOverlay('next');                    
                break;
                
                case 73:
                	$('#splash').toggleClass('visible');
            }
            return false;
        });

        this.videoWidget.addListener('playing', function() {
            that.enableSeek();
            that.hideLoading();
        });
        
        $('#videoList').hover(function() {
            if (!$(this).hasClass('visible'))
                return;
                
            if (that.listTimeout) {
                clearTimeout(that.listTimeout);
                that.listTimeout = null;
            }
        }, function() {
            if (!$(this).hasClass('visible'))
                return;
                
            that.hideVideoList();
        })
        
        // video list
        $(document).on('click', '#videoList a', function() {
            var videoUrl = $(this).attr('data-video-url');
                    	
            $('#videoList a').removeClass('active');
            $(this).addClass('active');


            that.currentIndex = $(this).find('img').attr('dataIndex');
            
            that.checkButtons();
            
            that.videoWidget.loadVideoByUrl(videoUrl);
            
            that.toolbarComponent.setTitle($(this).find('img').attr('alt'));

            return false;
        });
	},

    enableSeek: function() {
        this.toolbarComponent.slider.enable();
    },
    
    checkButtons: function() {
        try{
            if (this.currentIndex == 0) {
                this.toolbarComponent.prevBt.disable();
            } else {
                this.toolbarComponent.prevBt.enable();
            }
    
            if (this.currentIndex == this.maxIndex) {
                this.toolbarComponent.NextBt.disable();
            } else {
                this.toolbarComponent.nextBt.enable();
                if (this.currentIndex > 0){
                    this.toolbarComponent.prevBt.enable();
                }
            }
        } catch(err) {
        }
    },

    gotoNext: function() {
        this.currentIndex++;
        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = 0;
        }
        
        this.$videoList.find('a').eq(this.currentIndex).trigger('click');
        
        this.checkButtons();
    },

    gotoPrev: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.maxIndex;
        }
        
        this.$videoList.find('a').eq(this.currentIndex).trigger('click');
        
        this.checkButtons();        
    },
    
    showOverlay: function(type) {
        var that = this;
        
        this.$overlay.removeClass('pause play next prev visible');
        setTimeout(function() {
            that.$overlay.addClass(type + ' ' + 'visible');
        }, 0)
    },
    
    showVideoList: function(autoHide) {
        var that = this;
        
        if (this.listTimeout) {
            clearTimeout(this.listTimeout);
            this.listTimeout = null;
        }
        
        $('#videoList').addClass('visible');
        
        if (autoHide) {
            this.listTimeout = setTimeout(function() {
                that.hideVideoList(true);
            }, 3000);
        }
    },
    
    hideVideoList: function(now) {
        var that = this;
        
        if (now) {
            $('#videoList').removeClass('visible');
        } else {
            if (this.listTimeout) {
                clearTimeout(this.listTimeout);
                this.listTimeout = null;
            }
            
            this.listTimeout = setTimeout(function() {
                that.hideVideoList(true);
            }, 500);
        }
    },
    
    getVideos: function() {
        var that = this;

        return $.ajax({
            url: this.YT_CHANNEL_URL,
            dataType:'jsonp'
        }).done(function(res) {
            that.maxIndex = res.data.items.length - 1;
            
            var width = $(window).width();
            if (res && res.data && res.data.items) {
                $(res.data.items).each(function(i) {
                    var $img = $('<img/>').attr({
                        src: this.thumbnail.sqDefault,
                        alt: this.title,
                        dataIndex: i
                    }),
                    $a = $('<a href="#" class="tooltip"/>').attr('data-video-url', this.player.default).css('-webkit-transform', 'translateX(' + width + 'px)').append($img).append('<div class="playing">&nbsp;</div><span>' + this.title + '</span><div class="canPlay">&nbsp;</div>').appendTo('#videoList');
                });
            }
        }).fail(function(res) {
            console.warn('TODO: handle no video results');
        });
    }
}