function findSalesOrdertoFulfill(){
	
	return longSearchRecord('salesorder','customsearch_pel_bike_sale_lookup_3_4');
}

function schCreateFulfillments(type){
	var salesOrder = findSalesOrdertoFulfill();
	if(salesOrder && salesOrder.length > 0){
		createItemfulfillments(salesOrder);
	}
}

function longSearchRecord(recordType, savedSearchId, searchFilters,
		searchColumns) {
	var searchObject = null;
	if (searchFilters == '' || searchFilters == null
			|| typeof (searchFilters) == 'undefined') {
		searchFilters = [];
	}
	if (searchColumns == '' || searchColumns == null
			|| typeof (searchColumns) == 'undefined') {
		searchColumns = [];
	}

	if (savedSearchId != null && savedSearchId != ''
			&& typeof (savedSearchId) != 'undefined') {
		searchObject = nlapiLoadSearch(recordType, savedSearchId);
		// Only supports array of search filters to add to existing search
		for (var i = 0; i < searchFilters.length; i++) {
			searchObject.addFilter(searchFilters[i]);
		}
	} else {
		searchObject = nlapiCreateSearch(recordType, searchFilters,
				searchColumns);
	}

	var searchResults = [];
	var resultsSet = searchObject.runSearch();
	var resultsCounter = 0;
	var resultsPart = null;

	do {
		resultsPart = resultsSet.getResults(resultsCounter,
				resultsCounter + 1000);

		for (var i = 0; i < resultsPart.length; i++) {
			searchResults.push(resultsPart[i]);
			resultsCounter++;
		}
	} while (resultsPart.length >= 1000);

	return searchResults;
}

function createItemfulfillments(salesOrder){
  
		for (var i = 0; i < salesOrder.length; i++) {
			yieldIfRequired();
			var columns = salesOrder[i].getAllColumns();

			var SO = salesOrder[i].getValue(columns[0]);
			nlapiLogExecution('DEBUG','SO',SO);
			var SOid = nlapiLoadRecord('salesorder',SO);
          
		try{	
		
			var itemFulfillment = nlapiTransformRecord('salesorder',SO,'itemfulfillment');
		

			var deliverySKU = salesOrder[i].getValue(columns[1]);
			nlapiLogExecution('DEBUG','deliverySKU',deliverySKU);
			var fulfillLocation = salesOrder[i].getValue(columns[2]);
			nlapiLogExecution('DEBUG','fulfillLocation',fulfillLocation);
			var deliveryDate = salesOrder[i].getValue(columns[3]);
			nlapiLogExecution('DEBUG','deliveryDate',deliveryDate);

			itemFulfillment.setFieldValue('trandate',deliveryDate);
			itemFulfillment.setFieldValue('shipstatus','C');
			nlapiLogExecution('DEBUG','deliveryDate',deliveryDate);

			var itemCount = itemFulfillment.getLineItemCount('item');
			nlapiLogExecution('DEBUG','itemCount',itemCount);
			var fulfillLineCount = 0;
			var skip = false;
			for(var j = 1; j <=itemCount; j++){
				var itemid =itemFulfillment.getLineItemValue('item','item',j);
				nlapiLogExecution('DEBUG','itemid',itemid);
                itemFulfillment.selectLineItem('item',j);
				if((itemid == '2967' || itemid == '2969')&& skip == false){
					
					itemFulfillment.setCurrentLineItemValue('item','itemreceive','T');
					itemFulfillment.setCurrentLineItemValue('item','quantity',1);
					itemFulfillment.setCurrentLineItemValue('item','location',fulfillLocation);
					skip = true;
					fulfillLineCount++;
					
			    }else{
			    	itemFulfillment.setCurrentLineItemValue('item', 'itemreceive','F');
					itemFulfillment.setCurrentLineItemValue('item', 'quantity', 0);

			    }
			    itemFulfillment.commitLineItem('item');

			}
			if(fulfillLineCount == 0){
				continue;
			}
			nlapiSubmitRecord(itemFulfillment);
		}catch(e){
			nlapiLogExecution('Debug','TryCatch',e);
		}
        }
		

		
}
	
	


function yieldIfRequired() {
	var context = nlapiGetContext();
	var usageRemaining = context.getRemainingUsage();
	if (usageRemaining < 120) {
		nlapiYieldScript();
	}
}