﻿//Creating the Log classmodel.Log = new DataClass("Logs");//Add Note attributes.model.Log.ID = new Attribute("storage", "long", "key auto");model.Log.title = new Attribute("storage", "string");model.Log.dataClassName = new Attribute("storage", "string", "btree");model.Log.entityName = new Attribute("storage", "string");model.Log.changedBy = new Attribute("storage", "string", "btree");model.Log.changeDate = new Attribute("storage", "date");model.Log.from = new Attribute("storage", "string");