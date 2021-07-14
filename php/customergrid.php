<?php
	require_once(dirname(__FILE__)."/config.php");
	require_once("../../php/dbfunction.php");
	require_once(dirname(__FILE__)."/functions.php");
	
	dbconnect($database, $dbuser, $dbpass);
	
	
	$action	= ((isset($_POST['action'])) ? $_POST['action'] : $_GET['action']);
	$task	= ((isset($_POST['task'])) ? $_POST['task'] : $_GET['task']);
	$text	= ((isset($_POST['text'])) ? $_POST['text'] : $_GET['text']);
	$query	= ((isset($_POST['query'])) ? $_POST['query'] : $_GET['query']);
	$debug	= ((isset($_POST['debug'])) ? $_POST['debug'] : $_GET['debug']);
	$data	= ((isset($_POST['data'])) ? $_POST['data'] : $_GET['data']);
	$limit	= ((isset($_POST['limit'])) ? $_POST['limit'] : $_GET['limit']);
	$start	= ((isset($_POST['start'])) ? $_POST['start'] : $_GET['start']);

	switch ($task)
	{
		case "customer":
			$xaction = $_POST['xaction'];
			switch($xaction)
			{
				case "read":
					
					break;
				case "update":
					
					break;
				case "delete":
					
					break;
				default:
					echo "{failure: true, errors:{reason:'Unknown xaction => $xaction'}}";
					break;
			}
		case "customer-get":
			$sql = "select k.id, if(g.name is null,'None',g.name) level" .
#				", k.fornavn, k.efternavn" .
				", k.addr1, k.zipcode, k.contact" . 
				", k.phone, k.mobile, k.email, u.id userid, u.usergroup" .
				" from customers k" .
				" left join users u on u.id = k.user" .
				" left join postnumre p on p.postnr = k.zipcode" .
				" left join usergroup g on u.usergroup = g.id" .
				" order by k.id" .
				" limit ${start},${limit}";
			
#			$sql = "select c.id,c.name,c.addr1,c.country,c.zipcode,c.contact from customers c order by c.id";
			
			if (! $res = dbquery($sql))
			{
				break;
			}
			
			$results = lookup('select count(*) from customers');
			$rows = array();
			while ($row = mysql_fetch_assoc($res))
			{
//				$row['bynavn'] = utf8_encode($row['bynavn']);
				$rows[] = $row;
			}
			
			echo "{success: true, results: $results, rows: " . json_encode($rows) .
				",sql: \"" . htmlspecialchars($sql) . "\"}";
			break;
		case 'customer-promote':
			if ($_REQUEST['userid'] == $userdata['validated'])
			{
				echo "{failure: true, errors:{reason:'$task: You can not promote/demote yourself. Contact an Administrator.'}}";
				break;
			}
			
			$kundeid =  $_REQUEST['kundeid'];
			
			if (!$_REQUEST['userid'])
			{
				
				$sql = "select * from kunder where kundeid=$kundeid";
				if (! $cust = dbgetarray($sql))
					break;
				
				list($login,$domain) = explode('@',str_replace(' ','_',$cust['email']));
				$password = generatePassword();
				$pwcrypt = sha1($password);
				
				$sql = "insert into users(fname,lname,phone,mobile,email,login" .
					",passwd,pwcrypt,readwrite,usergroup,kundeid)" .
					" values('" . $cust['fornavn'] . "'" .
					",'" . $cust['efternavn'] . "'" .
					",'" . $cust['telefon'] . "'" .
					",'" . $cust['mobil'] . "'" .
					",'" . $cust['email'] . "'" .
					",'" . $login . "'" .
					",'" . $password . "'" .
					",'" . $pwcrypt . "'" .
					",1,1" .
					",'" . $cust['kundeid'] . "')";
				
				if (! $res = dbquery($sql))
					break;
				
				$userid = mysql_insert_id($conn);
			}
			else
			{
				$userid = $_REQUEST['userid'];
			}
			
			$sql = "update kunder set userid=$userid where kundeid=$kundeid";
			if (! executeSQL($sql))
				break;

			$user = dbgetobject("select * from users where id=$userid");
			
			if ($_REQUEST['userid'] and $user->usergroup == 3)
			{
				echo "{failure: true, message: 'User allready at level 3 - Bruger Admin'}";
				break;
			}
			
			if ($_REQUEST['userid'] and $user->usergroup < 3)
			{
				$user->usergroup++;
			}
			else
			{
				echo "{failure: true, message: 'User just added at level 1 - Kunder'}";
				break;
			}
			
			if (! executeSQL("update users set usergroup=$user->usergroup where id=$userid"))
				break;
			
			$level = lookup("select name from usergroup where id=$user->usergroup");
			
			if (! EmailPromote($user, $level))
				break;
			
			echo "{success: true, message: 'User $user->fname $user->lname access level promoted to $level'}";
			
			break;
		case "customer-demote":
			if ($_REQUEST['userid'] == $userdata['validated'])
			{
				echo "{failure: true, errors:{reason:'$task: You can not promote/demote yourself. Contact an Administrator.'}}";
				break;
			}
			if (! $_REQUEST['userid'])
			{
				echo "{failure: true, errors:{reason:'$task: Unknown User. Missing UserID'}}";
				break;
			}
			$userid = $_REQUEST['userid'];
			$user = dbgetobject("select * from users where id=$userid");
			if ($user->usergroup < 2)
			{
				echo "{failure: true, errors:{reason:'$task: User allready at minimum accesslevel: $user->usergroup'}}";
				break;
			}
			$user->usergroup--;
			$level = lookup("select name from usergroup where id=$user->usergroup");
			if (! executeSQL("update users set usergroup=$user->usergroup where id=$userid"))
				break;
			
			echo "{success: true, message: 'User $user->fname $user->lname access level demoted to $level'}";
			break;
		default:
			echo "{failure: true, errors:{reason:'Unknown action => $task'}}";
			break;
	}
	
	mysql_close($conn);
?>
