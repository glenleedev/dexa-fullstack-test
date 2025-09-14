INSERT INTO role (name, description) VALUES
('admin', 'Allows access to admin and attendance web'),
('employee', 'Allows access to attendance web');

-- Password example = password, bcrypt hash
INSERT INTO user (username, password, role_id) VALUES
('admin@dexagroup.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 1),
('glen@dexagroup.com', '$2a$10$ZsZjmCHwEGqHQl5v/k95WOMrv1.sIJYw6.KtdroUuEduNiSGc3gzC', 2);

INSERT INTO position (name) VALUES
('HR Admin'),
('IT Developer');

INSERT INTO employee (user_id, email, first_name, last_name, position_id, phone, photo) VALUES
(1, 'admin@dexagroup.com', 'Admin', 'HR', 1, '628123456789', NULL),
(2, 'glen@dexagroup.com', 'Glen', '', 2, '628987654321', NULL);

INSERT INTO attendance_status (name) VALUES
('masuk'),
('pulang');
