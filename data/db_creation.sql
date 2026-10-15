-- Type: single_transaction_type
CREATE TYPE public.single_transaction_type AS ENUM
    ('DEPOSIT', 'WITHDRAW', 'TRANSFER');

-- Table: public.users
CREATE TABLE IF NOT EXISTS public.users
(
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(30) NOT NULL,
    email character varying(254) NOT NULL,
    phone character varying(20) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (username),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_phone_key UNIQUE (phone),
    CONSTRAINT users_email_check CHECK (email::text ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'::text),
    CONSTRAINT users_username_check CHECK (length(username::text) >= 3)
);

-- Table: public.account_type
CREATE TABLE IF NOT EXISTS public.account_type
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    marketing_name character varying(50) NOT NULL,
    interest_rate numeric(7,5) NOT NULL DEFAULT 0.00,
    maturation_days integer NOT NULL DEFAULT 0,
    CONSTRAINT account_type_pkey PRIMARY KEY (id),
    CONSTRAINT account_type_marketing_name_key UNIQUE (marketing_name),
    CONSTRAINT account_type_interest_rate_check CHECK (interest_rate >= 0.00),
    CONSTRAINT account_type_maturation_days_check CHECK (maturation_days >= 0)
);

-- Table: public.accounts
CREATE TABLE IF NOT EXISTS public.accounts
(
    account_number numeric(12,0) NOT NULL,
    account_type bigint NOT NULL,
    username character varying(50) NOT NULL,
    nickname character varying(50) DEFAULT NULL::character varying,
    balance numeric(17,2) NOT NULL DEFAULT 0.00,
    pin_hash character varying(255) NOT NULL,
    creation_date timestamp without time zone NOT NULL DEFAULT now(),
    frozen_until timestamp without time zone,
    CONSTRAINT accounts_pkey PRIMARY KEY (account_number),
    CONSTRAINT accounts_account_type_fkey FOREIGN KEY (account_type)
        REFERENCES public.account_type (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT accounts_username_fkey FOREIGN KEY (username)
        REFERENCES public.users (username) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT accounts_account_number_check CHECK (account_number >= '100000000000'::bigint::numeric),
    CONSTRAINT accounts_balance_check CHECK (balance >= 0.00)
);

-- Indexes for accounts
CREATE INDEX IF NOT EXISTS idx_accounts_account_type ON public.accounts USING btree (account_type ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_accounts_username ON public.accounts USING btree (username ASC NULLS LAST);

-- Table: public.transactions_history
CREATE TABLE IF NOT EXISTS public.transactions_history
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    source_account numeric(12,0) NOT NULL,
    destination_account numeric(12,0),
    instant timestamp without time zone NOT NULL,
    amount numeric(17,2) NOT NULL,
    source_balance_after numeric(17,2) NOT NULL,
    destination_balance_after numeric(17,2),
    transaction_type single_transaction_type NOT NULL,
    description character varying(50) DEFAULT NULL::character varying,
    CONSTRAINT transactions_history_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_history_destination_account_fkey FOREIGN KEY (destination_account)
        REFERENCES public.accounts (account_number) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT transactions_history_source_account_fkey FOREIGN KEY (source_account)
        REFERENCES public.accounts (account_number) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_different_accounts CHECK (source_account IS DISTINCT FROM destination_account),
    CONSTRAINT chk_ledger_logic CHECK (transaction_type = 'TRANSFER'::single_transaction_type AND destination_account IS NOT NULL AND destination_balance_after IS NOT NULL OR transaction_type <> 'TRANSFER'::single_transaction_type AND destination_account IS NULL AND destination_balance_after IS NULL),
    CONSTRAINT transactions_history_amount_check CHECK (amount > 0.00)
);

-- Indexes for transactions_history
CREATE INDEX IF NOT EXISTS idx_transactions_destination_account ON public.transactions_history USING btree (destination_account ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_transactions_instant ON public.transactions_history USING btree (instant ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_transactions_source_account ON public.transactions_history USING btree (source_account ASC NULLS LAST);