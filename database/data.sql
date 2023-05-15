INSERT into "users"
  ("firstName", "lastName", "password", "userName", "email")
  VALUES
    ('John', 'Smith', '$argon2id$v=19$m=4096,t=3,p=1$zQnczDr6CF1lqZfgYPdY6w$1Sev6ZBgsVFmWOBYqkRFiM0vrqYHK+AOebkzhRAvu6o', 'Demo', 'example@email.com');

INSERT into "budgets"
  ("userId")
  VALUES
    (1);

INSERT into "records"
  ("userId", "month", "year", "day", "source", "isDebit", "numberOfItems", "totalSpent")
  VALUES
    (1, 4, 2023, 15, 'Albertsons', true, 3, 45.67),
    (1, 4, 2023, 13, 'Costco', true, 5, 75.33),
    (1, 4, 2023, 8, 'Ralphs', true, 6, 80.77),
    (1, 4, 2023, 7, 'Ikea', true, 1, 35.25),
    (1, 4, 2023, 7, 'Robibhood', false, 2, 33.23),
    (1, 4, 2023, 4, 'Circle K', true, 1, 45.60),
    (1, 4, 2023, 3, 'Olive Garden', true, 4, 67.32),
    (1, 4, 2023, 1, 'Albertsons', true, 5, 60.78),
    (1, 4, 2023, 1, 'Regal', true, 3, 54.21),
    (1, 3, 2023, 29, 'Target', true, 2, 36.78),
    (1, 3, 2023, 27, 'Ralphs', true, 1, 13.24),
    (1, 3, 2023, 27, 'Work', false, 1, 890.87),
    (1, 3, 2023, 21, 'Costco', true, 7, 155.87),
    (1, 3, 2023, 20, 'Verizon', true, 1, 67.87),
    (1, 3, 2023, 15, 'Costco', true, 2, 35.23),
    (1, 3, 2023, 12, 'Old Navy', true, 3, 38.23),
    (1, 3, 2023, 6, 'Work', false, 1, 856.21),
    (1, 3, 2023, 5, 'Albertsons', true, 4, 42.43),
    (1, 3, 2023, 1, 'Irvine Company', true, 2, 780.21),
    (1, 4, 2023, 8, 'Work', false, 1, 876.42);

INSERT into "items"
  ("recordId", "category", "amount", "itemName")
  VALUES
    (1, 'food', 14.32, 'vegatables'),
    (1, 'food', 8.76, 'fruit'),
    (1, 'food', 17.24, 'meat'),
    (2, 'food', 5, 'rotisserie chicken'),
    (2, 'toiletries', 12.32, 'paper towel'),
    (2, 'food', 25.46, 'frozen pizza'),
    (2, 'food', 13.42, 'pop'),
    (2, 'food', 7.89, 'eggs'),
    (3, 'toiletries', 4.56, 'kleenex'),
    (3, 'cleaning', 7.43, 'laundry detergent'),
    (3, 'food', 5.89, 'milk'),
    (3, 'food', 11.32, 'chicken'),
    (3, 'food', 4.46, 'butter'),
    (3, 'food', 7.49, 'bread'),
    (4, 'furniture', 28.20, 'chair'),
    (5, 'interest', 7.21, 'rh interest'),
    (5, 'dividends', 26.02, 'psec divi'),
    (6, 'car', 45.60, 'gas'),
    (7, 'fastFood', 14.32, 'pasta'),
    (7, 'fastFood', 15.78, 'shrimp'),
    (7, 'fastFood', 4.89, 'soft drink'),
    (7, 'food', 11.98, 'wine'),
    (8, 'food', 7.89, 'milk'),
    (8, 'food', 9, 'eggs'),
    (8, 'food', 14.32, 'bacon'),
    (8, 'cleaning', 8.43, 'dish soap'),
    (8, 'food', 7.89, 'noodles'),
    (9, 'entertainment', 16.32, 'ticket'),
    (9, 'entertainment', 16.32, 'ticket'),
    (9, 'food', 11.22, 'popcorn'),
    (10, 'otherOut', 21.42, 'coffe machine'),
    (10, 'food', 11.67, 'coffee'),
    (11, 'fastFood', 10.98, 'sandwhich'),
    (12, 'salary', 890, 'paycheck'),
    (13, 'toiletries', 16.82, 'shampoo'),
    (13, 'food', 26.76, 'steak'),
    (13, 'food', 31.23, 'stuffed salmon'),
    (13, 'food', 12, 'muffins'),
    (13, 'car', 56.74, 'tire'),
    (13, 'food', 8, 'eggs'),
    (13, 'cleaning', 14.87, 'swiffer'),
    (14, 'utilities', 67, 'celluar'),
    (15, 'clothes', 23.45, 'sweater'),
    (15, 'fastFood', 11.45, 'pizza'),
    (16, 'clothes', 13.45, 'shirt'),
    (16, 'clothes', 21.75, 'jeans'),
    (16, 'clothes', 2.45, 'socks'),
    (17, 'salary', 850, 'paycheck'),
    (18, 'food', 7.80, 'milk'),
    (18, 'food', 7.80, 'chili'),
    (18, 'food', 15, 'fruit'),
    (18, 'food', 5.67, 'cereal'),
    (19, 'rent', 600, 'Rent'),
    (19, 'utilities', 150, 'electric'),
    (20, 'salary', 870, 'paycheck');
