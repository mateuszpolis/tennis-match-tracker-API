PGDMP                  	    |            tennis_match_tracker    16.4 (Debian 16.4-1.pgdg120+1)    16.4 (Debian 16.4-1.pgdg120+1) B    x           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            y           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            z           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            {           1262    16384    tennis_match_tracker    DATABASE        CREATE DATABASE tennis_match_tracker WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
 $   DROP DATABASE tennis_match_tracker;
                yourusername    false            l           1247    28538    enum_matches_surface    TYPE     Y   CREATE TYPE public.enum_matches_surface AS ENUM (
    'CLAY',
    'GRASS',
    'HARD'
);
 '   DROP TYPE public.enum_matches_surface;
       public          yourusername    false            ]           1247    28474    enum_tennis_grounds_surface    TYPE     `   CREATE TYPE public.enum_tennis_grounds_surface AS ENUM (
    'CLAY',
    'HARD',
    'GRASS'
);
 .   DROP TYPE public.enum_tennis_grounds_surface;
       public          yourusername    false            f           1247    28498    enum_tournaments_surface    TYPE     ]   CREATE TYPE public.enum_tournaments_surface AS ENUM (
    'CLAY',
    'HARD',
    'GRASS'
);
 +   DROP TYPE public.enum_tournaments_surface;
       public          yourusername    false            T           1247    28448    enum_users_role    TYPE     Y   CREATE TYPE public.enum_users_role AS ENUM (
    'Admin',
    'Moderator',
    'User'
);
 "   DROP TYPE public.enum_users_role;
       public          yourusername    false            W           1247    28456    enum_users_status    TYPE     O   CREATE TYPE public.enum_users_status AS ENUM (
    'Active',
    'Inactive'
);
 $   DROP TYPE public.enum_users_status;
       public          yourusername    false            �            1259    28546    matches    TABLE     �  CREATE TABLE public.matches (
    id integer NOT NULL,
    "firstPlayerId" integer NOT NULL,
    "secondPlayerId" integer NOT NULL,
    date timestamp with time zone NOT NULL,
    "firstPlayerScore" integer NOT NULL,
    "secondPlayerScore" integer NOT NULL,
    "groundId" integer NOT NULL,
    surface public.enum_matches_surface NOT NULL,
    "firstPlayerStatsId" integer,
    "secondPlayerStatsId" integer,
    "tournamentEditionId" integer,
    round integer,
    finished boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "tournamentId" integer
);
    DROP TABLE public.matches;
       public         heap    yourusername    false    876            �            1259    28545    matches_id_seq    SEQUENCE     �   CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.matches_id_seq;
       public          yourusername    false    224            |           0    0    matches_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;
          public          yourusername    false    223            �            1259    28491    player_stats    TABLE       CREATE TABLE public.player_stats (
    id integer NOT NULL,
    aces integer NOT NULL,
    "doubleFaults" integer NOT NULL,
    "firstServePercentage" double precision NOT NULL,
    "pointsWonOnFirstServe" integer NOT NULL,
    "pointsWonOnSecondServe" integer NOT NULL,
    "breakPointsSaved" integer NOT NULL,
    "returnPointsWonOnFirstServe" integer NOT NULL,
    "returnPointsWonOnSecondServe" integer NOT NULL,
    "breakPointsConverted" integer NOT NULL,
    winners integer NOT NULL,
    "unforcedErrors" integer NOT NULL,
    "netPointsWon" integer NOT NULL,
    "consecutivePointsWon" integer NOT NULL,
    "servicePointsWon" integer NOT NULL,
    "returnPointsWon" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
     DROP TABLE public.player_stats;
       public         heap    yourusername    false            �            1259    28490    player_stats_id_seq    SEQUENCE     �   CREATE SEQUENCE public.player_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.player_stats_id_seq;
       public          yourusername    false    220            }           0    0    player_stats_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.player_stats_id_seq OWNED BY public.player_stats.id;
          public          yourusername    false    219            �            1259    28482    tennis_grounds    TABLE     �  CREATE TABLE public.tennis_grounds (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    "constructionDate" timestamp with time zone NOT NULL,
    country character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    surface public.enum_tennis_grounds_surface NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
 "   DROP TABLE public.tennis_grounds;
       public         heap    yourusername    false    861            �            1259    28481    tennis_grounds_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tennis_grounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.tennis_grounds_id_seq;
       public          yourusername    false    218            ~           0    0    tennis_grounds_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.tennis_grounds_id_seq OWNED BY public.tennis_grounds.id;
          public          yourusername    false    217            �            1259    28615    tournament_editions    TABLE     �  CREATE TABLE public.tournament_editions (
    id integer NOT NULL,
    year integer NOT NULL,
    "tournamentId" integer NOT NULL,
    "editionName" character varying(255),
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    "maximumNumberOfContestants" integer NOT NULL,
    "currentNumberOfContestants" integer DEFAULT 0,
    "registrationOpen" boolean DEFAULT true NOT NULL,
    round integer DEFAULT 1 NOT NULL,
    "winnerId" integer
);
 '   DROP TABLE public.tournament_editions;
       public         heap    yourusername    false            �            1259    28614    tournament_editions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tournament_editions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.tournament_editions_id_seq;
       public          yourusername    false    227                       0    0    tournament_editions_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.tournament_editions_id_seq OWNED BY public.tournament_editions.id;
          public          yourusername    false    226            �            1259    28506    tournaments    TABLE     G  CREATE TABLE public.tournaments (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    surface public.enum_tournaments_surface NOT NULL,
    "tennisGroundId" integer NOT NULL,
    points integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.tournaments;
       public         heap    yourusername    false    870            �            1259    28505    tournaments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tournaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.tournaments_id_seq;
       public          yourusername    false    222            �           0    0    tournaments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.tournaments_id_seq OWNED BY public.tournaments.id;
          public          yourusername    false    221            �            1259    28588    user_tournament_editions    TABLE     e  CREATE TABLE public.user_tournament_editions (
    "userId" integer NOT NULL,
    "tournamentEditionId" integer NOT NULL,
    "numberOfMatches" integer DEFAULT 0 NOT NULL,
    "numberOfWins" integer DEFAULT 0 NOT NULL,
    "numberOfLosses" integer DEFAULT 0 NOT NULL,
    round integer DEFAULT 1 NOT NULL,
    "pointsReceived" integer DEFAULT 0 NOT NULL
);
 ,   DROP TABLE public.user_tournament_editions;
       public         heap    yourusername    false            �            1259    28462    users    TABLE     k  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    surname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role NOT NULL,
    status public.enum_users_status NOT NULL,
    "rankingPoints" integer DEFAULT 0 NOT NULL,
    "confirmationToken" character varying(255),
    "resetPasswordToken" character varying(255),
    "resetPasswordExpires" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.users;
       public         heap    yourusername    false    855    852            �            1259    28461    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          yourusername    false    216            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          yourusername    false    215            �           2604    28549 
   matches id    DEFAULT     h   ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);
 9   ALTER TABLE public.matches ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    224    223    224            �           2604    28494    player_stats id    DEFAULT     r   ALTER TABLE ONLY public.player_stats ALTER COLUMN id SET DEFAULT nextval('public.player_stats_id_seq'::regclass);
 >   ALTER TABLE public.player_stats ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    219    220    220            �           2604    28485    tennis_grounds id    DEFAULT     v   ALTER TABLE ONLY public.tennis_grounds ALTER COLUMN id SET DEFAULT nextval('public.tennis_grounds_id_seq'::regclass);
 @   ALTER TABLE public.tennis_grounds ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    217    218    218            �           2604    28618    tournament_editions id    DEFAULT     �   ALTER TABLE ONLY public.tournament_editions ALTER COLUMN id SET DEFAULT nextval('public.tournament_editions_id_seq'::regclass);
 E   ALTER TABLE public.tournament_editions ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    226    227    227            �           2604    28509    tournaments id    DEFAULT     p   ALTER TABLE ONLY public.tournaments ALTER COLUMN id SET DEFAULT nextval('public.tournaments_id_seq'::regclass);
 =   ALTER TABLE public.tournaments ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    221    222    222            �           2604    28465    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    215    216    216            r          0    28546    matches 
   TABLE DATA             COPY public.matches (id, "firstPlayerId", "secondPlayerId", date, "firstPlayerScore", "secondPlayerScore", "groundId", surface, "firstPlayerStatsId", "secondPlayerStatsId", "tournamentEditionId", round, finished, "createdAt", "updatedAt", "tournamentId") FROM stdin;
    public          yourusername    false    224            n          0    28491    player_stats 
   TABLE DATA           z  COPY public.player_stats (id, aces, "doubleFaults", "firstServePercentage", "pointsWonOnFirstServe", "pointsWonOnSecondServe", "breakPointsSaved", "returnPointsWonOnFirstServe", "returnPointsWonOnSecondServe", "breakPointsConverted", winners, "unforcedErrors", "netPointsWon", "consecutivePointsWon", "servicePointsWon", "returnPointsWon", "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    220            l          0    28482    tennis_grounds 
   TABLE DATA           �   COPY public.tennis_grounds (id, name, description, "constructionDate", country, city, surface, "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    218            u          0    28615    tournament_editions 
   TABLE DATA           �   COPY public.tournament_editions (id, year, "tournamentId", "editionName", "startDate", "endDate", "maximumNumberOfContestants", "currentNumberOfContestants", "registrationOpen", round, "winnerId") FROM stdin;
    public          yourusername    false    227            p          0    28506    tournaments 
   TABLE DATA           l   COPY public.tournaments (id, name, surface, "tennisGroundId", points, "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    222            s          0    28588    user_tournament_editions 
   TABLE DATA           �   COPY public.user_tournament_editions ("userId", "tournamentEditionId", "numberOfMatches", "numberOfWins", "numberOfLosses", round, "pointsReceived") FROM stdin;
    public          yourusername    false    225            j          0    28462    users 
   TABLE DATA           �   COPY public.users (id, name, surname, email, password, role, status, "rankingPoints", "confirmationToken", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    216            �           0    0    matches_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.matches_id_seq', 92, true);
          public          yourusername    false    223            �           0    0    player_stats_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.player_stats_id_seq', 40, true);
          public          yourusername    false    219            �           0    0    tennis_grounds_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tennis_grounds_id_seq', 8, true);
          public          yourusername    false    217            �           0    0    tournament_editions_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.tournament_editions_id_seq', 21, true);
          public          yourusername    false    226            �           0    0    tournaments_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.tournaments_id_seq', 24, true);
          public          yourusername    false    221            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 111, true);
          public          yourusername    false    215            �           2606    28552    matches matches_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_pkey;
       public            yourusername    false    224            �           2606    28496    player_stats player_stats_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.player_stats
    ADD CONSTRAINT player_stats_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.player_stats DROP CONSTRAINT player_stats_pkey;
       public            yourusername    false    220            �           2606    28489 "   tennis_grounds tennis_grounds_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.tennis_grounds
    ADD CONSTRAINT tennis_grounds_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.tennis_grounds DROP CONSTRAINT tennis_grounds_pkey;
       public            yourusername    false    218            �           2606    28623 ,   tournament_editions tournament_editions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.tournament_editions
    ADD CONSTRAINT tournament_editions_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.tournament_editions DROP CONSTRAINT tournament_editions_pkey;
       public            yourusername    false    227            �           2606    28511    tournaments tournaments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.tournaments DROP CONSTRAINT tournaments_pkey;
       public            yourusername    false    222            �           2606    28597 6   user_tournament_editions user_tournament_editions_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_tournament_editions
    ADD CONSTRAINT user_tournament_editions_pkey PRIMARY KEY ("userId", "tournamentEditionId");
 `   ALTER TABLE ONLY public.user_tournament_editions DROP CONSTRAINT user_tournament_editions_pkey;
       public            yourusername    false    225    225            �           2606    28472    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            yourusername    false    216            �           2606    28470    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            yourusername    false    216            �           2606    28553 "   matches matches_firstPlayerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_firstPlayerId_fkey" FOREIGN KEY ("firstPlayerId") REFERENCES public.users(id) ON UPDATE CASCADE;
 N   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_firstPlayerId_fkey";
       public          yourusername    false    3266    216    224            �           2606    28568 '   matches matches_firstPlayerStatsId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_firstPlayerStatsId_fkey" FOREIGN KEY ("firstPlayerStatsId") REFERENCES public.player_stats(id) ON UPDATE CASCADE ON DELETE SET NULL;
 S   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_firstPlayerStatsId_fkey";
       public          yourusername    false    220    224    3270            �           2606    28563    matches matches_groundId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES public.tennis_grounds(id) ON UPDATE CASCADE;
 I   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_groundId_fkey";
       public          yourusername    false    3268    224    218            �           2606    28558 #   matches matches_secondPlayerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_secondPlayerId_fkey" FOREIGN KEY ("secondPlayerId") REFERENCES public.users(id) ON UPDATE CASCADE;
 O   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_secondPlayerId_fkey";
       public          yourusername    false    224    3266    216            �           2606    28573 (   matches matches_secondPlayerStatsId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_secondPlayerStatsId_fkey" FOREIGN KEY ("secondPlayerStatsId") REFERENCES public.player_stats(id) ON UPDATE CASCADE ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_secondPlayerStatsId_fkey";
       public          yourusername    false    220    3270    224            �           2606    28583 !   matches matches_tournamentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES public.tournaments(id) ON UPDATE CASCADE ON DELETE SET NULL;
 M   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_tournamentId_fkey";
       public          yourusername    false    224    3272    222            �           2606    28624 9   tournament_editions tournament_editions_tournamentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournament_editions
    ADD CONSTRAINT "tournament_editions_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES public.tournaments(id) ON UPDATE CASCADE ON DELETE CASCADE;
 e   ALTER TABLE ONLY public.tournament_editions DROP CONSTRAINT "tournament_editions_tournamentId_fkey";
       public          yourusername    false    3272    222    227            �           2606    28629 5   tournament_editions tournament_editions_winnerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournament_editions
    ADD CONSTRAINT "tournament_editions_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 a   ALTER TABLE ONLY public.tournament_editions DROP CONSTRAINT "tournament_editions_winnerId_fkey";
       public          yourusername    false    227    3266    216            �           2606    28517 +   tournaments tournaments_tennisGroundId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT "tournaments_tennisGroundId_fkey" FOREIGN KEY ("tennisGroundId") REFERENCES public.tennis_grounds(id) ON UPDATE CASCADE;
 W   ALTER TABLE ONLY public.tournaments DROP CONSTRAINT "tournaments_tennisGroundId_fkey";
       public          yourusername    false    218    222    3268            �           2606    28609 ,   tournaments tournaments_tennisGroundId_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT "tournaments_tennisGroundId_fkey1" FOREIGN KEY ("tennisGroundId") REFERENCES public.tennis_grounds(id) ON UPDATE CASCADE ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.tournaments DROP CONSTRAINT "tournaments_tennisGroundId_fkey1";
       public          yourusername    false    222    3268    218            �           2606    28598 =   user_tournament_editions user_tournament_editions_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_tournament_editions
    ADD CONSTRAINT "user_tournament_editions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;
 i   ALTER TABLE ONLY public.user_tournament_editions DROP CONSTRAINT "user_tournament_editions_userId_fkey";
       public          yourusername    false    3266    225    216            r     x��Xˎ#7<k�b��|H�Է�H�vO�3��)[�-�Z��om���d�Td�#}��+�+�7��> 8p��������=ő�����-�F�9E���U�>q�W�?^X'W>�0��qE���ۯ_W�< $ҟ{(@����!�9"�FT�ta��19҂�<��t�2���(|�K��������:���w���	�7������˫�Q��0�y�1�+�gx�-2n��5E�24�LQV�'��4�@����1~gE��0�yΘ�È�� 3��R����Ū�#^i�4e�;��5H��)�51�4�C�*��HE��O2�� k�$˜'4�߶�����4<p�b�
�^��9MPj�&i��a�YV���}
�1���9��sFX;Kc��MC(s�p�`��ݥ���[��$��-��u�������ٷ�UA#��Z��6���1�⥕`��+�b�{W�n:��2T����		����N{E�&~����D?�B��V�&�@*��t¨�Pi�Ƶ�L��@JQ-��L�ꠙ���yMs��X��(
0���Q�]����4���'R��2����!�3��Fi�>�7Q?%x�E#�蔿�-]��V��,A���r呠Ɖm���>��
�35Ec-��λk�{��2�/1	jY�Kr��b��2=Ec~�6��2=��6X�b��Ex���3�֋0mQ���l��w��q//ڤ���h
V��������d�R�����&yFR5��.i��tI�e��H��f��U��u�%5��/�]���~�Xl�AjU�j�7Y/��XkF�� ]Ґ[YHqY�9��[����m�Vv��Z���|�`��U�6}+�z�"DH��^�}�*E����~�Ҫy�K�&mt��Z���K2b�C�Cࣴ<�$�de�M�Z-~�LOT���������Р�A�©�J�=����9�@J]�8ު*�JnUU]��f����S�S\��v��s� �	�.��>�>�@V�E�4�uXL>�q?_,'��㹊�!��!�#�o< 8��vg��H�b�smr�^oMN1TM!��ш�������Y����f����i[sGD;B�W_��㑔bk�\�[�?=�b{0�{���pP���0P���$mt�}��>�j����-�ר���y�g�i����%-V�y�jV�/�`�3�\��)x�_���k:��#@;�R��W�1�����g r�mf,T��z4#@;�a5m�t�(�������:,�      n   �  x�}V[r�0��N��N<�(�����(@{E�;��$�,(�j�PB�As���𗊗����r���%���3�)��!�S�%���J��z�`�5�)�ݜ]�j
MC�PϮ-�0�>��E�qZ>S9T�G�qNY��:����FP��p�F���3�C��B���g&aj��� {���QQ���	��,d�0J�J
:##�$h��ǒ�k ��x���FBD@-����*4��r����E�W�?����B� ��W��yڮ��� Ic$�z�u0G��3��s�i����M�o$J�𠜍�������u�(���]&(
��I�ٻ�Ӯ�/�3�݅Ap�G�ƙ�!"��B�~�s����ߝ���I7�N�E4~��4֡��8�ml(��x$�)���y	�@���,u�r���V���Q,�f�@'n�ώN*>Zy� �xf|R*%�<0$#�M�	��r� 'B�_�c�fe'���{�x�q��Dz���Ȅ^�W����
x��C��	��k'-P̜��~T���X�G�v�w��Ϯss[��Ph@�u7�4vZ]yʙǑl����B���z��s��̓�j�4����g����+��k�׃���x
�@@�5[y�,�(u�b�"��OY��Jqo��k�et�=Ϯa'(�;��#��BЖ�Ž1?4�����6&(��,6��>���t����3{���Y��E�5Z�jn��=����sٟP�B3�~��@TV9qG��c&N7�O�'��C[y�őv7A�ےC�>�:ѱ�U��WYT��ފwN��Mf(��Y�N���t�*u0:�G�~x6�4C�����ϋF!3ک��ɞ��.s�u�E΢X�뛡�]�����ě<��c��Y|��gS�����P_�]���ᕸơ=�C�i�H�54C��.�8s���]@�6�R��[W݇h�c��#���0
�      l   �  x�u�Qo�0ǟͧ��%��&���I����U�����sfE��3T����		�}����c�)�X*����@�������`����Z�>�����N�R7d}P�����g��V�l	[�S�| �i_(%�(�(�Ĳ�5�i�O�f��9�h�L�l��$eq��է� !�ㅀ��$l�1ڒ5�[��6Pi��eǽ6��<�\��R8*�G����a�hL��p<
�i�j�=��cQE�r$����ж��=�?�~�Yc��Jr𞤱6���+^_/?n<�b�/�ڎl����hq�h�1�A*��̸�1�Y߸�l��)�'���Ǿ��*&�*lwp�w�<��f�$yF~�<j?�q��Q4�ڧ���v�B){���H�{o{�7��u��	h�wq�e�5N�����~�dX~TM�&q���G�R��0��!�      u   x   x�u�A
�0�ur��K��$��!���ޟ��Q��>�p��p�:$"1^�Rk ���-�t�G�x��X�{�LN(�Ǝ[<�@6��o54�?�KG��Ma4Ů[�[��D]GU�
1�      p   �   x�}��
�0F���)�TĐLӦfW@�M���JR�ߪ`]a�ͅ�'&�k��5]��H�`��J�w�0]W'���������`��GA��[�e��A�Ĥ�9+Q%��Da����h��tcbkC��
DR��2���� ���`�K���ɹ�Fd�L�}!gFy��LQ      s   h  x�eTA�!;ۏ�TԿ��߱��=��z�T 	j�V��z��Y������3*z\넂�㺢�P$(TT��+�]R�$�4�#(�:Vh�g\3C&7�졢����1��f1�������HY0�Ȱd�P`0���Z���Tv̨C=kG������#)�O��^(�A������8tH֓ʴ�T��=�D��cdh�;pC��_��L�j�r�H�D;�*��}s�u`�O�>�~��TAj��(�P%s.�@Ӎ\w��i�i��Y/�oN{C�Z̊�>�1�H9��2����!MR�]�ޡ4ڟB@V.�#w���N�{r>�)��>s�qL	Z�b_����<���T      j      x��|I�[7������Vc�z=[nI��v�FH�b�j���ү'/K��ֆŸe�&X��7�s	�~��o�7��aɫ=���nmq�q��h�~жW��������o���z<}^�����������S~�|�|������/�?����՛��?������nC��z�J�L����CHUsՕX;���HGk�I���G���h{&g�z�����g��������ؿ����'?p:�?�?�(>tV>
�|e�z�^�7�Ձ�W�y���$��x{{���e{����?�.~�}��~����w��Et�}�������w��ckO�/�zf�}N��X�+�vSo�t����FK��n&z3X�׬a�b�NP�����<��7V4�F}�ݨ�i�]�/W��f��i��U��=[���P��W�aP]z(�23�H��K��a�Zwm��Ku������.M~��8�dݢ^�Պ���by^���L���x�i�N;ظ&�kЁ�O��)��#tS�Gm�+��i|@v��pPO�[V��nMm��$..��L삉��C�Q'[�K.�c�:sF�zǩ�A��w/��a|�ѷ�F��V�G��v�ڐ��noV����V뻕Y4w����ڍ�M�2zУo=|�Qh�B�04�F�w���6���wݓW�w���r���̪N��aa���d7zOٓ�^����Zt.:#��&��$���OF�[���yJg)�_y��wzqy��w��M�b{gӺ�L1}�^=�S�9�1
<\�[Q���ۄ0r�	/���j=�z6��Uۮ�Oy|3-̜�3�W�(�0aw݅dz��wN���J�M��&W��=Dgz�e����W�0i��O�[�6����USW��x{'��6� �Sܭn��&iX۴ɡ�����NFrUk�}���w����J���lP�.��qmQ?����	��4FY.��X Ðʒ����T�H!F�}�\�)yC�"�}+Z>V���p[�Y=�vɻ�_]Bث6-.�qq?-΅O�F���
g ��JO�c!��4>"
��c(-k���k��>�S����6��Z���[�r������i&M�N5�)Y� �ʰ��Vs��>r�y��I'����}P-�0ކ���:��Ð�`&K[�-�Z��e{����r�o'i.�H�q>��\�bc ��m�Ӝb����` �Pր�<�>%��壯�CN���k�.��	e�I�.Ec��Q��i���D6x�5�`�d$x�G�b?�bA[�~�º���q��CX��L��Q���&��K��������~�XRA��)�u��UГ�|?O_8���O�%�4�Wx��Z�⑟��JF��-��Y:Q�ĢD�Cw�K1�@�s�x����&ji�����j��Ж��y�5���Q^���L��7�z�_�EvE���2R�F�*E+��֕�	����D���k�zv��ݪW7�qP,ϋ�<�U�jq���A�r�bDrp��fGNPv�	.�Wb���X�o�`����z��v��z��蓴���6�t��Q���
�M2`Y �z��VP�м1<_[�)K%��}�U9F�Q/i��g�V�I����\�w /7����X��/��?7�}�����+W��@���?^?z�������ѯ���탣ʏ>���m����o��C�h+��_������=z�[�ի���%)a������@zsp�D���%0�:��@�=���ĥ#ۚ�_9"T-����idW��H�&qVЀ��T]���N��`�bQmPu"�U�ߐ5{=@�Z}8OgаY�z�]!�N�řtn���Zd�k�Ň��C.�O#ڐ}�l(-��	5/���>�t��-�J�����.&y����L�P֩%�=�l�R�(J��@V�C���i��V׶d�
<r�YZG �lwKo6�^ߪ�$��Gy��Nv�J�-=�P`C�#PG��K�@�TBB\���	x�ȧZ|ug��Pԣ� �>���
�'H�v'�F}\d�jz����$�L���Yx��/Tz�!$ǡ�CDC��3c:ꩭ�ȫ�Կ���b�A�Igo 	���e�����#�Nj]o�h~��J`��L�r�6�|�~�tv���-�:�n��Gqq3�3霈���"kUoBsޥR��;x`�&J����|�Ыl"~�:>/�E��:����n��~�ҹ���� �C�x��A|�;"hn�):{S ��+1�9�,ݞ3InL���~y;;8ꏣx׻�,���@�vl�����l���	�'6)�N	t�5�n<
;(�y����-�oi�[��A��r�ۉH���a��v�\�T;xT�κ������5��U���Mi����MmJT���׻��[@</�<Wen�O9�:\8�z&��d[�`�P�'wg���f*�(��ؔ�/�'d���U�0����4=��C�I#Y������5��jW�	���G���<�������rz^��y��Z(ރ�W�j��B��6���<84<�d��H��9.uDs�}��q;i�-!Gj=���I����Ц ����hڲn��Dojw����5�sv1��e{f3R)�+x��)�	)��(Ε�[�v��c��@-��>��}��@�j��9�O�
S@8׆�V�?%k}Ii�R��+�ݪ��Ъݝ��<�ڶ9�$jhB.)��)�Fv;RE�nٹ�{3���������H��<�{�}� �갽�lCZ�'i�}h�q9�L�қ���Dð0,i���z �5���7��x�>җT.�w�~��j���ǹ��O ;U��J�ڈR]�Q�u��_���zf��)�FU�]x��e�]�0����h�0��V��P4X�7��� ��k`��k��u����	.��đZ+��)s\��i�(x�z�^_�F�p���<���Q��,d����zԵT�H6V�5\��mP�4�p �w����Q爛mp�-oh���M��L�9}L,� @l[ul�h���![*0&�A�k�����f�o��}�&>bTO��ޣ*?�n��U�`Վ+��ae���-(/�Vn@����fcZ�&Cc&$.�突JG�p��G�ߞ�W̴3�˴����o�K��s��!��;yq9�3i]���`� *<F��nJ���љ8cE4�mx&W�#�<ޝ	9]P/�5v(��ܨ�`�"̤�l�i����C�z+��,q૶a�d롷%G=d��C7R$A�$�}Poh�_�c7�8 ��Sٙ�RDʨR�D����K�=�ʬ��`Pj�2�z��E}���4�w!��zZI�:Tb�E�1�W_�o���� ��՝�;I�}�2�p��^��n�2��-I��j@)ֳ�L�F�c��X6�[��Z�4F�o�Q��Li-��ju���������@^���
�����4��l[�@�(�1B����G�)�$�<��7 �!cc��<���n�n��POW�r�V���"̵-joS ���[�����Ɨ�c.�xҐ��/�GM*��V�����WOx���
N�#/e�}XX�����!.v���Բ�G���\�m ީ�p%�5���G��	�9�|U�Y�
�ު_��/�N��ۣ4W,�<���zt�\�!'�,\����H��2v�":"M#��L��-�/h\&�|8�4���뫉'caX���f�-�'�d��8��w����m����,�w�8�@;�(�^_��+|��$-.'i&�9NS�}�uvN�HX�\��]!����	��";�}��y��C[�����5*��(-�Hs��p�Z����9i����k9,���`�$�4�/�l��?g��V�����V��y1�y�����u@f�jp�T
�k1:�ԭ3��*^���"5� ��P���-j��(ox���V�*Ź�r+���C��3X�`]�!!��Z�I��2gi	�6��#Ýia ����Pz��񴥈��$Υ3 �H�EY�Q��!��`R��7����*�{r.V�Js`{"��4 R  M{<գ�� �D���_�f�踂�u�2[��ih�Gr��h���9s�(���Jˁ�P��	�U,�[͝��?i>�e��W��}�O���"p�������d 8���s��o.aKr��n��=�uʬ�gZOp>�]��6خP��`����0����Su�Ĝ{�Q6+Riv��}@�r#6�k�Hw����\Q���4,��������wW[����]\�~��ж3|`#yؕ���$̑�����@i2hPލ吜5��#?j|to������>禳���a.��ss���'D1��+)����
��e����EϲEU��V������J��!��i����ǃ�_�:�r�����t@�뽬�E�25�Dh=���)�J�B�G�+%*��kJA^�X���������oar�ԣ�(V��FL-$���}X�+���D�%��� �i�,�����;4\�Yn1X�dW�m�(;�H��I}�ݵ���U�����na.{G�SL#Y!�}�L�ǘ��8U�9�Qt�n��A�S��٠��3�������Q��@�}����b\��Z���[�-��@�<Hf��r�s `��p��t?*0�׀w!Ě��a�^Ӯ�m��9
�%��Z��5m��i�6%��-��.��O~����!���;�d�
��V��NI=[��ݢ���d��eaq�qa�h[L��x����;�j�J
C���� �(���= 0�3��|����	��g�N����/�h�]!?JC�6�-�i$�:]C�ox${-���o@����=�w;����K	�iG�ձ�_�q��.ڑy�r�%j0"�e�(� $q��xG�6��șR���R٪��ǟlQ�.�gV�������zٚ)fB� �V���X��d�F�F.sd%jO6���^��WZ�-�١-��(��~A��l��􃐵,�J��@j ��8mG�l�EN.���5�����h��\Pa�cAZ�SFo�p�	,�N>0�������r
>۳pQ�A��t9�B�8�V�n��N�s��&݂n@#d�D�R��.�@$e�Iw��Z�9�10�h�y�9m:R�7;�����n�ں��T�"-q��qr�=�7�d���H���ٞ�!��y�Ϣ�k>ޅ�]PS���x+�\�O���.�@������(�}��HY��hP�HH�����f9�{����@���U���X�l��X����]��A�� ���%X�1P{KӮ�bf�sf9o[2�1s9)�~^�f{�����L�l��lM������H_5&�g�/�5dZ�
	��Td�ȣ�Y���6܄6��v#�(�r��WfW�j�L��1�����?Az������-�UCY�˃��ڸSp֟���v��y'7g�n��/E��I�Xw'����#1�_\�gx{�ޑ�Ss�Wg4�W��k���S��g*OSR�}�!��//���0u��\���� ��&b��5�^n.
���ӹl�'�� +w��CU[N)Q�i<�w��"P�iw �<Vw=�E��2ט焐#C-D*�H����N��a(B@Uր_�Wn�R�N�ޗ<�ıE�W���O�N+��G9Vd��F�-o�E2�!�Q.���	A�$��̻"�yx���A��[Q�w�����V�I������jL��pg;����r��/�2��'������(`��&���f�,=ҠO�����.	>^o���`�ǹ�iNK��6Zøg6����{-�1��E��#���&(/�m���ă���k�w����w�^����Q�K�$�Mj����N�R����ck�@a�Z�&`�Z@P'���"�A��=OA��^�6�[޽�^H�K��r��h�k%#{u9�����Έ[��n��G �Ans� Z��Z�Q��}u>ޯ��`N�:O;��I�gܞ�(rdL��Y|�Z9l��*t�QF�ƈ��c�39o�0��-������d�dճw���zs+S�|�7�sͨCaΖ�N������q� Wki��Dfe��M[��UY�D
�	~Ng���r%}�����<�mG�g�A����W��&V 'Wz���C٪IYf�=��޻tӽe%�g���t}![η
�o�?H���Ø�Sn2r:�܃-QN� [�
mm7(�Y˅� Ӎ��\�T"�I�	m����?��z���\)������:�a�B�l톴�tAi"�@N�!��#��j�N���a�%r���}��dm�P�6LR�&/��b�I`m2j��`X��ڸ�A:ȡ_��sy+��\�X&9|#���z������6Ի�����z{3](q���8W��2�7���`k�ݢlu�]?�4]�p��[jBjB"S������w˫'��
V���_����,�}\\ ��Ź���_�L��f� ��`9�*����.I����K������n#�l�����z�}8��X�Z~XX,����lα��N���,7^��{..�m�i���W#�m������}F��I;6�)~<|�շ�5�����_��f�SKYY���nZ��睌�9�o�\͘}�r6~���
~�@�9��3p**|>��M>	��I���E�'��~:��1�Ws͹Yh-XM�:����P��`������7�wCC�/�r��st����[�f�8ϋy��ֆ�e�ZKR69E�m]��\Jw��ڠ�շhm��qz�}���vUԽ������H�B��ʿ��K���_�Z�^��۫o_�o��;��u�ǉ�������n�j�8���<~�z�ۿOԣ.c��%���1>��I�,�
���9W�g�.�vq�ӳ����0�/!��P�6?��J�C?��$������	��     