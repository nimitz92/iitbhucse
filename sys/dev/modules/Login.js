/** *	Login module * *	@param data object ***/IITBHUCSE.jquery.module.Login = {	run : function(message, memory){		if(memory.data.success){			$.cookie(memory.data.key, memory.data.sessionid, {				expires : memory.data.expires			});			$('div#login-panel input[name=login]').removeAttr('disabled');			window.location.reload();			return false;		}		else {			$('div#login-panel input[name=login]').removeAttr('disabled');		}		return true;	}};