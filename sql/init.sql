CREATE TABLE `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `md5` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_66027a8bd3581665d9202f9afb` (`md5`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


CREATE TABLE `page` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `author` varchar(200) NOT NULL,
  `thumbnail` varchar(200) DEFAULT NULL,
  `isHome` tinyint(4) NOT NULL DEFAULT '0',
  `isDelete` tinyint(4) NOT NULL DEFAULT '0',
  `canvasData` json NOT NULL,
  `canvasStyle` json NOT NULL,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `allowed` text,
  PRIMARY KEY (`id`),
  KEY `IDX_0efb094b11b76510bda6e58d69` (`author`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;