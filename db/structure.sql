USE `farmassistant`;

CREATE TABLE `seed` (
	`id` int not null auto_increment primary key,
	`name` varchar(63),
	`growth_minutes` int
);
