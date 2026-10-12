-- Give the admin account a known password for the demo: Admin@123
USE loanprediction;
UPDATE registration SET password='$2b$10$ra5c.vXq0yUl6RhjlQHYDO3NIUauZuIaN1SkmEa1O3UymJoUBqj92' WHERE email='admin@gmail.com';
