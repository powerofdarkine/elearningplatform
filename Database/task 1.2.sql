/*
================================================================================
 INSERT DATA SCRIPT (UPDATED)
 - Resets all data.
 - Inserts data satisfying:
   + ≥ 15 Courses
   + 20 Instructors, 30 Students
   + 2 dual-role users (both student & instructor)
   + Each course: 1–3 lessons, 2 quizzes, 1 project
   + Each course: 0–2 reviews
   + Some students have payments, some don't
================================================================================
*/

USE elearning_db;

-- 1. WIPE AND RESET (CLEAN SLATE)
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Review_On;
TRUNCATE TABLE Paid_For;
TRUNCATE TABLE Method;
TRUNCATE TABLE Payment;
TRUNCATE TABLE Review;
TRUNCATE TABLE Receive;
TRUNCATE TABLE Study;
TRUNCATE TABLE Lesson_Resource;
TRUNCATE TABLE Lesson;
TRUNCATE TABLE Answer;
TRUNCATE TABLE Quiz_Question;
TRUNCATE TABLE Quiz;
TRUNCATE TABLE Project;
TRUNCATE TABLE Attempt_In;
TRUNCATE TABLE Assessment_Method;
TRUNCATE TABLE Aprrove;
TRUNCATE TABLE `Create`;
TRUNCATE TABLE Enroll;
TRUNCATE TABLE Prerequisites;
TRUNCATE TABLE Certificate;
TRUNCATE TABLE Language;
TRUNCATE TABLE Category;
TRUNCATE TABLE Course;
TRUNCATE TABLE Language_Of_Instruction;
TRUNCATE TABLE Administrator;
TRUNCATE TABLE End_user;
TRUNCATE TABLE Competition;
TRUNCATE TABLE Organize;
TRUNCATE TABLE Participate;

TRUNCATE TABLE User;

SET FOREIGN_KEY_CHECKS = 1;

/* ================================================================================
 PHASE 1: USERS AND ROLES
 - 5 Admin Users
 - 20 Instructors (IFlag = TRUE)
 - 30 Students (SFlag = TRUE)
 - 2 dual-role (SFlag = TRUE, IFlag = TRUE)
   => Total End_user = 48 rows
================================================================================
*/

INSERT INTO User (Name, Email, Street, City, Postal_Code) VALUES
-- Admins (1–5)
('Alice Johnson', 'alice.johnson@admin.com', '742 Madison Ave', 'New York', '10022'),
('Robert Miller', 'robert.miller@admin.com', '155 K Street NW', 'Washington D.C.', '20005'),
('Charles Smith', 'charles.smith@admin.com', '18 Baker Street', 'London', 'NW1 6XE'),
('Diana Carter', 'diana.carter@admin.com', '402 Kurfürstendamm', 'Berlin', '10719'),
('Ethan Brown', 'ethan.brown@admin.com', '55 Rue de Rivoli', 'Paris', '75001'),

-- Instructors (6–23)
('Michael Adams', 'michael.adams@faculty.edu', '112 Broadway', 'New York', '10007'),
('Laura Wilson', 'laura.wilson@faculty.edu', '784 King Street', 'Sydney', '2011'),
('Kevin Harris', 'kevin.harris@faculty.edu', '359 Yonge Street', 'Toronto', 'M5B 1S1'),
('Hannah Clark', 'hannah.clark@faculty.edu', '267 Friedrichstrasse', 'Berlin', '10969'),
('George Thompson', 'george.thompson@faculty.edu', '998 Oxford Street', 'London', 'W1D 2LT'),
('Rachel Lewis', 'rachel.lewis@faculty.edu', '673 14th Street NW', 'Washington D.C.', '20009'),
('Jonathan Hall', 'jonathan.hall@faculty.edu', '421 Fifth Avenue', 'New York', '10018'),
('Samantha Young', 'samantha.young@faculty.edu', '150 George Street', 'Sydney', '2000'),
('Christopher Allen', 'christopher.allen@faculty.edu', '890 Champs-Élysées', 'Paris', '75008'),
('Natalie Walker', 'natalie.walker@faculty.edu', '304 Queen Street', 'Toronto', 'M5H 2N2'),
('Andrew Scott', 'andrew.scott@faculty.edu', '529 Kuramae Dori', 'Tokyo', '110-0001'),
('Thomas Mitchell', 'thomas.mitchell@faculty.edu', '231 Tower Bridge Rd', 'London', 'SE1 2UP'),
('Megan Roberts', 'megan.roberts@faculty.edu', '742 Checkpoint Charlie St', 'Berlin', '10117'),
('Daniel Evans', 'daniel.evans@faculty.edu', '568 Itaewon-ro', 'Seoul', '04348'),
('Grace Turner', 'grace.turner@faculty.edu', '415 George Street', 'Sydney', '2000'),
('Patrick Collins', 'patrick.collins@faculty.edu', '921 Park Avenue', 'New York', '10028'),
('Eric Foster', 'eric.foster@faculty.edu', '633 Roppongi St', 'Tokyo', '106-0032'),
('Henry King', 'henry.king@faculty.edu', '341 Rue Saint-Honoré', 'Paris', '75001'),

-- Students (24–51)
('Mai Chung Tien', 'maichungtiengd@gmail.com', '325D Phan Van Tri', 'TP.HCM', '72313'),
('Benjamin Reed', 'benjamin.reed@student.com', '193 U Street NW', 'Washington D.C.', '20001'),
('Chloe Morgan', 'chloe.morgan@student.com', '875 Camden High Street', 'London', 'NW1 7JY'),
('David Wright', 'david.wright@student.com', '528 Torstrasse', 'Berlin', '10119'),
('Emily Rivera', 'emily.rivera@student.com', '312 Rue Lafayette', 'Paris', '75010'),
('Frank Simmons', 'frank.simmons@student.com', '959 Spadina Avenue', 'Toronto', 'M5S 2J9'),
('Grace Turner', 'grace.turner2@student.com', '447 George St', 'Sydney', '2000'),
('Hannah Cooper', 'hannah.cooper@student.com', '110 Kowloon Street', 'Tokyo', '160-0023'),
('Isabella Brooks', 'isabella.brooks@student.com', '621 Itaewon-gil', 'Seoul', '04348'),
('Jack Peterson', 'jack.peterson@student.com', '314 Madison Street', 'New York', '10002'),
('Karen Hughes', 'karen.hughes@student.com', '283 Swanston Street', 'Sydney', '3000'),
('Liam Powell', 'liam.powell@student.com', '772 College Street', 'Toronto', 'M6H 1A5'),
('Mia Russell', 'mia.russell@student.com', '406 Place de la République', 'Paris', '75003'),
('Noah Price', 'noah.price@student.com', '145 Baker Street', 'London', 'NW1 5RU'),
('Olivia Barnes', 'olivia.barnes@student.com', '933 Oranienburger Str', 'Berlin', '10178'),
('Parker Hayes', 'parker.hayes@student.com', '512 7th Street NW', 'Washington D.C.', '20004'),
('Quinn Murphy', 'quinn.murphy@student.com', '280 King Street West', 'Toronto', 'M5V 1J5'),
('Ryan Cooper', 'ryan.cooper@student.com', '861 Akasaka 1-chome', 'Tokyo', '107-0052'),
('Sophia Bell', 'sophia.bell@student.com', '377 Oxford Street', 'Sydney', '2021'),
('Taylor Ward', 'taylor.ward@student.com', '219 Rue Oberkampf', 'Paris', '75011'),
('Uriah Stone', 'uriah.stone@student.com', '744 Friedrichstraße', 'Berlin', '10969'),
('Victoria Scott', 'victoria.scott@student.com', '321 Carnaby Street', 'London', 'W1F 9PB'),
('William Hughes', 'william.hughes@student.com', '590 6th Avenue', 'New York', '10011'),
('Xavier Reed', 'xavier.reed@student.com', '858 Itaewon-ro 27', 'Seoul', '04350'),
('Yvonne Palmer', 'yvonne.palmer@student.com', '474 Shibuya Crossing', 'Tokyo', '150-0002'),
('Zachary Hill', 'zachary.hill@student.com', '128 Hunter Street', 'Sydney', '2000'),
('Brandon Cole', 'brandon.cole@student.com', '693 Avenue de Clichy', 'Paris', '75017'),
('Carter Gray', 'carter.gray@student.com', '317 Karl-Marx-Allee', 'Berlin', '10178'),

-- Dual-role users (Instructor + Student)
('Jacob Stevens', 'jacob.stevens@hybrid.com', '100 Yonge Street', 'Toronto', 'M5C 2W1'),
('Olivia Turner', 'olivia.turner@hybrid.com', '255 Charing Cross Road', 'London', 'WC2H 0EW');


-- 2. ADMINISTRATORS (5 Admins: User IDs 1–5)
INSERT INTO Administrator (Admin_ID, Role) VALUES
(1, 'SuperAdmin'),
(2, 'ContentAdmin'),
(3, 'BillingAdmin'),
(4, 'SupportAdmin'),
(5, 'ReviewerAdmin');

-- 3. END_USERS (48 rows: IDs 6–53)
-- Instructors only: End_userID 6–23
INSERT INTO End_user (End_userID, SFlag, Background, IFlag, Specialization) VALUES
(6,  FALSE, NULL, TRUE, 'Computer Science'),
(7,  FALSE, NULL, TRUE, 'Data Science'),
(8,  FALSE, NULL, TRUE, 'Mathematics'),
(9,  FALSE, NULL, TRUE, 'Physics'),
(10, FALSE, NULL, TRUE, 'History'),
(11, FALSE, NULL, TRUE, 'Biology'),
(12, FALSE, NULL, TRUE, 'Chemistry'),
(13, FALSE, NULL, TRUE, 'Statistics'),
(14, FALSE, NULL, TRUE, 'Machine Learning'),
(15, FALSE, NULL, TRUE, 'Deep Learning'),
(16, FALSE, NULL, TRUE, 'Web Development'),
(17, FALSE, NULL, TRUE, 'Mobile Development'),
(18, FALSE, NULL, TRUE, 'Cloud Computing'),
(19, FALSE, NULL, TRUE, 'DevOps'),
(20, FALSE, NULL, TRUE, 'Cybersecurity'),
(21, FALSE, NULL, TRUE, 'UI/UX'),
(22, FALSE, NULL, TRUE, 'Databases'),
(23, FALSE, NULL, TRUE, 'Software Engineering'),

-- Students only: End_userID 24–51
(24, TRUE, 'High School', FALSE, NULL),
(25, TRUE, 'Undergraduate', FALSE, NULL),
(26, TRUE, 'Undergraduate', FALSE, NULL),
(27, TRUE, 'Undergraduate', FALSE, NULL),
(28, TRUE, 'Undergraduate', FALSE, NULL),
(29, TRUE, 'Masters', FALSE, NULL),
(30, TRUE, 'Masters', FALSE, NULL),
(31, TRUE, 'Masters', FALSE, NULL),
(32, TRUE, 'PhD Student', FALSE, NULL),
(33, TRUE, 'PhD Student', FALSE, NULL),
(34, TRUE, 'Working Professional', FALSE, NULL),
(35, TRUE, 'Working Professional', FALSE, NULL),
(36, TRUE, 'Working Professional', FALSE, NULL),
(37, TRUE, 'Hobbyist', FALSE, NULL),
(38, TRUE, 'Hobbyist', FALSE, NULL),
(39, TRUE, 'Hobbyist', FALSE, NULL),
(40, TRUE, 'College Freshman', FALSE, NULL),
(41, TRUE, 'College Sophomore', FALSE, NULL),
(42, TRUE, 'College Junior', FALSE, NULL),
(43, TRUE, 'College Senior', FALSE, NULL),
(44, TRUE, 'Bootcamp Grad', FALSE, NULL),
(45, TRUE, 'Self-taught', FALSE, NULL),
(46, TRUE, 'Self-taught', FALSE, NULL),
(47, TRUE, 'Self-taught', FALSE, NULL),
(48, TRUE, 'Certificate Seeker', FALSE, NULL),
(49, TRUE, 'Career Switcher', FALSE, NULL),
(50, TRUE, 'Career Switcher', FALSE, NULL),
(51, TRUE, 'Career Switcher', FALSE, NULL);

-- Dual-role: End_userID 52–53
-- (52, TRUE, 'Dual Background 1', TRUE, 'Dual Specialization 1'),
-- (53, TRUE, 'Dual Background 2', TRUE, 'Dual Specialization 2');

-- 4. LANGUAGE_OF_INSTRUCTION (each instructor at least 1 language)
INSERT INTO Language_Of_Instruction (ID, Alanguage) VALUES
(6, 'English'),
(7, 'English'),
(8, 'French'),
(9, 'Spanish'),
(10, 'German'),
(11, 'English'),
(12, 'English'),
(13, 'Spanish'),
(14, 'French'),
(15, 'Spanish'),
(16, 'German'),
(17, 'English'),
(18, 'English'),
(19, 'German'),
(20, 'French'),
(21, 'Spanish'),
(22, 'German'),
(23, 'French');
-- (52, 'English'),
-- (53, 'Vietnamese');

/* ================================================================================
 PHASE 2: COURSES AND METADATA
 - 15 Courses
 - Category & Language per course
================================================================================
*/

-- 5. COURSES (15 Rows)
INSERT INTO Course (courseName, Description, Difficulty_Level, Price) VALUES
( 'Intro to SQL',               'Database basics',                 'Beginner',     49.99 ),
( 'Advanced SQL',               'Advanced SQL queries',            'Intermediate', 79.99 ),
( 'Intro to Python',            'Python fundamentals',             'Beginner',     59.99 ),
( 'Advanced Python',            'OOP and advanced features',       'Advanced',     89.99 ),
( 'Web Design Basics',          'HTML & CSS basics',               'Beginner',     39.99 ),
( 'Responsive Web Design',      'Modern responsive layouts',       'Intermediate', 69.99 ),
( 'Calculus 101',               'Introductory calculus',           'Beginner',     59.99 ),
( 'Linear Algebra',             'Vectors and matrices',            'Intermediate', 79.99 ),
( 'World History',              'History overview',                'Beginner',     29.99 ),
( 'Modern History',             '20th century focus',              'Intermediate', 39.99 ),
( 'Machine Learning Basics',    'Intro ML concepts',               'Advanced',     99.99 ),
( 'Advanced Machine Learning',  'Deep ML topics',                  'Advanced',    119.99 ),
( 'Data Visualization',         'Communicating data with charts',  'Intermediate', 89.99 ),
( 'Cloud Computing',            'Intro to cloud services',         'Intermediate',109.99 ),
( 'Data Engineering 101',       'Data pipelines and ETL',          'Advanced',    129.99 );

-- 6. CATEGORY (1 per Course)
INSERT INTO Category (CourseID, ACategory) VALUES
(1,  'Database'),
(2,  'Database'),
(3,  'Programming'),
(4,  'Programming'),
(5,  'Web'),
(6,  'Web'),
(7,  'Math'),
(8,  'Math'),
(9,  'History'),
(10, 'History'),
(11, 'Data Science'),
(12, 'Data Science'),
(13, 'Data Science'),
(14, 'Cloud'),
(15, 'Data Science');

-- 7. LANGUAGE (1 per Course)
INSERT INTO Language (CourseID, ALanguage) VALUES
(1, 'English'), (1, 'French'),
(2, 'English'), (2, 'French'),
(3, 'French'), (3, 'Spanish'),
(4, 'French'), (4, 'Spanish'),
(5, 'Spanish'),
(6, 'Spanish'),
(7, 'English'), (7, 'Chinese'),
(8, 'Chinese'), (8, 'English'),
(9, 'German'),
(10, 'English'),
(11, 'English'),
(12, 'English'),
(13, 'Spanish'),
(14, 'Chinese'),
(15, 'French');


-- 8. PREREQUISITES (một số ví dụ)
INSERT INTO Prerequisites (PrecourseID, SubcourseID) VALUES
(1,  2),   -- Intro SQL → Advanced SQL
(3,  4),   -- Intro Python → Advanced Python
(7, 11),   -- Calculus 101 → Machine Learning Basics
(8, 11),   -- Linear Algebra → Machine Learning Basics
(11, 12);  -- ML Basics → Advanced ML


-- 9. CREATE (Instructor -> Course) 1 instructor per course
-- Use instructors 6–20, dates spread from 2023 to now
INSERT INTO `Create` (CourseID, InstructorID, Creation_Date) VALUES
(1,  6, '2023-06-10'),
(2,  7,  '2024-02-15'),
(3,  8,  '2023-11-05'),
(4,  9,  '2025-01-20'),
(5,  10, '2025-04-02'),
(6,  11, '2025-07-18'),
(7,  12, '2023-10-01'),
(8,  13, '2023-01-12'),
(9,  14, '2024-03-28'),
(10, 15, '2023-05-09'),
(11, 16, '2025-06-21'),
(12, 17, '2025-07-03'),
(13, 18, '2025-09-14'),
(14, 19, '2023-10-26'),
(15, 20, '2023-11-30');


-- 10. APPROVE (Admin -> Course) 1 admin per course
-- 10. APPROVE (Admin -> Course) 
-- Courses with prerequisites MUST be approved: 2, 4, 11, 12

INSERT INTO Aprrove (CourseID, AdminID, Status) VALUES
(1,  1, 'Approved'),   
(2,  2, 'Approved'),    
(3,  3, 'Approved'),  
(4,  4, 'Approved'),   
(5,  5, 'Pending'),   
(6,  1, 'Approved'),   
(7,  2, 'Approved'),  
(8,  3, 'Approved'),   
(9,  4, 'Approved'),   
(10, 5, 'Approved'),
(11, 1, 'Approved'),   
(12, 2, 'Approved'),    
(13, 3, 'Approved'),    
(14, 4, 'Rejected'),   
(15, 5, 'Approved');   


/* ================================================================================
 PHASE 3: LESSONS & RESOURCES
 - Each course: 1–3 lessons
================================================================================
*/

-- 11. LESSONS (23 lessons, 1–3 per course)
-- (LessonID auto, nhưng mapping logic như đã tính)
-- 11. LESSONS (23 lessons, 1–3 per course)
-- Lesson titles are now meaningful and tied to each course

INSERT INTO Lesson (LessonTitle, CourseID) VALUES
-- Course 1: Intro to SQL
('SQL Basics: Tables & Rows',                    1),
('SQL Queries: SELECT & WHERE',                 1),
('SQL Joins & Aggregations',                    1),
-- Course 2: Advanced SQL
('Advanced SQL: Subqueries & CTEs',             2),
('Advanced SQL: Indexes & Performance Tuning',  2),
('Advanced SQL: Stored Procedures & Triggers',  2),
-- Course 3: Intro to Python
('Python Basics: Syntax & Variables',           3),
('Control Flow & Loops in Python',              3),
('Working with Lists & Dictionaries',           3),
-- Course 4: Advanced Python
('Advanced Python: OOP & Classes',              4),
('Decorators, Generators & Context Managers',   4),
-- Course 5: Web Design Basics
('HTML Fundamentals: Structure & Tags',         5),
('CSS Basics: Selectors & Layout',              5),
-- Course 6: Responsive Web Design
('Responsive Design with Flexbox & Grid',       6),
-- Course 7: Calculus 101
('Limits, Derivatives & Basic Rules',           7),
-- Course 8: Linear Algebra
('Vectors, Matrices & Linear Transformations',  8),
-- Course 9: World History
('Ancient Civilizations Overview',              9),
-- Course 10: Modern History
('World Wars & the 20th Century',               10),
-- Course 11: Machine Learning Basics
('Supervised vs Unsupervised Learning',         11),
-- Course 12: Advanced Machine Learning
('Deep Neural Networks & Regularization',       12),
-- Course 13: Data Visualization
('Principles of Effective Data Visualization',  13),
-- Course 14: Cloud Computing
-- ('Cloud Service Models: IaaS, PaaS, SaaS',      14),
-- Course 15: Data Engineering 101
('Building Data Pipelines & ETL Basics',        15);

INSERT INTO Lesson_Resource (LessonID, ResourceID, Resource_Type, Storage_URL, FileName) VALUES
-- Course 1: Intro to SQL
(1,  1, 'video',    'http://cdn.example.com/sql_basics_intro',                 'sql_basics_intro.mp4'),
(2,  1, 'video',    'http://cdn.example.com/sql_select_where',                 'sql_select_where.mp4'),
(3,  1, 'video',    'http://cdn.example.com/sql_joins_aggregations',           'sql_joins_aggregations.mp4'),
-- Course 2: Advanced SQL
(4,  1, 'document', 'http://cdn.example.com/adv_sql_ctes_subqueries',          'adv_sql_ctes_subqueries.pdf'),
(5,  1, 'document', 'http://cdn.example.com/adv_sql_indexes_tuning',           'adv_sql_indexes_tuning.pdf'),
(6,  1, 'video',    'http://cdn.example.com/adv_sql_triggers_storedproc',      'adv_sql_triggers_storedproc.mp4'),
-- Course 3: Intro to Python
(7,  1, 'video',    'http://cdn.example.com/python_syntax_variables',           'python_syntax_variables.mp4'),
(8,  1, 'document', 'http://cdn.example.com/python_control_flow',               'python_control_flow.pdf'),
(9,  1, 'video',    'http://cdn.example.com/python_lists_dicts',                'python_lists_dicts.mp4'),
-- Course 4: Advanced Python
(10, 1, 'video',    'http://cdn.example.com/adv_python_oop',                    'adv_python_oop.mp4'),
(11, 1, 'document', 'http://cdn.example.com/adv_python_decorators',             'adv_python_decorators.pdf'),
-- Course 5: Web Design Basics
(12, 1, 'video',    'http://cdn.example.com/html_fundamentals',                 'html_fundamentals.mp4'),
(13, 1, 'document', 'http://cdn.example.com/css_basics_layout',                 'css_basics_layout.pdf'),
-- Course 6: Responsive Web Design
(14, 1, 'video',    'http://cdn.example.com/responsive_flexbox_grid',           'responsive_flexbox_grid.mp4'),
-- Course 7: Calculus 101
(15, 1, 'video',    'http://cdn.example.com/calculus_derivatives_intro',        'calculus_derivatives_intro.mp4'),
-- Course 8: Linear Algebra
(16, 1, 'video',    'http://cdn.example.com/linear_algebra_matrices',           'linear_algebra_matrices.mp4'),
-- Course 9: World History
(17, 1, 'video',    'http://cdn.example.com/ancient_civilizations_overview',    'ancient_civilizations_overview.mp4'),
-- Course 10: Modern History
(18, 1, 'video',    'http://cdn.example.com/20th_century_history',              '20th_century_history.mp4'),
-- Course 11: Machine Learning Basics
(19, 1, 'video',    'http://cdn.example.com/ml_supervised_unsupervised',        'ml_supervised_unsupervised.mp4'),
-- Course 12: Advanced Machine Learning
(20, 1, 'video',    'http://cdn.example.com/deep_learning_regularization',      'deep_learning_regularization.mp4'),
-- Course 13: Data Visualization
(21, 1, 'video',    'http://cdn.example.com/data_viz_principles',               'data_viz_principles.mp4'),
-- Course 14: Cloud Computing
-- (22, 1, 'video',    'http://cdn.example.com/cloud_service_models',              'cloud_service_models.mp4'),
-- Course 15: Data Engineering 101
(22, 1, 'video',    'http://cdn.example.com/etl_data_pipelines',                'etl_data_pipelines.mp4');

/* ================================================================================
 PHASE 4: ASSESSMENTS
 - Mỗi course: 2 quiz + 1 project
   => 15 * 3 = 45 Assessment_Method
   + 30 Quiz rows
   + 15 Project rows
================================================================================
*/

-- 13. ASSESSMENT_METHOD (45 rows: ID 1..45)
-- Pattern per course c:
--   Quiz1: ID=3c-2, Quiz2: ID=3c-1, Project: ID=3c
INSERT INTO Assessment_Method (AssessmentID, Weight_Ratio, Release_date, Due_date, CourseID) VALUES
-- Course 1 (created 2024-02-15)
(1,  0.30, '2023-06-10', '2025-06-10', 1),
(2,  0.50, '2023-06-10', '2025-04-15', 1),
(3,  0.20, '2023-06-10', '2025-05-20', 1),

-- Course 2 (created 2023-06-10)
(4,  0.30, '2024-02-15', '2025-02-15', 2),
(5,  0.30, '2024-02-15', '2025-02-15', 2),
(6,  0.40, '2024-02-15', '2025-02-15', 2),

-- Course 3 (created 2023-11-05)
(7,  0.20, '2023-11-05', '2025-11-05', 3),
(8,  0.20, '2023-11-05', '2025-11-05', 3),
(9,  0.60, '2023-11-05', '2025-11-05', 3),

-- Course 4 (created 2025-01-20)
(10, 0.10, '2025-02-01', '2025-12-15', 4),
(11, 0.10, '2025-02-01', '2025-12-15', 4),
(12, 0.80, '2025-02-01', '2025-12-20', 4),

-- Course 5 (created 2025-04-02)
(13, 0.40, '2025-04-20', '2025-12-05', 5),
(14, 0.40, '2025-04-20', '2025-12-05', 5),
(15, 0.20, '2025-04-20', '2025-12-10', 5),

-- Course 6 (created 2025-07-18)
(16, 0.30, '2025-08-01', '2025-12-15', 6),
(17, 0.30, '2025-08-01', '2025-12-15', 6),
(18, 0.40, '2025-08-01', '2025-12-20', 6),

-- Course 7 (created 2023-10-01)
(19, 0.20, '2023-10-15', '2025-12-30', 7),
(20, 0.20, '2023-10-15', '2025-12-30', 7),
(21, 0.60, '2023-10-15', '2025-12-30', 7),

-- Course 8 (created 2023-01-12)
(22, 0.20, '2023-02-01', '2025-02-15', 8),
(23, 0.10, '2023-02-01', '2025-03-15', 8),
(24, 0.70, '2023-02-01', '2025-04-20', 8),

-- Course 9 (created 2024-03-28)
(25, 0.20, '2024-04-10', '2025-04-25', 9),
(26, 0.20, '2024-04-10', '2025-05-25', 9),
(27, 0.60, '2024-04-10', '2025-06-30', 9),

-- Course 10 (created 2023-05-09)
(28, 0.10, '2023-05-20', '2025-06-05', 10),
(29, 0.10, '2023-05-20', '2025-07-05', 10),
(30, 0.80, '2023-05-20', '2025-08-10', 10),

-- Course 11 (created 2025-06-21)
(31, 0.20, '2025-07-05', '2025-12-20', 11),
(32, 0.20, '2025-07-05', '2025-12-20', 11),
(33, 0.60, '2025-07-05', '2025-12-30', 11),

-- Course 12 (created 2024-08-03)
(34, 0.20, '2025-07-20', '2025-12-30', 12),
(35, 0.30, '2025-07-20', '2025-12-30', 12),
(36, 0.50, '2025-07-20', '2025-12-30', 12),

-- Course 13 (created 2025-09-14)
(37, 0.20, '2025-10-01', '2025-12-15', 13),
(38, 0.20, '2025-10-01', '2025-12-15', 13),
(39, 0.60, '2025-10-01', '2025-12-20', 13),

-- Course 14 (created 2023-10-26)
-- (40, 0.20, '2023-11-05', '2023-11-20', 14),
-- (41, 0.30, '2023-12-05', '2023-12-20', 14),
-- (42, 0.50, '2024-01-05', '2024-01-25', 14),

-- Course 15 (created 2023-11-30)
(40, 0.30, '2023-12-10', '2023-12-25', 15),
(41, 0.10, '2024-01-10', '2024-01-25', 15),
(42, 0.60, '2024-02-10', '2024-03-01', 15);

-- 14. QUIZ (30 quizzes: AssessmentID = [1,2,4,5,7,8,...,43,44])
INSERT INTO Quiz (QuizID, Num_attempt, Passing_score, Time_limit) VALUES
(1,  1, 70.0, 50),
(2,  3, 70.0, 50),
(4,  3, 70.0, 60),
(5,  2, 70.0, 40),
(7,  1, 70.0, 70),
(8,  3, 70.0, 30),
(10, 1, 70.0, 80),
(11, 3, 70.0, 30),
(13, 1, 70.0, 40),
(14, 3, 70.0, 30),
(16, 1, 70.0, 30),
(17, 1, 70.0, 30),
(19, 3, 70.0, 30),
(20, 3, 70.0, 30),
(22, 5, 70.0, 30),
(23, 3, 70.0, 30),
(25, 1, 70.0, 30),
(26, 1, 70.0, 50),
(28, 1, 70.0, 30),
(29, 3, 70.0, 30),
(31, 3, 70.0, 60),
(32, 2, 70.0, 30),
(34, 2, 70.0, 70),
(35, 3, 70.0, 40),
(37, 3, 70.0, 120),
(38, 3, 70.0, 90),
-- (40, 3, 70.0, 60),
-- (41, 3, 70.0, 45),
(40, 3, 70.0, 30),
(41, 3, 70.0, 90);

-- 15. PROJECT (15 projects: AssessmentID = [3,6,9,...,45])
-- 15. PROJECT (15 projects: AssessmentID = [3,6,9,...,45])
INSERT INTO Project (ProjectID, Team_size, Description, Name) VALUES
-- Course 1: Intro to SQL
(3,  2, 'Design and query a small relational database using basic SQL.', 
    'Intro SQL: Mini Database Project'),
-- Course 2: Advanced SQL
(6,  2, 'Optimize complex queries and implement stored routines on a sample DB.', 
    'Advanced SQL: Query Optimization Project'),
-- Course 3: Intro to Python
(9,  2, 'Build a small console application using core Python syntax and data structures.', 
    'Intro Python: Console App Project'),
-- Course 4: Advanced Python
(12, 2, 'Develop an object-oriented Python application using classes and advanced features.', 
    'Advanced Python: OOP Application'),
-- Course 5: Web Design Basics
(15, 2, 'Create a static multi-page website using semantic HTML and basic CSS.', 
    'Web Design Basics: Static Website'),
-- Course 6: Responsive Web Design
(18, 2, 'Implement a fully responsive landing page using Flexbox and Grid.', 
    'Responsive Web: Landing Page'),
-- Course 7: Calculus 101
(21, 2, 'Apply differentiation and basic integration to solve real-world style problems.'   ,   'Calculus 101: Problem-Solving Project'),
-- Course 8: Linear Algebra
(24, 2, 'Use vectors and matrices to model and solve simple linear systems.', 
    'Linear Algebra: Matrix Modeling Project'),
-- Course 9: World History
(27, 2, 'Research and present a timeline of key events in world civilizations.', 
    'World History: Civilization Timeline'),
-- Course 10: Modern History
(30, 2, 'Analyze major 20th-century events and write a short historical report.', 
    'Modern History: 20th Century Report'),
-- Course 11: Machine Learning Basics
(33, 2, 'Train and evaluate a basic ML model on a small dataset.', 
    'ML Basics: Classification Project'),
-- Course 12: Advanced Machine Learning
(36, 2, 'Build and tune a deeper ML model, experimenting with regularization techniques.', 
    'Advanced ML: Model Tuning Project'),
-- Course 13: Data Visualization
(39, 2, 'Design clear and effective charts to communicate insights from a dataset.', 
    'Data Viz: Dashboard Project'),
-- Course 14: Cloud Computing
-- (42, 2, 'Deploy a simple application using a cloud service provider.', 
--     'Cloud Computing: Cloud Deployment Project'),
-- Course 15: Data Engineering 101
(42, 2, 'Design and implement a basic ETL pipeline from raw data to cleaned output.', 
    'Data Engineering 101: ETL Pipeline');

-- 16. QUIZ_QUESTION (ít nhất 1 câu hỏi cho 10 quiz đầu)
INSERT INTO Quiz_Question (QuizID, QuestionID, Question_Text, Type) VALUES
-- Course 1: Intro to SQL
(1, 1, 'What does SQL stand for?', 'mcq'),
(2, 1, 'Which SQL command is used to retrieve data from a table?', 'mcq'),
-- Course 2: Advanced SQL
(4, 1, 'Which keyword is used to optimize query performance with indexing?', 'mcq'),
(5, 1, 'What SQL clause is commonly used in window functions?', 'mcq'),
-- Course 3: Intro to Python
(7, 1, 'Which data type is used to store a sequence of items in Python?', 'mcq'),
(8, 1, 'What keyword defines a function in Python?', 'mcq'),
-- Course 4: Advanced Python
(10, 1, 'What is the purpose of Python decorators?', 'mcq'),
(11, 1, 'Which OOP principle allows a subclass to modify a superclass method?', 'mcq'),
-- Course 5: Web Design Basics
(13, 1, 'Which HTML tag is used to create a hyperlink?', 'mcq'),
(14, 1, 'What does CSS stand for?', 'mcq'),
-- Course 6: Responsive Web Design
(16, 1, 'Which CSS unit is best for responsive font sizing?', 'mcq'),
(17, 1, 'Which technique uses flexible grids and layouts?', 'mcq'),
-- Course 7: Calculus 101
(19, 1, 'What is the derivative of x²?', 'mcq'),
(20, 1, 'Which rule is used to differentiate composite functions?', 'mcq'),
-- Course 8: Linear Algebra
(22, 1, 'What is the determinant of a matrix used for?', 'mcq'),
(23, 1, 'Which operation combines two vectors into a scalar value?', 'mcq'),
-- Course 9: World History
(25, 1, 'Which civilization built the pyramids of Giza?', 'mcq'),
(26, 1, 'The Renaissance began in which country?', 'mcq'),
-- Course 10: Modern History
(28, 1, 'World War II ended in which year?', 'mcq'),
(29, 1, 'Who was the first President of the United States?', 'mcq'),
-- Course 11: Machine Learning Basics
(31, 1, 'Which algorithm is used for classification tasks?', 'mcq'),
(32, 1, 'What is the purpose of a training dataset?', 'mcq'),
-- Course 12: Advanced Machine Learning
(34, 1, 'Which technique helps prevent overfitting?', 'mcq'),
(35, 1, 'What does the term “gradient descent” refer to?', 'mcq'),
-- Course 13: Data Visualization
(37, 1, 'Which chart is best for showing proportions?', 'mcq'),
(38, 1, 'What does a scatter plot visualize?', 'mcq'),
-- Course 14: Cloud Computing
-- (40, 1, 'What does IaaS stand for?', 'mcq'),
-- (41, 1, 'Which service model handles both infrastructure and runtime?', 'mcq'),
-- Course 15: Data Engineering 101
(40, 1, 'What does ETL stand for?', 'mcq'),
(41, 1, 'Which system is commonly used for distributed data storage?', 'mcq');
-- 17. ANSWER (2 đáp án mỗi câu hỏi ở trên)
INSERT INTO Answer (QuizID, QuestionID, AAnswer) VALUES
-- Quiz 1 (Intro to SQL – What does SQL stand for?)
(1,1,'Structured Query Language'),
(1,1,'System Query Logic'),
(1,1,'Sequential Query Layer'),
(1,1,'Standard Quality Language'),

-- Quiz 2 (Intro to SQL – Retrieve data command?)
(2,1,'SELECT'),
(2,1,'FETCH'),
(2,1,'GET'),
(2,1,'PULL'),

-- Quiz 4 (Advanced SQL – Index optimization)
(4,1,'CREATE INDEX'),
(4,1,'MAKE INDEX'),
(4,1,'FORM INDEX'),
(4,1,'INIT INDEX'),

-- Quiz 5 (Advanced SQL – Window function clause)
(5,1,'OVER'),
(5,1,'WITH'),
(5,1,'USING'),
(5,1,'GROUP'),

-- Quiz 7 (Intro to Python – Sequence type)
(7,1,'List'),
(7,1,'Integer'),
(7,1,'Boolean'),
(7,1,'Class'),

-- Quiz 8 (Intro to Python – Define function)
(8,1,'def'),
(8,1,'func'),
(8,1,'lambda'),
(8,1,'function'),

-- Quiz 10 (Advanced Python – Decorators)
(10,1,'Modify function behavior'),
(10,1,'Create new variables'),
(10,1,'Delete modules'),
(10,1,'Optimize loops'),

-- Quiz 11 (Advanced Python – OOP principle)
(11,1,'Polymorphism'),
(11,1,'Encapsulation'),
(11,1,'Abstraction'),
(11,1,'Sequencing'),

-- Quiz 13 (Web Design Basics – Hyperlink tag)
(13,1,'<a>'),
(13,1,'<link>'),
(13,1,'<href>'),
(13,1,'<url>'),

-- Quiz 14 (Web Design Basics – CSS meaning)
(14,1,'Cascading Style Sheets'),
(14,1,'Creative Style Syntax'),
(14,1,'Color Styling System'),
(14,1,'Custom Style Structure'),

-- Quiz 16 (Responsive Web – Best font unit)
(16,1,'rem'),
(16,1,'px'),
(16,1,'pt'),
(16,1,'inch'),

-- Quiz 17 (Responsive Web – Technique)
(17,1,'Flexible grids'),
(17,1,'Static layouts'),
(17,1,'Fixed columns'),
(17,1,'Image mapping'),

-- Quiz 19 (Calculus – derivative of x²)
(19,1,'2x'),
(19,1,'x'),
(19,1,'x²'),
(19,1,'1'),

-- Quiz 20 (Calculus – composite function rule)
(20,1,'Chain rule'),
(20,1,'Product rule'),
(20,1,'Sum rule'),
(20,1,'Modulo rule'),

-- Quiz 22 (Linear Algebra – determinant)
(22,1,'Check matrix invertibility'),
(22,1,'Compute vector length'),
(22,1,'Measure angle between rows'),
(22,1,'Create linear combinations'),

-- Quiz 23 (Linear Algebra – scalar result)
(23,1,'Dot product'),
(23,1,'Cross product'),
(23,1,'Matrix addition'),
(23,1,'Vector concatenation'),

-- Quiz 25 (World History – pyramids of Giza)
(25,1,'Egyptians'),
(25,1,'Romans'),
(25,1,'Chinese'),
(25,1,'Persians'),

-- Quiz 26 (World History – Renaissance origin)
(26,1,'Italy'),
(26,1,'France'),
(26,1,'Germany'),
(26,1,'Spain'),

-- Quiz 28 (Modern History – WWII end year)
(28,1,'1945'),
(28,1,'1940'),
(28,1,'1939'),
(28,1,'1950'),

-- Quiz 29 (Modern History – First US president)
(29,1,'George Washington'),
(29,1,'Abraham Lincoln'),
(29,1,'Thomas Jefferson'),
(29,1,'John Adams'),

-- Quiz 31 (ML Basics – classification algorithm)
(31,1,'Logistic Regression'),
(31,1,'K-Means'),
(31,1,'DBSCAN'),
(31,1,'Apriori'),

-- Quiz 32 (ML Basics – training dataset)
(32,1,'Used to fit model parameters'),
(32,1,'Used only for visualization'),
(32,1,'Used to deploy the model'),
(32,1,'Used for hardware testing'),

-- Quiz 34 (Advanced ML – prevent overfitting)
(34,1,'Regularization'),
(34,1,'Amplification'),
(34,1,'Accumulation'),
(34,1,'Distribution'),

-- Quiz 35 (Advanced ML – gradient descent)
(35,1,'Optimization method'),
(35,1,'Data compression'),
(35,1,'Clustering technique'),
(35,1,'Visualization process'),

-- Quiz 37 (Data Visualization – proportions)
(37,1,'Pie chart'),
(37,1,'Line chart'),
(37,1,'Scatter plot'),
(37,1,'Histogram'),

-- Quiz 38 (Data Visualization – scatter plot)
(38,1,'Relationship between two variables'),
(38,1,'Distribution of categories'),
(38,1,'Ranking of values'),
(38,1,'Proportional areas');

-- Quiz 40 (Cloud Computing – IaaS)
-- (40,1,'Infrastructure as a Service'),
-- (40,1,'Integration as a System'),
-- (40,1,'Instance allocation as storage'),
-- (40,1,'Internet as a Solution'),

-- Quiz 41 (Cloud Computing – handles runtime)
-- (41,1,'PaaS'),
-- (41,1,'SaaS'),
-- (41,1,'IaaS'),
-- (41,1,'FaaS'),

-- Quiz 43 (Data Engineering – ETL)
-- (43,1,'Extract Transform Load'),
-- (43,1,'Encode Transfer Link'),
-- (43,1,'Extend Test Loop'),
-- (43,1,'Export Table List'),

-- Quiz 44 (Data Engineering – distributed storage)
-- (44,1,'Hadoop HDFS'),
-- (44,1,'Redis Cache'),
-- (44,1,'SQLite'),
-- (44,1,'Excel Sheet');

/* ================================================================================
 PHASE 5: STUDENT ACTIVITY
 - 30 students (End_userID 24–53) đăng ký các khóa học
================================================================================
*/
-- 18. ENROLL (mỗi student đăng ký 2 course)
INSERT INTO Enroll (StudentID, CourseID, Enrollment_Date) VALUES
    (24, 10, '2023-05-14'), 
    (24, 15, '2024-11-05'),

    (25, 1,  '2024-02-28'),  
 
	(26, 1, '2023-06-15' ),
    (26, 2,  '2024-02-20'), 
   

    (27, 13, '2025-09-19'), 
    (27, 3,  '2023-11-10'),

    (28, 9,  '2024-04-02'),  
    (28, 10, '2023-05-14'),

    (29, 15, '2023-12-05'),  
    (29, 7,  '2023-10-06'),

    (30, 1,  '2024-02-20'), 
    (30, 2,  '2025-03-19'),
    (30, 6,  '2025-07-23'),

    (31, 1,  '2023-06-15'), 
    (31, 3,  '2023-11-10'),

    (32, 3,  '2023-11-10'),  
    (32, 4,  '2025-01-25'),

    (33, 3,  '2025-01-25'), 
    (33, 7, '2025-06-26'),

    (34, 1,  '2024-02-20'),
    (34, 2,  '2025-06-15'),
	(34, 7, '2024-06-26'),
	(34, 8, '2024-06-26'),
	(34, 11, '2025-06-22'),
	(34, 12, '2025-07-6'),
    
    (35, 6,  '2025-08-15'),
    (35, 3,  '2023-11-10'),

    (36, 3,  '2023-11-10'),
    (36, 4,  '2025-01-25'),

    (37, 6,  '2025-07-23'),

    (38, 6,  '2025-07-23'),
    (38, 7,  '2023-10-06'),

    (39, 7,  '2023-10-06'),
    (39, 8,  '2023-01-17'),

    (40, 8,  '2023-01-17'),
    (40, 9,  '2024-04-02'),

    (41, 9,  '2024-04-02'),
    (41, 10, '2023-05-14'),

    (42, 10, '2023-05-14'),

    (44, 13, '2025-09-19'),

    (45, 13, '2025-09-19'),
    (45, 15, '2023-12-05'),

    (46, 15, '2023-12-05'),
    (46, 1,  '2024-02-20'),

    (47, 1,  '2024-02-20'),

    (48, 3,  '2023-11-10'),

    (49, 3,  '2023-11-10'),

    (50, 3,  '2023-11-10'),
    (50, 4,  '2025-01-25'),
    (50, 6,  '2025-07-23'),

    (51, 6,  '2025-07-23'),
    (51, 7,  '2023-10-06');


INSERT INTO Study (LessonID, StudentID) VALUES
-- Student 24 enrolled in courses 10 and 15 → dùng course 10 (Modern History)
(18, 24),
(22,24),
-- Student 25 enrolled in courses 1 and 11 → dùng course 1 (Intro to SQL)
(1, 25),
-- Student 26 enrolled in courses 2 and 1 → dùng course 2 (Advanced SQL)
(1, 26),
(2, 26),
(3, 26),
(4, 26),
-- Student 27 enrolled in courses 13 and 3 → dùng course 13 (Data Visualization)
(21, 27),
-- Student 28 enrolled in courses 9 and 10 → dùng course 9 (World History)
(17, 28),
-- Student 29 enrolled in courses 15 and 7 → dùng course 15 (Data Engineering 101)
-- (23, 29),
-- Student 30 enrolled in courses 1 and 6 → dùng course 1
(1, 30),
(2, 30),
(3, 30),

(1, 31),
-- Student 32 enrolled in courses 3 and 4 → dùng course 3 (Intro to Python)
(7, 32),
(8, 32),
(9, 32),
-- Student 33 enrolled in courses 4 and 11 → dùng course 4 (Advanced Python)
(7, 33),
-- Student 34 enrolled in courses 1 and 2 → dùng course 1
(1, 34),
(2, 34),
(3, 34),
(15, 34),
(16, 34),
(19, 34),


-- Student 35 enrolled in courses 2 and 3 → dùng course 2
(7, 35),
-- Student 36 enrolled in courses 3 and 4 → dùng course 3
(7, 36),
(8, 36),
(9, 36),

-- Student 37 enrolled in courses 4 and 6 → dùng course 4
(14, 37),
-- Student 38 enrolled in courses 6 and 7 → dùng course 6 (Responsive Web)
(14, 38),
-- Student 39 enrolled in courses 7 and 8 → dùng course 7 (Calculus 101)
(15, 39),
-- Student 40 enrolled in courses 8 and 9 → dùng course 8 (Linear Algebra)
(16, 40),
-- Student 41 enrolled in courses 9 and 10 → dùng course 9
(17, 41),
-- Student 42 enrolled in courses 10 and 11 → dùng course 10
(18, 42),
-- Student 44 enrolled in courses 12 and 13 → dùng course 12 (Advanced ML)
(21, 44),
-- Student 45 enrolled in courses 13 and 15 → dùng course 13
(21, 45),
-- Student 46 enrolled in courses 15 and 1 → dùng course 15
-- (23, 46),
-- Student 47 enrolled in courses 1 and 2 → dùng course 1
(1, 47),
-- Student 48 enrolled in courses 2 and 3 → dùng course 2
(7, 48),
-- Student 49 enrolled in courses 3 and 4 → dùng course 3
(7, 49),
-- Student 50 enrolled in courses 4 and 6 → dùng course 4
(7, 50),
(8, 50),
(9, 50),
(10, 50),
-- Student 51 enrolled in courses 6 and 7 → dùng course 6
(14, 51);


INSERT INTO Attempt_In (StudentID, AssessmentID, Score, Feedback, Attempt_Date) VALUES

(26, 1, 5.5,  'Good',               '2024-08-25'),
(26, 2, 7.0,  'Good',               '2024-08-25'),
(26, 3, 7.5,  'Good',               '2024-09-25'),
(30, 1,  7.0,  'Good',               '2024-03-06'),
(30, 2,  8.5,  'Execellent',               '2024-03-06'),
(30,3, 4, 'Need more revision','2024-05-06'),
(32, 7,  8.5,  'Excellent',          '2023-11-25'),
(32, 8,  9,  'Excellent',          '2023-11-25'),
(32, 9,  8.5,  'Excellent',          '2023-12-26'),
(35, 7, 3.0,  'Need more revision', '2024-04-25'),
(37, 16, 6.0,  'Good',               '2025-10-20'),
(50, 10, 2.0,  'Need more revision', '2025-04-15');
-- (24,28,10,'Excellent','2024-04-25'),
-- (24,29,7,'Good','2024-04-25'),
-- (24,30,8,'Excellent','2024-05-25'),
-- (24,40,8,'Excellent','2024-10-25'),
-- (24,41,5,'Good','2024-10-25'),
-- (24,42,6,'Good','2024-11-25');

/* ================================================================================
 PHASE 6: FINANCIALS, REVIEWS, CERTIFICATES
================================================================================
*/

INSERT INTO Payment (PaymentID, StudentID, Amount) VALUES
-- (Student, Course) from Study, Amount = Course.Price

-- 24 studies course 10 (Modern History – 39.99)
(1,  24, 39.99),
(2, 24, 129.99),
(3,25,49.99),
(4,26,49.99),
(5,26,79.99),
(6,27,89.99),
(7,28,29.99),
(8,30,49.99),
(9,31,49.99),
(10,32,59.99),
(11,33,49.99),
(12,34,49.99),
(13,34,59.99),
(14,34,79.99),
(15,34,99.99),
(16,35,59.99),
(17,36,59.99),
(18,37,69.99),
(19,38,69.99),
(20,39,59.99),
(21,40,79.99),
(22,41,99.99),
(23,42,39.99),
(24,44,89.99),
(25,45,89.99),
(26,47,49.99),
(27,48,59.99),
(28,49,59.99),
(29,50,59.99),
(30,50,89.99),
(31,51,69.99);


-- 24. REVIEW (mỗi course 0–2 review, tổng 23 reviews)
INSERT INTO Review (ReviewID, StudentID, Description, Rating) VALUES
-- Course 1 (2 reviews)
(1,  24, 'Clear explanations and easy to follow.', 4),
(2,  25, 'Good intro but could use more examples.', 4),
-- Course 2 (2 reviews)
(3,  30, 'Some sections were too hard for beginners.', 3),
(4,  31, 'Great depth, well structured.', 4),
-- Course 3 (2 reviews)
(5,  34, 'Excellent course, learned a lot!', 5),
(6,  35, 'Could improve pacing, a bit fast.', 3),
-- Course 4 (2 reviews)
(7,  40, 'Very well taught, clear concepts.', 5),
(8,  41, 'Great instructor and good exercises.', 5),
-- Course 5 (2 reviews)
(9,  50, 'Basic but helpful for beginners.', 3),
(10, 51, 'Loved the design principles taught.', 5);
INSERT INTO Method (PaymentID, StudentID, Amethod) VALUES
(1,  24, 'Credit Card'),
(2,  24, 'Bank Transfer'),
(3,  25, 'E-Wallet'),
(4,  26, 'Credit Card'),
(5,  26, 'Bank Transfer'),
(6,  27, 'Credit Card'),
(7,  28, 'E-Wallet'),
(8,  30, 'Credit Card'),
(9,  31, 'Bank Transfer'),
(10, 32, 'Credit Card'),
(11, 33, 'E-Wallet'),
(12, 34, 'Bank Transfer'),
(13, 34, 'Credit Card'),
(14, 34, 'E-Wallet'),
(15, 34, 'Bank Transfer'),
(16, 35, 'Credit Card'),
(17, 36, 'E-Wallet'),
(18, 37, 'Credit Card'),
(19, 38, 'Bank Transfer'),
(20, 39, 'E-Wallet'),
(21, 40, 'Credit Card'),
(22, 41, 'Bank Transfer'),
(23, 42, 'Credit Card'),
(24, 44, 'E-Wallet'),
(25, 45, 'Bank Transfer'),
(26, 47, 'Credit Card'),
(27, 48, 'E-Wallet'),
(28, 49, 'Bank Transfer'),
(29, 50, 'E-Wallet'),
(30, 50, 'E-Wallet'),
(31, 51, 'E-Wallet');
INSERT INTO Paid_For (PaymentID, StudentID, CourseID) VALUES
(1,  24, 10),
(2, 24, 15),
(3,25, 1),
(4,26, 1),
(5,26,2),
(6,27,13),
(7,28,9),
(8,30,1),
(9,31,1),
(10,32,3),
(11,33,3),
(12,34,1),
(13,34,7),
(14,34,8),
(15,34,11),
(16,35,3),
(17,36,3),
(18,37,6),
(19,38,6),
(20,39,7),
(21,40,8),
(22,41,9),
(23,42,10),
(24,44,13),
(25,45,13),
(26,47,1),
(27,48,3),
(28,49,3),
(29,50,3),
(30,50,4),
(31,51,6);

-- 25. REVIEW_ON (mapping Review -> Course)
INSERT INTO Review_On (ReviewID, StudentID, CourseID) VALUES
-- Course 1 (2 reviews)
(1,  24,15),
(2,  25, 1),
-- Course 2 (2 reviews)
(3,  30,1),
(4,  31, 1),
-- Course 3 (2 reviews)
(5,  34, 11),
(6,  35, 3),
-- Course 4 (2 reviews)
(7,  40, 8),
(8,  41, 9),
-- Course 5 (2 reviews)
(9,  50, 3),
(10, 51,6);

-- 26. CERTIFICATE (10 certificates cho một số học sinh)
INSERT INTO Certificate (Cer_ID, Cer_Name, Issue_Date, CourseID) VALUES
(1,  'Modern History Graduation Certificate',
     '2023-05-20', 10),
(2,  'Intro to SQL Graduation Certificate',
     '2024-08-25', 1),
(3,  'Intro to SQL Graduation Certificate',
     '2023-12-11', 1),
(4,  'Advanced SQL Graduation Certificate',
     '2024-06-20', 2),
(5,  'Data Visualization Graduation Certificate',
     '2025-10-28', 13),

-- (5,  'Data Engineering 101 Graduation Certificate',
--      '2023-12-12', 15),
(6,  'Intro to SQL Graduation Certificate',
     '2024-6-01', 1),
(7,  'Intro to Python Graduation Certificate',
     '2023-11-20', 3),
(8,  'Intro to SQL Graduation Certificate',
     '2024-08-25', 1),
(9,  'Calculus 101 Graduation Certificate',
     '2024-08-25', 7),
(10,  'Linear Algebra Graduation Certificate',
     '2024-08-25', 8),
(11,  'Machine Learning Basics Graduation Certificate',
     '2025-09-26', 11),
(12,  'Intro to Python Graduation Certificate',
     '2023-12-20', 3),
(13,  'Intro to Python Graduation Certificate',
     '2023-1-1', 3);
-- 27. RECEIVE (Certificate -> Student subset)
INSERT INTO Receive (Cer_ID, StudentID) VALUES
(1,  24),
(2,  25),
(3 , 26),
(4,  26),
(5,  27),
(6 , 30),
(7,  32),
(8,34),
(9,34),
(10,34),
(11,34),
(12,36),
(13,50);

INSERT INTO Competition (Name, Description, Start_date, End_date) VALUES
('AI Hackathon 2025',
 '48-hour hackathon focusing on building AI-powered educational tools.',
 '2025-03-15', '2025-03-17'),

('Data Challenge 2024',
 'Data analysis and visualization challenge on real-world datasets.',
 '2024-10-01', '2024-10-03'),

('Web Dev Sprint',
 'Frontend and backend sprint to build a complete web application.',
 '2025-01-10', '2025-01-12'),

('ML Cup 2025',
 'Machine learning competition with multiple benchmark tasks.',
 '2025-06-05', '2025-06-07'),

('Cloud Innovation Jam',
 'Challenge to deploy scalable services on cloud platforms.',
 '2024-11-20', '2024-11-22');
 
 INSERT INTO Organize (AdminID, CompetitionName) VALUES
-- AI Hackathon 2025 organized by Admin 1 & 2
(1, 'AI Hackathon 2025'),
(2, 'AI Hackathon 2025'),

-- Data Challenge 2024 organized by Admin 2 & 3
(2, 'Data Challenge 2024'),
(3, 'Data Challenge 2024'),

-- Web Dev Sprint organized by Admin 3 & 4
(3, 'Web Dev Sprint'),
(4, 'Web Dev Sprint'),

-- ML Cup 2025 organized by Admin 4
(4, 'ML Cup 2025'),

-- Cloud Innovation Jam organized by Admin 5
(5, 'Cloud Innovation Jam');

INSERT INTO Participate (StudentID, CompetitionName) VALUES
-- AI Hackathon 2025
(24, 'AI Hackathon 2025'),
(25, 'AI Hackathon 2025'),
(26, 'AI Hackathon 2025'),

-- Data Challenge 2024
(24, 'Data Challenge 2024'),
(28, 'Data Challenge 2024'),
(29, 'Data Challenge 2024'),

-- Web Dev Sprint
(30, 'Web Dev Sprint'),
(31, 'Web Dev Sprint'),

-- ML Cup 2025
(31, 'ML Cup 2025'),
(33, 'ML Cup 2025'),

-- Cloud Innovation Jam
(34, 'Cloud Innovation Jam'),
(35, 'Cloud Innovation Jam');


-- Add the missing column that handles the Fee
ALTER TABLE End_user
ADD COLUMN Total_Amount_Due DECIMAL(10, 2) DEFAULT 0.00;
