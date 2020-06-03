create table session (
    "sessionid" varchar unique not null,
    "maxage" int not null,
    "session" jsonb not null
);

create table "User" (
	"userid" serial not null,
	"username" varchar not null unique,
	"displayname" varchar,
	"preference" varchar default 'anyone',
	"interests" varchar[],
	"email" varchar not null unique,
	"password" varchar not null,
	"spotify" jsonb,
	"bio" text,
    "gender" varchar not null,
    "city" varchar,
    "birthdate" date not null,
    "profilephotos" varchar[],
	constraint "User_pk" primary key ("userid")
);

create table "Taste" (
	"username" varchar not null,
	"classical" real not null default 9.99,
	"rock" real not null default 9.99,
	"pop" real not null default 9.99,
	"rnb" real not null default 9.99,
	"hiphop" real not null default 9.99,
	"country" real not null default 9.99,
	"jazz" real not null default 9.99,
	"electronic" real not null default 9.99,
	"latin" real not null default 9.99,
	"folk" real not null default 9.99,
	"blues" real not null default 9.99,
	constraint "Taste_pk" primary key ("username")
);

create table "Track" (
	"trackid" serial not null,
	"name" varchar not null,
	"artists" varchar[] not null,
	"genres" varchar[] not null,
	"spotifyid" varchar unique ,
	constraint "Track_pk" primary key ("trackid")
);

create table "Genre" (
	"name" varchar not null,
	"maingenre" varchar not null,
	constraint "Genre_pk" primary key (name, maingenre)
);

create table "Play" (
    "playid" serial,
	"userid" int not null,
	"trackid" int not null,
	"listenedon" timestamp not null,
	constraint "Play_pk" primary key (playid)
);

create table "Match" (
    "matchid" serial,
    "username" varchar not null,
    "match" varchar not null,
    constraint "Match_pk" primary key (matchid)
);

create table "Ditch" (
    "ditchid" serial,
    "username" varchar not null,
    "ditch" varchar not null,
    constraint "Ditch_pk" primary key (ditchid)
);

create table "Message" (
    "messageid" serial,
    "message" text,
    "sender" varchar not null,
    receiver varchar not null,
    "senton" timestamp not null,
    constraint "Message_pk" primary key (messageid)
);

alter table "Taste" add constraint "Taste_fk0" foreign key ("username") references "User"("username") on delete cascade;
alter table "Play" add constraint "Play_fk0" foreign key ("userid") references "User"("userid");
alter table "Play" add constraint "Play_fk1" foreign key ("trackid") references "Track"("trackid");
alter table "Match" add constraint "Match_fk0" foreign key ("username") references "User"("username") on delete cascade ;
alter table "Match" add constraint "Match_fk1" foreign key ("match") references "User"("username") on delete cascade ;
alter table "Message" add constraint "Message_fk0" foreign key (sender) references "User"("username") on delete cascade;
alter table "Message" add constraint "Message_fk1" foreign key (receiver) references "User"("username") on delete cascade ;

create index pair_idx on "Message" using btree(sender, receiver);
create index time_idx on "Play" using btree(listenedon);

create or replace function createTaste()
returns trigger as
    $$
    begin
        insert into "Taste"("username") values(new.username);
        return new;
    end
    $$ language plpgsql;

create trigger createTaste
    after insert on "User"
    for each row
    execute procedure createTaste();
