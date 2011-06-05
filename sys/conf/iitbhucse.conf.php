<?php 

	/**
	 *	MySQL Database
	 *	
	 *	@param mysql_database 	database name
	 *	@param mysql_user 			username
	 *	@param mysql_pass 			password
	 *	@param mysql_host			mysql server host
	**/
	$mysql_database 	= 	"iitbhucse";
	$mysql_user 			= 	"root";
	$mysql_pass 			= 	"shivang";
	$mysql_host 			= 	"localhost";
	
	/**
	 *	Mail configurations
	 *
	 *	@param mail_delegate		true/false indicating whether the PHP mail() will be used, 
	 *											enhancse-core.mail.smtp service will be used if false
	 *	@param mail_value			additional headers if above is true, 
	 *											enhancse-core.mail.smtp service URL if above is false
	 *	@param mail_from				Sender mail id 
	 *	@param mail_user				SMTP user, if enhancse-core.mail.smtp service is used
	 *	@param mail_pass				SMTP password, if enhancse-core.mail.smtp service is used
	**/
	$mail_delegate 	= 	true;
	$mail_value 		= 	"";
	$mail_from 		= 	"";
	$mail_user 		= 	"";
	$mail_pass 		= 	"";
	
	/**
	 * Cookie configurations
	 *
	 *	@param cookie_key			cookie key to be received (not applicable in account/logout.php)
	 *	@param cookie_key_sent	cookie key to be sent
	**/
	$cookie_key 			= 	"iitbhucseid";
	$cookie_key_sent 	= 	"iitbhucseid";
	
	/** 
	 *	Application configurations
	 *
	 *	@param application_name	name of the application
	 *	@param application_url		application root URL
	**/
	$application_name 	= 	"IIT BHU CSE";
	$application_url 		= 	"/iitbhucse";
	
?>
