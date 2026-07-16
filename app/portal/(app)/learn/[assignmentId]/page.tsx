import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCoursePlayer } from "@/lib/actions/portal";
import { CoursePlayer } from "./course-player";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const res = await getCoursePlayer(assignmentId);

  if (!res.success || !res.data) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#555555]">{res.error ?? "This course isn't available."}</p>
        <Link
          href="/portal"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5A7247]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Learning
        </Link>
      </div>
    );
  }

  return <CoursePlayer data={res.data} />;
}
