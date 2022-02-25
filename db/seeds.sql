INSERT INTO department (name)
VALUES ('Product Development'), ('Marketing'), ('Human Resources') , ('Executives'), ('Customer Support');

INSERT INTO roles (title, salary, dept_id)
VALUES ('Project Owner', 95000, 1), 
('SVP of Product', 1750000, 1),
('Marketing Manager', 1730000, 2),
('Graphic Designer', 82500, 2), 
('Social Media Coordinator', 91000, 2),
('People Operations Manager', 105000, 3), 
('Recruiter', 80000, 3),
('President', 6000000, 4),
('CFO', 2500000, 4), 
('Director Customer Support', 106000, 5),
('Senior Support Engineer', 97500, 5);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Nolan', 'Dill', 1, 2),
('Rachel', 'Duke', 2, 8),
('Alan', 'Boggs', 3, null),
('Carolyn', 'Brungardt', 4, 3),
('Jack','Fulton', 6, null),
('Harriet','Booth', 7, 6),
('Pamela', 'Rios', 8, null),
('McKinley', 'Hildebrand', 9, null ),
('Emma','Richard',10, null),
('Dorian','Gray',11,10); 