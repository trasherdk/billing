<?php
	require_once(dirname(__FILE__)."/config.php");
	require_once("$base/php/dbfunction.php");
	require_once(dirname(__FILE__)."/functions.php");
	
	dbconnect($database, $dbuser, $dbpass);
	
	
	$action	= ((isset($_POST['action'])) ? $_POST['action'] : $_GET['action']);
	$task	= ((isset($_POST['task'])) ? $_POST['task'] : $_GET['task']);
	$text	= ((isset($_POST['text'])) ? $_POST['text'] : $_GET['text']);
	$query	= ((isset($_POST['query'])) ? $_POST['query'] : $_GET['query']);
	$debug	= ((isset($_POST['debug'])) ? $_POST['debug'] : $_GET['debug']);
	$data	= ((isset($_POST['data'])) ? $_POST['data'] : $_GET['data']);
	
	switch($task)
	{
		case 'get-postnr':
			$sql = "select postnr, concat(bynavn,' (',postnr,')') bynavn" .
				" from postnumre" .
				" where postnr like '${query}%'" .
				" or bynavn like '${query}%'" .
				" order by bynavn";
				
			$res = dbquery($sql);
			$total = mysql_num_rows($res);
			while ($row = mysql_fetch_assoc($res))
			{
				$rows[] = $row;
			}
			
			echo "{success: true, results: $total, rows: " . json_encode($rows) . 
#				",sql: '" . htmlspecialchars ($sql,ENT_QUOTES) . "'" .
				"}";
			break;
		case "customer-save":
			/**
			echo "{failure: true, errors:{reason:'Action not implemented: " . $_POST['task'] . "'}}";
			break;
			**/
			if (!isset($data))
			{
				echo "{failure: true, errors:{reason:'No data submitted for: " . $_POST['task'] . "'}}";
				break;
			}
			
			if (! $data['telefon'] and ! $data['mobil'])
			{
				echo "{failure: true, errors:{reason:'Phone/Mobile missing: You must enter one or the other.'}}";
				return;
			}
			
			if ($data['kundeid'])
			{
				customer_update($data);
			}
			else
			{
				customer_insert($data);
			}
			
			break;
		default:
			echo "{failure: true, errors:{reason:'customerform: Unknown action => " . $_POST['task'] . "'}}";
			break;
	}
	
	mysql_close($conn);
	
function customer_update($data)
{
/**
	echo "{ failure: true, errors: { reason: 'Enter customer_update()'}, data: ".json_encode($data)."}";
	return;
**/
	$sql = "update kunder set ";
	$set = "";
	
	while (list($key, $val) = each($data))
	{
		if ($key == 'kundeid')
			continue;
		
		if ($set)
			$set .= ",";
		
		$set .= "${key} = '${val}'";
	}
	
	$sql .= "$set where kundeid=" . $data['kundeid'];
}

function customer_insert($data)
{
	/**
	echo "{ failure: true, errors: { reason: 'Enter customer_insert()'}, data: ".json_encode($data)."}";
	return;
	**/
	$sql = "insert into kunder";
	$keys = "";
	$vals = "";
	while (list($key, $val) = each($data))
	{
		if ($key == 'kundeid')
			continue;
		
		if ($val == '')
			continue;
		
		if ($keys)
			$keys .= ",";
		
		$keys .= $key;
		
		if ($vals)
			$vals .= ",";
		
		$vals .= "'$val'";
	}
	
	$sql .= "(${keys}) values(${vals})";
	
	if (!dbquery($sql))
	{
		return false;
	}
	
	/**
	echo "{ failure: true, errors: { reason: 'Before mysql_insert_id()'}, data: ".json_encode($data)."}";
	return;
	**/
	if (!$id = @mysql_insert_id())
	{
		echo "{ failure: true, errors: { reason: 'mysql_insert_id() returned no id:" . mysql_error($conn) . "'}}";
	}
	$data['kundeid'] = $id;
	/**
	echo "{ failure: true, errors: { reason: 'Before dbgetarray()'}, data: ".json_encode($data)."}";
	return;
	**/
	if (!$cust = dbgetarray("select * from kunder where kundeid=$id"))
	{
		return false;
	}
	
	/**
	echo "{ failure: true, errors: { reason: 'Before generatePassword()'}, data: ".json_encode($data)."}";
	return;
	**/
	$pw = generatePassword();
	$pwcrypt = sha1($pw);
	list($login, $domin) = explode('@',$data['email']);
	
	$sql = "insert into users(manager,fname,lname,phone,mobile,email,domain,login,passwd,pwcrypt,usergroup,kundeid)";
	$sql .= " values(1,'" . mysql_real_escape_string($data['fornavn']) . "'";
	$sql .= ",'" . mysql_real_escape_string($data['efternavn']) . "'";
	$sql .= ",'" . mysql_real_escape_string($data['telefon']) . "'";
	$sql .= ",'" . mysql_real_escape_string($data['mobil']) . "'";
	$sql .= ",'" . mysql_real_escape_string($data['email']) . "'";
	$sql .= ",'" . mysql_real_escape_string($domain) . "'";
	$sql .= ",'" . mysql_real_escape_string($login) . "'";
	$sql .= ",'" . $pw . "'";
	$sql .= ",'" . sha1($pw) . "',1,$id)";
	if (!dbquery($sql))
	{
		return false;
	}
	
	$userid = mysql_insert_id($conn);
	$user = dbgetobject("select * from users where id=$userid");
	
	if (! EmailWelcome($user))
		return false;
	
	echo "{success: true, results: 1, rows: " . json_encode($cust) . "}";
	
}

?>
