CREATE TABLE "posts" ("id" SERIAL PRIMARY KEY, "date" TEXT NOT NULL, "author_id" INTEGER NOT NULL, "title" TEXT, "entry" TEXT NOT NULL, "comments" TEXT NOT NULL, FOREIGN KEY("author_id") REFERENCES "authors"("id"));
alter table posts alter column comments set default '[]';

INSERT INTO posts(date, author_id, entry) VALUES ('', 1, '');
INSERT INTO posts(date, author_id, title, entry) VALUES ('', 1, '', '');
INSERT INTO posts(date, author_id, title, entry) VALUES ('', 1, '', '');
INSERT INTO posts(date, author_id, title, entry) VALUES ('', 1, '', '');
INSERT INTO posts(date, author_id, entry) VALUES ('', 1, '');

create table "comments" ("id" serial primary key, "post_id" integer not null, "author_id" integer not null, "date" text not null, "comment" text not null, foreign key("post_id") references "posts"("id"), foreign key("author_id") references "authors"("id"));

insert into comments(post_id, author_id, date, comment) values (2, 1, 'test', 'test');