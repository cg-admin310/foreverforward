export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "../event-form";

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/events-admin"
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#C9A84C] transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Create New Event</h1>
          <p className="text-[#555555]">
            Add a new event for the community
          </p>
        </div>
      </div>

      {/* Form */}
      <EventForm />
    </div>
  );
}
