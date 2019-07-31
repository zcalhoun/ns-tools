/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(['N/search'], function(search) {
    function _post(serials) {
      if(!serials || serials.length < 1) { 
        return "You must provide at least one serial number.";
      }
      return searchForLocations(serials);
    }
    function allInventoryNumbers(serials) {
      return serials.map(function(serial) {
        if(!serial || serial === "") {
          // Do nothing...
        } else {
          return ["inventorynumber","is",serial]
        }
      }).reduce(function(fullArr, res) {
        fullArr = typeof fullArr[0] == "object" ? fullArr : [fullArr];
        return res ? fullArr.concat("OR",[res]) : fullArr;
      });
    }
    function searchForLocations(serials) {
      log.debug("All inv numbers", allInventoryNumbers(serials));
      var locationSearch = search.create({
        type: "inventorynumber",
        filters: allInventoryNumbers(serials),
        columns: [
          "inventorynumber",
          "location"
        ]
      });
      var results = {};
      locationSearch.run().each(function(result) {
        results[result.getValue("inventorynumber")] = result.getText("location") || "";
        return true;
      });
      var orderedNumbers = [];
  
      // This step is necessary to get the results in the same order as the 
      // serials passed in.
      serials.forEach(function(serial) {
        var value = results[serial] || "None found";
        orderedNumbers.push(value);
      });
      log.debug("Ordered Numbers", orderedNumbers);
      return orderedNumbers;
    }
    return {
      post: _post
    }
  });
  