-- 0️⃣ Optional: Clear previous data to avoid duplicates
TRUNCATE "ProductFits", "ProductSizes", product_images, products RESTART IDENTITY CASCADE;

-- 1️⃣ Insert Products
INSERT INTO products ("name","description","color","price","is_featured","is_new","gender","category_id","createdAt","updatedAt") VALUES
('Classic Blue Shirt', 'A timeless blue shirt for everyday wear','Blue',34.99, TRUE, TRUE, 'Men', 2, NOW(), NOW()),
('Summer Tee', 'Light and breathable t-shirt','White',19.99, TRUE, TRUE, 'Men', 3, NOW(), NOW()),
('Elegant Dress', 'Perfect for evening occasions','Red',59.99, TRUE, FALSE, 'Women', 11, NOW(), NOW()),
('Urban Hoodie', 'Stylish hoodie for cool days','Gray',44.99, FALSE, TRUE, 'Men', 10, NOW(), NOW()),
('Straight Jeans', 'Classic fit denim jeans','Dark Blue',49.99, TRUE, FALSE, 'Women', 5, NOW(), NOW()),
('Cozy Sweater', 'Warm and soft knit sweater','Green',39.99, FALSE, TRUE, 'Women', 9, NOW(), NOW()),
('Pleated Skirt', 'Fashionable pleated skirt','Pink',29.99, TRUE, TRUE, 'Women', 12, NOW(), NOW()),
('Rain Jacket', 'Waterproof rain jacket','Black',79.99, TRUE, TRUE, 'Men', 8, NOW(), NOW()),
('Casual Shorts', 'Comfortable everyday shorts','Beige',24.99, FALSE, TRUE, 'Men', 6, NOW(), NOW()),
('Graphic Tee', 'Cool graphic print t-shirt','Black',22.99, TRUE, TRUE, 'Men', 3, NOW(), NOW()),
('Floral Dress', 'Beautiful floral summer dress','Yellow',54.99, TRUE, FALSE, 'Women', 11, NOW(), NOW()),
('Zip Hoodie', 'Casual zip‑up hoodie','Navy',42.99, FALSE, TRUE, 'Men', 10, NOW(), NOW()),
('Slim Jeans', 'Modern slim denim jeans','Blue Black',52.99, TRUE, TRUE, 'Women', 5, NOW(), NOW()),
('Oversized Sweater', 'Chic oversized knit sweater','Maroon',46.99, TRUE, TRUE, 'Women', 9, NOW(), NOW()),
('Leather Jacket', 'Premium leather jacket','Brown',99.99, TRUE, FALSE, 'Men', 7, NOW(), NOW());

-- 2️⃣ Insert Product Sizes
INSERT INTO "ProductSizes" ("product_id","size_id","createdAt","updatedAt") VALUES
(1,2,NOW(),NOW()),(1,3,NOW(),NOW()),(2,3,NOW(),NOW()),(2,4,NOW(),NOW()),
(3,3,NOW(),NOW()),(3,4,NOW(),NOW()),(4,2,NOW(),NOW()),(4,3,NOW(),NOW()),
(5,3,NOW(),NOW()),(5,4,NOW(),NOW()),(6,2,NOW(),NOW()),(6,3,NOW(),NOW()),
(7,3,NOW(),NOW()),(7,4,NOW(),NOW()),(8,3,NOW(),NOW()),(8,4,NOW(),NOW()),
(9,2,NOW(),NOW()),(9,3,NOW(),NOW()),(10,3,NOW(),NOW()),(10,4,NOW(),NOW()),
(11,3,NOW(),NOW()),(11,4,NOW(),NOW()),(12,2,NOW(),NOW()),(12,3,NOW(),NOW()),
(13,3,NOW(),NOW()),(13,4,NOW(),NOW()),(14,3,NOW(),NOW()),(14,4,NOW(),NOW()),
(15,3,NOW(),NOW()),(15,4,NOW(),NOW());

-- 3️⃣ Insert Product Fits
INSERT INTO "ProductFits" ("product_id","fit_id","createdAt","updatedAt") VALUES
(1,2,NOW(),NOW()),(2,1,NOW(),NOW()),(3,2,NOW(),NOW()),(4,3,NOW(),NOW()),
(5,2,NOW(),NOW()),(6,3,NOW(),NOW()),(7,2,NOW(),NOW()),(8,1,NOW(),NOW()),
(9,2,NOW(),NOW()),(10,1,NOW(),NOW()),(11,2,NOW(),NOW()),(12,3,NOW(),NOW()),
(13,1,NOW(),NOW()),(14,2,NOW(),NOW()),(15,3,NOW(),NOW());

-- 4️⃣ Insert Product Images (Using image_url)
INSERT INTO product_images ("product_id","image_url","position","position_sequence","createdAt","updatedAt") VALUES
-- 1. Classic Blue Shirt
(1,'https://images.pexels.com/photos/447570/pexels-photo-447570.jpeg','front',1,NOW(),NOW()),
(1,'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg','back',2,NOW(),NOW()),
-- 2. Summer Tee
(2,'https://images.pexels.com/photos/4066288/pexels-photo-4066288.jpeg','front',1,NOW(),NOW()),
(2,'https://images.pexels.com/photos/4066290/pexels-photo-4066290.jpeg','back',2,NOW(),NOW()),
-- 3. Elegant Dress
(3,'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg','front',1,NOW(),NOW()),
(3,'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg','right',2,NOW(),NOW()),
-- 4. Urban Hoodie
(4,'https://images.pexels.com/photos/634785/pexels-photo-634785.jpeg','front',1,NOW(),NOW()),
(4,'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg','back',2,NOW(),NOW()),
-- 5. Straight Jeans
(5,'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg','front',1,NOW(),NOW()),
(5,'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg','back',2,NOW(),NOW()),
-- 6. Cozy Sweater
(6,'https://images.pexels.com/photos/5705490/pexels-photo-5705490.jpeg','front',1,NOW(),NOW()),
-- 7. Pleated Skirt
(7,'https://images.pexels.com/photos/1007018/pexels-photo-1007018.jpeg','front',1,NOW(),NOW()),
-- 8. Rain Jacket
(8,'https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg','front',1,NOW(),NOW()),
-- 9. Casual Shorts
(9,'https://images.pexels.com/photos/11012117/pexels-photo-11012117.jpeg','front',1,NOW(),NOW()),
-- 10. Graphic Tee
(10,'https://images.pexels.com/photos/15535316/pexels-photo-15535316.jpeg','front',1,NOW(),NOW()),
-- 11. Floral Dress
(11,'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg','front',1,NOW(),NOW()),
-- 12. Zip Hoodie
(12,'https://images.pexels.com/photos/702350/pexels-photo-702350.jpeg','front',1,NOW(),NOW()),
-- 13. Slim Jeans
(13,'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg','front',1,NOW(),NOW()),
-- 14. Oversized Sweater
(14,'https://images.pexels.com/photos/1035685/pexels-photo-1035685.jpeg','front',1,NOW(),NOW()),
-- 15. Leather Jacket
(15,'https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg','front',1,NOW(),NOW());
