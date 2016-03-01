'use strict';

var uwaterloo;
var singleModel, listModel;

/* exported handle */

(function(Models, Views, Services) {
  $(document).ready(function() {

    listModel = new Models.BuildingListModel();
    singleModel = new Models.BuildingModel();
    uwaterloo = new Services.UWaterlooService();

    new Views.BuildingListView(listModel, uwaterloo);
    new Views.MapView(singleModel, uwaterloo);

    var once = false;
    
    $('#searchInput').focus(function(){
      if(!once){
        once=true;
        search = false;
        uwaterloo.queryBuildings('.*', listModel);
      }
    });

    $('#searchInput').keyup(function() {
      search = true;
      var searchVar = '.*';

      for(var i = 0; i < this.value.length; i++){
        if (this.value.charAt(i) !== ' ') {
          searchVar += '(' + this.value.charAt(i).toUpperCase() + '|' + this.value.charAt(i).toLowerCase() + ')';
          searchVar += '.*';
        }
      }

      listModel.findBuilding(searchVar);
    });

  });
})(ModelModule, ViewModule, ServiceModule);


function handle(){
  /*jshint validthis:true */
    var code = this.id.substr(1,this.id.length);
    var tmp = document.getElementById('_' + this.id);

    if(this.checked){ 
      tmp.style.backgroundColor = '#bff0a1';
      uwaterloo.getBuilding(code, singleModel);
    }else{
      tmp.style.backgroundColor = '#ADD1FF';
      singleModel.remove(code);
    }

    listModel.changeList(code, this.checked);
}

