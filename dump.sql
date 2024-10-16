PGDMP      "            	    |            tennis_match_tracker    16.4 (Debian 16.4-1.pgdg120+2)    16.4 (Debian 16.4-1.pgdg120+2) B    x           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            y           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            z           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            {           1262    16384    tennis_match_tracker    DATABASE        CREATE DATABASE tennis_match_tracker WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
 $   DROP DATABASE tennis_match_tracker;
                yourusername    false            T           1247    16558    enum_matches_surface    TYPE     Y   CREATE TYPE public.enum_matches_surface AS ENUM (
    'CLAY',
    'GRASS',
    'HARD'
);
 '   DROP TYPE public.enum_matches_surface;
       public          yourusername    false            W           1247    16566    enum_tennis_grounds_surface    TYPE     `   CREATE TYPE public.enum_tennis_grounds_surface AS ENUM (
    'CLAY',
    'HARD',
    'GRASS'
);
 .   DROP TYPE public.enum_tennis_grounds_surface;
       public          yourusername    false            Z           1247    16574    enum_tournaments_surface    TYPE     ]   CREATE TYPE public.enum_tournaments_surface AS ENUM (
    'CLAY',
    'HARD',
    'GRASS'
);
 +   DROP TYPE public.enum_tournaments_surface;
       public          yourusername    false            ]           1247    16582    enum_users_role    TYPE     Y   CREATE TYPE public.enum_users_role AS ENUM (
    'Admin',
    'Moderator',
    'User'
);
 "   DROP TYPE public.enum_users_role;
       public          yourusername    false            `           1247    16590    enum_users_status    TYPE     O   CREATE TYPE public.enum_users_status AS ENUM (
    'Active',
    'Inactive'
);
 $   DROP TYPE public.enum_users_status;
       public          yourusername    false            �            1259    16595    matches    TABLE     f  CREATE TABLE public.matches (
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
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.matches;
       public         heap    yourusername    false    852            �            1259    16599    matches_id_seq    SEQUENCE     �   CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.matches_id_seq;
       public          yourusername    false    215            |           0    0    matches_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;
          public          yourusername    false    216            �            1259    16600    player_stats    TABLE     �  CREATE TABLE public.player_stats (
    id integer NOT NULL,
    aces integer,
    "doubleFaults" integer,
    "firstServePercentage" double precision,
    "pointsWonOnFirstServe" integer,
    "pointsWonOnSecondServe" integer,
    "breakPointsSaved" integer,
    "returnPointsWonOnFirstServe" integer,
    "returnPointsWonOnSecondServe" integer,
    "breakPointsConverted" integer,
    winners integer,
    "unforcedErrors" integer,
    "netPointsWon" integer,
    "consecutivePointsWon" integer,
    "servicePointsWon" integer,
    "returnPointsWon" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
     DROP TABLE public.player_stats;
       public         heap    yourusername    false            �            1259    16603    player_stats_id_seq    SEQUENCE     �   CREATE SEQUENCE public.player_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.player_stats_id_seq;
       public          yourusername    false    217            }           0    0    player_stats_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.player_stats_id_seq OWNED BY public.player_stats.id;
          public          yourusername    false    218            �            1259    16604    tennis_grounds    TABLE     �  CREATE TABLE public.tennis_grounds (
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
       public         heap    yourusername    false    855            �            1259    16609    tennis_grounds_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tennis_grounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.tennis_grounds_id_seq;
       public          yourusername    false    219            ~           0    0    tennis_grounds_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.tennis_grounds_id_seq OWNED BY public.tennis_grounds.id;
          public          yourusername    false    220            �            1259    16610    tournament_editions    TABLE     �  CREATE TABLE public.tournament_editions (
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
       public         heap    yourusername    false            �            1259    16616    tournament_editions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tournament_editions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.tournament_editions_id_seq;
       public          yourusername    false    221                       0    0    tournament_editions_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.tournament_editions_id_seq OWNED BY public.tournament_editions.id;
          public          yourusername    false    222            �            1259    16617    tournaments    TABLE     G  CREATE TABLE public.tournaments (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    surface public.enum_tournaments_surface NOT NULL,
    "tennisGroundId" integer NOT NULL,
    points integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.tournaments;
       public         heap    yourusername    false    858            �            1259    16620    tournaments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tournaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.tournaments_id_seq;
       public          yourusername    false    223            �           0    0    tournaments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.tournaments_id_seq OWNED BY public.tournaments.id;
          public          yourusername    false    224            �            1259    16621    user_tournament_editions    TABLE     e  CREATE TABLE public.user_tournament_editions (
    "userId" integer NOT NULL,
    "tournamentEditionId" integer NOT NULL,
    "numberOfMatches" integer DEFAULT 0 NOT NULL,
    "numberOfWins" integer DEFAULT 0 NOT NULL,
    "numberOfLosses" integer DEFAULT 0 NOT NULL,
    round integer DEFAULT 1 NOT NULL,
    "pointsReceived" integer DEFAULT 0 NOT NULL
);
 ,   DROP TABLE public.user_tournament_editions;
       public         heap    yourusername    false            �            1259    16629    users    TABLE     k  CREATE TABLE public.users (
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
       public         heap    yourusername    false    864    861            �            1259    16635    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          yourusername    false    226            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          yourusername    false    227            �           2604    16636 
   matches id    DEFAULT     h   ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);
 9   ALTER TABLE public.matches ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    216    215            �           2604    16637    player_stats id    DEFAULT     r   ALTER TABLE ONLY public.player_stats ALTER COLUMN id SET DEFAULT nextval('public.player_stats_id_seq'::regclass);
 >   ALTER TABLE public.player_stats ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    218    217            �           2604    16638    tennis_grounds id    DEFAULT     v   ALTER TABLE ONLY public.tennis_grounds ALTER COLUMN id SET DEFAULT nextval('public.tennis_grounds_id_seq'::regclass);
 @   ALTER TABLE public.tennis_grounds ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    220    219            �           2604    16639    tournament_editions id    DEFAULT     �   ALTER TABLE ONLY public.tournament_editions ALTER COLUMN id SET DEFAULT nextval('public.tournament_editions_id_seq'::regclass);
 E   ALTER TABLE public.tournament_editions ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    222    221            �           2604    16640    tournaments id    DEFAULT     p   ALTER TABLE ONLY public.tournaments ALTER COLUMN id SET DEFAULT nextval('public.tournaments_id_seq'::regclass);
 =   ALTER TABLE public.tournaments ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    224    223            �           2604    16641    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          yourusername    false    227    226            i          0    16595    matches 
   TABLE DATA           �   COPY public.matches (id, "firstPlayerId", "secondPlayerId", date, "firstPlayerScore", "secondPlayerScore", "groundId", surface, "firstPlayerStatsId", "secondPlayerStatsId", "tournamentEditionId", round, finished, "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    215   _       k          0    16600    player_stats 
   TABLE DATA           z  COPY public.player_stats (id, aces, "doubleFaults", "firstServePercentage", "pointsWonOnFirstServe", "pointsWonOnSecondServe", "breakPointsSaved", "returnPointsWonOnFirstServe", "returnPointsWonOnSecondServe", "breakPointsConverted", winners, "unforcedErrors", "netPointsWon", "consecutivePointsWon", "servicePointsWon", "returnPointsWon", "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    217   �`       m          0    16604    tennis_grounds 
   TABLE DATA           �   COPY public.tennis_grounds (id, name, description, "constructionDate", country, city, surface, "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    219   �c       o          0    16610    tournament_editions 
   TABLE DATA           �   COPY public.tournament_editions (id, year, "tournamentId", "editionName", "startDate", "endDate", "maximumNumberOfContestants", "currentNumberOfContestants", "registrationOpen", round, "winnerId") FROM stdin;
    public          yourusername    false    221   �d       q          0    16617    tournaments 
   TABLE DATA           l   COPY public.tournaments (id, name, surface, "tennisGroundId", points, "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    223   Ee       s          0    16621    user_tournament_editions 
   TABLE DATA           �   COPY public.user_tournament_editions ("userId", "tournamentEditionId", "numberOfMatches", "numberOfWins", "numberOfLosses", round, "pointsReceived") FROM stdin;
    public          yourusername    false    225   �e       t          0    16629    users 
   TABLE DATA           �   COPY public.users (id, name, surname, email, password, role, status, "rankingPoints", "confirmationToken", "resetPasswordToken", "resetPasswordExpires", "createdAt", "updatedAt") FROM stdin;
    public          yourusername    false    226   Hf       �           0    0    matches_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.matches_id_seq', 15, true);
          public          yourusername    false    216            �           0    0    player_stats_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.player_stats_id_seq', 26, true);
          public          yourusername    false    218            �           0    0    tennis_grounds_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tennis_grounds_id_seq', 3, true);
          public          yourusername    false    220            �           0    0    tournament_editions_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.tournament_editions_id_seq', 2, true);
          public          yourusername    false    222            �           0    0    tournaments_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.tournaments_id_seq', 3, true);
          public          yourusername    false    224            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 103, true);
          public          yourusername    false    227            �           2606    16643    matches matches_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_pkey;
       public            yourusername    false    215            �           2606    16645    player_stats player_stats_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.player_stats
    ADD CONSTRAINT player_stats_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.player_stats DROP CONSTRAINT player_stats_pkey;
       public            yourusername    false    217            �           2606    16647 "   tennis_grounds tennis_grounds_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.tennis_grounds
    ADD CONSTRAINT tennis_grounds_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.tennis_grounds DROP CONSTRAINT tennis_grounds_pkey;
       public            yourusername    false    219            �           2606    16649 ,   tournament_editions tournament_editions_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.tournament_editions
    ADD CONSTRAINT tournament_editions_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.tournament_editions DROP CONSTRAINT tournament_editions_pkey;
       public            yourusername    false    221            �           2606    16651    tournaments tournaments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.tournaments DROP CONSTRAINT tournaments_pkey;
       public            yourusername    false    223            �           2606    16653 6   user_tournament_editions user_tournament_editions_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.user_tournament_editions
    ADD CONSTRAINT user_tournament_editions_pkey PRIMARY KEY ("userId", "tournamentEditionId");
 `   ALTER TABLE ONLY public.user_tournament_editions DROP CONSTRAINT user_tournament_editions_pkey;
       public            yourusername    false    225    225            �           2606    16655    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            yourusername    false    226            �           2606    16657    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            yourusername    false    226            �           2606    16658 "   matches matches_firstPlayerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_firstPlayerId_fkey" FOREIGN KEY ("firstPlayerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_firstPlayerId_fkey";
       public          yourusername    false    215    226    3278            �           2606    16663 '   matches matches_firstPlayerStatsId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_firstPlayerStatsId_fkey" FOREIGN KEY ("firstPlayerStatsId") REFERENCES public.player_stats(id) ON UPDATE CASCADE ON DELETE SET NULL;
 S   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_firstPlayerStatsId_fkey";
       public          yourusername    false    217    3266    215            �           2606    16668    matches matches_groundId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_groundId_fkey" FOREIGN KEY ("groundId") REFERENCES public.tennis_grounds(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_groundId_fkey";
       public          yourusername    false    3268    215    219            �           2606    16673 #   matches matches_secondPlayerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_secondPlayerId_fkey" FOREIGN KEY ("secondPlayerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 O   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_secondPlayerId_fkey";
       public          yourusername    false    3278    226    215            �           2606    16678 (   matches matches_secondPlayerStatsId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_secondPlayerStatsId_fkey" FOREIGN KEY ("secondPlayerStatsId") REFERENCES public.player_stats(id) ON UPDATE CASCADE ON DELETE SET NULL;
 T   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_secondPlayerStatsId_fkey";
       public          yourusername    false    215    217    3266            �           2606    16683 (   matches matches_tournamentEditionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT "matches_tournamentEditionId_fkey" FOREIGN KEY ("tournamentEditionId") REFERENCES public.tournament_editions(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 T   ALTER TABLE ONLY public.matches DROP CONSTRAINT "matches_tournamentEditionId_fkey";
       public          yourusername    false    3270    215    221            �           2606    16688 9   tournament_editions tournament_editions_tournamentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournament_editions
    ADD CONSTRAINT "tournament_editions_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES public.tournaments(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 e   ALTER TABLE ONLY public.tournament_editions DROP CONSTRAINT "tournament_editions_tournamentId_fkey";
       public          yourusername    false    223    3272    221            �           2606    16693 5   tournament_editions tournament_editions_winnerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournament_editions
    ADD CONSTRAINT "tournament_editions_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 a   ALTER TABLE ONLY public.tournament_editions DROP CONSTRAINT "tournament_editions_winnerId_fkey";
       public          yourusername    false    3278    226    221            �           2606    16698 +   tournaments tournaments_tennisGroundId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT "tournaments_tennisGroundId_fkey" FOREIGN KEY ("tennisGroundId") REFERENCES public.tennis_grounds(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 W   ALTER TABLE ONLY public.tournaments DROP CONSTRAINT "tournaments_tennisGroundId_fkey";
       public          yourusername    false    3268    219    223            �           2606    16703 J   user_tournament_editions user_tournament_editions_tournamentEditionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_tournament_editions
    ADD CONSTRAINT "user_tournament_editions_tournamentEditionId_fkey" FOREIGN KEY ("tournamentEditionId") REFERENCES public.tournament_editions(id) ON UPDATE CASCADE ON DELETE CASCADE;
 v   ALTER TABLE ONLY public.user_tournament_editions DROP CONSTRAINT "user_tournament_editions_tournamentEditionId_fkey";
       public          yourusername    false    221    225    3270            �           2606    16708 =   user_tournament_editions user_tournament_editions_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_tournament_editions
    ADD CONSTRAINT "user_tournament_editions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE;
 i   ALTER TABLE ONLY public.user_tournament_editions DROP CONSTRAINT "user_tournament_editions_userId_fkey";
       public          yourusername    false    225    226    3278            i   j  x���;n�0@g�����m��uh���G)��$����3�G�Z��uǴ� 6_�� �����v� ����_�;�N�B԰4)A0������Z,�e�Yg��E]?�Z�)�L=�%`�\�y�&�QҴ)��
T9SA��LJ%h�N��
��$���VQ������� d�����@��*=���W��B�:H�d�u��4uY�������f0�"�aF�&��⑥@��w��ٰ>c���>]���	9(�e7�A��h}����q��.�Ģ�09���kG�2��!?:��QG{�ٟ<��}���6�!�C��6�dL��6���%�1i�U���Ê�]��H;�,�
��jH����m۾7$�      k   1  x�}V[��0��N�����(�,��9:C�]�[ ����ĥ��5�nU�O�.}I�^�*�^��j�W��]�_u������J�f����d�]�3��KLf�>s�߶�R�T��s���]l�����Z`,}���c����JE�Ui2��(���-��G�1b��ڷ-�TL~J"V�<�$>O�S�y
��h^u6f�c+�	�CkS���-0(��J�&�Ia���0A|���x���Yl�6�E�� ~U;�%���8�zT��ti�T�hs�	�{����̴��I���֠�i��fx�G��T���LL�Zl�B+������,5>X�'y�/7=@�[��K�;�L�2�Q#�J||�3-��ѕ��J��xH�E���ut�;�&x�{%�~�q�bl��h�[T� 
�*�T	~�ZR��;z��5�^*����=���J^�ptx��܁��� e��Kg��J��KN 5Mո�<����g ���Dc/� VȌ��=΅� ?Mp��#4_����쏽T0��;����sk��e�%}��ޯ�X�I��Ji0#��Q�Lس�$*�`�xq�a21�RA���0ýo,F$F�,n�W2����j�[��������(�FЂ\X�w�r�$}{��B��v��y�pp��s�G�
dW�C5�j+��� ����^S�����z`�5��
�2�p͸�a�����k��m����H[�+��yܨ�'}
���{�s�>8Y��R����ңG��32�;	' q������1W���R錮���S��Zd��AZ��p�8g��V*��R��=      m   �   x�u��J�@E�7_1�&6�[	�������6�&ٙ��A�{ӂ R�20\.����0�=u��*�I��D���/L���x`��'=�����<�{�e���v4L�7�*��c�怔�%7R���-<�Z��b��b��ԵHd��J�*%�lU,�E�����*Z�:�a���v���j{�;���gX�.�[����4"���X��AAÓ�K�"���5���Ԡx��xQV���|�"S�U�^A�UE�(��9m�      o   R   x�3�4202�4�Ӻ���
V`�m` 6�5�@64�4�,�4���2��a�	W��s]Cct3�(�Ӕ�ܔ+F��� �i8      q   �   x�3���M�IM��Sp�H�-���+��,(�tr�4�4200 F&�����
�V��V&�z�&��x���9��s�R����4܊R�3�R�49�}#9�1�7�20�22�371E7U�+F��� ~�,�      s   _   x�]ϻ�0�����w��s��t<�Y���oUጛ	mj�����p W@`A?W�KFn}�(�� ��~ɩ�5��a���$-      t      x��\ێǑ}N}�>��BB�/z2IQԊ��d�6"3#gZ}��{�~�����E�K�D��C��"��9���.�_.�^�]�����F���t�8��=mv_��^�����;s��ë��������_�y��|�_�9�����������o�����o�<������I���'�_j��;V�f�6��S�#��b�!P2��B��Ւ���yP�%D�A3r&���������ύ�܄�0�K��t�o�j�O��e_$#}��k:m�p`�u|���9�\�ig���k,�e�u���١�
w
����s�uO��M�-6��%N���7���I~���$��|w���~���x��
?���7o���7��&���>���������W���o�/����O-�Ќ�}��3u��9�ĩv���Bv�	��n-�a�7�󈆨��#�/m�"��O.��I_z�E�������Ϝz}Dh�r<��i�����W�������Rz�=[d���RN&��#ƹ�,{g��U�4L1յA�Ƶl�E���>��1����gA=��́�7���h6�[1V�r�|�6�:r`D��̹Rt&Z�� ���\j#wB�k;L�Q������o?�,�כvK;V�w�|<��՞NW{%�3��:b6��d��=ԎI�u�L#k�:F�}�ZcR;֮���\��_����tR�?�/wީ����F�9m�\���o- ��R�)17�>:F5�Z�x��3��V#�R?r1�\.��n���ʧ]n��=ѣ�Vr�R1a����I\���K>���2������Ϝ�L���6��i�Փ������^����=L���J~7=4��Ù+�����FS�BY]0�+*VA5�Ng�3�B��6�-�.�F��$s��lM��Z���7�
�h����*;��a���T�ֱjM ;G���q5�j�+�<���-߳�g��յ=�S�핼�\Mp�6����I%٨�M�Z�����P|`mC��՚�]�cƩ�'�Hꇟ7�-�:[�y�V��8Y�RvҊ�Tc��1f�]�l]SN�́�XP��?��}�W/ywި����oA��j+C��:����n��Uے��=15����mc�R<!�|� ��)q���e��V�e���ζ[��ٞ�W{%��D�8[�s��M�^>�+ǒ�6&�`�S���b����p�$��f��k�Wt���結����&#e�2���bmF�Ѽgc%�a� �>4i�}��Y=����w�Ί�y���Z�E�Mü�Z� ��o��p�
��ԡ�fۆ��PZ`lNǅ���WL�)�!�wLS���<�{(�SOܚ����ζ�H.��kC�(ژ���~�~��SH�g�t�;|��7�[���i��J^;q,�h(:ց["������J��np���ԣE�a�2|��X_��o�uC��ձm�tP?=L���J~3i�=������'������At�P�zh���`*na�����zqw�<�N��t���Z%��-�A���q} ��0K/.		��%HL��޸{g �.��G�� |����5k���1��B8k�r��1�V�Fo���!;z� �a�A=��'�u����<��� �CW<�Q���nЍ0��B)bFhL��A�..�U�ǩ�P[��l@TlWc���:{T&Ts

1E֘��F�����"G6�8bL�0�D��t�"u8@Fmgs�]͵|n:���]F`�GO��NΘ�2等\0�ZWc��#��2z�꒴��$�<[��l��1�!�5X%�3�K$
���(ɾ��A} �3��dw��2~i��z!�zs�d�\�s�?����6�J�&�c[L0�$oA$���Z��̦����@5�h��iYf;�^�}�����;��� �$�k1/���:�OB	:0�R�T�圪�=�i���0:;-�� ւXV��U_��p�~q���Z�����^��<�B]�0"��H��u��I��F�L��H&z��X�S/�r�ꆏ�	ke���%{W���<��G�:��j�u�.��/>��	_b�(V�Ϋȣ�T��󺹜��С�8X3���@�{��-7�1`�����]n}��/�6������fW�m�V�i{���y@���<H��M��L�ZDEf�k� '����+�كTRֻ�lyD����>=�vA,�Tgc�ndQ¬�8�Њ1Z��V˘CL�0��� �P�� �_C^��]V/N���ICG��F����^m�U�M�θ�Ma0G	5�sk�%��0D"�G$O	Z2���=���]Q?�$��6�����lN�j���l!��f��j0�cG-1�t�#�ʘ�@,�4/�ס�[�;�6��~y����i�J0֊���!�Qxએ���1�x@���3�֠"} �����kz��s�}���]?�:���j�U�	�Eлq�\�5���Z�Q���x|h@ER�H{Y��y�N 8v�|��tQ����~���V��tx5��� �ɾkh�V�v�-כ� gKg&�.(ȥ��;����9�o�g�����Z-���,�tN�j�QS�hY���Q���![ԧB!猘j7�X�W���
ӷ��E`N7��Z}ZЬ��,��u���V	߀�Ö���6�MÃk�$%*�ޖ)����[��n��>���t��+y��8��oHc�UW.!vg�dxT*/r ���L������m���c�����o����l�g���r�I{^��k��a���2L�
�l/��4&�B�J��xw�����DF��<�R��9T��Yv5�
M�H6J/�W���j��ZSI�c�{�V��\.G���/��������|����C��c�>b���1�-jnH�.�q�L�.�x/+1C�F�����nC��z�
���f{��5N��mA
��<��s�mem	U7�'�z	ZjQ��u�m��A�'�d�*zG�Yk�a+n�B�%n1����!Ҷ$��(w@bh׆G���)��9����aY�~×����n/<�a`z?��.1�4�"�#S��R�5}Xˑ�%D%��V�P���5k���z�3\�8��:ܫ��=�<�k�3�h��	��j���:�	�k��K����s���c��;����c9ͧ{�ֳ�A�"�	�j��VG��ė�4Cj�|��C�`^�1����� �;�N�} $�|��+��G�߁�ty��<�5��c�Hlr�&��j:ʢ"�+'� �6J�B쵉.%\��Le�
E=�?mv»����Ml�]W{�.�$�����Ճ�X ���6�Ei	� ��@�l!
11D��G�^ޟf�y�߫-��a<��-���C����.Y7�1��Kٗ����K#�V���:.�� �~�\�Å����b��AD�y����[*19wm�U�AF �UDGy�j�讽�˺Ѫ�t��?���s��
��ad�?����*�h��A4��*d�3.�F��k��JV�4A�E�)�9ca�<�XܫWw�ٽ�\>�q�v�k�� ��B�,e��Q��l
ށ��ћ�-���QAD1����e5°���T���{��|��Ӽz|?m���˶*�$���dC5(MÙ AvI1U�*=�����0�e?�2�����L���V�����������-�1�����Sυd�9�Wp��9��r�k�@y�B���x�]�`�؊�0��^\.�{���A9�rݐ�d#�N�!I�l�i�5�M��( �ԓ�;�U_#�I��Ak�N�9[�����f��>�Q�[3�sdT:^>$�&C� c�<���|ڑ��Dn �wbN��\M3�*�BR9� ��2�\:Vcs�!"�!����q�ldʹ�e<,�_�wp�z�m3+~�,�rp�BV��Y;|����yޭG�Į.SJyP��Cc�!+���X������qw�C�Ӎ:b ��ׁ�tdв�6P�\�L����4��f�h<�V��O�#�}Xp��"��i��F�:ޫo����履���2����H�*Ȇ����:$�? 1
  ;�Xc\�nP39��d��2�l]���?&�O���l6�J+������1YS��;
��TK
r�Q��=:8�1�nA.��'���me�q/���j����U��
Ї����"��&�z�[l� �8����CezT.V븰�����ć����ԎBI.bN�s�ܶ]�NR]mfe(�V]3H����Ve��RO�ICec.,��rr�߰��#!�x��ߴ�ƀ@�>�d�84�� �L�q��HH�>F��"έ�!k��}5a�\6���O�|�Wg<NU��枣��g�_�K�5@DA?gm�K��?9���-�^��.���-���t��X�s=�< �Z�Q� ��b�PF(H��Z�� ��uD�n��$�c�1������u��V�jn��v�r��O��Zk��4��OE� E���d���J���Qijt�|���A$��y��K��{G���J����Z+� Ә�җ�Z��� ��7$��T�śf��'(��K�A���ڲ�Գ���������6L���@]�jե�G9�]0������KobdEV贑-��|� ևÆ�[��7��a6��Ws��n�e��r�Oq����lj�,9Fm�3x�CB/��Zo�:A9��}^���^�&�y��j�����5�:�6��Ɔ24��\Hj%�^����.� ����y��H=9ȉ69w<�D��Z�QW�\�cr�8��(Y�R.�3y�Y�!uL�E�In���@^��;�rQ��${���	p=�c��U$�Q�
h3��C2����sE��ɠ�ꂴ��Q��Z�(Z=�����bw�kSĜ��F̵��8��C(G+ݯ�"1R�L���@(���l�법�rj1EזŸ@3�|�����B4��t����S�J��R��I��4�I)ܡ62ES�����a�l��`c�����U�����ط~�i�^��_���E�6�d�)lk�(pkF�M�>	���Z��q89n=�9�Q�)���%U���xܞ��%E���Z]��.S�[�����T���\�7�X�M����t����0��E����Mɐ��םn��Ph�/���ԥ�����=*nk�3�����r�ڳ�0r��^Ҳ�"%����%���WT_,��d��+6���ka���ت�m*�.��j(g���-�v��� �5J��o���*I�d��L�mΩ��1}c�m��NV"�t�>uH��ҫ
���r$���t�p��VC�}+Y�x{7�t{z���Y]��Tgs-�\�ΛZ�(�R��Z.8�����²2�d.��~ApqM#/��"��wǓzz�s#�S=�vj����+{P����0�A��|�چ�v9[�\ ��#�ޥ�eo�"o>��ȿ���ӑW��hG��>��ަ��l%���dk����G��ԂzLS�6�.Y�[x��6��{���m.d?#�闫��}Gr�M��X�������h�a�j42�;P�f�:()G�P�������|�����nͩ�\��k��3="�娄�f\�Y�A�Z�7�������#*tk�/+Wp�5t��rQo�pr�Q��=��jwg!�P� .�,%��2u��l�}nv�V��3(�6y9�����>��|Q/���������j�v�f���\��@�&�:s)Y<�W.V�y���?F�&��������U��ֈ�jr��H��0��G������n�R	 �(J���99	�Q�Q�t�e�g�����D����U��|vZ=��iǲ-긅��)��ە�x�e�	h-+l`���)^��!�*Y A^h"���цl
LY���G���uT_ѻ�A��;�ۭ�bL�gc��ֽA^�X���m�	�2;r�!�;~���S(�s!p��u�d5���!�Ws�� �q��~��՞��^�z�TZ���m*�kS<��g��;��	͌�CI7SB�u���|0�\�?�;��[�I����r��eD��2�=��ឯ֭��+��#f0/v-��zr���"N���|�ٍ8*��{����x}���	�k'۴�9���i[�.���{�\���&g���s:��j��.K�\��в]=��vToxC�~2����^w�˯���_�6{@�n}l�}~3����Kcȭ�k���"��4�!Ǟ
x��Z�;U�?�sn�ZH�����w�uY�5�I-��nw�k�ngs����\Ha4L�n,H��.9��l���Y:J&A��0ػ5,�G]>����^Ȑ���55�i{|�iP"�������b�:K�
��Vk(�E�VG����]��� �������М�m>�����|�t��I?�n�T��),��V�����ʗK5.EDӼ(�SHj�_(p�4/�{"���_��O?����E}u�C��H��nIu�����jY��`7��^d��\�l��
�-���=R�I�3�!�^�3M��Z[��P�y�C��i�9烢{�&��w��波C�U�����׽�!9|�Gc����I����&�5`N.F�k��>������X��Q=�����<Uy^-����^݆Q�M�-��!T�[�&g߆�Z5y�R15\�#��o���߿��g��/�[X     