<?php
	require_once(dirname(__FILE__)."/config.php");
	require_once("dbfunction.php");
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
		case "user":
			$xaction = $_POST['xaction'];
			switch($xaction)
			{
				case "read":
					$sql = "select u.id, u.manager, u.fname, u.lname, u.phone, u.mobile, u.email" .
						",u.login, u.passwd, u.usergroup, g.name `level`, u.kundeid" .
						" from users u" .
						" left join usergroup g on g.id=u.usergroup" .
						" where u.usergroup <= " . $userdata['usergroup'] .
						" order by u.id" .
						" limit ${start},${limit}";
					
					if (! $res = dbquery($sql))
					{
						break;
					}
					
					$results = lookup("select count(*) from users where usergroup <= " . $userdata['usergroup']);
					
					while ($row = mysql_fetch_assoc($res))
					{
						$rows[] = $row;
					}
					
					echo "{success: true, results: $results, rows: " . json_encode($rows) .
						",sql: '$sql'}";
					
					break;
				case "update":
					$skip = array('id','level','kundeid');
					
					$data = json_decode($_POST['rows']);
					
					$sql = "update users set kundeid=" . $data->kundeid;
					while (list($key, $val) = each($data))
					{
						if (in_array($key, $skip)) continue;
						
						$sql .= ",$key='$val'";
					}
					$sql .= " where id=" . $data->id;
					
					
					if (!$res = dbquery($sql))
					{
						break;
					}
					/*
					echo "{success: true" .
						", results: 1" .
						", rows: " . json_encode($data) .
						", sql: '$sql'}";
					*/
					echo "{success:true}";
					
					break;
				default:
					echo "{failure: true, errors:{reason:'Unknown action => $xaction'}}";
					break;
			}
			
			break;
		case "user-get":
			$sql = "select u.id, u.manager, u.fname, u.lname, u.phone, u.mobile, u.email" .
				",u.login, u.passwd, u.usergroup, g.name `level`, u.kundeid" .
				" from users u" .
				" left join usergroup g on g.id=u.usergroup" .
				" where u.usergroup <= " . $userdata['usergroup'] .
				" order by u.id" .
				" limit ${start},${limit}";
			
			if (! $res = dbquery($sql))
			{
				break;
			}
			
#			$results = mysql_num_rows($res);
			$results = lookup("select count(*) from users where usergroup <= " . $userdata['usergroup']);
			
			while ($row = mysql_fetch_assoc($res))
			{
				$rows[] = $row;
			}
			
			echo "{success: true, results: $results, rows: " . json_encode($rows) .
				",sql: '$sql'}";
			break;
		case 'user-promote':
			if ($_REQUEST['userid'] == $userdata['validated'])
			{
				echo "{failure: true, errors:{reason:'$task: You can not promote/demote yourself. Contact an Administrator.'}}";
				break;
			}
			
			$kundeid =  $_REQUEST['kundeid'];
			
			if (!$_REQUEST['userid'])
			{
				echo "{failure: true, errors:{reason:'$task: Unknown User. Missing UserID'}}";
				break;
			}
			
			$userid = $_REQUEST['userid'];
			$user = dbgetobject("select * from users where id=$userid");
			
			if ($_REQUEST['userid'] and $user->usergroup < 3)
			{
				$user->usergroup++;
			}
			else
			{
				echo "{failure: true, errors:{reason:'User allready at level 3 - Bruger Admins'}}";
				break;
			}
			
			if (! executeSQL("update users set usergroup=$user->usergroup where id=$userid"))
				break;
			
			$level = lookup("select name from usergroup where id=$user->usergroup");
/**			
			if (!EmailPromote($user, $level))
			{
				break;
			}
**/			
			echo "{success: true, message: 'User $user->fname $user->lname access level promoted to $level'}";
			
			break;
		case "user-demote":
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
