
model = new DataStoreCatalog();

include("classes/utility.js"); //Utility methods used my all dataclasses.

//Use module pattern for User dataclass definition. I use this dataclass in many projects.
model.User = require('User');

include("classes/activity.js");
include("classes/lead.js");
include("classes/contact.js");
include("classes/account.js");
include("classes/recentItem.js");
include("classes/note.js");
include("classes/log.js");


//Example for Wakanda Training on Model API (v5);
var dataClassNames = ['Lead', 'Account', 'Contact']; 

for (var i = 0, len = dataClassNames.length; i < len; i++) 
{
	model[dataClassNames[i]].collectionMethods.collectionEcho = function() {
		return "There are " + this.length + " entities in the collection."
	};
	
	model[dataClassNames[i]].collectionMethods.collectionEcho.scope = "public";
}

