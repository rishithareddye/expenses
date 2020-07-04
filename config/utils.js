module.exports = {
	parseQueryString: function (query,columns) {
		var filter = query.filter;
		var filterTerm = query.filterTerm;
		var sortBy = query.sortBy;
		var sortOrder = query.sortOrder ? query.sortOrder:"asc";
		var searchColumn = query.searchColumn ? (query.searchColumn instanceof Array) ? query.searchColumn : [query.searchColumn] : [];
		var searchTerm = query.searchTerm ? (query.searchTerm instanceof Array) ? query.searchTerm : [query.searchTerm]: [];
		var searchOperator = query.searchOperator ? (query.searchOperator instanceof Array) ? query.searchOperator : [query.searchOperator]: [];
		if(searchColumn.length != searchTerm.length && searchColumn.length != searchOperator.length)
		{
			searchColumn = [];
			searchTerm = [];
			searchOperator = [];
		}
		var queryFormat = ";";
		var searchArray = [];
		if(typeof(filter) != "undefined" && typeof(filterTerm) != "undefined")
		{
			if(filter instanceof Array && filterTerm instanceof Array && filter.length == filterTerm.length)
			{
				for(var i=0;i<filter.length;i++)
				{
					searchColumn.push(filter[i]);
					searchTerm.push(filterTerm[i]);
					searchOperator.push("eq");
				}
			}
			else if(typeof(filter) == "string" && typeof(filterTerm) == "string")
			{
                                searchColumn.push(filter);
                                searchTerm.push(filterTerm);
                                searchOperator.push("eq");

			}
		}
		if(searchColumn.length == searchTerm.length && searchColumn.length == searchOperator.length)
		{
			
			for(var j=0;j<searchColumn.length;j++)
			{
				if(columns.includes(searchColumn[j]))
				{
					var res = this.generateQuery(searchColumn[j],searchOperator[j],searchTerm[j]);
					if(res != "")
						searchArray.push(res);
				}
			}
		}
                if(typeof(sortBy) != "undefined" && typeof(sortBy) == "string")
                {
                        queryFormat = " order by " + sortBy + " " + sortOrder + " ;";
                }
		var searchQuery = searchArray.join(" and ");
		if(searchQuery != "")
			searchQuery = " and " + searchQuery;
			return searchQuery+queryFormat;
	},
	generateQuery : function(column, operator, term)
	{
		var output = "";
		switch (operator) {
			case "eq":
				output  = column+" = '"+term+"'";
				break;
			case "ne":
				output  = column+" <> '"+term+"'";
				break;
			case "gt":
				if(!isNaN(Date.parse(term)) || !isNaN(term))
				{
					output = column+" > '"+term+"'";
				}
				break;
			case "lt":
                                if(!isNaN(Date.parse(term)) || !isNaN(term))
                                {
                                        output = column+" < '"+term+"'";
                                }
				break;
                        case "ge":
                                if(!isNaN(Date.parse(term)) || !isNaN(term))
                                {
                                        output = column+" >= '"+term+"'";
                                }
				break;
                        case "le":
                                if(!isNaN(Date.parse(term)) || !isNaN(term))
                                {
                                        output = column+" <= '"+term+"'";
                                }
				break;
                        case "ct":
                                        output = column+" like '%"+term+"%'";
				break;
			case "bt":
                               try{
					var array = term.split(',');
					if((array instanceof Array) && array.length == 2 && !isNaN(Date.parse(array[0])) && !isNaN(Date.parse(array[1])))
					{
						var ordered = Date.parse(array[0]) > Date.parse(array[1]);
						output = "("+column+" between '"+ ((ordered) ? array[1] : array[0])+"' and '"+((ordered) ? array[0] : array[1]) + "')"; 
					}
				}
				catch(e) {
				}
				break;
		}
		return output;
	}
}
