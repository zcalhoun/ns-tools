/**
 * Use this piece of code in the browser to extract all fields
 * and put them in a copy/paste format (like a CSV) that can be 
 * used to import into a data map.
 */

// Step 1
require(["N/record"]);

// Step 2
var record = require("N/record");

// Step 3: Get example record.
var rec = record.load({
    type: recType,
    id: recId
})

// Step 4: Get labels and field Ids.
rec.getFields().map(function(result) {
	var label = rec.getField({fieldId: result}) ? rec.getField({fieldId: result}).label : "";
	if(label) {
    	return [label, result];
    } else {
		return ["", result];
    }
}).join("\n");

// Step 4b: Get all sublist fields

rec.getSublistFields({
  sublistId: "item"}).forEach(function(result) {
    var f = rec.getSublistField({
        sublistId: "item",
        fieldId: result,
  line: 0
    });
  if(!f) return;
  fieldInfo.push([f.label, f.id]);
});

