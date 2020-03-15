--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: brangi
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    comment text,
    commenter integer,
    image_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO brangi;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: brangi
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO brangi;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brangi
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: brangi
--

CREATE TABLE public.images (
    image_id integer NOT NULL,
    image_name text,
    image_url character varying,
    image_data jsonb,
    poster integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.images OWNER TO brangi;

--
-- Name: images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: brangi
--

CREATE SEQUENCE public.images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_image_id_seq OWNER TO brangi;

--
-- Name: images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brangi
--

ALTER SEQUENCE public.images_image_id_seq OWNED BY public.images.image_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: brangi
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(355)
);


ALTER TABLE public.users OWNER TO brangi;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: brangi
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO brangi;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brangi
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: images image_id; Type: DEFAULT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.images ALTER COLUMN image_id SET DEFAULT nextval('public.images_image_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: images unique_image; Type: CONSTRAINT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT unique_image PRIMARY KEY (image_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: comments comments_commenter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_commenter_fkey FOREIGN KEY (commenter) REFERENCES public.users(user_id);


--
-- Name: comments comments_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(image_id);


--
-- Name: images images_poster_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brangi
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_poster_fkey FOREIGN KEY (poster) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

