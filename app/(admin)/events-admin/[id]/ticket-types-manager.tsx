"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, DollarSign, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createTicketType,
  updateTicketType,
  deleteTicketType,
  createAddon,
  updateAddon,
  deleteAddon,
} from "@/lib/actions/event-tickets";
import type { EventTicketType, EventAddon, AddonCategory } from "@/types/database";

interface TicketTypesManagerProps {
  eventId: string;
  ticketTypes: EventTicketType[];
  addons: EventAddon[];
}

const addonCategories: { value: AddonCategory; label: string }[] = [
  { value: "food", label: "Food & Beverage" },
  { value: "merchandise", label: "Merchandise" },
  { value: "upgrade", label: "Upgrade" },
  { value: "other", label: "Other" },
];

export function TicketTypesManager({
  eventId,
  ticketTypes: initialTicketTypes,
  addons: initialAddons,
}: TicketTypesManagerProps) {
  const [ticketTypes, setTicketTypes] = useState(initialTicketTypes);
  const [addons, setAddons] = useState(initialAddons);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<EventTicketType | null>(null);
  const [editingAddon, setEditingAddon] = useState<EventAddon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    name: "",
    description: "",
    price: "0",
    quantity_available: "",
    max_per_order: "10",
  });

  // Addon form state
  const [addonForm, setAddonForm] = useState({
    name: "",
    description: "",
    category: "other" as AddonCategory,
    price: "0",
    quantity_available: "",
    max_per_order: "5",
  });

  const resetTicketForm = () => {
    setTicketForm({
      name: "",
      description: "",
      price: "0",
      quantity_available: "",
      max_per_order: "10",
    });
    setEditingTicket(null);
    setShowTicketForm(false);
  };

  const resetAddonForm = () => {
    setAddonForm({
      name: "",
      description: "",
      category: "other",
      price: "0",
      quantity_available: "",
      max_per_order: "5",
    });
    setEditingAddon(null);
    setShowAddonForm(false);
  };

  const handleEditTicket = (ticket: EventTicketType) => {
    setTicketForm({
      name: ticket.name,
      description: ticket.description || "",
      price: ticket.price.toString(),
      quantity_available: ticket.quantity_available?.toString() || "",
      max_per_order: ticket.max_per_order.toString(),
    });
    setEditingTicket(ticket);
    setShowTicketForm(true);
  };

  const handleEditAddon = (addon: EventAddon) => {
    setAddonForm({
      name: addon.name,
      description: addon.description || "",
      category: addon.category || "other",
      price: addon.price.toString(),
      quantity_available: addon.quantity_available?.toString() || "",
      max_per_order: addon.max_per_order.toString(),
    });
    setEditingAddon(addon);
    setShowAddonForm(true);
  };

  const handleSubmitTicket = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        event_id: eventId,
        name: ticketForm.name,
        description: ticketForm.description || null,
        price: parseFloat(ticketForm.price) || 0,
        quantity_available: ticketForm.quantity_available
          ? parseInt(ticketForm.quantity_available)
          : null,
        max_per_order: parseInt(ticketForm.max_per_order) || 10,
        is_active: true,
        sort_order: ticketTypes.length,
        quantity_sold: 0,
      };

      if (editingTicket) {
        const result = await updateTicketType(editingTicket.id, data);
        if (result.success && result.data) {
          setTicketTypes((prev) =>
            prev.map((t) => (t.id === editingTicket.id ? result.data! : t))
          );
        }
      } else {
        const result = await createTicketType(data);
        if (result.success && result.data) {
          setTicketTypes((prev) => [...prev, result.data!]);
        }
      }
      resetTicketForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAddon = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        event_id: eventId,
        name: addonForm.name,
        description: addonForm.description || null,
        category: addonForm.category,
        price: parseFloat(addonForm.price) || 0,
        quantity_available: addonForm.quantity_available
          ? parseInt(addonForm.quantity_available)
          : null,
        max_per_order: parseInt(addonForm.max_per_order) || 5,
        is_active: true,
        sort_order: addons.length,
        quantity_sold: 0,
      };

      if (editingAddon) {
        const result = await updateAddon(editingAddon.id, data);
        if (result.success && result.data) {
          setAddons((prev) =>
            prev.map((a) => (a.id === editingAddon.id ? result.data! : a))
          );
        }
      } else {
        const result = await createAddon(data);
        if (result.success && result.data) {
          setAddons((prev) => [...prev, result.data!]);
        }
      }
      resetAddonForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ticket type?")) return;
    const result = await deleteTicketType(id);
    if (result.success) {
      setTicketTypes((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleDeleteAddon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this add-on?")) return;
    const result = await deleteAddon(id);
    if (result.success) {
      setAddons((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Ticket Types Section */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#C9A84C]" />
              Ticket Types
            </h2>
            <p className="text-sm text-[#555555]">
              Define different ticket options for this event
            </p>
          </div>
          {!showTicketForm && (
            <Button onClick={() => setShowTicketForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Ticket Type
            </Button>
          )}
        </div>

        {/* Ticket Form */}
        {showTicketForm && (
          <div className="mb-6 p-4 bg-[#FAFAF8] rounded-lg border border-[#DDDDDD]">
            <h3 className="font-medium text-[#1A1A1A] mb-4">
              {editingTicket ? "Edit Ticket Type" : "New Ticket Type"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={ticketForm.name}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, name: e.target.value })
                  }
                  placeholder="e.g., General Admission, VIP, Family Pack"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Description
                </label>
                <Textarea
                  value={ticketForm.description}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, description: e.target.value })
                  }
                  placeholder="What's included with this ticket?"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Price ($)
                </label>
                <Input
                  type="number"
                  value={ticketForm.price}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, price: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Quantity Available
                </label>
                <Input
                  type="number"
                  value={ticketForm.quantity_available}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      quantity_available: e.target.value,
                    })
                  }
                  placeholder="Leave empty for unlimited"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Max Per Order
                </label>
                <Input
                  type="number"
                  value={ticketForm.max_per_order}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      max_per_order: e.target.value,
                    })
                  }
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetTicketForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmitTicket} disabled={isSubmitting || !ticketForm.name}>
                {isSubmitting ? "Saving..." : editingTicket ? "Update" : "Add Ticket Type"}
              </Button>
            </div>
          </div>
        )}

        {/* Ticket Types List */}
        {ticketTypes.length === 0 ? (
          <p className="text-sm text-[#888888] text-center py-4">
            No ticket types defined. Add one to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {ticketTypes.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 bg-[#FAFAF8] rounded-lg border border-[#DDDDDD]"
              >
                <div>
                  <h4 className="font-medium text-[#1A1A1A]">{ticket.name}</h4>
                  {ticket.description && (
                    <p className="text-sm text-[#555555]">{ticket.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#888888]">
                    <span className="font-medium text-[#C9A84C]">
                      ${ticket.price.toFixed(2)}
                    </span>
                    <span>
                      {ticket.quantity_available
                        ? `${ticket.quantity_sold}/${ticket.quantity_available} sold`
                        : "Unlimited"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTicket(ticket)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add-ons Section */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Package className="h-5 w-5 text-[#5A7247]" />
              Add-ons & Extras
            </h2>
            <p className="text-sm text-[#555555]">
              Optional items attendees can purchase (food, swag, upgrades)
            </p>
          </div>
          {!showAddonForm && (
            <Button onClick={() => setShowAddonForm(true)} size="sm" variant="secondary">
              <Plus className="h-4 w-4 mr-1" />
              Add Add-on
            </Button>
          )}
        </div>

        {/* Addon Form */}
        {showAddonForm && (
          <div className="mb-6 p-4 bg-[#EFF4EB] rounded-lg border border-[#5A7247]/20">
            <h3 className="font-medium text-[#1A1A1A] mb-4">
              {editingAddon ? "Edit Add-on" : "New Add-on"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={addonForm.name}
                  onChange={(e) =>
                    setAddonForm({ ...addonForm, name: e.target.value })
                  }
                  placeholder="e.g., Extra Dinner Plate, Swag Bag, VIP Seating"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Description
                </label>
                <Textarea
                  value={addonForm.description}
                  onChange={(e) =>
                    setAddonForm({ ...addonForm, description: e.target.value })
                  }
                  placeholder="What does this include?"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Category
                </label>
                <select
                  value={addonForm.category}
                  onChange={(e) =>
                    setAddonForm({
                      ...addonForm,
                      category: e.target.value as AddonCategory,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5A7247]"
                >
                  {addonCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Price ($)
                </label>
                <Input
                  type="number"
                  value={addonForm.price}
                  onChange={(e) =>
                    setAddonForm({ ...addonForm, price: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Quantity Available
                </label>
                <Input
                  type="number"
                  value={addonForm.quantity_available}
                  onChange={(e) =>
                    setAddonForm({
                      ...addonForm,
                      quantity_available: e.target.value,
                    })
                  }
                  placeholder="Leave empty for unlimited"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">
                  Max Per Order
                </label>
                <Input
                  type="number"
                  value={addonForm.max_per_order}
                  onChange={(e) =>
                    setAddonForm({
                      ...addonForm,
                      max_per_order: e.target.value,
                    })
                  }
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetAddonForm}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAddon}
                disabled={isSubmitting || !addonForm.name}
                className="bg-[#5A7247] hover:bg-[#3D5030]"
              >
                {isSubmitting ? "Saving..." : editingAddon ? "Update" : "Add Add-on"}
              </Button>
            </div>
          </div>
        )}

        {/* Add-ons List */}
        {addons.length === 0 ? (
          <p className="text-sm text-[#888888] text-center py-4">
            No add-ons defined. Add items like extra food, swag bags, or VIP upgrades.
          </p>
        ) : (
          <div className="space-y-3">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between p-4 bg-[#EFF4EB] rounded-lg border border-[#5A7247]/20"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[#1A1A1A]">{addon.name}</h4>
                    <span className="px-2 py-0.5 bg-[#5A7247]/10 text-[#5A7247] text-xs rounded-full">
                      {addonCategories.find((c) => c.value === addon.category)?.label ||
                        addon.category}
                    </span>
                  </div>
                  {addon.description && (
                    <p className="text-sm text-[#555555]">{addon.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#888888]">
                    <span className="font-medium text-[#5A7247]">
                      ${addon.price.toFixed(2)}
                    </span>
                    <span>
                      {addon.quantity_available
                        ? `${addon.quantity_sold}/${addon.quantity_available} sold`
                        : "Unlimited"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAddon(addon)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAddon(addon.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
