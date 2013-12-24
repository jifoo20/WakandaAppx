
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var matrix1 = {};	// @matrix
	var login1 = {};	// @login
// @endregion// @endlock

// eventHandlers// @lock

	matrix1.onChildrenDraw = function matrix1_onChildrenDraw (event)// @startlock
	{// @endlock
		var elem$ = $(event.htmlObject);
		if (waf.sources.lead.leadStatus == "Contacted") {
			elem$.find('.contactedCheck').show();
		} else {
			elem$.find('.contactedCheck').hide();
		}	
	};// @lock

	login1.logout = function login1_logout (event)// @startlock
	{// @endlock
		waf.sources.lead.setEntityCollection();
	};// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		waf.sources.lead.all();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("matrix1", "onChildrenDraw", matrix1.onChildrenDraw, "WAF");
	WAF.addListener("login1", "logout", login1.logout, "WAF");
	WAF.addListener("login1", "login", login1.login, "WAF");
// @endregion
};// @endlock
