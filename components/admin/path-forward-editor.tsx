"use client";

import { useState } from "react";
import { Plus, X, Loader2, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface PathForwardPlan {
  career_goal?: string;
  short_term_goals?: { goal: string; completed: boolean }[];
  long_term_goals?: { goal: string; completed: boolean }[];
  barriers?: string[];
  support_plan?: string;
}

interface PathForwardEditorProps {
  initialPlan: PathForwardPlan | null;
  participantName: string;
  onSave: (plan: PathForwardPlan) => Promise<void>;
  onCancel: () => void;
}

export function PathForwardEditor({
  initialPlan,
  participantName,
  onSave,
  onCancel,
}: PathForwardEditorProps) {
  const [plan, setPlan] = useState<PathForwardPlan>({
    career_goal: initialPlan?.career_goal || "",
    short_term_goals: initialPlan?.short_term_goals || [],
    long_term_goals: initialPlan?.long_term_goals || [],
    barriers: initialPlan?.barriers || [],
    support_plan: initialPlan?.support_plan || "",
  });

  const [newShortTermGoal, setNewShortTermGoal] = useState("");
  const [newLongTermGoal, setNewLongTermGoal] = useState("");
  const [newBarrier, setNewBarrier] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddShortTermGoal = () => {
    if (!newShortTermGoal.trim()) return;
    setPlan((prev) => ({
      ...prev,
      short_term_goals: [
        ...(prev.short_term_goals || []),
        { goal: newShortTermGoal.trim(), completed: false },
      ],
    }));
    setNewShortTermGoal("");
  };

  const handleAddLongTermGoal = () => {
    if (!newLongTermGoal.trim()) return;
    setPlan((prev) => ({
      ...prev,
      long_term_goals: [
        ...(prev.long_term_goals || []),
        { goal: newLongTermGoal.trim(), completed: false },
      ],
    }));
    setNewLongTermGoal("");
  };

  const handleAddBarrier = () => {
    if (!newBarrier.trim()) return;
    setPlan((prev) => ({
      ...prev,
      barriers: [...(prev.barriers || []), newBarrier.trim()],
    }));
    setNewBarrier("");
  };

  const handleRemoveShortTermGoal = (index: number) => {
    setPlan((prev) => ({
      ...prev,
      short_term_goals: prev.short_term_goals?.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveLongTermGoal = (index: number) => {
    setPlan((prev) => ({
      ...prev,
      long_term_goals: prev.long_term_goals?.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveBarrier = (index: number) => {
    setPlan((prev) => ({
      ...prev,
      barriers: prev.barriers?.filter((_, i) => i !== index),
    }));
  };

  const handleToggleShortTermGoal = (index: number) => {
    setPlan((prev) => ({
      ...prev,
      short_term_goals: prev.short_term_goals?.map((g, i) =>
        i === index ? { ...g, completed: !g.completed } : g
      ),
    }));
  };

  const handleToggleLongTermGoal = (index: number) => {
    setPlan((prev) => ({
      ...prev,
      long_term_goals: prev.long_term_goals?.map((g, i) =>
        i === index ? { ...g, completed: !g.completed } : g
      ),
    }));
  };

  const handleSave = async () => {
    if (!plan.career_goal?.trim()) {
      setError("Career goal is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save plan");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#DDDDDD]">
        <div className="p-2 rounded-lg bg-[#FBF6E9]">
          <Target className="h-5 w-5 text-[#C9A84C]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">
            Path Forward Plan
          </h2>
          <p className="text-sm text-[#888888]">for {participantName}</p>
        </div>
      </div>

      {/* Career Goal */}
      <div className="space-y-2">
        <Label htmlFor="career-goal" className="text-sm font-medium text-[#1A1A1A]">
          Career Goal <span className="text-red-500">*</span>
        </Label>
        <Input
          id="career-goal"
          placeholder="e.g., Become a network administrator"
          value={plan.career_goal || ""}
          onChange={(e) => setPlan((prev) => ({ ...prev, career_goal: e.target.value }))}
          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
        />
        <p className="text-xs text-[#888888]">
          The ultimate career outcome this participant is working toward
        </p>
      </div>

      {/* Short-term Goals */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-[#1A1A1A]">Short-term Goals</Label>
        <p className="text-xs text-[#888888]">
          Goals achievable within the program (next 1-3 months)
        </p>

        {plan.short_term_goals && plan.short_term_goals.length > 0 && (
          <div className="space-y-2">
            {plan.short_term_goals.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-[#FAFAF8] rounded-lg group"
              >
                <button
                  type="button"
                  onClick={() => handleToggleShortTermGoal(index)}
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    item.completed
                      ? "bg-[#5A7247] text-white"
                      : "bg-white border border-[#DDDDDD] hover:border-[#C9A84C]"
                  }`}
                >
                  {item.completed && <Check className="h-3 w-3" />}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    item.completed ? "text-[#888888] line-through" : "text-[#1A1A1A]"
                  }`}
                >
                  {item.goal}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveShortTermGoal(index)}
                  className="p-1 rounded text-[#888888] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Add a short-term goal..."
            value={newShortTermGoal}
            onChange={(e) => setNewShortTermGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddShortTermGoal()}
            className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddShortTermGoal}
            disabled={!newShortTermGoal.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Long-term Goals */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-[#1A1A1A]">Long-term Goals</Label>
        <p className="text-xs text-[#888888]">
          Goals for the next 6-12 months after program completion
        </p>

        {plan.long_term_goals && plan.long_term_goals.length > 0 && (
          <div className="space-y-2">
            {plan.long_term_goals.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-[#FAFAF8] rounded-lg group"
              >
                <button
                  type="button"
                  onClick={() => handleToggleLongTermGoal(index)}
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    item.completed
                      ? "bg-[#5A7247] text-white"
                      : "bg-white border border-[#DDDDDD] hover:border-[#C9A84C]"
                  }`}
                >
                  {item.completed && <Check className="h-3 w-3" />}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    item.completed ? "text-[#888888] line-through" : "text-[#1A1A1A]"
                  }`}
                >
                  {item.goal}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveLongTermGoal(index)}
                  className="p-1 rounded text-[#888888] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Add a long-term goal..."
            value={newLongTermGoal}
            onChange={(e) => setNewLongTermGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddLongTermGoal()}
            className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddLongTermGoal}
            disabled={!newLongTermGoal.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Barriers */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-[#1A1A1A]">Identified Barriers</Label>
        <p className="text-xs text-[#888888]">
          Challenges or obstacles that may affect progress
        </p>

        {plan.barriers && plan.barriers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {plan.barriers.map((barrier, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 text-sm rounded-full group"
              >
                {barrier}
                <button
                  type="button"
                  onClick={() => handleRemoveBarrier(index)}
                  className="p-0.5 rounded-full hover:bg-yellow-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Add a barrier..."
            value={newBarrier}
            onChange={(e) => setNewBarrier(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddBarrier()}
            className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddBarrier}
            disabled={!newBarrier.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Support Plan */}
      <div className="space-y-2">
        <Label htmlFor="support-plan" className="text-sm font-medium text-[#1A1A1A]">
          Support Plan
        </Label>
        <p className="text-xs text-[#888888]">
          How will Forever Forward support this participant in achieving their goals?
        </p>
        <Textarea
          id="support-plan"
          placeholder="e.g., Weekly check-ins with case worker, tutoring support for certifications, job placement assistance..."
          value={plan.support_plan || ""}
          onChange={(e) => setPlan((prev) => ({ ...prev, support_plan: e.target.value }))}
          rows={4}
          className="border-[#DDDDDD] focus:border-[#C9A84C] focus:ring-[#C9A84C]"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[#DDDDDD]">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isSaving ? "Saving..." : "Save Plan"}
        </Button>
      </div>
    </div>
  );
}
