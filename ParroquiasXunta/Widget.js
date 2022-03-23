define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/tasks/QueryTask", "esri/tasks/query", 'dojo/_base/lang', "esri/SpatialReference", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"],
  function(declare, BaseWidget, QueryTask, Query, lang,SpatialReference, Graphic, SimpleFillSymbol, SimpleMarkerSymbol, SimpleLineSymbol, Color) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-Parroquias',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      postCreate: function() {
        console.log('postCreate');
      },

      startup: function() {
       console.log('startup');
      },

      onOpen: function(){
        console.log('onOpen');
      },

      cargaConcellos() {
        console.log("cargaConcellos");
        let codigoProvincia = this.selectProvincia.value;
        console.log(this.selectProvincia.value)
        if (codigoProvincia == -1) return;

        this.listaConcellos.innerHTML = "";

        const queryTask1 = new QueryTask(this.config.serviceConcellos);

        const query = new Query();
        query.returnGeometry = false;
        query.outFields = ["CODPROV","CODCONC", "CONCELLO"];
        query.orderByFields = ["CONCELLO"];
        query.where = `CODPROV =${this.selectProvincia.value}`;

        queryTask1.execute(query, lang.hitch(this, function (results) {  
          console.log("results",results);

          let opt1 = document.createElement("option");

          opt1.value = -1;

          opt1.text = "Seleccione un concello";

          this.listaConcellos.add(opt1);

          for (var i = 0; i < results.features.length; i++) {

            opt1 = document.createElement("option");

            opt1.value = results.features[i].attributes.CODCONC;

            opt1.text = results.features[i].attributes.CONCELLO;

            this.listaConcellos.add(opt1);
          }
        }));
      },
      
      cargaParroquias() {
        console.log("cargaParroquias");
        let codigoConcello = this.listaConcellos.value;
        console.log(this.listaConcellos.value);

        if (codigoConcello == -1) return;
        this.listaParroquias.innerHTML = "";
        
        const queryTask2 = new QueryTask(this.config.servicioParroquias);

        const query2 = new Query();

        query2.returnGeometry = false;
        query2.outFields = ["CODCONC","CODPARRO", "PARROQUIA"];
        query2.orderByFields = ["PARROQUIA"];
        query2.where = `CODCONC =${this.listaConcellos.value}`;

        queryTask2.execute(query2, lang.hitch(this, function(results) {
          console.log("results", results);
          
          let opt2 = document.createElement("option");

          opt2.value = -1;

          opt2.text = "Seleccione una parroquia";

          this.listaParroquias.add(opt2);

          for (var i = 0; i < results.features.length; i++) {
            opt2 = document.createElement("option");

            opt2.value = results.features[i].attributes.CODPARRO;

            opt2.text = results.features[i].attributes.PARROQUIA;

            this.listaParroquias.add(opt2);
          }
        }))
      },

      zoomConcello() {
        console.log("zoomConcello");
        
        let codigoConcello = this.listaConcellos.value;

        if (codigoConcello == -1) return;
        
        var queryTask3 = new QueryTask(this.config.serviceConcellos);

        var query3 = new Query();
        query3.returnGeometry = true;
        query3.outFields = ["CODCONC", "CONCELLO", "CODPROV"];
        query3.orderByFields = ["CONCELLO"];
        query3.where = `CODCONC =${this.listaConcellos.value}`;
        query3.outSpatialReference = new SpatialReference(102100);

        queryTask3.execute(query3, lang.hitch(this,function(results) {
          if (results.features.length > 0) {
            var geom1 = results.features[0].geometry;

            this.map.graphics.clear();
            
            this.map.graphics.add(new Graphic(geom1, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 77, 168, 1])), new Color([190, 232, 255, 0.25]))));
            
            this.map.setExtent(geom1.getExtent(), true);
          }
        }))
      },

      zoomParroquia() {
        console.log("zoomParroquia");
        
        let codigoParroquia = this.listaParroquias.value;

        if (codigoParroquia == -1) return;

        var queryTask4 = new QueryTask(this.config.serviceParroquias);

        var query4 = new Query();
        query4.returnGeometry = true;
        query4.outFields = ["CODPARRO", "PARROQUIA"];
        query4.orderByFields = ["PARROQUIA"];
        query4.where = `CODPARRO =${this.listaConcellos.value}`;
        query4.outSpatialReference = new SpatialReference(102100);

        queryTask4.execute(query4, lang.hitch(this, function(results) {
          if (results.features.length >0) {
            var geom2 = results.features[0].geometry;

            this.map.graphics.clear();

            this.map.graphics.add(new Graphic(geom2, new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CROSS, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([168, 0, 132, 1])), new Color([255, 190, 232, 0.25]))));

            this.map.setExtent(geom2.getExtent(), true);
          }
        }))

      },

      onClose: function(){
        console.log('onClose');
      },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });