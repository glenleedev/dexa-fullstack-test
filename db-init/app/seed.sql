INSERT INTO role (name, description) VALUES
('admin', 'Allows access to admin and attendance web'),
('employee', 'Allows access to attendance web');

-- all password here = password, bcrypt hash
INSERT INTO user (username, password, role_id) VALUES
('admin@dexagroup.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 1),
('glen@dexagroup.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user1@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user2@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user3@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user4@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user5@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user6@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user7@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user8@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user9@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2),
('user10@test.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2);

INSERT INTO position (name) VALUES
('HR Admin'),
('IT Developer'),
('IT Support'),
('Accounting Staff'),
('Marketing Staff'),
('Office Administrator');

INSERT INTO employee (user_id, email, first_name, last_name, position_id, phone, photo) VALUES
(1, 'admin@dexagroup.com', 'Admin', 'HR', 1, '628123456789', NULL),
(2, 'glen@dexagroup.com', 'Glen', '', 2, '628987654321', NULL),
(3, 'user1@test.com', 'Alice', 'Tan', 3, '628111000001', NULL),
(4, 'user2@test.com', 'Budi', 'Santoso', 4, '628111000002', NULL),
(5, 'user3@test.com', 'Citra', 'Wijaya', 5, '628111000003', NULL),
(6, 'user4@test.com', 'Daniel', 'Kusuma', 6, '628111000004', NULL),
(7, 'user5@test.com', 'Eka', 'Putri', 2, '628111000005', NULL),
(8, 'user6@test.com', 'Farhan', 'Akbar', 5, '628111000006', NULL),
(9, 'user7@test.com', 'Gita', 'Pratiwi', 6, '628111000007', NULL),
(10, 'user8@test.com', 'Hari', 'Saputra', 2, '628111000008', NULL),
(11, 'user9@test.com', 'Indra', 'Syah', 4, '628111000009', NULL),
(12, 'user10@test.com', 'Joko', 'Wibowo', 3, '628111000010', NULL);

INSERT INTO attendance_status (name) VALUES
('masuk'),
('pulang');

INSERT INTO attendance (employee_id, status_id, attendance_dttm) VALUES
(2, 1, '2025-09-02 08:01:00'),
(2, 2, '2025-09-02 17:05:00'),
(2, 1, '2025-09-03 08:03:00'),
(2, 2, '2025-09-03 17:00:00'),
(2, 1, '2025-09-04 08:02:00'),
(2, 2, '2025-09-04 16:58:00'),
(2, 1, '2025-09-05 08:04:00'),
(2, 2, '2025-09-05 17:10:00'),
(2, 1, '2025-09-08 08:00:00'),
(2, 2, '2025-09-08 17:01:00'),
(2, 1, '2025-09-09 08:05:00'),
(2, 2, '2025-09-09 17:15:00');
