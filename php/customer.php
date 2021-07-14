<?php
/**
DROP TABLE IF EXISTS `billing`.`customers`;
CREATE TABLE  `billing`.`customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) unsigned NOT NULL DEFAULT '0',
  `owner` int(11) unsigned NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL DEFAULT '',
  `addr1` varchar(50) NOT NULL DEFAULT '',
  `addr2` varchar(50) NOT NULL DEFAULT '',
  `country` char(2) NOT NULL DEFAULT 'th',
  `zipcode` varchar(8) NOT NULL DEFAULT '',
  `contact` varchar(50) NOT NULL DEFAULT '',
  `phone` varchar(15) NOT NULL DEFAULT '',
  `mobile` varchar(15) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `notat` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `owner` (`owner`),
  KEY `user` (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
**/
?>
