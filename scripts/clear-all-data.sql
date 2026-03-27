-- Forever Forward - Clear All Data Script
-- WARNING: This will DELETE ALL DATA from all tables
-- Run this in Supabase SQL Editor to reset the database for testing

-- Disable triggers temporarily for faster truncation
SET session_replication_role = 'replica';

-- Clear all tables (using TRUNCATE CASCADE to handle foreign keys)

-- Event related tables
TRUNCATE TABLE event_checkin_log CASCADE;
TRUNCATE TABLE event_feedback CASCADE;
TRUNCATE TABLE event_order_items CASCADE;
TRUNCATE TABLE event_analytics CASCADE;
TRUNCATE TABLE event_tables CASCADE;
TRUNCATE TABLE event_attendees CASCADE;
TRUNCATE TABLE event_addons CASCADE;
TRUNCATE TABLE event_ticket_types CASCADE;
TRUNCATE TABLE events CASCADE;

-- Donation related tables
TRUNCATE TABLE donor_communications CASCADE;
TRUNCATE TABLE donation_allocations CASCADE;
TRUNCATE TABLE impact_metrics CASCADE;
TRUNCATE TABLE donor_profiles CASCADE;
TRUNCATE TABLE donations CASCADE;

-- Program related tables
TRUNCATE TABLE checkins CASCADE;
TRUNCATE TABLE travis_conversations CASCADE;
TRUNCATE TABLE participants CASCADE;
TRUNCATE TABLE cohorts CASCADE;

-- MSP/Client related tables
TRUNCATE TABLE assignments CASCADE;
TRUNCATE TABLE billing_events CASCADE;
TRUNCATE TABLE revenue_history CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE msp_clients CASCADE;

-- CRM tables
TRUNCATE TABLE activities CASCADE;
TRUNCATE TABLE emails CASCADE;
TRUNCATE TABLE leads CASCADE;

-- Content tables
TRUNCATE TABLE blog_posts CASCADE;
TRUNCATE TABLE blog_categories CASCADE;
TRUNCATE TABLE newsletter_subscribers CASCADE;

-- Resource tables
TRUNCATE TABLE workforce CASCADE;
TRUNCATE TABLE resources CASCADE;

-- System tables
TRUNCATE TABLE webhook_events CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Verify all tables are empty
SELECT 'leads' as table_name, COUNT(*) as row_count FROM leads
UNION ALL SELECT 'participants', COUNT(*) FROM participants
UNION ALL SELECT 'msp_clients', COUNT(*) FROM msp_clients
UNION ALL SELECT 'events', COUNT(*) FROM events
UNION ALL SELECT 'event_attendees', COUNT(*) FROM event_attendees
UNION ALL SELECT 'donations', COUNT(*) FROM donations
UNION ALL SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers;
