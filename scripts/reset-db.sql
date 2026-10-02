-- Veritabanı Sıfırlama Script'i
-- ⚠️ DİKKAT: Bu script TÜM VERİLERİ SİLER!

-- Veritabanına bağlan
\c etkinlik_platform

-- Tabloları sil (CASCADE ile ilişkili veriler de silinir)
DROP TABLE IF EXISTS media_posts CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS events CASCADE;

\echo '⚠️  Tüm tablolar silindi!'
\echo ''
\echo '📝 Tabloları yeniden oluşturmak için:'
\echo '   npm run db:setup'
\echo ''
\echo '📊 Örnek veri eklemek için:'
\echo '   npm run db:seed'
