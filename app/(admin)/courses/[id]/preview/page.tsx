import { notFound } from "next/navigation";
import { getCourse } from "@/lib/actions/courses";
import { CoursePreview } from "./course-preview";

export const dynamic = "force-dynamic";

export default async function CoursePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getCourse(id);
  if (!res.success || !res.data) notFound();
  return <CoursePreview detail={res.data} />;
}
