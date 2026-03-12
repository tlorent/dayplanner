import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TAG_COLORS } from "../constants/tags";
import { FULL_DAYS } from "../constants/tasks";

const schema = z
  .object({
    label: z.string().min(1, "Vul een taakomschrijving in"),
    tags: z.preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.string()).min(1, "Kies minstens één tag")
    ),
    type: z.enum(["daily", "recurring", "one-off"]),
    day: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
      z.number().min(0).max(4).optional()
    ),
  })
  .refine(
    (data) => {
      if (data.type === "recurring" || data.type === "one-off") {
        return data.day !== undefined;
      }
      return true;
    },
    { message: "Kies een dag", path: ["day"] }
  );

const TAGS = Object.keys(TAG_COLORS);

const TYPE_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "recurring", label: "Recurring (specific day)" },
  { value: "one-off", label: "One-off (specific day)" },
];

export function AddTaskForm({ onClose }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: "daily" },
  });

  const type = watch("type");
  const needsDay = type === "recurring" || type === "one-off";

  function onSubmit(data) {
    const typeLabel = { daily: "Daily", recurring: "Recurring", "one-off": "One-off" }[data.type];
    const dayLabel = data.day !== undefined ? ` — ${FULL_DAYS[data.day]}` : "";
    window.alert(`Task ready to save!\n\nLabel: ${data.label}\nTags: ${data.tags.join(", ")}\nType: ${typeLabel}${dayLabel}`);
    onClose(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(26,26,26,0.4)" }}
      onClick={(e) => e.target === e.currentTarget && onClose(null)}
    >
      <div className="bg-beige w-full max-w-md mx-4 shadow-lg animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-syne font-semibold text-ink text-base tracking-wide">
            Add task
          </h2>
          <button
            onClick={() => onClose(null)}
            className="text-muted hover:text-ink transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-5">
          {/* Label */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-widest text-muted uppercase">
              Task
            </label>
            <input
              {...register("label")}
              placeholder="What needs to be done?"
              className={[
                "font-mono text-[13px] bg-beige-dark border px-3 py-2.5 text-ink placeholder:text-muted outline-none",
                "focus:border-ink transition-colors",
                errors.label ? "border-terracotta" : "border-border",
              ].join(" ")}
            />
            {errors.label && (
              <span className="font-mono text-[11px] text-terracotta">
                {errors.label.message}
              </span>
            )}
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-widest text-muted uppercase">
              Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const color = TAG_COLORS[tag];
                return (
                  <label key={tag} className="cursor-pointer">
                    <input
                      type="checkbox"
                      value={tag}
                      {...register("tags")}
                      className="sr-only"
                    />
                    <TagBadge tag={tag} color={color} selected={[].concat(watch("tags") ?? []).includes(tag)} />
                  </label>
                );
              })}
            </div>
            {errors.tags && (
              <span className="font-mono text-[11px] text-terracotta">
                {errors.tags.message}
              </span>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] tracking-widest text-muted uppercase">
              Frequency
            </label>
            <div className="flex flex-col gap-2">
              {TYPE_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    value={value}
                    {...register("type")}
                    className="sr-only"
                  />
                  <span
                    className={[
                      "w-[14px] h-[14px] border-[1.5px] shrink-0 flex items-center justify-center transition-colors",
                      watch("type") === value ? "border-ink bg-ink" : "border-border",
                    ].join(" ")}
                  >
                    {watch("type") === value && (
                      <span className="w-[5px] h-[5px] bg-beige block" />
                    )}
                  </span>
                  <span className="font-mono text-[13px] text-ink">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Day selector — only shown for recurring / one-off */}
          {needsDay && (
            <div className="flex flex-col gap-1.5 animate-fade-up">
              <label className="font-mono text-[11px] tracking-widest text-muted uppercase">
                Day
              </label>
              <div className="flex gap-2 flex-wrap">
                {FULL_DAYS.map((day, i) => (
                  <label key={day} className="cursor-pointer">
                    <input
                      type="radio"
                      value={i}
                      {...register("day")}
                      className="sr-only"
                    />
                    <span
                      className={[
                        "font-mono text-[12px] px-3 py-1.5 border transition-colors block",
                        Number(watch("day")) === i
                          ? "bg-ink text-beige border-ink"
                          : "border-border text-ink hover:border-ink",
                      ].join(" ")}
                    >
                      {day}
                    </span>
                  </label>
                ))}
              </div>
              {errors.day && (
                <span className="font-mono text-[11px] text-terracotta">
                  {errors.day.message}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => onClose(null)}
              className="flex-1 font-mono text-[12px] tracking-wide border border-border text-muted py-2.5 hover:border-ink hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 font-mono text-[12px] tracking-wide bg-ink text-beige py-2.5 hover:bg-terracotta transition-colors"
            >
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TagBadge({ tag, color, selected }) {
  return (
    <span
      className="font-mono text-[10px] px-[7px] py-[3px] tracking-[0.05em] border-[1.5px] transition-all"
      style={{
        background: selected ? color.bg : "transparent",
        color: selected ? color.text : color.bg,
        borderColor: color.bg,
      }}
    >
      {tag}
    </span>
  );
}
