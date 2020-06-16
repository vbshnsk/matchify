alter table "Taste" drop constraint if exists "Taste_fk0";

alter table "Play" drop constraint if exists "Play_fk0";

alter table "Play" drop constraint if exists "Play_fk1";

alter table "Match" drop constraint if exists "Match_fk0";

alter table "Match" drop constraint if exists "Match_fk1";

alter table "Message" drop constraint if exists  "Message_fk0";

alter table "Message" drop constraint if exists  "Message_fk1";

drop table if exists "User";

drop table if exists "Taste";

drop table if exists "Track";

drop table if exists "Genre";

drop table if exists "Play";

drop table if exists "session";

drop table if exists "Match";

drop table if exists "Ditch";

drop table if exists "Message";