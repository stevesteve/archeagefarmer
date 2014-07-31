
CREATE TABLE `climate` (
	`id` int not null auto_increment primary key,
	`name` varchar(63)
);

CREATE TABLE `seed` (
	`id` int not null auto_increment primary key,
	`name` varchar(63),
	`growth_minutes` int,
	`harvest_minutes` int,
	`climate` int
);

ALTER TABLE seed
    ADD FOREIGN KEY (`climate`)
    REFERENCES `climate` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
