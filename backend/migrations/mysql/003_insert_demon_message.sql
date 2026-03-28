-- Insert a demon message into the contacts table
INSERT INTO contacts (id, first_name, last_name, name, email, subject, message, status)
VALUES (UUID(), 'Demon', 'Message', 'Demon Message', 'demon@hell.com', 'Summoning', 'This is a demon message from the abyss!', 'new');
