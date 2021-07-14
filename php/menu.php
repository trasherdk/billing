<?php
	require_once(dirname(__FILE__)."/config.php");
	require_once("$base/php/dbfunction.php");
	
	dbconnect($database, $dbuser, $dbpass);
	
	$action	= ((isset($_POST['action'])) ? $_POST['action'] : $_GET['action']);
	$id		= ((isset($_POST['id'])) ? $_POST['id'] : $_GET['id']);
	$node		= ((isset($_POST['node'])) ? $_POST['node'] : $_GET['node']);
	$nodeid		= ((isset($_POST['nodeid'])) ? $_POST['nodeid'] : $_GET['nodeid']);
	$text	= ((isset($_POST['text'])) ? $_POST['text'] : $_GET['text']);
	$oldtext	= ((isset($_POST['oldText'])) ? $_POST['oldText'] : $_GET['oldText']);
	$newtext	= ((isset($_POST['newText'])) ? $_POST['newText'] : $_GET['newText']);
	$point	= ((isset($_POST['point'])) ? $_POST['point'] : $_GET['point']);
	$target	= ((isset($_POST['target'])) ? $_POST['target'] : $_GET['target']);
	
	$tree	= ((isset($_POST['treeID'])) ? $_POST['treeID'] : $_GET['treeID']);
	$table	= ((isset($_POST['treeTable'])) ? $_POST['treeTable'] : $_GET['treeTable']);
	
	$debug	= ((isset($_POST['debug'])) ? $_POST['debug'] : $_GET['debug']);
	
	error_log("Menu parameters:" . json_encode($_POST));

	switch($_POST['category'])
	{
		case 'user-list':
		case 'user-entry':
			require_once('userlist.php');
//			getuserlist();
			return;
			break;
	}
	
	switch($_POST['action'])
	{
		case 'get-nodes':
			if ($node == 'root')
			{
				$node = 0;
			}
			else
			{
				$sql = "select category from ${table}";
				$sql .= " where id=${node} and menu='${tree}'";
				$category = lookup($sql);
			}
			
			$sql = "select * from ${table} where parent=$node and menu='${tree}'";
			$sql .= " and level <=" . $userdata['usergroup'];
			$sql .= " order by sort";
			if (!$res = dbquery($sql))
			{
				error_log("DB Query failed: $sql");
				mysql_close();
				return;
			}
			error_log("DB Query returned data : $sql");

			$nodes = array();
			while ($row = mysql_fetch_assoc($res))
			{
				/**
				if (lookup("select count(*) from ${table} where parent=${row['id']}"))
				{
					$row['leaf'] = false;
				}
				else
				{
					$row['leaf'] = true;
				}
				**/
				$row['qtip'] = $row['category'];
				$nodes[] = $row;
			}
			echo json_encode($nodes);
			mysql_close();
			return;
			break;
		case 'get-all-nodes':
			if ($node == 'root') $node = 0;
			
			$sql = "select * from ${table} where parent=$node and menu='${tree}'";
			$res = dbquery($sql);
			while ($row = mysql_fetch_object($res))
			{
				$treeArr = getTree($row->id, $tree);
				echo json_encode($treeArr);
			}
			break;
		case "getTree":
			$treeArr = getTree(0, $tree);
			echo json_encode($treeArr);
			break;
		default:
			echo "{failure: true, errors:{reason:'Unknown action: " . $_POST['action'] . "}}";
	}
	
	mysql_close();

$treeArr = array();

function getTree($parent=0,$treeID='')
{
	global $conn;
	global $table;
	global $userdata;
	
	$node = array();
	$tree = array();
	
	$sql = "select * from ${table} where parent=${parent}";
	$sql .= " and menu='${treeID}'";
	$sql .= " and level <= " . $userdata['usergroup'];
	$sql .= " order by parent,sort";
	if (! $res = mysql_query($sql))
	{
		echo "{failure: true, errors: { reason:'" .htmlspecialchars(mysql_error($conn),ENT_QUOTES). ", sql: '".htmlentities($sql, ENT_QUOTES)."'}";
		mysql_close($conn);
		exit;
	}
	
	while($row = mysql_fetch_object($res))
	{
		$tree['id'] = $row->id;
		$tree['nodeID'] = $row->id;
		$tree['pnodeID'] = $row->parent;
		$tree['text'] = $row->text;
		$tree['category'] = $row->category;
		if ($row->parent == 0)
			$tree['visible'] = false;
		
		unset($tree['children']);
		
		$children = getTree($row->id, $treeID);
		
		if (is_array($children) && count($children))
		{
			$tree['leaf'] = false;
			$tree['children'] = array();
			$tree['children'] = $children;
		}
		elseif ($tree['pnodeID'] == 0)
		{
			$tree['leaf'] = false;
		}
		else
		{
			$tree['leaf'] = true;
		}
		
		array_push($node, $tree);
	}
	
	mysql_free_result($res);
	return $node;
}
?>
