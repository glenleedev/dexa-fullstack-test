INSERT INTO role (name, description) VALUES
('admin', 'Allows access to admin and attendance web'),
('employee', 'Allows access to attendance web');

-- Password example = password123, bcrypt hash
INSERT INTO user (email, password, role_id) VALUES
('admin@dexagroup.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8vZPzjTnQhP9Jw4rD2oI9x9RlhSyeK', 1),
('glen@dexagroup.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8vZPzjTnQhP9Jw4rD2oI9x9RlhSyeK', 2);

INSERT INTO position (name) VALUES
('HR Admin'),
('IT Developer');

INSERT INTO employee (user_id, first_name, last_name, position_id, phone, photo) VALUES
(1, 'Admin', 'HR', 1, '628123456789', NULL),
(2, 'Glen', '', 2, '628987654321', NULL);

INSERT INTO attendance_status (name) VALUES
('masuk'),
('pulang');
