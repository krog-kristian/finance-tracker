set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

-- CREATE TABLE "public"."users" (
-- 	"firstname" TEXT NOT NULL,
-- 	"lastname" TEXT NOT NULL,
-- 	"createdat" timestamptz(6) not null default now(),
-- 	"lastlogin" timestamptz(6) not null default now(),
-- 	"password" TEXT NOT NULL,
-- 	"username" TEXT NOT NULL UNIQUE,
-- 	"email" TEXT NOT NULL UNIQUE,
-- 	"userId" serial NOT NULL,
-- 	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
-- ) WITH (
--   OIDS=FALSE
-- );



-- CREATE TABLE "public"."records" (
-- 	"userId" integer NOT NULL,
-- 	"month" integer NOT NULL,
-- 	"year" integer NOT NULL,
-- 	"day" integer NOT NULL,
-- 	"source" TEXT NOT NULL,
-- 	"isDebit" BOOLEAN NOT NULL,
-- 	"created" timestamptz(6) NOT NULL default now(),
-- 	"recordId" serial NOT NULL,
-- 	"numberOfItems" integer NOT NULL,
-- 	"totalSpent" DECIMAL NOT NULL,
-- 	CONSTRAINT "records_pk" PRIMARY KEY ("recordId")
-- ) WITH (
--   OIDS=FALSE
-- );



-- CREATE TABLE "public"."items" (
-- 	"recordId" integer NOT NULL,
-- 	"category" TEXT NOT NULL,
-- 	"amount" DECIMAL NOT NULL,
-- 	"itemname" TEXT NOT NULL,
-- 	"itemId" serial NOT NULL,
-- 	CONSTRAINT "items_pk" PRIMARY KEY ("itemId")
-- ) WITH (
--   OIDS=FALSE
-- );




-- ALTER TABLE "records" ADD CONSTRAINT "records_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

-- ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("recordId") REFERENCES "records"("recordId");


CREATE TABLE "public"."users" (
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
	"createdAt" timestamptz not null default now(),
	"lastLogin" timestamptz not null default now(),
	"password" TEXT NOT NULL,
	"userName" TEXT NOT NULL UNIQUE,
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
	"isDebit" BOOLEAN NOT NULL,
	"created" timestamptz NOT NULL default now(),
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
	"itemName" TEXT NOT NULL,
	"itemId" serial NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("itemId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."budgets" (
	"userId" serial NOT NULL UNIQUE,
	"food" DECIMAL NOT NULL,
	"clothes" DECIMAL NOT NULL,
	"fastFood" DECIMAL NOT NULL,
	"cleaning" DECIMAL NOT NULL,
	"toiletries" DECIMAL NOT NULL,
	"furniture" DECIMAL NOT NULL,
	"car" DECIMAL NOT NULL,
	"utilities" DECIMAL NOT NULL,
	"rent" DECIMAL NOT NULL,
	"entertainment" DECIMAL NOT NULL,
	"lending" DECIMAL NOT NULL,
	"other" DECIMAL NOT NULL,
	CONSTRAINT "budgets_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "records" ADD CONSTRAINT "records_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("recordId") REFERENCES "records"("recordId");

ALTER TABLE "budgets" ADD CONSTRAINT "budgets_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
