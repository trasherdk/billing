<?php
	require_once(dirname(__FILE__)."/config.php");
	require_once("dbfunction.php");
	require_once(dirname(__FILE__)."/functions.php");
	
	dbconnect($database, $dbuser, $dbpass);

	mysql_close($conn);
?>
