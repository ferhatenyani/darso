-- 0002_reference.sql
-- Seeded, read-only taxonomy. Bilingual labels mirror the frontend i18n keys.

-- ---------------------------------------------------------------------------
-- wilayas: Algeria's 48 administrative provinces. `code` matches the slugs in
-- src/lib/wilayas.ts (camelCase for multi-word names).
-- ---------------------------------------------------------------------------
create table public.wilayas (
  code       text primary key,
  number     smallint not null unique,   -- official 1..58 wilaya number
  name_fr    text not null,
  name_ar    text not null
);

-- ---------------------------------------------------------------------------
-- categories: the 8 top-level subject families. `key` matches CategoryKey in
-- src/lib/mock/categories.ts.
-- ---------------------------------------------------------------------------
create table public.categories (
  key        text primary key,
  name_fr    text not null,
  name_ar    text not null,
  sort_order smallint not null default 0
);

-- ---- RLS: public read, no writes (data owned by migrations) ---------------
alter table public.wilayas    enable row level security;
alter table public.categories enable row level security;

create policy "wilayas are readable by everyone"
  on public.wilayas for select using (true);

create policy "categories are readable by everyone"
  on public.categories for select using (true);

-- ---- Seed: categories -----------------------------------------------------
insert into public.categories (key, name_fr, name_ar, sort_order) values
  ('school',    'Scolaire',            'الدراسة',          1),
  ('languages', 'Langues',             'اللغات',           2),
  ('code',      'Programmation',       'البرمجة',          3),
  ('design',    'Design',              'التصميم',          4),
  ('business',  'Business',            'الأعمال',          5),
  ('music',     'Musique',             'الموسيقى',         6),
  ('religion',  'Sciences religieuses','العلوم الشرعية',   7),
  ('exams',     'Examens & concours',  'الامتحانات والمسابقات', 8);

-- ---- Seed: wilayas (58 provinces, official numbering) ----------------------
insert into public.wilayas (number, code, name_fr, name_ar) values
  (1,'adrar','Adrar','أدرار'),
  (2,'chlef','Chlef','الشلف'),
  (3,'laghouat','Laghouat','الأغواط'),
  (4,'oumElBouaghi','Oum El Bouaghi','أم البواقي'),
  (5,'batna','Batna','باتنة'),
  (6,'bejaia','Béjaïa','بجاية'),
  (7,'biskra','Biskra','بسكرة'),
  (8,'bechar','Béchar','بشار'),
  (9,'blida','Blida','البليدة'),
  (10,'bouira','Bouira','البويرة'),
  (11,'tamanrasset','Tamanrasset','تمنراست'),
  (12,'tebessa','Tébessa','تبسة'),
  (13,'tlemcen','Tlemcen','تلمسان'),
  (14,'tiaret','Tiaret','تيارت'),
  (15,'tiziOuzou','Tizi Ouzou','تيزي وزو'),
  (16,'alger','Alger','الجزائر'),
  (17,'djelfa','Djelfa','الجلفة'),
  (18,'jijel','Jijel','جيجل'),
  (19,'setif','Sétif','سطيف'),
  (20,'saida','Saïda','سعيدة'),
  (21,'skikda','Skikda','سكيكدة'),
  (22,'sidiBelAbbes','Sidi Bel Abbès','سيدي بلعباس'),
  (23,'annaba','Annaba','عنابة'),
  (24,'guelma','Guelma','قالمة'),
  (25,'constantine','Constantine','قسنطينة'),
  (26,'medea','Médéa','المدية'),
  (27,'mostaganem','Mostaganem','مستغانم'),
  (28,'msila','M''Sila','المسيلة'),
  (29,'mascara','Mascara','معسكر'),
  (30,'ouargla','Ouargla','ورقلة'),
  (31,'oran','Oran','وهران'),
  (32,'elBayadh','El Bayadh','البيض'),
  (33,'illizi','Illizi','إليزي'),
  (34,'bordjBouArreridj','Bordj Bou Arréridj','برج بوعريريج'),
  (35,'boumerdes','Boumerdès','بومرداس'),
  (36,'elTarf','El Tarf','الطارف'),
  (37,'tindouf','Tindouf','تندوف'),
  (38,'tissemsilt','Tissemsilt','تيسمسيلت'),
  (39,'elOued','El Oued','الوادي'),
  (40,'khenchela','Khenchela','خنشلة'),
  (41,'soukAhras','Souk Ahras','سوق أهراس'),
  (42,'tipaza','Tipaza','تيبازة'),
  (43,'mila','Mila','ميلة'),
  (44,'ainDefla','Aïn Defla','عين الدفلى'),
  (45,'naama','Naâma','النعامة'),
  (46,'ainTemouchent','Aïn Témouchent','عين تموشنت'),
  (47,'ghardaia','Ghardaïa','غرداية'),
  (48,'relizane','Relizane','غليزان'),
  (49,'timimoun','Timimoun','تيميمون'),
  (50,'bordjBadjiMokhtar','Bordj Badji Mokhtar','برج باجي مختار'),
  (51,'ouledDjellal','Ouled Djellal','أولاد جلال'),
  (52,'beniAbbes','Béni Abbès','بني عباس'),
  (53,'inSalah','In Salah','عين صالح'),
  (54,'inGuezzam','In Guezzam','عين قزام'),
  (55,'touggourt','Touggourt','تقرت'),
  (56,'djanet','Djanet','جانت'),
  (57,'elMghair','El M''Ghair','المغير'),
  (58,'elMeniaa','El Meniaa','المنيعة');
