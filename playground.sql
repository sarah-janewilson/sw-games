\c nc_games_test

INSERT INTO comments (review_id, author, body) VALUES (1, 'mallionaire', 'Lovely game') RETURNING *;