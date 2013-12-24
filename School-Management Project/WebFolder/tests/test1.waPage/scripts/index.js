
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock
	function formatNumber(str , nb){
		while(str.length < nb){
			str = '0' + str;
		}
		
		return str;
	}
	
	function formatTimeFromNumber(val){
		var
		nbMinutes	= val%60
		nbHours 	= (val - nbMinutes)/60,
		pm			= nbHours > 12;

		if(pm){
			nbHours -= 12;
		}

		return nbHours + ':' + formatNumber(nbMinutes + '' , 2) + ' ' + (pm ? 'PM' : 'AM');
	}
	
	function getDateFromMinutes(baseDate , nb){
		if(!baseDate){
			return null;
		}
		
		var
		nbM = nb%60;
		nbH = (nb - nbM)/60;
		
		baseDate.setHours(nbH);
		baseDate.setMinutes(nbM);
		
		return new Date(baseDate);
	}
	_ns.adminView.getDateFromMinutes= getDateFromMinutes;
	_ns.adminView.formatNumber		= formatNumber;
	_ns.adminView.formatTimeFromNumber = formatTimeFromNumber;
// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		var $scheduler = $$('container1').$domNode;
		
		mappingObj = initScheduler($scheduler.attr('id') , new Date(), 'week' , {
			dataSource 	: sources.timeTable,
			fields		: {
				text			: "comment",
				rec_type 		: 'rec_type',
				end_date		: "endDate",
				courseID		: "course",
				event_pid 		: 'tt_pid',
				teacherID		: "teacher",
				start_date		: "beginDate",
				classroomID		: "classroom",
				studyGroupID	: "studyGroup",
				event_length 	: 'tt_length'
			},
			cacheSize	: 40,
			colorAttr	: 'classroom.color',
			initQuery	: ''
		});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
