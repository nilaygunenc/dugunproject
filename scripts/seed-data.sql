-- Örnek Veri Script'i
-- Bu script test için örnek veriler ekler

-- Örnek etkinlikler
INSERT INTO events (event_name, event_type, event_date) VALUES
('Ayşe & Mehmet Düğünü', 'Düğün', '2026-06-15'),
('Zeynep''in Doğum Günü', 'Doğum Günü', '2026-07-20'),
('Elif & Can Nişanı', 'Nişan', '2026-08-10'),
('Fatma''nın Kına Gecesi', 'Kına', '2026-05-25'),
('Ali''nin Sünnet Töreni', 'Sünnet', '2026-09-05')
ON CONFLICT DO NOTHING;

-- Örnek misafirler
INSERT INTO guests (event_id, full_name) VALUES
(1, 'Ahmet Yılmaz'),
(1, 'Fatma Demir'),
(1, 'Can Öztürk'),
(2, 'Mehmet Kaya'),
(2, 'Ayşe Şahin'),
(3, 'Zeynep Arslan'),
(3, 'Burak Çelik'),
(4, 'Elif Yıldız'),
(5, 'Mustafa Aydın')
ON CONFLICT DO NOTHING;

-- Başarı mesajı
\echo '✅ Örnek veriler başarıyla eklendi!'
\echo ''
\echo '📊 Eklenen veriler:'
\echo '   - 5 etkinlik'
\echo '   - 9 misafir'
\echo ''
\echo '🔍 Kontrol etmek için:'
\echo '   SELECT * FROM events;'
\echo '   SELECT * FROM guests;'
