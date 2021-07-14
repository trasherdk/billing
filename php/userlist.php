<?php
	require_once('functions.php');
	
	switch($_POST['category'])
	{
		case 'user-list':
			$sql = "select u.id userid, g.name qtip";
			$sql .= ", concat(u.fname,' ',u.lname) `text`";
			$sql .= " from users u";
			$sql .= " left join usergroup g on g.id=u.usergroup";
			$sql .= " order by u.manager,u.id";
			
			break;
		case 'user-entry':
			$sql = "select u.id userid, g.name qtip";
			$sql .= ", concat(u.fname,' ',u.lname) `text`";
			$sql .= " from users u";
			$sql .= " left join usergroup g on g.id=u.usergroup";
			$sql .= " where u.id=" . $_POST['userid'];
			$sql .= " order by u.manager,u.id";
			
			break;
		default:
			echo "{success:false, error:{reason:'Unknown command',command:'${_POST[category]}'}}";
			return;
	}
	
	if (!$res = dbquery($sql))
	{
		echo "{Error: \"$sql\"";
		return;
	}
	
	$nodes = array();
	$rcnt = mysql_num_rows($res);
	
	while ($row = mysql_fetch_assoc($res))
	{
		$row['category'] = "user-entry";
		$row['id'] = "user-" . $row['userid'];
		$row['iconCls'] = getusericon($row['usergroup']);
		$nodes[] = $row;
	}
	$result = array(
		'success'=>true
		,'results'=>$rcnt
		,'data'=>$nodes
	);
	
	echo json_encode($nodes);
	
?>
