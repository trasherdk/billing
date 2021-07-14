<?php
	require_once('config.php');
	require_once('dbfunction.php');
	
	dbconnect($database,$dbuser,$dbpass);

	switch($_POST['task'])
	{
		case 'get-usergroup':
			$sql = "select id usergroup, name usergroupname";
			$sql .= " from usergroup";
			if ($_POST['query'])
			{
				$sql .= " and name like '" . $_POST['query'] . "%'";
			}
			$sql .= " order by id";
			
			if (!$res = dbquery($sql))
				break;
			
			$count = mysql_num_rows($res);
			
			while ( $row = mysql_fetch_assoc($res))
			{
				$rows[] = $row;
			}
			$result = array('success'=>true, 'results'=>$count, 'rows'=>$rows);
			echo json_encode($result);
			mysql_free_result($res);
			
			break;
		case 'get-manager':
			$sql = "select id manager, concat(fname,' ',lname) managername";
			$sql .= " from users where admin=1";
			if ($_POST['query'])
			{
				$sql .= " and fname like '" . $_POST['query'] . "%'";
			}
			
			if (!$res = dbquery($sql))
				break;
			
			$count = mysql_num_rows($res);
			
			while ( $row = mysql_fetch_assoc($res))
			{
				$rows[] = $row;
			}
			$result = array('success'=>true, 'results'=>$count, 'rows'=>$rows);
			echo json_encode($result);
			mysql_free_result($res);
			
			break;
		case 'user-save':
			if (isset($_POST['data']))
			{
				$data = $_POST['data'];
				
				$sql = "insert into users(manager,fname,lname";
				$sql .= ",phone,email,passwd,pwcrypt,admin,readwrite,usergroup)";
				$sql .= " values(${data[manager]},'${data[fname]}','${data[lname]}'";
				$sql .= ",'${data[phone]}','${data[email]}','${data[passwd]}'";
				$sql .= ",SHA1('${data[passwd]}'),if('${data[admin]}'='on',1,0)";
				$sql .= ",if('${data[readwrite]}'='on',1,0),${data[usergroup]})";
				if (!$res = executeSQL($sql))
				{
					return false;
				}
				$data['id'] = mysql_insert_id($res);
				
				$result = array(
					'success'=>true
					,'message'=>'Data saved to database'
					,'data'=>$data
					,'SQL'=>$sql
				);
			}
			else
			{
				$result = array(
					'failure'=>true
					,'reason'=>'No data to save.'
				);
			}
			echo json_encode($result);
			break;
	}

	mysql_close($conn);
?>
