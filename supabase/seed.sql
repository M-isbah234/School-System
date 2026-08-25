-- ============================================================
-- SCHOOL ERP — COMPLETE SEED DATA (15 Students, 3 Classes, 7 Teachers)
-- Run AFTER schema.sql in the Supabase SQL Editor
-- Default Passwords:
--   Admin   → Admin@123
--   Teacher → Teacher@123
--   Student → Student@123
-- ============================================================

DO $$
DECLARE
  -- Admin
  admin_id UUID := '00000000-0000-0000-0000-000000000001';

  -- 7 Teachers
  t_tariq  UUID := '00000000-0000-0000-0000-000000000011';
  t_salman UUID := '00000000-0000-0000-0000-000000000012';
  t_ayesha UUID := '00000000-0000-0000-0000-000000000013';
  t_kamran UUID := '00000000-0000-0000-0000-000000000014';
  t_sana   UUID := '00000000-0000-0000-0000-000000000015';
  t_owais  UUID := '00000000-0000-0000-0000-000000000016';
  t_hira   UUID := '00000000-0000-0000-0000-000000000017';

  -- 15 Students (5 per class across 3 classes: 8-A, 9-A, 10-A)
  -- Class 8-A
  s_ahmed   UUID := '00000000-0000-0000-0000-000000000021';
  s_sara    UUID := '00000000-0000-0000-0000-000000000022';
  s_bilal   UUID := '00000000-0000-0000-0000-000000000023';
  s_zainab  UUID := '00000000-0000-0000-0000-000000000024';
  s_usman   UUID := '00000000-0000-0000-0000-000000000025';

  -- Class 9-A
  s_zara    UUID := '00000000-0000-0000-0000-000000000026';
  s_hamza   UUID := '00000000-0000-0000-0000-000000000027';
  s_ayesha  UUID := '00000000-0000-0000-0000-000000000028';
  s_danyal  UUID := '00000000-0000-0000-0000-000000000029';
  s_emaan   UUID := '00000000-0000-0000-0000-000000000030';

  -- Class 10-A
  s_faisal  UUID := '00000000-0000-0000-0000-000000000031';
  s_hania   UUID := '00000000-0000-0000-0000-000000000032';
  s_ibrahim UUID := '00000000-0000-0000-0000-000000000033';
  s_mahnoor UUID := '00000000-0000-0000-0000-000000000034';
  s_saad    UUID := '00000000-0000-0000-0000-000000000035';

BEGIN

-- ── 1. AUTH USERS ───────────────────────────────────────────
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES
  (admin_id, 'authenticated', 'authenticated', 'admin@school.edu.pk',        crypt('Admin@123',   gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  
  -- 7 Teachers
  (t_tariq,  'authenticated', 'authenticated', 'tariq.m@school.edu.pk',      crypt('Teacher@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (t_salman, 'authenticated', 'authenticated', 'salman.f@school.edu.pk',     crypt('Teacher@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (t_ayesha, 'authenticated', 'authenticated', 'ayesha.s@school.edu.pk',     crypt('Teacher@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (t_kamran, 'authenticated', 'authenticated', 'kamran.b@school.edu.pk',     crypt('Teacher@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (t_sana,   'authenticated', 'authenticated', 'sana.m@school.edu.pk',       crypt('Teacher@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (t_owais,  'authenticated', 'authenticated', 'owais.r@school.edu.pk',      crypt('Teacher@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (t_hira,   'authenticated', 'authenticated', 'hira.n@school.edu.pk',       crypt('Teacher@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),

  -- 15 Students
  (s_ahmed,  'authenticated', 'authenticated', 'ahmed.raza@school.edu.pk',   crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_sara,   'authenticated', 'authenticated', 'sara.fatima@school.edu.pk',  crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_bilal,  'authenticated', 'authenticated', 'bilal.m@school.edu.pk',      crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_zainab, 'authenticated', 'authenticated', 'zainab.a@school.edu.pk',     crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_usman,  'authenticated', 'authenticated', 'usman.g@school.edu.pk',      crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_zara,   'authenticated', 'authenticated', 'zara.malik@school.edu.pk',   crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_hamza,  'authenticated', 'authenticated', 'hamza.sheikh@school.edu.pk', crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_ayesha, 'authenticated', 'authenticated', 'ayesha.o@school.edu.pk',     crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_danyal, 'authenticated', 'authenticated', 'danyal.h@school.edu.pk',     crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_emaan,  'authenticated', 'authenticated', 'emaan.m@school.edu.pk',      crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_faisal, 'authenticated', 'authenticated', 'faisal.q@school.edu.pk',     crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_hania,  'authenticated', 'authenticated', 'hania.a@school.edu.pk',      crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_ibrahim,'authenticated', 'authenticated', 'ibrahim.k@school.edu.pk',    crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_mahnoor,'authenticated', 'authenticated', 'mahnoor.t@school.edu.pk',    crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', ''),
  (s_saad,   'authenticated', 'authenticated', 'saad.r@school.edu.pk',       crypt('Student@123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', FALSE, '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ── 2. PROFILES ─────────────────────────────────────────────
INSERT INTO profiles (id, role, name, email, phone, status, join_date) VALUES
  (admin_id, 'admin',   'System Admin',        'admin@school.edu.pk',        '+92-21-0000000',  'active',    '2015-01-01'),

  -- 7 Teachers
  (t_tariq,  'teacher', 'Mr. Tariq Mehmood',   'tariq.m@school.edu.pk',      '+92-300-1122334', 'active',    '2018-08-01'),
  (t_salman, 'teacher', 'Mr. Salman Farooq',   'salman.f@school.edu.pk',     '+92-321-2233445', 'active',    '2019-08-15'),
  (t_ayesha, 'teacher', 'Ms. Ayesha Siddiqui', 'ayesha.s@school.edu.pk',     '+92-333-3344556', 'active',    '2017-09-01'),
  (t_kamran, 'teacher', 'Mr. Kamran Baig',     'kamran.b@school.edu.pk',     '+92-345-4455667', 'active',    '2020-08-01'),
  (t_sana,   'teacher', 'Ms. Sana Mirza',      'sana.m@school.edu.pk',       '+92-311-5566778', 'active',    '2021-08-20'),
  (t_owais,  'teacher', 'Mr. Owais Raza',      'owais.r@school.edu.pk',      '+92-322-6677889', 'active',    '2022-01-10'),
  (t_hira,   'teacher', 'Ms. Hira Noor',       'hira.n@school.edu.pk',       '+92-334-7788990', 'active',    '2022-09-01'),

  -- 15 Students
  -- 8-A
  (s_ahmed,  'student', 'Ahmed Raza Khan',     'ahmed.raza@school.edu.pk',   '+92-321-4567890', 'active',    '2022-04-01'),
  (s_sara,   'student', 'Sara Fatima',         'sara.fatima@school.edu.pk',  '+92-300-2345678', 'active',    '2023-03-15'),
  (s_bilal,  'student', 'Muhammad Bilal',      'bilal.m@school.edu.pk',      '+92-333-3456789', 'active',    '2021-04-01'),
  (s_zainab, 'student', 'Zainab Abid',         'zainab.a@school.edu.pk',     '+92-345-1122334', 'active',    '2023-04-01'),
  (s_usman,  'student', 'Usman Ghani',         'usman.g@school.edu.pk',      '+92-312-2233445', 'active',    '2022-04-01'),

  -- 9-A
  (s_zara,   'student', 'Zara Malik',          'zara.malik@school.edu.pk',   '+92-345-4567891', 'active',    '2023-04-10'),
  (s_hamza,  'student', 'Hamza Sheikh',        'hamza.sheikh@school.edu.pk', '+92-311-5678902', 'active',    '2020-04-01'),
  (s_ayesha, 'student', 'Ayesha Omer',         'ayesha.o@school.edu.pk',     '+92-323-3344556', 'active',    '2022-04-01'),
  (s_danyal, 'student', 'Danyal Hassan',       'danyal.h@school.edu.pk',     '+92-301-4455667', 'active',    '2021-04-01'),
  (s_emaan,  'student', 'Emaan Mustafa',       'emaan.m@school.edu.pk',      '+92-335-5566778', 'active',    '2023-04-01'),

  -- 10-A
  (s_faisal, 'student', 'Faisal Qureshi',      'faisal.q@school.edu.pk',     '+92-302-6677889', 'active',    '2020-04-01'),
  (s_hania,  'student', 'Hania Aamir',         'hania.a@school.edu.pk',      '+92-346-7788990', 'active',    '2021-04-01'),
  (s_ibrahim,'student', 'Ibrahim Khalid',      'ibrahim.k@school.edu.pk',    '+92-313-8899001', 'active',    '2020-04-01'),
  (s_mahnoor,'student', 'Mahnoor Tariq',       'mahnoor.t@school.edu.pk',    '+92-324-9900112', 'active',    '2022-04-01'),
  (s_saad,   'student', 'Saad Rizvi',          'saad.r@school.edu.pk',       '+92-303-1011121', 'active',    '2021-04-01')
ON CONFLICT (id) DO NOTHING;

-- ── 3. CLASSES ───────────────────────────────────────────────
INSERT INTO classes (name, grade, section, campus) VALUES
  ('8-A',  8,  'A', 'Gulshan Campus'),
  ('9-A',  9,  'A', 'Gulshan Campus'),
  ('10-A', 10, 'A', 'Gulshan Campus')
ON CONFLICT (name) DO NOTHING;

-- ── 4. STUDENTS ──────────────────────────────────────────────
INSERT INTO students (id, roll_no, class_name, section, campus, father_name, mother_name, emergency_contact, address, blood_group, date_of_birth, admission_date) VALUES
  -- Class 8-A
  (s_ahmed,  'SP-2026-0001', '8-A',  'A', 'Gulshan Campus', 'Muhammad Raza Khan', 'Fatima Khan',   '+92-300-1234567', 'House 14-B, Block 5, Gulshan-e-Iqbal', 'B+',  '2012-08-15', '2022-04-01'),
  (s_sara,   'SP-2026-0002', '8-A',  'A', 'Gulshan Campus', 'Ali Fatima',         'Sana Ali',      '+92-300-2345679', 'House 22, Street 3, PECHS',           'A+',  '2012-03-20', '2023-03-15'),
  (s_bilal,  'SP-2026-0003', '8-A',  'A', 'Gulshan Campus', 'Naeem Hassan',       'Rubina Hassan', '+92-300-3456780', 'Flat 5B, Block 12, North Nazimabad',  'O+',  '2012-06-10', '2021-04-01'),
  (s_zainab, 'SP-2026-0004', '8-A',  'A', 'Gulshan Campus', 'Abid Ali',           'Shagufta Abid', '+92-300-4567891', 'House 88, Block 3, KDA Scheme 1',     'AB+', '2012-11-12', '2023-04-01'),
  (s_usman,  'SP-2026-0005', '8-A',  'A', 'Gulshan Campus', 'Ghani Ur Rehman',    'Zubaida Ghani', '+92-300-5678902', 'House 12, Sector 11-B, North Karachi', 'B-',  '2012-01-05', '2022-04-01'),

  -- Class 9-A
  (s_zara,   'SP-2026-0006', '9-A',  'A', 'Gulshan Campus', 'Asif Malik',         'Nadia Malik',   '+92-300-6789013', 'House 8, Block B, Clifton',            'AB+', '2011-01-25', '2023-04-10'),
  (s_hamza,  'SP-2026-0007', '9-A',  'A', 'Gulshan Campus', 'Tariq Sheikh',       'Amina Sheikh',  '+92-300-7890124', 'House 3, DHA Phase 4',                 'O-',  '2011-11-05', '2020-04-01'),
  (s_ayesha, 'SP-2026-0008', '9-A',  'A', 'Gulshan Campus', 'Omer Farooq',        'Samina Omer',   '+92-300-8901235', 'Flat 402, Royal Apartments, Bahadurabad','A-',  '2011-05-18', '2022-04-01'),
  (s_danyal, 'SP-2026-0009', '9-A',  'A', 'Gulshan Campus', 'Hassan Mahmood',     'Fareeda Hassan','+92-300-9012346', 'House 45-C, Model Colony',            'B+',  '2011-09-30', '2021-04-01'),
  (s_emaan,  'SP-2026-0010', '9-A',  'A', 'Gulshan Campus', 'Mustafa Kamal',      'Sadia Mustafa', '+92-300-0123457', 'House 101, Block 7, Gulshan-e-Iqbal',  'O+',  '2011-02-14', '2023-04-01'),

  -- Class 10-A
  (s_faisal, 'SP-2026-0011', '10-A', 'A', 'Gulshan Campus', 'Kamran Qureshi',     'Nargis Qureshi','+92-300-1234568', 'House 77, Navy Housing Society',      'A+',  '2010-04-12', '2020-04-01'),
  (s_hania,  'SP-2026-0012', '10-A', 'A', 'Gulshan Campus', 'Aamir Hussain',      'Bushra Aamir',  '+92-300-2345670', 'Flat 12, Al-Azhar Garden',            'B+',  '2010-10-08', '2021-04-01'),
  (s_ibrahim,'SP-2026-0013', '10-A', 'A', 'Gulshan Campus', 'Khalid Masood',      'Tahira Khalid', '+92-300-3456781', 'House 23, Askari 4, Karachi',          'O+',  '2010-07-22', '2020-04-01'),
  (s_mahnoor,'SP-2026-0014', '10-A', 'A', 'Gulshan Campus', 'Tariq Jameel',       'Shaheen Tariq', '+92-300-4567892', 'House 55, Defense Phase 2',            'AB-', '2010-12-01', '2022-04-01'),
  (s_saad,   'SP-2026-0015', '10-A', 'A', 'Gulshan Campus', 'Asad Rizvi',         'Huma Rizvi',    '+92-300-5678903', 'House 90, Block 13-D, Gulshan',        'A+',  '2010-03-29', '2021-04-01')
ON CONFLICT (id) DO NOTHING;

-- ── 5. TEACHERS ──────────────────────────────────────────────
INSERT INTO teachers (id, employee_id, department, subjects, classes) VALUES
  (t_tariq,  'TCH-001', 'Science',        ARRAY['Mathematics'],         ARRAY['8-A', '9-A']),
  (t_salman, 'TCH-002', 'Science',        ARRAY['Physics'],             ARRAY['9-A', '10-A']),
  (t_ayesha, 'TCH-003', 'Languages',      ARRAY['English'],             ARRAY['8-A', '10-A']),
  (t_kamran, 'TCH-004', 'Languages',      ARRAY['Urdu'],                ARRAY['8-A', '9-A', '10-A']),
  (t_sana,   'TCH-005', 'Science',        ARRAY['Chemistry'],           ARRAY['9-A', '10-A']),
  (t_owais,  'TCH-006', 'Computer',       ARRAY['Computer Science'],    ARRAY['8-A', '9-A', '10-A']),
  (t_hira,   'TCH-007', 'Social Studies', ARRAY['Pakistan Studies'],    ARRAY['8-A', '9-A'])
ON CONFLICT (id) DO NOTHING;

-- ── 6. NOTICES ───────────────────────────────────────────────
INSERT INTO notices (title, content, date, category, status, author_id, author_name) VALUES
  ('Summer Break Schedule', 'School will remain closed for summer vacation from June 15 to July 31.', '2026-06-01', 'holiday', 'approved', admin_id, 'Admin'),
  ('Parent Teacher Meeting', 'PTM for Term 1 results will be held on Saturday from 9 AM to 1 PM.',     '2026-06-05', 'urgent',  'approved', admin_id, 'Admin'),
  ('Annual Sports Gala',     'Registration for inter-house sports competitions is now open.',          '2026-06-08', 'event',   'approved', admin_id, 'Admin')
ON CONFLICT DO NOTHING;

END $$;
