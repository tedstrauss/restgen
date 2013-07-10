var restErrors = require('./resterrors');

module.exports = function(app, controller) {
  
  app.all('/', function(req, res, next) {
	  //res.header("Access-Control-Allow-Origin", "*");
	  //res.header("Access-Control-Allow-Headers", "X-Requested-With");
	  res.header('Access-Control-Allow-Origin', config.allowedDomains);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
  });	
  
  // List All Records
  app.get('/' + controller.plural + '.:format?', function(req, res, next) {
    controller.index(function(err, results) {
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else {
        var options = {};
        options[controller.plural] = results.map(function(instance) {return instance.toObject()});
        if(req.params.format){
                req.params.format.toLowerCase() == 'json' ? res.json(results) : res.render(controller.name, options);
        }
        else{
                // here it is
                res.json(results);
        }
      }
    });
  });

  // Create Record
  app.post('/' + controller.plural + '.:format?', function(req, res, next) {
    controller.create(req.body, function(err, instance){
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else {
        if(req.params.format){
        	req.params.format.toLowerCase() == 'json' ? res.json(201, instance) : res.redirect(controller.plural + '/' + instance._id + '/show');
      	}
      	else{
      		// here it is
      		res.json(201, instance);
      	}
      }
    });
  });

  // Show Record
  app.get('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    controller.show(req.params.id, function(err, instance) {
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance){
        if(req.params.format){
        	req.params.format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      	}
      	else{
      		// here it is
      		res.json(404, { error: 'Not Found' });
      	}
      }
      else {
        var options = {};
        options[controller.name] = instance.toObject();
        if(req.params.format){
        	req.params.format.toLowerCase() == 'json' ? res.json(instance) : res.render(controller.name + '/show', options );
      	}
      	else{
      		// here it is
			res.json(instance);
      	}
      }
    });

  });

  // Update Record
  app.put('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    controller.update(req.params.id, req.body, function(err, instance){
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance){
        if(req.params.format){
       	  req.params.format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      	}
      	else{
      		//here it is
      		res.json(404, { error: 'Not Found' });
      	}
      }
      else{ 
		if(req.params.format){      
	        req.params.format.toLowerCase() == 'json' ? res.json(instance) : res.redirect(controller.plural + '/' + instance._id + '/show');
      	}
      	else{
      		//here it is
      		res.json(instance);
      	}
      
      }
      
    });
  });

  // Delete Record
  app.del('/' + controller.plural + '/:id.:format?', function(req, res, next) {
    controller.destroy(req.params.id, function(err, instance){
      if (err)
        req.params.format.toLowerCase() == 'json' ? res.json(500, {error: 'Internal Server Error: '+err}) : next(restErrors.RestError.InternalServer.insert(err), req, res);
      else if (!instance){
        if(req.params.format){
        	req.params.format.toLowerCase() == 'json' ? res.json(404, { error: 'Not Found' }) : next(restErrors.RestError.NotFound.insert(controller.name + ' Id: "' + req.params.id + '" was not found.'), req, res);
      	}
      	else{
      		//
      		res.json(404, { error: 'Not Found' });
      	}	
      }
      else{
      	if(req.params.format){
	        req.params.format.toLowerCase() == 'json' ? res.json(instance) : res.redirect(controller.plural);
        }
        else{
        	//
        	res.json(instance);
        }
      }
    });
  });
};
