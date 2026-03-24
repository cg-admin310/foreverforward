-- ============================================================================
-- MIGRATION: Event Ticket Types and Add-ons
-- ============================================================================

-- ============================================================================
-- EVENT TICKET TYPES
-- Different ticket options for events (General, VIP, Family Pack, etc.)
-- ============================================================================

CREATE TABLE event_ticket_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Ticket type details
  name TEXT NOT NULL,  -- e.g., "General Admission", "VIP", "Family Pack (4)"
  description TEXT,    -- What's included, benefits

  -- Pricing
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- Availability
  quantity_available INTEGER,  -- NULL = unlimited
  quantity_sold INTEGER DEFAULT 0,

  -- Configuration
  max_per_order INTEGER DEFAULT 10,  -- Max tickets of this type per order
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  -- Stripe
  stripe_price_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- EVENT ADD-ONS / PRODUCTS
-- Additional items that can be purchased with event tickets
-- ============================================================================

CREATE TABLE event_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Add-on details
  name TEXT NOT NULL,  -- e.g., "Extra Dinner Plate", "Swag Bag", "VIP Seating Upgrade"
  description TEXT,
  category TEXT,       -- 'food', 'merchandise', 'upgrade', 'other'

  -- Pricing
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- Availability
  quantity_available INTEGER,  -- NULL = unlimited
  quantity_sold INTEGER DEFAULT 0,

  -- Configuration
  max_per_order INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  -- For upgrades, which ticket types can use this
  applicable_ticket_types TEXT[],  -- NULL = all ticket types

  -- Stripe
  stripe_price_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ORDER ITEMS (Line items for tickets and add-ons)
-- ============================================================================

CREATE TABLE event_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendee_id UUID NOT NULL REFERENCES event_attendees(id) ON DELETE CASCADE,

  -- What was purchased
  item_type TEXT NOT NULL,  -- 'ticket' or 'addon'
  ticket_type_id UUID REFERENCES event_ticket_types(id) ON DELETE SET NULL,
  addon_id UUID REFERENCES event_addons(id) ON DELETE SET NULL,

  -- Details
  item_name TEXT NOT NULL,  -- Denormalized for history
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_ticket_types_event ON event_ticket_types(event_id);
CREATE INDEX idx_ticket_types_active ON event_ticket_types(is_active);
CREATE INDEX idx_addons_event ON event_addons(event_id);
CREATE INDEX idx_addons_category ON event_addons(category);
CREATE INDEX idx_order_items_attendee ON event_order_items(attendee_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_ticket_types_updated_at
  BEFORE UPDATE ON event_ticket_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addons_updated_at
  BEFORE UPDATE ON event_addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE event_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_order_items ENABLE ROW LEVEL SECURITY;

-- Ticket types: Public can view active ones, admins can manage
CREATE POLICY "Public can view active ticket types" ON event_ticket_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage ticket types" ON event_ticket_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('super_admin', 'event_coordinator')
    )
  );

-- Add-ons: Public can view active ones, admins can manage
CREATE POLICY "Public can view active addons" ON event_addons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage addons" ON event_addons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('super_admin', 'event_coordinator')
    )
  );

-- Order items: Users can see their own, admins can see all
CREATE POLICY "Users can view own order items" ON event_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM event_attendees WHERE id = attendee_id AND email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can manage order items" ON event_order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid()
      AND role IN ('super_admin', 'event_coordinator')
    )
  );
