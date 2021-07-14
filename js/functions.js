function getIcon(level)
{
	var icon = '';
	
	switch( level )
	{
		case '1':
			icon = 'user-customer';
			break;
		case '2':
			icon = 'user-user';
			break;
		case '3':
			icon = 'user-user-admin';
			break;
		case '4':
			icon = 'user-admin';
			break;
		default:
			icon = 'user-no-user';
	}
	
	return icon;
}