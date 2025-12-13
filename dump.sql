--
-- PostgreSQL database dump
--

\restrict WNCp0WZuFUWveKUblI2QI8cvRTwPsGjhM0dMFM575fOhZS4HDrcrRL41hbgEHns

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    host text NOT NULL,
    source text NOT NULL,
    event_type text NOT NULL,
    severity text NOT NULL,
    message text NOT NULL
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_seq OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs (id, "timestamp", host, source, event_type, severity, message) FROM stdin;
1	2025-01-12 15:15:23+05	srv-1	auth-service	auth	info	User login success
2	2025-01-12 15:15:25+05	srv-1	auth-service	auth	warn	Slow authentication response
3	2025-01-12 15:16:10+05	srv-2	api-gateway	request	info	GET /api/products 200
4	2025-01-12 15:16:11+05	srv-2	api-gateway	request	error	Timeout communicating with inventory-service
5	2025-01-12 15:16:12+05	srv-3	inventory-service	db	info	DB query executed successfully
6	2025-01-12 15:16:20+05	srv-3	inventory-service	db	error	Failed to fetch product stock
7	2025-01-12 15:17:05+05	srv-4	scheduler	system	info	Scheduled job executed
8	2025-01-12 15:17:10+05	srv-4	scheduler	system	warn	Job execution took too long
9	2025-01-12 15:17:15+05	srv-2	api-gateway	request	info	POST /api/login 201
10	2025-01-12 15:17:17+05	srv-1	auth-service	auth	error	Invalid credentials provided
11	2025-01-12 15:18:00+05	srv-5	payment-service	payment	info	Payment processed
12	2025-01-12 15:18:02+05	srv-5	payment-service	payment	error	Payment gateway unreachable
13	2025-01-12 15:18:10+05	srv-5	payment-service	payment	warn	High latency during payment operation
14	2025-01-12 15:18:30+05	srv-3	inventory-service	db	info	Stock update completed
15	2025-01-12 15:19:00+05	srv-2	api-gateway	request	info	GET /api/orders 200
16	2025-01-12 15:19:05+05	srv-2	api-gateway	request	warn	Client aborted the connection
17	2025-01-12 15:19:20+05	srv-6	log-service	system	info	Log rotation triggered
18	2025-01-12 15:19:25+05	srv-6	log-service	system	error	Failed to rotate log file
19	2025-01-12 15:19:40+05	srv-1	auth-service	auth	info	Token refreshed
20	2025-01-12 15:20:00+05	srv-1	auth-service	auth	critical	Multiple failed login attempts detected
21	2025-01-12 15:20:10+05	srv-7	analytics-service	analytics	info	Daily metrics processed
22	2025-01-12 15:20:15+05	srv-7	analytics-service	analytics	warn	Metric data source delayed
23	2025-01-12 15:20:20+05	srv-7	analytics-service	analytics	error	Aggregation failed due to missing field
24	2025-01-12 15:20:30+05	srv-3	inventory-service	db	warn	Slow DB query detected
25	2025-01-12 15:20:35+05	srv-2	api-gateway	request	critical	DDOS-like traffic spike detected
26	2025-11-28 23:43:15.791574+05	host2	api	test_event	ERROR	Database connection failed
27	2025-11-27 13:44:50.340057+05	host3	worker	test_event	WARN	Database connection failed
28	2025-11-28 15:38:21.847298+05	host2	app2	test_event	INFO	Cache cleared
29	2025-11-27 12:27:37.40679+05	host2	app2	test_event	ERROR	Database connection failed
30	2025-11-28 01:21:19.169943+05	host4	app1	test_event	ERROR	User login successful
31	2025-11-28 23:51:25.578445+05	host3	api	test_event	ERROR	Timeout on API request
32	2025-11-28 12:22:44.525994+05	host4	api	test_event	WARN	Error parsing JSON
33	2025-11-28 15:56:18.080534+05	host4	app2	test_event	WARN	Payment processed
34	2025-11-27 04:58:06.560087+05	host1	db	test_event	ERROR	Database connection failed
35	2025-11-27 06:24:39.526527+05	host3	worker	test_event	CRITICAL	Payment processed
36	2025-11-28 12:41:09.656914+05	host4	app1	test_event	ERROR	Service restarted
37	2025-11-27 13:20:39.061554+05	host4	app1	test_event	WARN	Error parsing JSON
38	2025-11-28 02:26:05.68181+05	host4	worker	test_event	CRITICAL	Payment processed
39	2025-11-27 19:28:28.45491+05	host1	worker	test_event	INFO	Service restarted
40	2025-11-27 06:48:29.694163+05	host4	app1	test_event	CRITICAL	Payment processed
41	2025-11-28 23:54:52.371917+05	host4	db	test_event	WARN	Error parsing JSON
42	2025-11-28 05:38:01.499088+05	host2	api	test_event	ERROR	Service restarted
43	2025-11-28 11:03:26.044349+05	host3	worker	test_event	ERROR	Payment processed
44	2025-11-28 01:53:09.438912+05	host4	app1	test_event	CRITICAL	Database connection failed
45	2025-11-27 18:29:47.771299+05	host4	api	test_event	ERROR	Error parsing JSON
46	2025-11-27 06:05:35.143162+05	host1	api	test_event	ERROR	User login successful
47	2025-11-28 09:48:49.720183+05	host1	app2	test_event	CRITICAL	Timeout on API request
48	2025-11-28 14:09:58.660189+05	host4	db	test_event	CRITICAL	Error parsing JSON
49	2025-11-28 14:50:30.349897+05	host2	api	test_event	INFO	Database connection failed
50	2025-11-27 04:07:47.729825+05	host4	app2	test_event	ERROR	Disk space low
51	2025-11-27 11:00:42.519143+05	host2	app2	test_event	WARN	Payment processed
52	2025-11-27 23:25:51.836674+05	host4	app1	test_event	ERROR	Disk space low
53	2025-11-27 20:37:11.258254+05	host4	db	test_event	INFO	Database connection failed
54	2025-11-27 04:55:40.851394+05	host1	app1	test_event	INFO	Disk space low
55	2025-11-27 01:33:05.122502+05	host3	db	test_event	ERROR	Service restarted
56	2025-11-27 06:27:39.475763+05	host3	app1	test_event	ERROR	Disk space low
57	2025-11-27 09:53:57.686189+05	host2	db	test_event	WARN	Disk space low
58	2025-11-28 10:59:49.679375+05	host3	worker	test_event	CRITICAL	Payment processed
59	2025-11-28 14:51:17.032367+05	host3	app2	test_event	CRITICAL	User login successful
60	2025-11-28 10:20:19.348601+05	host2	api	test_event	CRITICAL	Database connection failed
61	2025-11-27 20:55:30.864136+05	host2	api	test_event	INFO	Database connection failed
62	2025-11-27 01:12:27.731584+05	host3	api	test_event	ERROR	Database connection failed
63	2025-11-28 12:10:10.369617+05	host4	api	test_event	INFO	User login successful
64	2025-11-28 22:38:10.627788+05	host1	worker	test_event	CRITICAL	Timeout on API request
65	2025-11-28 19:28:47.39947+05	host3	api	test_event	WARN	Payment processed
66	2025-11-28 17:41:01.44164+05	host3	api	test_event	WARN	Error parsing JSON
67	2025-11-27 18:23:40.006998+05	host2	api	test_event	CRITICAL	Database connection failed
68	2025-11-27 20:27:46.045471+05	host4	db	test_event	WARN	Disk space low
69	2025-11-28 13:43:22.754159+05	host3	worker	test_event	CRITICAL	Timeout on API request
70	2025-11-28 16:01:41.127688+05	host4	api	test_event	CRITICAL	Error parsing JSON
71	2025-11-28 21:02:22.436716+05	host4	app1	test_event	INFO	User login successful
72	2025-11-28 22:42:26.37338+05	host3	app2	test_event	WARN	Database connection failed
73	2025-11-28 20:41:43.249109+05	host4	app2	test_event	WARN	Timeout on API request
74	2025-11-27 09:23:06.716905+05	host3	worker	test_event	CRITICAL	Cache cleared
75	2025-11-28 18:09:18.56574+05	host2	api	test_event	ERROR	Disk space low
76	2025-11-28 19:16:20.638116+05	host1	worker	test_event	INFO	User login successful
77	2025-11-27 04:49:46.693556+05	host3	app2	test_event	INFO	User login successful
78	2025-11-27 13:14:58.31965+05	host3	api	test_event	INFO	Timeout on API request
79	2025-11-27 22:18:14.583757+05	host4	app1	test_event	ERROR	User login successful
80	2025-11-27 19:52:15.445206+05	host2	app1	test_event	WARN	Timeout on API request
81	2025-11-28 03:18:10.111688+05	host1	api	test_event	INFO	Error parsing JSON
82	2025-11-28 23:35:26.153252+05	host2	app1	test_event	ERROR	User login successful
83	2025-11-27 13:02:02.802879+05	host4	worker	test_event	WARN	Payment processed
84	2025-11-28 09:45:35.914359+05	host4	app2	test_event	WARN	Error parsing JSON
85	2025-11-27 07:17:01.850506+05	host3	app2	test_event	CRITICAL	Timeout on API request
86	2025-11-28 20:51:16.466217+05	host2	worker	test_event	ERROR	Error parsing JSON
87	2025-11-27 09:25:02.118634+05	host1	worker	test_event	WARN	Timeout on API request
88	2025-11-27 08:06:12.642855+05	host4	app2	test_event	WARN	Disk space low
89	2025-11-28 06:57:23.466561+05	host3	app2	test_event	ERROR	Payment processed
90	2025-11-28 07:04:43.936649+05	host3	worker	test_event	INFO	Cache cleared
91	2025-11-28 01:42:40.791902+05	host4	db	test_event	ERROR	Database connection failed
92	2025-11-27 15:08:14.605292+05	host1	app1	test_event	ERROR	Disk space low
93	2025-11-28 16:06:34.37995+05	host1	app2	test_event	CRITICAL	Payment processed
94	2025-11-27 02:40:20.433527+05	host2	db	test_event	CRITICAL	User login successful
95	2025-11-27 06:55:48.669687+05	host1	app2	test_event	CRITICAL	Error parsing JSON
96	2025-11-27 15:42:16.725231+05	host4	worker	test_event	WARN	User login successful
97	2025-11-28 11:04:02.251274+05	host2	app2	test_event	WARN	User login successful
98	2025-11-28 17:19:12.712497+05	host2	worker	test_event	INFO	Error parsing JSON
99	2025-11-28 18:45:12.161078+05	host2	worker	test_event	ERROR	Disk space low
100	2025-11-27 09:03:48.519667+05	host4	api	test_event	WARN	Disk space low
101	2025-11-28 19:00:11.734498+05	host3	app2	test_event	WARN	Timeout on API request
102	2025-11-27 16:10:59.245414+05	host2	db	test_event	INFO	Database connection failed
103	2025-11-29 00:08:31.854093+05	host1	db	test_event	WARN	User login successful
104	2025-11-28 23:44:21.17722+05	host3	app2	test_event	CRITICAL	Service restarted
105	2025-11-28 17:48:04.215026+05	host3	api	test_event	INFO	Payment processed
106	2025-11-27 23:05:28.634197+05	host1	app2	test_event	CRITICAL	Database connection failed
107	2025-11-28 02:12:13.479116+05	host2	api	test_event	ERROR	Database connection failed
108	2025-11-27 15:29:13.225003+05	host1	worker	test_event	WARN	Error parsing JSON
109	2025-11-27 22:34:09.223261+05	host1	worker	test_event	WARN	Disk space low
110	2025-11-28 04:16:15.112212+05	host3	worker	test_event	INFO	Payment processed
111	2025-11-27 08:52:50.675322+05	host2	app1	test_event	CRITICAL	Database connection failed
112	2025-11-28 07:15:38.787879+05	host1	worker	test_event	INFO	Service restarted
113	2025-11-28 16:58:40.838748+05	host3	worker	test_event	ERROR	Timeout on API request
114	2025-11-28 19:06:52.576006+05	host1	app2	test_event	CRITICAL	Disk space low
115	2025-11-28 01:25:31.345805+05	host2	worker	test_event	CRITICAL	Error parsing JSON
116	2025-11-27 17:47:13.903361+05	host4	app1	test_event	ERROR	Cache cleared
117	2025-11-28 04:06:12.968147+05	host4	app2	test_event	ERROR	Database connection failed
118	2025-11-27 08:31:20.296153+05	host4	worker	test_event	WARN	Error parsing JSON
119	2025-11-27 21:13:30.493363+05	host2	app2	test_event	CRITICAL	Error parsing JSON
120	2025-11-28 20:57:38.002026+05	host1	db	test_event	WARN	Timeout on API request
121	2025-11-27 21:34:17.76265+05	host4	app2	test_event	CRITICAL	Service restarted
122	2025-11-27 06:01:42.24244+05	host4	app2	test_event	WARN	Timeout on API request
123	2025-11-28 17:38:55.721338+05	host2	api	test_event	CRITICAL	Payment processed
124	2025-11-27 12:48:21.86516+05	host1	db	test_event	INFO	Disk space low
125	2025-11-28 03:25:28.301233+05	host3	worker	test_event	WARN	Disk space low
126	2025-11-27 22:35:30.489318+05	host3	api	test_event	INFO	Database connection failed
127	2025-11-27 13:41:47.079667+05	host4	app2	test_event	ERROR	Payment processed
128	2025-11-28 21:56:07.953575+05	host4	db	test_event	WARN	Disk space low
129	2025-11-27 18:37:16.675341+05	host3	api	test_event	CRITICAL	Disk space low
130	2025-11-28 07:17:25.680834+05	host4	app1	test_event	ERROR	User login successful
131	2025-11-27 11:31:30.188423+05	host2	app1	test_event	INFO	Payment processed
132	2025-11-27 04:27:27.786869+05	host3	worker	test_event	INFO	Payment processed
133	2025-11-27 11:26:35.842303+05	host2	worker	test_event	CRITICAL	Cache cleared
134	2025-11-28 18:24:30.138505+05	host3	api	test_event	INFO	Timeout on API request
135	2025-11-27 19:27:16.370454+05	host3	db	test_event	INFO	Cache cleared
136	2025-11-28 07:12:23.621105+05	host3	db	test_event	CRITICAL	Payment processed
137	2025-11-27 06:00:57.378262+05	host3	db	test_event	ERROR	Payment processed
138	2025-11-28 03:55:33.848368+05	host3	api	test_event	WARN	Timeout on API request
139	2025-11-27 08:29:47.108722+05	host1	api	test_event	ERROR	Database connection failed
140	2025-11-27 18:39:19.679651+05	host3	db	test_event	INFO	Error parsing JSON
141	2025-11-27 22:31:45.223328+05	host3	api	test_event	INFO	Service restarted
142	2025-11-28 20:01:22.793358+05	host1	app2	test_event	WARN	Error parsing JSON
143	2025-11-28 04:58:10.814201+05	host1	db	test_event	CRITICAL	User login successful
144	2025-11-27 00:43:20.356119+05	host2	worker	test_event	ERROR	Error parsing JSON
145	2025-11-27 12:41:58.399244+05	host1	worker	test_event	CRITICAL	User login successful
146	2025-11-28 03:40:20.379446+05	host2	db	test_event	WARN	Service restarted
147	2025-11-27 13:09:50.790843+05	host3	db	test_event	CRITICAL	Error parsing JSON
148	2025-11-28 09:21:24.090039+05	host2	api	test_event	ERROR	Payment processed
149	2025-11-27 10:48:13.301903+05	host2	db	test_event	ERROR	Service restarted
150	2025-11-27 15:07:51.436475+05	host4	db	test_event	ERROR	Disk space low
151	2025-11-27 12:20:13.894476+05	host1	api	test_event	INFO	Cache cleared
152	2025-11-28 14:00:28.827116+05	host2	app2	test_event	INFO	Payment processed
153	2025-11-27 16:39:24.017989+05	host2	db	test_event	ERROR	Disk space low
154	2025-11-27 10:27:36.190379+05	host4	db	test_event	INFO	User login successful
155	2025-11-27 22:18:31.22035+05	host2	db	test_event	CRITICAL	Disk space low
156	2025-11-27 08:58:45.485304+05	host1	app2	test_event	ERROR	Timeout on API request
157	2025-11-27 14:07:50.665612+05	host4	db	test_event	ERROR	Payment processed
158	2025-11-28 22:46:18.612629+05	host2	app1	test_event	INFO	Database connection failed
159	2025-11-28 07:39:12.65709+05	host1	db	test_event	CRITICAL	Database connection failed
160	2025-11-28 07:30:05.776851+05	host4	app2	test_event	CRITICAL	Database connection failed
161	2025-11-28 11:23:06.375315+05	host1	db	test_event	INFO	Cache cleared
162	2025-11-28 10:37:29.474046+05	host3	worker	test_event	INFO	Timeout on API request
163	2025-11-27 15:23:47.135368+05	host2	api	test_event	INFO	User login successful
164	2025-11-27 04:29:59.974797+05	host4	app1	test_event	WARN	Service restarted
165	2025-11-28 21:24:50.07751+05	host2	db	test_event	ERROR	Error parsing JSON
166	2025-11-28 06:42:11.9624+05	host3	app2	test_event	ERROR	User login successful
167	2025-11-28 09:50:51.135233+05	host3	app1	test_event	INFO	Cache cleared
168	2025-11-27 10:41:15.073243+05	host1	app1	test_event	INFO	Timeout on API request
169	2025-11-29 00:07:28.44855+05	host1	api	test_event	CRITICAL	Timeout on API request
170	2025-11-27 02:20:28.295695+05	host4	worker	test_event	WARN	Disk space low
171	2025-11-27 14:37:39.586284+05	host1	api	test_event	INFO	Disk space low
172	2025-11-27 06:38:18.05465+05	host4	app1	test_event	ERROR	Payment processed
173	2025-11-27 06:46:53.023674+05	host4	app1	test_event	ERROR	Timeout on API request
174	2025-11-27 08:50:38.939222+05	host2	api	test_event	INFO	Cache cleared
175	2025-11-27 13:12:39.05077+05	host3	app1	test_event	CRITICAL	Cache cleared
176	2025-11-28 21:29:42.124849+05	host1	api	test_event	ERROR	Database connection failed
177	2025-11-28 13:03:06.844375+05	host4	api	test_event	ERROR	Database connection failed
178	2025-11-28 08:11:01.150691+05	host3	worker	test_event	WARN	Cache cleared
179	2025-11-28 08:35:54.866269+05	host1	app1	test_event	CRITICAL	Error parsing JSON
180	2025-11-28 18:31:54.287319+05	host3	db	test_event	CRITICAL	Timeout on API request
181	2025-11-27 19:16:07.426227+05	host2	db	test_event	INFO	Error parsing JSON
182	2025-11-27 17:11:26.214862+05	host2	worker	test_event	ERROR	Service restarted
183	2025-11-27 10:02:57.846273+05	host4	api	test_event	ERROR	Payment processed
184	2025-11-27 20:11:20.78993+05	host1	app2	test_event	CRITICAL	Cache cleared
185	2025-11-28 20:16:04.100669+05	host1	api	test_event	ERROR	Disk space low
186	2025-11-27 16:08:59.294359+05	host4	db	test_event	WARN	User login successful
187	2025-11-27 01:49:19.962189+05	host1	db	test_event	ERROR	Database connection failed
188	2025-11-27 08:30:28.817375+05	host3	db	test_event	ERROR	Database connection failed
189	2025-11-28 05:12:27.825092+05	host3	worker	test_event	ERROR	Database connection failed
190	2025-11-28 23:51:35.713942+05	host4	worker	test_event	CRITICAL	Payment processed
191	2025-11-28 14:36:36.992107+05	host4	db	test_event	CRITICAL	Payment processed
192	2025-11-27 21:11:46.008349+05	host2	api	test_event	ERROR	Database connection failed
193	2025-11-28 15:04:06.0295+05	host4	db	test_event	INFO	Service restarted
194	2025-11-27 16:05:36.234325+05	host4	api	test_event	ERROR	Payment processed
195	2025-11-27 14:08:04.762774+05	host4	db	test_event	INFO	Cache cleared
196	2025-11-28 08:10:51.62433+05	host4	app1	test_event	ERROR	Service restarted
197	2025-11-28 03:50:04.18081+05	host4	worker	test_event	INFO	Cache cleared
198	2025-11-28 07:35:53.14815+05	host1	worker	test_event	ERROR	Error parsing JSON
199	2025-11-27 02:15:21.691109+05	host2	db	test_event	INFO	Disk space low
200	2025-11-27 15:07:24.728326+05	host2	db	test_event	CRITICAL	Timeout on API request
201	2025-11-28 05:28:30.115271+05	host4	api	test_event	WARN	Timeout on API request
202	2025-11-27 16:22:44.51424+05	host2	db	test_event	WARN	User login successful
203	2025-11-27 12:03:08.466062+05	host3	worker	test_event	INFO	User login successful
204	2025-11-28 08:16:21.376995+05	host4	app1	test_event	CRITICAL	Timeout on API request
205	2025-11-27 17:27:20.421938+05	host1	api	test_event	CRITICAL	User login successful
206	2025-11-27 18:48:23.286866+05	host3	api	test_event	INFO	Service restarted
207	2025-11-27 14:34:24.982941+05	host1	app1	test_event	ERROR	Disk space low
208	2025-11-27 07:47:42.209471+05	host4	db	test_event	INFO	Error parsing JSON
209	2025-11-27 22:10:42.019849+05	host2	worker	test_event	CRITICAL	Database connection failed
210	2025-11-27 22:40:50.266769+05	host4	db	test_event	INFO	Disk space low
211	2025-11-28 02:00:27.58863+05	host2	app1	test_event	WARN	Payment processed
212	2025-11-28 16:44:32.47849+05	host4	app1	test_event	INFO	Timeout on API request
213	2025-11-27 10:08:58.573689+05	host4	app2	test_event	CRITICAL	Service restarted
214	2025-11-28 23:20:13.600434+05	host1	app1	test_event	INFO	Payment processed
215	2025-11-28 07:35:30.577542+05	host4	worker	test_event	WARN	Database connection failed
216	2025-11-28 23:19:33.852257+05	host1	db	test_event	WARN	Service restarted
217	2025-11-27 02:47:32.967882+05	host4	api	test_event	WARN	Service restarted
218	2025-11-27 21:41:38.053003+05	host1	api	test_event	INFO	Service restarted
219	2025-11-28 18:15:54.283259+05	host1	worker	test_event	CRITICAL	Service restarted
220	2025-11-27 02:57:10.431745+05	host1	app2	test_event	WARN	Timeout on API request
221	2025-11-28 07:51:29.576045+05	host3	app1	test_event	INFO	Database connection failed
222	2025-11-28 14:50:57.733625+05	host1	app2	test_event	ERROR	Cache cleared
223	2025-11-27 16:14:12.371484+05	host2	api	test_event	WARN	Timeout on API request
224	2025-11-27 21:54:48.359986+05	host1	app1	test_event	INFO	Timeout on API request
225	2025-11-27 10:17:50.086536+05	host1	app2	test_event	ERROR	Error parsing JSON
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, role, created_at) FROM stdin;
1	admin	$2a$10$VrdY.XUCz7iNfvW4nfZLmuzOpOhfGougK7V0bQHS9nd0SBwPXYrUK	admin	2025-11-30 16:08:27.742101
3	Alex	$2b$10$EvgKG96WJwRI/0Ds8izGjeULG9JwpNKPE3hMNN8sIN2CPJoyRbTme	security	2025-12-13 22:32:46.534118
\.


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_seq', 225, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

\unrestrict WNCp0WZuFUWveKUblI2QI8cvRTwPsGjhM0dMFM575fOhZS4HDrcrRL41hbgEHns

