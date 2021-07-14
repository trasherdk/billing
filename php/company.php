<?php
	require_once(dirname(__FILE__)."/config.php");
	require_once("../../php/dbfunction.php");
	require_once(dirname(__FILE__)."/functions.php");
	
	dbconnect($database, $dbuser, $dbpass);

/**
DROP TABLE IF EXISTS `billing`.`company`;
CREATE TABLE  `billing`.`company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` varchar(50) NOT NULL,
  `addr1` varchar(50) DEFAULT NULL,
  `addr2` varchar(50) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) NOT NULL DEFAULT 'Denmark',
  `cvr` varchar(15) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `web` varchar(50) DEFAULT NULL,
  `closed` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unpaid` decimal(10,2) NOT NULL DEFAULT '0.00',
  `open` decimal(10,2) NOT NULL DEFAULT '0.00',
  `credit` decimal(10,2) NOT NULL DEFAULT '5000.00',
  `payment` enum('0','1','2','3') NOT NULL DEFAULT '0',
  `blocking` enum('Y','N') NOT NULL DEFAULT 'N',
  `validated` enum('Y','N') NOT NULL DEFAULT 'N',
  `changed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `changedby` int(11) NOT NULL DEFAULT '0',
  `created` date DEFAULT NULL,
  `createdby` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `company` (`company`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
**/
	switch($_POST['task'])
	{
		case "company":
			$xaction	= $_POST['xaction'];
			$start		= $_POST['start'];
			$limit		= $_POST['limit'];
			switch($xaction)
			{
				case "read":
					$sql = "select * from company" .
						" order by id" .
						" limit ${start},${limit}";
					
					if (! $res = dbquery($sql))
					{
						break;
					}
					
					$results = lookup("select count(*) from company");
					
					while ($row = mysql_fetch_assoc($res))
					{
						$rows[] = $row;
					}
					
					echo "{success: true, results: $results, rows: " . json_encode($rows) .
						",sql: '$sql'}";
					
					break;
				case "update":
					$skip = array('id');
					
					$data = json_decode($_POST['rows']);
					
					$sql = "update company set changedby=" . $_POST['userid'];
					while (list($key, $val) = each($data))
					{
						if (in_array($key, $skip)) continue;
						
						$sql .= ",$key='$val'";
					}
					$sql .= " where id=" . $data->id;
					
					if (!executeSQL($sql))
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
	}

	mysql_close($conn);
?>
