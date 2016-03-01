'use strict';

/* exported ViewModule */
/* The above comment disables the JSHint warning of ViewModule being defined but not used. */
var map;
var search = false;

var ViewModule = (function() {

  var AbstractView = function(model) {
    this.model = model;
    this.model.addListener(this);
  };

  _.extend(AbstractView.prototype, {
    init: function() {
      map = new google.maps.Map(document.getElementById('map_canvas'), {
                                    center: new google.maps.LatLng(43.472761,-80.542164),
                                    zoom: 15,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }, 

    update: function() {
      if (deleteFlag) {
        this.deleteMarker(globalCode);
      }else{
        this.viewUpdate();
      }
    },


  });

  var BuildingListView = function(model, UWaterlooService) {
    AbstractView.apply(this, arguments); 
    this.UWaterlooService = UWaterlooService;
  };

  _.extend(BuildingListView.prototype, AbstractView.prototype, {

    viewUpdate: function(){
     
      var scrolDiv = document.getElementById('scrolBox');
      scrolDiv.innerHTML = '';
      if(!search){
        for(var i = 0; this.model.listArr[i] !== null; i++){
          var pair = this.model.listArr[i].data.building_name + ' (' + this.model.listArr[i].data.building_code + ')'; 

          var tmpInput = document.createElement('INPUT');
          var description = document.createTextNode(pair);
          var label = document.createElement('LABEL');

          tmpInput.id = '_' + this.model.listArr[i].data.building_code;
          tmpInput.setAttribute('class','inputBox');
          tmpInput.name = '_' + this.model.listArr[i].data.building_code;
          tmpInput.type = 'checkbox';
          tmpInput.addEventListener('change', handle);

          label.className = 'checkbox-inline control-label ';
          label.id = '_' + tmpInput.id;
          label.appendChild(tmpInput);
          label.appendChild(description);

          scrolDiv.appendChild(label);
          scrolDiv.appendChild(document.createElement('BR'));

        }
      }else{
        for(var ii = 0; this.model.searchArr[ii] !== null; ii++){
          var pair2 = this.model.searchArr[ii].data.building_name + ' (' + this.model.searchArr[ii].data.building_code + ')'; 

          var tmpInput2 = document.createElement('INPUT');
          var description2 = document.createTextNode(pair2);
          var label2 = document.createElement('LABEL');

          tmpInput2.id = '_' + this.model.searchArr[ii].data.building_code;
          tmpInput2.setAttribute('class','inputBox');
          tmpInput2.name = '_' + this.model.searchArr[ii].data.building_code;
          tmpInput2.type = 'checkbox';
          tmpInput2.addEventListener('change', handle);

          label2.className = 'checkbox-inline control-label';
          label2.id = '_' + tmpInput2.id;
          if (this.model.searchArr[ii].checked) {
              tmpInput2.checked = true;
              label2.style.backgroundColor = '#bff0a1';
          }

          label2.appendChild(tmpInput2);
          label2.appendChild(description2);

          scrolDiv.appendChild(label2);
          scrolDiv.appendChild(document.createElement('BR'));
          
        }
      }

    }
  });

  var MapView = function(model, UWaterlooService) {
    AbstractView.apply(this, arguments);
    this.UWaterlooService = UWaterlooService;
    this.usedMarkers = [];
    google.maps.event.addDomListener(window, 'load', this.init);
    
  };

  _.extend(MapView.prototype, AbstractView.prototype, {
   viewUpdate: function(){
      var self = this;
      var mapLatlng = new google.maps.LatLng(self.model.lat, self.model.lng);

      var marker = new google.maps.Marker({
                                    position: mapLatlng,
                                    map: map,
                                    animation: google.maps.Animation.DROP,
                                    title: self.model.code
                     });
      var tmp = {
                code: self.model.code,
                marker: marker
                };
      self.usedMarkers.push(tmp);         
    },

    deleteMarker: function(globalCode){
      var self = this;
      var i = 0; 
      while(i < self.usedMarkers.length){
        if(self.usedMarkers[i].code === globalCode){
          self.usedMarkers[i].marker.setMap(null);
          self.usedMarkers.splice(i, 1);
          continue;
        } 
        i++;
      }
    }


  });

  return {
    BuildingListView: BuildingListView,
    MapView: MapView
  };
})();
