--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 15.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP TRIGGER IF EXISTS update_partner_cases_updated_at ON public.partner_cases;
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON public.news_articles;
DROP TRIGGER IF EXISTS update_form_submissions_updated_at ON public.form_submissions;
DROP TRIGGER IF EXISTS update_featured_cases_updated_at ON public.featured_cases;
DROP TRIGGER IF EXISTS update_customer_cases_updated_at ON public.customer_cases;
DROP TRIGGER IF EXISTS update_case_configurations_updated_at ON public.case_configurations;
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
DROP INDEX IF EXISTS public.idx_partner_cases_sort_order;
DROP INDEX IF EXISTS public.idx_partner_cases_is_active;
DROP INDEX IF EXISTS public.idx_partner_cases_industry;
DROP INDEX IF EXISTS public.idx_news_articles_publish_time;
DROP INDEX IF EXISTS public.idx_news_articles_is_featured;
DROP INDEX IF EXISTS public.idx_news_articles_created_at;
DROP INDEX IF EXISTS public.idx_news_articles_category;
DROP INDEX IF EXISTS public.idx_form_submissions_status;
DROP INDEX IF EXISTS public.idx_form_submissions_created_at;
DROP INDEX IF EXISTS public.idx_form_submissions_company_name;
DROP INDEX IF EXISTS public.idx_featured_cases_sort_order;
DROP INDEX IF EXISTS public.idx_featured_cases_is_active;
DROP INDEX IF EXISTS public.idx_customer_cases_status;
DROP INDEX IF EXISTS public.idx_customer_cases_sort_order;
DROP INDEX IF EXISTS public.idx_customer_cases_is_featured;
DROP INDEX IF EXISTS public.idx_customer_cases_industry;
DROP INDEX IF EXISTS public.idx_case_configurations_sort_order;
DROP INDEX IF EXISTS public.idx_case_configurations_is_active;
DROP INDEX IF EXISTS public.idx_admin_users_is_active;
DROP INDEX IF EXISTS public.idx_admin_users_email;
ALTER TABLE IF EXISTS ONLY public.partner_cases DROP CONSTRAINT IF EXISTS partner_cases_pkey;
ALTER TABLE IF EXISTS ONLY public.news_articles DROP CONSTRAINT IF EXISTS news_articles_pkey;
ALTER TABLE IF EXISTS ONLY public.form_submissions DROP CONSTRAINT IF EXISTS form_submissions_pkey;
ALTER TABLE IF EXISTS ONLY public.featured_cases DROP CONSTRAINT IF EXISTS featured_cases_pkey;
ALTER TABLE IF EXISTS ONLY public.customer_cases DROP CONSTRAINT IF EXISTS customer_cases_pkey;
ALTER TABLE IF EXISTS ONLY public.case_configurations DROP CONSTRAINT IF EXISTS case_configurations_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_users DROP CONSTRAINT IF EXISTS admin_users_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_users DROP CONSTRAINT IF EXISTS admin_users_email_key;
DROP TABLE IF EXISTS public.partner_cases;
DROP TABLE IF EXISTS public.news_articles;
DROP TABLE IF EXISTS public.form_submissions;
DROP TABLE IF EXISTS public.featured_cases;
DROP TABLE IF EXISTS public.customer_cases;
DROP TABLE IF EXISTS public.case_configurations;
DROP TABLE IF EXISTS public.admin_users;
DROP FUNCTION IF EXISTS public.update_updated_at_column();
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'admin'::text,
    is_active boolean DEFAULT true,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: case_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_configurations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    subtitle text,
    description text,
    company_name text NOT NULL,
    company_logo text NOT NULL,
    stock_code text,
    image_url text,
    link_url text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: customer_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name text NOT NULL,
    company_logo text DEFAULT 'C'::text NOT NULL,
    industry text NOT NULL,
    description text NOT NULL,
    results text NOT NULL,
    metrics jsonb DEFAULT '{}'::jsonb,
    is_featured boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT customer_cases_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text])))
);


--
-- Name: featured_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.featured_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    company_name text NOT NULL,
    industry text NOT NULL,
    description text NOT NULL,
    image_url text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: form_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name text NOT NULL,
    user_name text NOT NULL,
    phone text NOT NULL,
    company_types text[] DEFAULT '{}'::text[] NOT NULL,
    source_url text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    submitted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT form_submissions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'invalid'::text])))
);


--
-- Name: news_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_articles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    category text DEFAULT '公司新闻'::text NOT NULL,
    publish_time timestamp with time zone DEFAULT now(),
    image_url text,
    summary text,
    content text,
    views integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: partner_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partner_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name text NOT NULL,
    logo_url text,
    industry text NOT NULL,
    description text NOT NULL,
    results text NOT NULL,
    image_url text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: case_configurations case_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_configurations
    ADD CONSTRAINT case_configurations_pkey PRIMARY KEY (id);


--
-- Name: customer_cases customer_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_cases
    ADD CONSTRAINT customer_cases_pkey PRIMARY KEY (id);


--
-- Name: featured_cases featured_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_cases
    ADD CONSTRAINT featured_cases_pkey PRIMARY KEY (id);


--
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- Name: news_articles news_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_pkey PRIMARY KEY (id);


--
-- Name: partner_cases partner_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_cases
    ADD CONSTRAINT partner_cases_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_email ON public.admin_users USING btree (email);


--
-- Name: idx_admin_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_is_active ON public.admin_users USING btree (is_active);


--
-- Name: idx_case_configurations_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_case_configurations_is_active ON public.case_configurations USING btree (is_active);


--
-- Name: idx_case_configurations_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_case_configurations_sort_order ON public.case_configurations USING btree (sort_order);


--
-- Name: idx_customer_cases_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_industry ON public.customer_cases USING btree (industry);


--
-- Name: idx_customer_cases_is_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_is_featured ON public.customer_cases USING btree (is_featured);


--
-- Name: idx_customer_cases_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_sort_order ON public.customer_cases USING btree (sort_order);


--
-- Name: idx_customer_cases_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_status ON public.customer_cases USING btree (status);


--
-- Name: idx_featured_cases_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_cases_is_active ON public.featured_cases USING btree (is_active);


--
-- Name: idx_featured_cases_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_cases_sort_order ON public.featured_cases USING btree (sort_order);


--
-- Name: idx_form_submissions_company_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_company_name ON public.form_submissions USING btree (company_name);


--
-- Name: idx_form_submissions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_created_at ON public.form_submissions USING btree (created_at DESC);


--
-- Name: idx_form_submissions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_status ON public.form_submissions USING btree (status);


--
-- Name: idx_news_articles_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_category ON public.news_articles USING btree (category);


--
-- Name: idx_news_articles_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_created_at ON public.news_articles USING btree (created_at DESC);


--
-- Name: idx_news_articles_is_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_is_featured ON public.news_articles USING btree (is_featured);


--
-- Name: idx_news_articles_publish_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_publish_time ON public.news_articles USING btree (publish_time DESC);


--
-- Name: idx_partner_cases_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partner_cases_industry ON public.partner_cases USING btree (industry);


--
-- Name: idx_partner_cases_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partner_cases_is_active ON public.partner_cases USING btree (is_active);


--
-- Name: idx_partner_cases_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partner_cases_sort_order ON public.partner_cases USING btree (sort_order);


--
-- Name: admin_users update_admin_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: case_configurations update_case_configurations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_case_configurations_updated_at BEFORE UPDATE ON public.case_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: customer_cases update_customer_cases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_customer_cases_updated_at BEFORE UPDATE ON public.customer_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: featured_cases update_featured_cases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_featured_cases_updated_at BEFORE UPDATE ON public.featured_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: form_submissions update_form_submissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON public.form_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: news_articles update_news_articles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: partner_cases update_partner_cases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_partner_cases_updated_at BEFORE UPDATE ON public.partner_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- PostgreSQL database dump complete
--

