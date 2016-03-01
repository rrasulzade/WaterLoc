'use strict'; 

/* exported ServiceModule */
/* The above comment disables the JSHint warning of ServiceModule being defined but not used. */

var ServiceModule = (function() {

  var UWaterlooService = function() {
    this.key = 'da2a56dc8d6aadb150bf77d9e2e2d937';
    this.urlPrefix = 'https://api.uwaterloo.ca/v2';
  };


  _.extend(UWaterlooService.prototype, {
    queryBuildings: function(word, listObj) {
      var self = this; 
      var url = self.urlPrefix + '/buildings/list.json?key=' + self.key;
     
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json'
      }).done(function (res) {
         if (res.meta.status === 200) {
           listObj.filter(null, res.data, word);
         }else {
           listObj.filter('Building not found', null, word);
         }
      }).fail(function () {
          var err = 'AJAX call failed: ';
          listObj.filter(err, null, word);
      });
    },


    getBuilding: function(buildingCode, buildingObj) {
      var self = this; 
      var url = self.urlPrefix + '/buildings/' + buildingCode +  '.json?key=' + self.key;
     
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json'
      }).done(function (res) {
         if (res.meta.status === 200) {
           buildingObj.filter(null, res.data);
         }else {
           buildingObj.filter('Building not found', null);
         }
      }).fail(function () {
          var err = 'AJAX call failed: ';
          buildingObj.filter(err, null);
      });
    }
  });


  return {
    UWaterlooService: UWaterlooService,
  };

})();

