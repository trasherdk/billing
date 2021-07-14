<html>
<head>
<!--meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"-->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Icon List</title>
<link rel="stylesheet" type="text/css" href="../css/silk.css" />
</head>
<body>
<?php
	
	$base = $_SERVER['DOCUMENT_ROOT'];
	
	if (!$f = fopen("$base/billing/css/silk.css",'r'))
	{
		echo "<div>fopen() failed.</div>\n";
		return;
	}
	
	$ln = 0;
	
	echo "<table>\n<tr>\n";
	
	while ($cssline = fgets($f))
	{
		$ln++;
		
		$part = explode(' ', $cssline, 2);
		$class = substr($part[0],1);
		
		echo "<td><span style='{float:left; width:30px;}' class='$class'>&nbsp;</span>$class</td>\n";
		
		if ($ln % 4 == 0)
		{
			echo "</tr>\n<tr>\n";
		}
	}
	
	while ($ln % 4)
	{
		echo "<td>&nbsp;</td>\n";
		$ln++;
	}
	echo "</tr>\n</table>\n";
	
	fclose($f);
?>
</body>
</html>
