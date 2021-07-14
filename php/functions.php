<?php
/***
	function getusericon($level=0)
	function generatePassword ($length = 8)
	function EmailWelcome($user)
	function EmailPromote($user, $level)
***/

function getusericon($level=0)
{
	switch( level )
	{
		case '1':
			$icon = 'user-customer';
			break;
		case '2':
			$icon = 'user-user';
			break;
		case '3':
			$icon = 'user-user-admin';
			break;
		case '4':
			$icon = 'user-admin';
			break;
		default:
			$icon = 'user-no-user';
	}
	return $icon;
}

function generatePassword ($length = 8)
{
	$password = "";
	$possible = "2346789bcdfghjkmnpqrtvwxyzBCDFGHJKLMNPQRTVWXYZ";
	$maxlength = strlen($possible);
	
	if ($length > $maxlength)
	{
		$length = $maxlength;
	}
	
	$i = 0; 
	
	while ($i < $length)
	{ 
		
		$char = substr($possible, mt_rand(0, $maxlength-1), 1);
		
		if (!strstr($password, $char))
		{
			$password .= $char;
			$i++;
		}
	}
	
	return $password;
}

function EmailWelcome($user)
{
	$subject = mb_encode_mimeheader("Velkommen hos Skov & Træ","UTF-8","Q","\r\n");
#	$subject = "Velkommen hos Skov & Træ\n";
	
	$message = "Hej $user->fname\n\nVelkommen hos Skov & Træ" .
		"Du er nu oprettet som kunde/bruger på vores website.\n\n" .
		"For at foretage bestillinger skal du logge ind på" .
		"http://www.trader-internet.dk/mossin/\n\n" .
		"Username: $user->login\nPassword: $user->passwd\n\n" .
		"God fornøjelse\n\nwebmaster@trader-internet.dk\n";
	
	$message = utf8_encode($message);
	
	$headers = "From: webmaster@trader-internet.dk\r\n" .
		"Reply-To: webmaster@trader-internet.dk\r\n" .
		"Cc: webmaster@trader-internet.dk\r\n" .
		"MIME-version: 1.0\r\n" .
		"Content-type: text/plain; charset=UTF-8\r\n" .
		"X-Mailer: Trader Internet - PHP/" . phpversion() . "\r\n";
	
	$toaddress = "$user->fname $user->lname <$user->email>";
	
	if (! @mail($toaddress, $subject, $message, $headers))
	{
		echo "{failure: true, errors:{reason: 'sending email to new user $user->email failed.'}}";
		return false;
	}
	
	return true;
}

function EmailPromote($user, $level)
{
	$subject = mb_encode_mimeheader("Bruger Niveau hos Skov & Træ",'UTF-8','Q',"\r\n");
	
	$message = "Hej $user->fname\n\nVelkommen hos Skov & Træ" .
		"Din status som kunde/bruger på vores website er ændret til ${level}.\n\n" .
		"For at foretage bestillinger skal du logge ind på" .
		"http://www.trader-internet.dk/mossin/\n\n" .
		"Username: $user->login\nPassword: $user->passwd\n\n" .
		"God fornøjlse\n\nwebmaster@trader-internet.dk\n";
	
	$message = utf8_encode($message);
	
	$headers = "From: webmaster@trader-internet.dk\r\n" .
		"Reply-To: webmaster@trader-internet.dk\r\n" .
		"Cc: webmaster@trader-internet.dk\r\n" .
		"MIME-version: 1.0\r\n" .
		"Content-type: text/plain; charset=UTF-8\r\n" .
		"X-Mailer: Trader Internet - PHP/" . phpversion() . "\r\n";
	
	$toaddress = "$user->fname $user->lname <$user->email>";
	
	if (! @mail($toaddress, $subject, $message, $headers))
	{
		echo "{failure: true, errors:{reason: 'sending email to updated user $user->email failed.'}}";
		return false;
	}
	
	return true;
}
?>
