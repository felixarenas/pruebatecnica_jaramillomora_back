--
-- PostgreSQL database dump
--

\restrict MsLjEatg5kcHbJ66N3wilMKAqc5UiHyniaMTiabYEHtnPdPvDASmfRb7rlczMo5

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: jaramillomora
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    id_tipo_identificacion integer NOT NULL,
    identificacion integer NOT NULL,
    nombres character varying(80) NOT NULL,
    apellidos character varying(80) NOT NULL,
    fecha_nacimiento date NOT NULL,
    numero_celular character varying(20) NOT NULL,
    email character varying(1000) NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.clientes OWNER TO jaramillomora;

--
-- Name: COLUMN clientes.identificacion; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.clientes.identificacion IS 'identificacion del cliente (Numero de Cedula)';


--
-- Name: COLUMN clientes.nombres; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.clientes.nombres IS 'Nombres del cliente';


--
-- Name: COLUMN clientes.apellidos; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.clientes.apellidos IS 'Apellidos del cliente';


--
-- Name: COLUMN clientes.fecha_nacimiento; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.clientes.fecha_nacimiento IS 'fecha de nacimiento del cliente';


--
-- Name: COLUMN clientes.numero_celular; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.clientes.numero_celular IS 'Numero de celular del cliente';


--
-- Name: COLUMN clientes.email; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.clientes.email IS 'Correo electronico del cliente';


--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: jaramillomora
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO jaramillomora;

--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jaramillomora
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: identity_type; Type: TABLE; Schema: public; Owner: jaramillomora
--

CREATE TABLE public.identity_type (
    id integer NOT NULL,
    abr character varying(5) NOT NULL,
    name character varying(200) NOT NULL,
    dian_code character varying(500),
    description character varying(1000)
);


ALTER TABLE public.identity_type OWNER TO jaramillomora;

--
-- Name: servicios; Type: TABLE; Schema: public; Owner: jaramillomora
--

CREATE TABLE public.servicios (
    id integer NOT NULL,
    id_cliente integer NOT NULL,
    id_tipo_servicio integer NOT NULL,
    fecha_inicio date NOT NULL,
    ultima_facturacion date NOT NULL,
    ultimo_pago integer DEFAULT 0 NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.servicios OWNER TO jaramillomora;

--
-- Name: TABLE servicios; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON TABLE public.servicios IS 'Tabla donde se almacena el contrado o la parametrizacion de la vigencia de un servicio por cliente';


--
-- Name: COLUMN servicios.id_cliente; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.servicios.id_cliente IS 'llave primaria de la tabla clientes';


--
-- Name: COLUMN servicios.id_tipo_servicio; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.servicios.id_tipo_servicio IS 'Id del tipo de servicio';


--
-- Name: COLUMN servicios.fecha_inicio; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.servicios.fecha_inicio IS 'fecha de inicio del servicio';


--
-- Name: COLUMN servicios.ultima_facturacion; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.servicios.ultima_facturacion IS 'fecha de la ultima facturacion';


--
-- Name: COLUMN servicios.ultimo_pago; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.servicios.ultimo_pago IS 'Valor del ultimo pago';


--
-- Name: COLUMN servicios.estado; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.servicios.estado IS 'estado del servicio relacionado con el cliente';


--
-- Name: servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: jaramillomora
--

CREATE SEQUENCE public.servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicios_id_seq OWNER TO jaramillomora;

--
-- Name: servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jaramillomora
--

ALTER SEQUENCE public.servicios_id_seq OWNED BY public.servicios.id;


--
-- Name: tipo_servicios; Type: TABLE; Schema: public; Owner: jaramillomora
--

CREATE TABLE public.tipo_servicios (
    id integer NOT NULL,
    nombre character varying NOT NULL
);


ALTER TABLE public.tipo_servicios OWNER TO jaramillomora;

--
-- Name: TABLE tipo_servicios; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON TABLE public.tipo_servicios IS 'Almacena los tipos de servicio segun configuracion de contrado con el cliente';


--
-- Name: COLUMN tipo_servicios.nombre; Type: COMMENT; Schema: public; Owner: jaramillomora
--

COMMENT ON COLUMN public.tipo_servicios.nombre IS 'Nombre del tipo de servicio';


--
-- Name: tipo_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: jaramillomora
--

CREATE SEQUENCE public.tipo_servicios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_servicios_id_seq OWNER TO jaramillomora;

--
-- Name: tipo_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jaramillomora
--

ALTER SEQUENCE public.tipo_servicios_id_seq OWNED BY public.tipo_servicios.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: jaramillomora
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    username character varying(500) NOT NULL,
    passwd character varying(2000) NOT NULL,
    id_identity_type integer NOT NULL,
    identity_number character varying(50) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    firts_names character varying(100) NOT NULL,
    last_names character varying(100) NOT NULL,
    phone_number character varying(30),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO jaramillomora;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: jaramillomora
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO jaramillomora;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jaramillomora
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: servicios id; Type: DEFAULT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.servicios ALTER COLUMN id SET DEFAULT nextval('public.servicios_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: jaramillomora
--

COPY public.clientes (id, id_tipo_identificacion, identificacion, nombres, apellidos, fecha_nacimiento, numero_celular, email, estado) FROM stdin;
3	4	4587996	Pablo Camilo	Merlano Marin	1985-01-01	3002546325	camiloantoniomarin@correo.com.co	t
4	4	4545	asdfasdf	asdfasdf	2026-06-19	5878999458	asdfasdf@correo.com.co	t
1	4	4587222	Jhoni Camilo	Prez Prado	2026-06-26	3122222225	jhonnyperezprado@correo.com.co	t
2	4	458799	Pablo Antonio	Marin Marin	1985-01-01	3002546325	pabloantoniomarin@correo.com.co	f
\.


--
-- Data for Name: identity_type; Type: TABLE DATA; Schema: public; Owner: jaramillomora
--

COPY public.identity_type (id, abr, name, dian_code, description) FROM stdin;
1	CN	Certificado de Nacido Vivo	\N	Documento diligenciado por personal de salud, requisito para el registro civil
7	CD	Carné Diplomático	\N	Identifica a funcionarios de misiones diplomáticas
8	MS	Menor sin Identificación	\N	Caso especial para menores no identificados por la RNEC en sistemas de salud
9	AS	Adulto sin Identificación	\N	Caso especial para adultos no identificados por la RNEC en sistemas de salud
10	SC	Salvoconducto de Permanencia	\N	Documento temporal para extranjeros
11	PE	Permiso Especial de Permanencia	\N	Documento otorgado a nacionales venezolanos bajo normativas específicas
12	PT	Permiso de Protección Temporal	\N	Estatus migratorio temporal
13	DE	Documento Extranjero	\N	Identificación expedida por el país de origen para extranjeros que no posean CE, PA, etc
14	OTROS	Otro tipo de documento	\N	Tipo de documento no registrado en nuestro sistema de informacion
2	RC	Registro Civil de Nacimiento	11	Identifica a menores de 7 años. Expedido por la RNEC
3	TI	Tarjeta de Identidad	12	Identifica a menores de 7 a 17 años. Expedido por la RNEC
4	CC	Cédula de Ciudadanía	13	Identifica a colombianos mayores de 18 años. Expedido por la RNEC
5	CE	Cédula de Extranjería	22	Documento para extranjeros mayores de 7 años residentes en Colombia
6	PA	Pasaporte	41	Documento de viaje. En salud, se usa para extranjeros
15	TE	Tarjeta de Extranjería	21	(Similar a CE) Para extranjeros residentes.
\.


--
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: jaramillomora
--

COPY public.servicios (id, id_cliente, id_tipo_servicio, fecha_inicio, ultima_facturacion, ultimo_pago, estado) FROM stdin;
1	1	2	2026-06-20	2026-05-22	0	t
3	2	4	2026-06-26	2026-06-18	35000	t
2	1	1	2026-06-26	2026-06-25	20000	f
\.


--
-- Data for Name: tipo_servicios; Type: TABLE DATA; Schema: public; Owner: jaramillomora
--

COPY public.tipo_servicios (id, nombre) FROM stdin;
1	Internet 200 MB
2	Internet 400 MB
3	Internet 600 MB
4	Directv Go
5	Paramount+
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jaramillomora
--

COPY public.users (id, email, username, passwd, id_identity_type, identity_number, active, firts_names, last_names, phone_number, created_at) FROM stdin;
1	perezp@delenaionales.com	perezp	$2b$10$k81KLSpqhhAezPzPA2RYlOKd4yfez.c3LyDRnHBu2dut9tYkFiiaC	1	123456	t	perez	agudelo	325458588	2026-06-26 00:50:09.54179-05
\.


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaramillomora
--

SELECT pg_catalog.setval('public.clientes_id_seq', 4, true);


--
-- Name: servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaramillomora
--

SELECT pg_catalog.setval('public.servicios_id_seq', 3, true);


--
-- Name: tipo_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaramillomora
--

SELECT pg_catalog.setval('public.tipo_servicios_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jaramillomora
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: clientes clientes_pk; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pk PRIMARY KEY (id);


--
-- Name: clientes clientes_unique; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_unique UNIQUE (identificacion);


--
-- Name: clientes clientes_unique_1; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_unique_1 UNIQUE (email);


--
-- Name: identity_type identity_type_pk; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.identity_type
    ADD CONSTRAINT identity_type_pk PRIMARY KEY (id);


--
-- Name: tipo_servicios servicios_pk; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.tipo_servicios
    ADD CONSTRAINT servicios_pk PRIMARY KEY (id);


--
-- Name: servicios servicios_pk2; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pk2 PRIMARY KEY (id);


--
-- Name: servicios servicios_unique; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_unique UNIQUE (id_cliente, id_tipo_servicio, estado);


--
-- Name: tipo_servicios tipo_servicios_unique; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.tipo_servicios
    ADD CONSTRAINT tipo_servicios_unique UNIQUE (nombre);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_identity_number_type_unique; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_identity_number_type_unique UNIQUE (id_identity_type, identity_number);


--
-- Name: users users_name_unq; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_unq UNIQUE (username);


--
-- Name: users users_passwd_key; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_passwd_key UNIQUE (passwd);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_identity_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_identity_type_fk FOREIGN KEY (id_tipo_identificacion) REFERENCES public.identity_type(id);


--
-- Name: servicios servicios_clientes_fk; Type: FK CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_clientes_fk FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- Name: servicios servicios_tipo_servicios_fk; Type: FK CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_tipo_servicios_fk FOREIGN KEY (id_tipo_servicio) REFERENCES public.tipo_servicios(id);


--
-- Name: users users_identity_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: jaramillomora
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_identity_type_fk FOREIGN KEY (id_identity_type) REFERENCES public.identity_type(id);


--
-- PostgreSQL database dump complete
--

\unrestrict MsLjEatg5kcHbJ66N3wilMKAqc5UiHyniaMTiabYEHtnPdPvDASmfRb7rlczMo5

