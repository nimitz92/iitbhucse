/** *	Login navigator * *	@param type string *	@param tabtitle string *	@param id integer ***/IITBHUCSE.jquery.navigator.Login = function(config){	var d= new Date();	var inputs = $('div#login-panel input.field');	$('div#login-panel input[name=login]').attr('disabled', true);		return [{		service : ServiceClient.jquery.view.ElementView,		elementid : 'div#login-panel div.status'	},{		service : ServiceClient.jquery.loader.AjaxLoader,		loadurl : IITBHUCSE.urls.base + IITBHUCSE.urls.login,		loadparams : {			username : inputs.eq(0).val(),			password : inputs.eq(1).val(),			_ts : d.getTime()		},		workflow : [{			service : IITBHUCSE.jquery.module.Login		},{			service : ServiceClient.jquery.renderer.ContentUI		}]	}];}