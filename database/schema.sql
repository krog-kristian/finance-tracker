set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"firstname" TEXT NOT NULL,
	"lastname" TEXT NOT NULL,
	"createdat" timestamptz(6) not null default now(),
	"lastlogin" timestamptz(6) not null default now(),
	"password" TEXT NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"email" TEXT NOT NULL UNIQUE,
	"userId" serial NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."records" (
	"userId" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"day" integer NOT NULL,
	"source" TEXT NOT NULL,
	"inOut" BOOLEAN NOT NULL,
	"created" timestamptz(6) NOT NULL default now(),
	"recordId" serial NOT NULL,
	"numberOfItems" integer NOT NULL,
	"totalSpent" DECIMAL NOT NULL,
	CONSTRAINT "records_pk" PRIMARY KEY ("recordId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."items" (
	"recordId" integer NOT NULL,
	"category" TEXT NOT NULL,
	"amount" DECIMAL NOT NULL,
	"itemname" TEXT NOT NULL,
	"itemId" serial NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("itemId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "records" ADD CONSTRAINT "records_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("recordId") REFERENCES "records"("recordId");
