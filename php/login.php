<?php
	require_once('config.php');
	require_once('dbfunction.php');
	
	dbconnect($database,$dbuser,$dbpass);
	
	switch($_POST['task'])
	{
		case "login":
			
			$sql = "select u.id validated, u.manager, u.fname, u.lname" .
				", u.phone, u.mobile, u.email, u.usergroup, g.name level" .
				" from users u" .
				" left join usergroup g on u.usergroup=g.id" .
				" where u.login='" . $_POST['user'] . "'" .
				" and pwcrypt='" . $_POST['hash'] . "'";
			
			if (!$res = dbquery($sql))
			{
			#	echo "{ failure: true, errors: { reason: 'Call dbquery() failed.' }, sql: $sql }";
				break;
			}
			
			if (! mysql_num_rows($res))
			{
				$response = "{ failure: true";
				$response .= ", errors: { reason: 'Invalid User or Password [".$_POST['user']."]'";
				$response .= ", sql: $sql}}";
				
				echo  $response;
				break;
			}
			$userdata = mysql_fetch_assoc($res);
			$_SESSION['user'] = $userdata;
			setcookie("user",json_encode($userdata), time() + $maxlifetime);
#			$userdata = mysql_fetch_array($res);
			echo "{ success: true, data: " . json_encode($userdata) . "}";
#			echo "{ success: true }";
			
			break;
		case "logout":
			
			unset($_SESSION['user']);
			echo "{ success: true, response: { text: 'Logout successfull' }}";
			
			break;
		default:
		
			echo "{ failure: true, errors: { reason: 'Invalid task in request [".$_POST['task']."' }}";
			
			break;
	}
	
	mysql_close();
?>
