--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 15.13 (Homebrew)

-- Started on 2025-07-17 16:56:59 CST

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 216 (class 1255 OID 25417)
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
-- TOC entry 215 (class 1259 OID 25401)
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
-- TOC entry 214 (class 1259 OID 25387)
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
-- TOC entry 211 (class 1259 OID 25338)
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
-- TOC entry 212 (class 1259 OID 25358)
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
-- TOC entry 209 (class 1259 OID 25303)
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
-- TOC entry 210 (class 1259 OID 25320)
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
-- TOC entry 213 (class 1259 OID 25372)
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
-- TOC entry 3783 (class 0 OID 25401)
-- Dependencies: 215
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_users (id, email, password_hash, role, is_active, last_login, created_at, updated_at) FROM stdin;
e5516326-d91c-4fea-8afa-a560b7591806	admin@example.com	$2b$10$rOKjTKUAEBRTBLF/mJPZ5.RU6VWfRDYzb4G8hFiVGmHw6H.E3pJ.S	admin	t	\N	2025-07-17 16:16:38.960552+08	2025-07-17 16:16:38.960552+08
\.


--
-- TOC entry 3782 (class 0 OID 25387)
-- Dependencies: 214
-- Data for Name: case_configurations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.case_configurations (id, title, subtitle, description, company_name, company_logo, stock_code, image_url, link_url, is_active, sort_order, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3779 (class 0 OID 25338)
-- Dependencies: 211
-- Data for Name: customer_cases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_cases (id, company_name, company_logo, industry, description, results, metrics, is_featured, sort_order, status, created_at, updated_at) FROM stdin;
795493b1-68fb-42c1-8001-327527b9727e	华为技术有限公司	H	通信设备	华为作为全球领先的通信设备制造商，通过久火ERP系统实现了全球供应链的数字化管理。	订单处理效率提升60%，库存周转率提高40%	{"cost_reduction": "25%", "inventory_turnover": "40%", "efficiency_improvement": "60%"}	t	1	active	2025-07-17 16:16:38.960014+08	2025-07-17 16:16:38.960014+08
77b69d2f-b3de-42c6-8392-939ae1115345	比亚迪股份有限公司	B	新能源汽车	比亚迪通过久火ERP系统优化了新能源汽车的生产和供应链管理流程。	供应链协同效率提升50%，成本降低25%	{"delivery_time": "30%", "cost_reduction": "25%", "supply_chain_efficiency": "50%"}	t	2	active	2025-07-17 16:16:38.960014+08	2025-07-17 16:16:38.960014+08
\.


--
-- TOC entry 3780 (class 0 OID 25358)
-- Dependencies: 212
-- Data for Name: featured_cases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.featured_cases (id, title, company_name, industry, description, image_url, is_active, sort_order, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3777 (class 0 OID 25303)
-- Dependencies: 209
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.form_submissions (id, company_name, user_name, phone, company_types, source_url, status, notes, submitted_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3778 (class 0 OID 25320)
-- Dependencies: 210
-- Data for Name: news_articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_articles (id, title, category, publish_time, image_url, summary, content, views, is_featured, created_at, updated_at) FROM stdin;
5b422780-c1ea-4141-9db7-dcd33b82a748	久火ERP助力外贸企业数字化转型，订单处理效率提升60%	公司新闻	2024-12-20 10:30:00+08	https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800	久火ERP通过智能化管理系统，帮助众多外贸企业实现数字化转型，显著提升运营效率。	\N	1250	t	2025-07-17 16:16:38.958018+08	2025-07-17 16:16:38.958018+08
cd49f428-e116-45ac-9283-c4310b93864c	2024年外贸行业发展趋势分析：数字化成为核心竞争力	行业动态	2024-12-19 14:20:00+08	https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800	深度解析2024年外贸行业发展趋势，数字化转型已成为企业提升竞争力的关键因素。	\N	980	f	2025-07-17 16:16:38.958018+08	2025-07-17 16:16:38.958018+08
195e80ce-a97b-49e1-a14b-45047d4c5b39	新版外贸政策解读：跨境电商迎来新机遇	政策解读	2024-12-18 09:15:00+08	https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800	详细解读最新外贸政策变化，为跨境电商企业带来的新机遇和挑战。	\N	756	t	2025-07-17 16:16:38.958018+08	2025-07-17 16:16:38.958018+08
\.


--
-- TOC entry 3781 (class 0 OID 25372)
-- Dependencies: 213
-- Data for Name: partner_cases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partner_cases (id, company_name, logo_url, industry, description, results, image_url, is_active, sort_order, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3626 (class 2606 OID 25414)
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- TOC entry 3628 (class 2606 OID 25412)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3622 (class 2606 OID 25398)
-- Name: case_configurations case_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_configurations
    ADD CONSTRAINT case_configurations_pkey PRIMARY KEY (id);


--
-- TOC entry 3607 (class 2606 OID 25353)
-- Name: customer_cases customer_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_cases
    ADD CONSTRAINT customer_cases_pkey PRIMARY KEY (id);


--
-- TOC entry 3613 (class 2606 OID 25369)
-- Name: featured_cases featured_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_cases
    ADD CONSTRAINT featured_cases_pkey PRIMARY KEY (id);


--
-- TOC entry 3596 (class 2606 OID 25316)
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3605 (class 2606 OID 25333)
-- Name: news_articles news_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_pkey PRIMARY KEY (id);


--
-- TOC entry 3620 (class 2606 OID 25383)
-- Name: partner_cases partner_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_cases
    ADD CONSTRAINT partner_cases_pkey PRIMARY KEY (id);


--
-- TOC entry 3629 (class 1259 OID 25415)
-- Name: idx_admin_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_email ON public.admin_users USING btree (email);


--
-- TOC entry 3630 (class 1259 OID 25416)
-- Name: idx_admin_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_users_is_active ON public.admin_users USING btree (is_active);


--
-- TOC entry 3623 (class 1259 OID 25399)
-- Name: idx_case_configurations_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_case_configurations_is_active ON public.case_configurations USING btree (is_active);


--
-- TOC entry 3624 (class 1259 OID 25400)
-- Name: idx_case_configurations_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_case_configurations_sort_order ON public.case_configurations USING btree (sort_order);


--
-- TOC entry 3608 (class 1259 OID 25357)
-- Name: idx_customer_cases_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_industry ON public.customer_cases USING btree (industry);


--
-- TOC entry 3609 (class 1259 OID 25355)
-- Name: idx_customer_cases_is_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_is_featured ON public.customer_cases USING btree (is_featured);


--
-- TOC entry 3610 (class 1259 OID 25356)
-- Name: idx_customer_cases_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_sort_order ON public.customer_cases USING btree (sort_order);


--
-- TOC entry 3611 (class 1259 OID 25354)
-- Name: idx_customer_cases_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_cases_status ON public.customer_cases USING btree (status);


--
-- TOC entry 3614 (class 1259 OID 25370)
-- Name: idx_featured_cases_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_cases_is_active ON public.featured_cases USING btree (is_active);


--
-- TOC entry 3615 (class 1259 OID 25371)
-- Name: idx_featured_cases_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_cases_sort_order ON public.featured_cases USING btree (sort_order);


--
-- TOC entry 3597 (class 1259 OID 25319)
-- Name: idx_form_submissions_company_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_company_name ON public.form_submissions USING btree (company_name);


--
-- TOC entry 3598 (class 1259 OID 25318)
-- Name: idx_form_submissions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_created_at ON public.form_submissions USING btree (created_at DESC);


--
-- TOC entry 3599 (class 1259 OID 25317)
-- Name: idx_form_submissions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_form_submissions_status ON public.form_submissions USING btree (status);


--
-- TOC entry 3600 (class 1259 OID 25334)
-- Name: idx_news_articles_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_category ON public.news_articles USING btree (category);


--
-- TOC entry 3601 (class 1259 OID 25337)
-- Name: idx_news_articles_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_created_at ON public.news_articles USING btree (created_at DESC);


--
-- TOC entry 3602 (class 1259 OID 25336)
-- Name: idx_news_articles_is_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_is_featured ON public.news_articles USING btree (is_featured);


--
-- TOC entry 3603 (class 1259 OID 25335)
-- Name: idx_news_articles_publish_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_articles_publish_time ON public.news_articles USING btree (publish_time DESC);


--
-- TOC entry 3616 (class 1259 OID 25386)
-- Name: idx_partner_cases_industry; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partner_cases_industry ON public.partner_cases USING btree (industry);


--
-- TOC entry 3617 (class 1259 OID 25384)
-- Name: idx_partner_cases_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partner_cases_is_active ON public.partner_cases USING btree (is_active);


--
-- TOC entry 3618 (class 1259 OID 25385)
-- Name: idx_partner_cases_sort_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_partner_cases_sort_order ON public.partner_cases USING btree (sort_order);


--
-- TOC entry 3637 (class 2620 OID 25424)
-- Name: admin_users update_admin_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3636 (class 2620 OID 25423)
-- Name: case_configurations update_case_configurations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_case_configurations_updated_at BEFORE UPDATE ON public.case_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3633 (class 2620 OID 25420)
-- Name: customer_cases update_customer_cases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_customer_cases_updated_at BEFORE UPDATE ON public.customer_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3634 (class 2620 OID 25421)
-- Name: featured_cases update_featured_cases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_featured_cases_updated_at BEFORE UPDATE ON public.featured_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3631 (class 2620 OID 25418)
-- Name: form_submissions update_form_submissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON public.form_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3632 (class 2620 OID 25419)
-- Name: news_articles update_news_articles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3635 (class 2620 OID 25422)
-- Name: partner_cases update_partner_cases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_partner_cases_updated_at BEFORE UPDATE ON public.partner_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Completed on 2025-07-17 16:56:59 CST

--
-- PostgreSQL database dump complete
--

