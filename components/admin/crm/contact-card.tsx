"use client";

import { Mail, Phone, User, Crown, Wrench, CreditCard } from "lucide-react";

interface ContactCardProps {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
  isTechnical?: boolean;
  isBilling?: boolean;
  avatarUrl?: string;
  compact?: boolean;
}

export function ContactCard({
  name,
  email,
  phone,
  role,
  isPrimary = false,
  isTechnical = false,
  isBilling = false,
  avatarUrl,
  compact = false,
}: ContactCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#DDDDDD] hover:border-[#C9A84C] transition-colors">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#FBF6E9] flex items-center justify-center text-[#C9A84C] font-semibold text-sm">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#1A1A1A] text-sm truncate">{name}</span>
            {isPrimary && (
              <Crown className="h-3 w-3 text-[#C9A84C] shrink-0" />
            )}
          </div>
          <span className="text-xs text-[#888888] truncate block">{email}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border transition-all hover:shadow-sm ${
        isPrimary
          ? "bg-[#FBF6E9] border-[#E8D48B]"
          : "bg-white border-[#DDDDDD] hover:border-[#C9A84C]"
      }`}
    >
      <div className="flex items-start gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${
              isPrimary
                ? "bg-[#C9A84C] text-white"
                : "bg-[#FBF6E9] text-[#C9A84C]"
            }`}
          >
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-[#1A1A1A] truncate">{name}</h4>
            {isPrimary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#C9A84C] text-white">
                <Crown className="h-3 w-3" />
                Primary
              </span>
            )}
          </div>

          {role && (
            <p className="text-sm text-[#555555] mb-2">{role}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {isTechnical && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#EFF4EB] text-[#5A7247]">
                <Wrench className="h-3 w-3" />
                Technical
              </span>
            )}
            {isBilling && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <CreditCard className="h-3 w-3" />
                Billing
              </span>
            )}
          </div>

          <div className="space-y-1">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-sm text-[#555555] hover:text-[#C9A84C] transition-colors"
            >
              <Mail className="h-4 w-4 text-[#888888]" />
              <span className="truncate">{email}</span>
            </a>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-sm text-[#555555] hover:text-[#C9A84C] transition-colors"
              >
                <Phone className="h-4 w-4 text-[#888888]" />
                <span>{phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContactListProps {
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    isPrimary?: boolean;
    isTechnical?: boolean;
    isBilling?: boolean;
    avatarUrl?: string;
  }>;
  compact?: boolean;
  onContactClick?: (id: string) => void;
}

export function ContactList({ contacts, compact = false, onContactClick }: ContactListProps) {
  const primaryContact = contacts.find((c) => c.isPrimary);
  const otherContacts = contacts.filter((c) => !c.isPrimary);

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {primaryContact && (
        <div onClick={() => onContactClick?.(primaryContact.id)} className={onContactClick ? "cursor-pointer" : ""}>
          <ContactCard {...primaryContact} compact={compact} />
        </div>
      )}
      {otherContacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onContactClick?.(contact.id)}
          className={onContactClick ? "cursor-pointer" : ""}
        >
          <ContactCard {...contact} compact={compact} />
        </div>
      ))}
    </div>
  );
}
