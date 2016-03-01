'use strict'; 

/* exported ModelModule */
/* The above comment disables the JSHint warning of ModelModule being defined but not used. */

var deleteFlag = false;
var globalCode = '';


var ModelModule = (function() {
  var AbstractModel = function() {
    this.listeners = [];
  };


  _.extend(AbstractModel.prototype, {
    addListener: function(listener) {
      this.listeners.push(listener);
    },

    removeListener: function(listener) {
      var index = this.listeners.indexOf(listener);
      if (index !== -1) {
          this.listeners.splice(index, 1);
      }
    },

    notify: function() {
      for(var i = 0; i < this.listeners.length; i++){
                this.listeners[i].update();
            }
    },

  });



  var BuildingModel = function(name, id, code, lat, lng) {
    AbstractModel.apply(this, arguments);
    this.name = name;
    this.id = id;
    this.code = code;
    this.lat = lat;
    this.lng = lng; 
  };

  _.extend(BuildingModel.prototype, AbstractModel.prototype, {

    filter: function(err, data){
      var self = this;
      if(err !== null){
        console.log(err);
        alert(err);
      }else{
        self.name = data.building_name;
        self.code = data.building_code;
        self.id = data.building_id;
        self.lat = data.latitude;
        self.lng = data.longitude;
        self.notify();
      }
    },

    remove: function(buildingCode){
      deleteFlag = true;
      globalCode =  buildingCode;
      this.notify();
      deleteFlag = false;
      globalCode = '';
    }

  });




  var BuildingListModel = function() {
    AbstractModel.apply(this, arguments);
    this.listArr = [];
    this.searchArr = [];
  };

  _.extend(BuildingListModel.prototype, AbstractModel.prototype, {

    filter: function(err, data, word){
      var self = this;
      var len = self.listArr.length;
      self.listArr.splice(0, len);

      if(err !== null){
        console.log(err);
        alert(err);
      }else{
            for(var i = 0; i < data.length; i++){
              var b_code = data[i].building_code;
              var b_name = data[i].building_name;

              if (b_code.match(word) !== null || b_name.match(word) !== null) {
                var info = {
                      data: data[i],
                      checked: false
                    };
                 self.listArr.push(info);
               }
             }
      }
      self.notify();
    },

    findBuilding: function(word){
      var self = this;
      var len = self.searchArr.length;
     self.searchArr.splice(0, len);
      for(var i = 0; i < self.listArr.length; i++){
        var b_code = self.listArr[i].data.building_code;
        var b_name = self.listArr[i].data.building_name;

        if (b_code.match(word) !== null || b_name.match(word) !== null) {
          var info = {
                      data: self.listArr[i].data,
                      checked: self.listArr[i].checked
                    };
         self.searchArr.push(info);
       }
     }

     self.notify();
   },

   changeList: function(code, check){
    var self = this;
    var len = self.listArr.length;
    for(var i = 0; i < len; i++){
        if(code === self.listArr[i].data.building_code){
          self.listArr[i].checked = check;
        }
    }
   }

  });

  return {
    BuildingModel: BuildingModel,
    BuildingListModel: BuildingListModel
  };
})();