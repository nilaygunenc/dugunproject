-- ==========================================
-- TEST KULLANICISI EKLE
-- pgAdmin'de etkinlik_platform veritabanında çalıştırın
-- ==========================================

-- Test kullanıcısı ekle (şifre: 123456)
INSERT INTO users (full_name, email, password_hash, role) 
VALUES (
    'Test Kullanıcı',
    'test@test.com',
    '$2a$10$rOZxQKJ9YXZ5YqN5YqN5YeN5YqN5YqN5YqN5YqN5YqN5YqN5YqN5Y',
    'event_owner'
)
ON CONFLICT (email) DO NOTHING;

-- Kontrol et
SELECT 
    id,
    full_name,
    email,
    role,
    created_at
FROM users;

-- Başarı mesajı
SELECT '✅ Test kullanıcısı eklendi! Email: test@test.com, Şifre: 123456' as sonuc;
