<?php
/**
function dbconnect($db, $user, $password)
function dbquery($sql)
function getobject($sql)
function dbgetobject($sql)
function dbgetarray($sql)
function lookup($sql)
function executeSQL($sql)
**/

function dbconnect($db, $user, $password)
{
	global $conn;
	global $mysql;
	
	if (!$conn = @mysql_connect('localhost',$user,$password))
	{
		echo "{ failuer: true, errors: { reason: 'Connect to DB $db failed.<br />" . htmlspecialchars(mysql_error($conn),ENT_QUOTES) . "'}}";
		exit;
	}
	
	if (!$mysql = @mysql_select_db($db,$conn))
	{
		echo "{ failuer: true, errors: { reason: 'Select DB $db failed.<br />" . htmlspecialchars(mysql_error($conn),ENT_QUOTES) . "'}}";
		mysql_close();
		exit;
	}
	
	return $conn;
}

function dbquery($sql)
{
	global $conn;
	
	if (!$res = mysql_query($sql))
	{
		echo "{failure: true, errors:{reason: 'dbquery() failed: " . htmlspecialchars(mysql_error($conn),ENT_QUOTES) . "', sql: $sql }}";
		return false;
	}
	
	return $res;
}

function getobject($sql)
{
	global $conn;
	$result = true;
	
	if (! $res = mysql_query($sql))
	{
		echo "{failure: true, errors:{reason: 'getobject() failed: " . htmlspecialchars(mysql_error($conn),ENT_QUOTES) . "' sql: '".htmlspecialchars($sql,ENT_QUOTES)."'}}";
		$result = false;
	}
	elseif (mysql_num_rows($res) > 1)
	{
		echo "{failure: true, errors:{reason: 'getobject(): Query returned more than one row' sql: ".htmlspecialchars($sql,ENT_QUOTES)."'}}";
		$result = false;
	}
	else
	{
		$result = mysql_fetch_object($res);
		mysql_free_result($res);
	}
	
	return $result;
}

function dbgetobject($sql)
{
	return getobject($sql);
}

function dbgetarray($sql)
{
	global $conn;
	$result = true;
	
	if (! $res = mysql_query($sql))
	{
		echo "{failure: true, errors:{reason: 'dbgetarray() failed: " .htmlspecialchars(mysql_error($conn),ENT_QUOTES). "' sql: ".htmlspecialchars($sql,ENT_QUOTES)."'}}";
		$result = false;
	}
	elseif (!$result = mysql_fetch_assoc($res))
	{
		echo "{failure: true, errors:{reason: 'dbgetarray() failed: " .htmlspecialchars(mysql_error($conn),ENT_QUOTES). "' sql: ".htmlspecialchars($sql,ENT_QUOTES)."'}}";
		$result = false;
	}
	else
	{
		mysql_free_result($res);
	}
	
	return $result;
}

function lookup($sql)
{
	global $conn;
	$result = true;
	
	if (! $res = mysql_query($sql))
	{
		echo "{failure: true, errors:{reason: '" .htmlspecialchars(mysql_error($conn),ENT_QUOTES). "' sql: ".htmlspecialchars($sql,ENT_QUOTES)."'}}";
		$result = false;
	}
	elseif (mysql_num_rows($res) > 1)
	{
		echo "{failure: true, errors:{reason: 'Lookup: Query Returned more than one row.' sql: ".htmlspecialchars($sql,ENT_QUOTES)."'}}";
		$result = false;
	}
	elseif (mysql_num_fields($res) > 1)
	{
		echo "{failure: true, errors:{reason: 'Lookup: Query Returned more than one column.' sql: ".htmlspecialchars($sql,ENT_QUOTES)."'}}";
		$result = false;
	}
	else
	{
		$row = mysql_fetch_row($res);
		$result = $row[0];
		mysql_free_result($res);
	}
	
	return $result;
}

function executeSQL($sql)
{
	global $conn;
	
	
	if (! $sql)
	{
		echo "{failure: true, errors:{ reason: 'Missing SQL statement'}}";
		return false;
	}
	
	if (! $res = mysql_query($sql))
	{
		echo "{failure: true, errors:{reason: '" .htmlspecialchars(mysql_error($conn),ENT_QUOTES). "'}, sql: \"$sql\"}";
		return false;
	}
	return true;
}

?>
