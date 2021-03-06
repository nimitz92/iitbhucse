/**
 *	ServiceClient
 *	JavaScript UI Framework for consuming Services 
 *	
 *	@author Vibhaj Rajan <vibhaj8@gmail.com>
 *
 *	Services are generic modules providing resuable stateless functionalities
 *
 *	interface Service {
 *		public function run(message, memory){
 *			... use message for receiving configurations ...
 *			... use memory for managing state in workflows ...
 *			... save reference in Registry instead of returning objects ...
 *		}
 *	}
 *	
**/

var ServiceClient = (function(){
	/**
	 *	@var references array
	 *
	 *	an array for saving references
	 *	references may be accessed through the Registry
	 *
	**/
	var references = new Array();
	
	/**
	 *	@var navigators array
	 *
	 *	an array that saves indexes to service workflows
	 *	workflow = [{	
	 *		service : ...,
	 *		( ... params : ... )
	 *	}];
	 *
	 *	indexes usually starts with # (href programming)
	 *	navigator is index followed by parameters to be overrided delimited by ':'
	 *
	 *	example #testtab:tabtitle=Krishna:loadurl=test.php
	 *
	 *	escapes for usage in form id
	 *	# by _ 
	 *	= by .
	 *
	**/
	var navigators = new Array();
	
	return {
		/**
		 *	@var Registry object
		 *	
		 *	manages references and navigator indexes
		 *
		**/
		Registry : {
			/**
			 *	saves a Reference with index
			 *
			 *	@param index string
			 *	@param reference object or any type
			 *
			**/
			save : function(index, reference){
				references[index] = reference;
			},
			
			/**
			 *	gets the Reference for index
			 *
			 *	@param index string
			 *
			**/
			get : function(index){
				return references[index];
			},
			
			/**
			 *	removes a Reference with index
			 *
			 *	@param index string
			 *
			**/
			remove : function(index){
				references[index] = 0;
			},
			
			/**
			 *	adds a Navigator with index
			 *
			 *	@param index string
			 *	@param navigator object
			 *
			**/
			add : function(index, navigator){
				navigators[index] = navigator;
			},
			
			/**
			 *	removes a Navigator with index
			 *
			 *	@param index string
			 *
			**/
			removeNavigator : function(index){
				navigators[index] = 0;
			}
		},
		
		/**
		 *	@var Kernel object
		 *	
		 *	manages the following tasks
		 *		runs services when requested
		 *		processes navigators when received
		 *
		**/
		Kernel : {			
			/** 
			 *	executes a workflow with the given definition
			 *
			 *	@param config object
			 *	@param mem object optional
			 *
			**/
			run : function(config, mem){
				/**
				 *	create a new memory if not passed
				**/
				var memory = mem || {};
				
				for(var i in config){
					var service = config[i].service;
					var message = config[i];
					/**
					 *	run the service with the message and memory
					**/
					if(service.run(message, memory) !== true)
						return false;
				}
				
				return true;
			},
			
			/**
			 *	processes the navigator request received to run services and workflows
			 *
			 *	@param request string
			 *
			**/
			navigate : function(request, escaped){
				if(escaped || false){
					request = request.replace(/_/g, '#');
					request = request.replace(/\./g, '=');
				}
				
				var req = request.split(':');
				var index = req[0];
				
				var config = new Array();
				for(var i=1, len=req.length; i<len; i++){
					var param = (req[i]).split('=');
					config[param[0]] = param[1];
				}
				
				if(navigators[index] || false){
					var navigator = new (navigators[index])(config);
					return this.run(navigator);
				}
				
				return false;
			}
		}
	};
})();
ServiceClient.jquery = {};

ServiceClient.jquery.view = {};
ServiceClient.jquery.module = {};
ServiceClient.jquery.loader = {};
ServiceClient.jquery.renderer = {};
ServiceClient.jquery.navigator = {};
ServiceClient.jquery.requestor = {};
ServiceClient.jquery.template = {};
ServiceClient.jquery.helper = {};
/**
 * ElementView view
 *
 * @param elementid string
 *
 *	@return view object
 *
**/
ServiceClient.jquery.view.ElementView = {
	run : function(message, memory){
		memory.view = $(message.elementid);
		return true;
	}
};
/**
 *	TabUIAdd view
 *
 *	@param tabui string
 *  @param tabtitle string
 *  @param autoload boolean
 *  @param taburl string
 *
 *	@return view View
 *
**/
ServiceClient.jquery.view.TabUIAdd = {
	run : function(message, memory){
		var tabui = ServiceClient.Registry.get(message.tabui);
		memory.view = tabui.add(message.tabtitle, message.autoload || false, message.taburl || false);
		return true;
	}
};
/**
 *	ContentUI renderer
 *
 *	@param template Template
 *
 *	@param data html/text
 *
**/
ServiceClient.jquery.renderer.ContentUI = {
	run : function(message, memory){
		memory.view.hide();
		memory.view.html(memory.data)
		memory.view.fadeIn(1000);
		return true;
	}
};
/**
 *	TabUI renderer
 *
 *	@param cache boolean
 *	@param collapsible boolean
 *	@param event string
 *	@param tablink boolean
 *	@param indexstart integer
 *	@param saveindex string
 *
 *	@param view View
 *
 *	@save tabpanel object
 *
**/
ServiceClient.jquery.renderer.TabUI = {
	run : function(message, memory){
		var tab = new Array();
		var index = message.indexstart || 0;
		
		var options = {
			cache : message.cache || false,
			collapsible : message.collapsible || false,
			event : message.event || 'click',
			tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				tab[index] = $(ui.panel);
			}
		};
		
		if(message.tablink || false){
			options.load = function(event, ui) {
				$('a', ui.panel).click(function() {
					$(ui.panel).load(this.href);
					return false;
				});
			}
		}
		
		var tabpanel = memory.view.tabs(options);
		memory.view.fadeIn(1000);
		
		$('.ui-icon-close').live( "click", function() {
			var indx = $("li", tabpanel).index($(this).parent());
			tabpanel.tabs( "remove", indx );
		});
		index--;
		
		ServiceClient.Registry.save(message.saveindex, {
			add : function(tabtitle, autoload, taburl){
				index++;
				var url = '#ui-tab-'+index;
				if(autoload || false){
					url = taburl;
				}
				tabpanel.tabs('add', url, tabtitle);
				tabpanel.tabs('select', '#ui-tab-'+index);
				return tab[index];
			}
		});
		return true;
	}	
};
/**
 *	AjaxLoader loader
 *
 *	@param loadurl string [memory|message]
 *	@param loadparams object [memory|message]
 *	@param	datatype string [memory|message]
 *	@param request string [memory|message]
 *	@param workflow Workflow [message]
 *	@param errorflow	Workflow [message] optional
 *
 *	@param process boolean [message] optional
 *	@param status string [message] optional
 *	@param processflow Workflow [message] optional
 *	@param replace string [message] optional
 *	
 *	@param view View [memory]
 *
 *	@return data string
 *	@return status integer
 *	@return error string
 *
**/
ServiceClient.jquery.loader.AjaxLoader = {
	run : function(message, memory){
		/**
		 *	Show the loading message
		**/
		memory.view.html('<p class="loading">Loading ...</p>');
		
		/**
		 *	Load data from server using AJAX
		**/
		$.ajax({
			url: memory.loadurl || message.loadurl,
			data: memory.loadparams || message.loadparams || {},
			dataType : memory.datatype || message.datatype || 'json',
			type : memory.request || message.request || 'POST',
			
			success : function(data, status, request){
				var success = true;
				memory.data = data;
				memory.status = status;
				/**
				 *	If process is true, check for status value in JSON data received and set success variable accordingly
				**/
				if(message.process || false){
					if(data[message.status] || false){
						success = true;
						/**
						 *	Check for processflow definitions and execute them
						**/
						var run = data[message.processflow] || false;
						if(run){
							for(var i in run){
								run[i].service = ServiceClient.Registry.get(run[i].service);
							}
							return ServiceClient.Kernel.run(run);
						}
					}
					else {
						success = false;
					}
					/**
					 *	Replace data with data to be processed further using replace index
					**/
					if(message.replace || false){
						memory.data = data[message.replace];
					}
				}
				/**
				 *	If success is true, run the workflow; otherwise run the errorflow or display error message
				**/
				if(success){
					ServiceClient.Kernel.run(message.workflow, memory);
				}
				else {
					if(message.errorflow || false){
						ServiceClient.Kernel.run(message.errorflow, memory);
					}
					else {
						memory.view.html(memory.data);
					}
				}
			},
			error : function(request, status, error){
				memory.error = error;
				memory.status = status;
				memory.data ='<p class="error">The requested resource could not be loaded</p>';
				/**
				 *	Run the errorflow or display error message
				**/
				if(message.errorflow){
					ServiceClient.Kernel.run(message.errorflow, memory);
				}
				else {
					memory.view.html(memory.data);
				}
			}
		});
		
		/**
		 *	@return false 
		 *	to stop default browser event
		**/
		return false;
	}
};
/** *	AlertStatus module * *	@param selector string [message] *	@param value string [message] *	@param show integer [message] optional *	@param hide integer [message] optional *	@param delay integer [message] optional default 0 ***/ServiceClient.jquery.module.AlertStatus = {	run : function(message, memory){		var el = $(message.selector);		el.html(message.value);		if(message.show || false){			el.delay(message.delay || 0)				.fadeIn(message.show);		}		if(message.hide || false){			el.delay(message.delay || 0)				.fadeOut(message.hide);		}		return true;	}};/**
 *	ApplyTemplate module
 *
 *	@param template Template [memory]
 *	@param data object [memory|message]
 *
 *	@return data html
 *
**/
ServiceClient.jquery.module.ApplyTemplate = {
	run : function(message, memory){
		memory.data = $.tmpl(memory.tpl || message.template, memory.data || message.data);
		return true;
	}
};
/** *	ConfirmStatus module * *	@param confirm boolean [message] *	@param value string [message] ***/ServiceClient.jquery.module.ConfirmStatus = {	run : function(message, memory){		if(message.confirm || false){			return confirm(message.value);		}		return true;	}};/** *	CookieLogin module * *	@param key string [message] *	@param sessionid string [message] *	@param expires integer[message] default 1 day ***/ServiceClient.jquery.module.CookieLogin = {	run : function(message, memory){		$.cookie(message.key, message.sessionid, {			expires : message.expires || 1		});		window.location.reload();		return false;	}};/** *	ElementStatus module * *	@param selector string [message] *	@param disabled boolean [message] ***/ServiceClient.jquery.module.ElementStatus = {	run : function(message, memory){		if(message.disabled || false){			$(message.selector).attr('disabled', true);		}		else {			$(message.selector).removeAttr('disabled');		}		return true;	}};/** *	NavigatorInit module * *	@param selector string [message] *	@param event string [message] *	@param attribute string [message] *	@param escaped boolean [message] ***/ServiceClient.jquery.module.NavigatorInit = {	run : function(message, memory){		var result = $(message.selector);		result.live(message.event || 'click', function(){			return ServiceClient.Kernel.navigate($(this).attr(message.attribute), message.escaped || false);		});		return true;	}};/** *	ReadForm module * *	@param selector string [message] * *	@return loadurl string *	@return request string *	@return loadparams object ***/ServiceClient.jquery.module.ReadForm = {	run : function(message, memory){		var form = $(message.selector);		memory.loadurl = form.attr('action');		memory.request = form.attr('method').toUpperCase();				var params = form.serialize();		var d= new Date();		params = params + '&_ts='+ d.getTime();		memory.loadparams = params;				return true;	}};/**
 *	ReadTemplate module
 *
 *	@param data.template string [memory]
 *	@param tpl string [message]
 *
 *	@param tpl template
 *
**/
ServiceClient.jquery.module.ReadTemplate = {
	run : function(message, memory){
		if(memory.data.template || false){
			memory.tpl = $.template(memory.data.template);
		}
		else {
			memory.tpl = ServiceClient.Registry.get(message.tpl);
		}
		return true;
	}
};
/** *	ValidateForm module * *	@element .confirm *	@element .required *	@element .email * *	@param selector string [message] * *	@return loadurl string *	@return request string *	@return loadparams object ***/ServiceClient.jquery.module.ValidateForm = {	run : function(message, memory){		var result = true;				var checkRequired = function(index, el){			if($(this).val() == ''){				result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$(message.selector + ' .required').each(checkRequired);				var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;		var checkEmail = function(index, el){			if(!emailRegex.test($(this).val())){				result = false;				$(this).parent()					.next('p.error')					.slideDown(1000)					.delay(5000)					.slideUp(1000);				return false;			}		}		$(message.selector + ' .email').each(checkEmail);				return result;	}};/** *	FormSubmit navigator * *	@element form *	@element div.status *	@element input[name=submit] * *	@param sel form-parent selector string *	@param cf boolean confirm submit [optional] false ***/ServiceClient.jquery.navigator.FormSubmit = function(config){		return [{		service : ServiceClient.jquery.view.ElementView,		elementid : config.sel +' div.status'	},{		service : ServiceClient.jquery.module.ValidateForm,		selector : config.sel + ' form'	},{		service : ServiceClient.jquery.module.ConfirmStatus,		confirm : config.cf || false,		value : 'Please confirm form submission'	},{		service : ServiceClient.jquery.module.ReadForm,		selector : config.sel + ' form'	},{		service : ServiceClient.jquery.module.ElementStatus,		selector : config.sel + ' input[name=submit]',		disabled : true	},{		service : ServiceClient.jquery.loader.AjaxLoader,		process : true,		status : 'success',		processflow : 'run',		replace : 'msg',		workflow : [{			service : ServiceClient.jquery.renderer.ContentUI		}],		errorflow : [{			service : ServiceClient.jquery.module.ElementStatus,			selector : config.sel + ' input[name=submit]'		},{			service : ServiceClient.jquery.renderer.ContentUI		}]	}];	}/** *	HtmlLoad navigator * *	@param cntr selector *	@param url URL ***/ServiceClient.jquery.navigator.HtmlLoad = function(config){	return [{		service : ServiceClient.jquery.view.ElementView,		elementid : config.cntr	},{		service : ServiceClient.jquery.loader.AjaxLoader,		loadurl : config.url,		datatype : 'html',		workflow : [{			service : ServiceClient.jquery.renderer.ContentUI		}]	}];}/** *	TestTab navigator * *	@param title string *	@param url URL optional ***/ServiceClient.jquery.navigator.TestTab = function(config){	return [{		service : ServiceClient.jquery.view.TabUIAdd,		tabui : 'tabuipanel',		tabtitle : config.title || 'Testing'	},{		service : ServiceClient.jquery.loader.AjaxLoader,		loadurl : config.url || 'data.json.php',		workflow : [{			service : ServiceClient.jquery.module.ReadTemplate,			tpl : config.tpl || 'tpl-test'		},{			service : ServiceClient.jquery.module.ApplyTemplate,		},{			service : ServiceClient.jquery.renderer.ContentUI		}]	}];}/** *	TplLoad navigator * *	@param cntr selector *	@param url URL *	@param tpl template-index [optional] *	@param arg string = escaped by ~ [optional] *	@param cf boolean confirm continue [optional] false ***/ServiceClient.jquery.navigator.TplLoad = function(config){	if(config.arg || false){		config.arg = config.arg.replace(/~/g, '=');	}	return [{		service : ServiceClient.jquery.view.ElementView,		elementid : config.cntr	},{		service : ServiceClient.jquery.module.ConfirmStatus,		confirm : config.cf || false,		value : 'Are you sure you want to continue ?'	},{		service : ServiceClient.jquery.loader.AjaxLoader,		loadurl : config.url,		loadparams : config.arg || {},		workflow : [{			service : ServiceClient.jquery.module.ReadTemplate,			tpl : config.tpl || false		},{			service : ServiceClient.jquery.module.ApplyTemplate		},{			service : ServiceClient.jquery.renderer.ContentUI		}]	}];}/** *	Upload navigator * *	@param sel form selector string *	@param val string ***/ServiceClient.jquery.navigator.Upload = function(config){		return [{		service : ServiceClient.jquery.module.ElementStatus,		selector : config.sel + ' input[name=submit]',		disabled : true	},{		service : ServiceClient.jquery.module.AlertStatus,		selector : config.sel + ' div.status',		value : config.val || 'Uploading ... Please Wait'	}];}/** *	Equals helper * *	@param value1 *	@param value2 ***/ServiceClient.jquery.helper.equals = function(value1, value2){	return value1==value2;}/** *	GetDate helper * *	@param time ***/ServiceClient.jquery.helper.getDate = function(time){	var d = new Date(time);	return d.toDateString();}/**
 *	@helper readFileSize
 *
**/
ServiceClient.jquery.helper.readFileSize = function(size){
	var kb = size/1024.0;
	if(kb > 1024.0){
		var mb = kb/1024.0;
		return mb.toFixed(2) + ' MB';
	}
	return kb.toFixed(2) + ' KB';
}
