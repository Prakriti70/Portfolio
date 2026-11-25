import { ARTWORK_CATEGORIES } from "@/types/artwork";
import { artworkInputSchema, type ArtworkInput } from "@/lib/validation/artwork";

/** Form state is all strings; it is validated into an ArtworkInput by `parseValues`. */
export interface FormValues {
  title: string;
  category: string;
  medium: string;
  madeOn: string;
  description: string;
  note: string;
  body: string;
}
export type FieldErrors = Partial<Record<keyof FormValues, string>>;

export const emptyValues: FormValues = {
  title: "", category: "Paintings", medium: "", madeOn: "", description: "", note: "", body: "",
};

export function parseValues(values: FormValues): { data?: ArtworkInput; errors: FieldErrors } {
  const result = artworkInputSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: {} };
  const flat = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const errors: FieldErrors = {};
  for (const key of Object.keys(flat)) errors[key as keyof FormValues] = flat[key]?.[0];
  return { errors };
}

const input = "mt-1 block w-full rounded-md border-2 border-moss/60 bg-cream px-3 py-2 text-base text-ink focus:border-forest";

interface Props {
  idPrefix: string;
  values: FormValues;
  errors: FieldErrors;
  onChange: (field: keyof FormValues, value: string) => void;
}

export function ArtworkFields({ idPrefix, values, errors, onChange }: Props) {
  const field = (name: keyof FormValues, label: string, el: React.ReactNode) => (
    <div>
      <label htmlFor={`${idPrefix}-${name}`} className="font-medium text-forest">{label}</label>
      {el}
      {errors[name] && <p id={`${idPrefix}-${name}-err`} className="mt-1 text-sm text-midnight underline decoration-rose">{errors[name]}</p>}
    </div>
  );
  const common = (name: keyof FormValues) => ({
    id: `${idPrefix}-${name}`,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(name, e.target.value),
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${idPrefix}-${name}-err` : undefined,
    className: input,
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">{field("title", "Title", <input {...common("title")} />)}</div>
      {field("category", "Category", (
        <select {...common("category")}>
          {ARTWORK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      ))}
      {field("madeOn", "Date (optional)", <input type="date" {...common("madeOn")} />)}
      <div className="sm:col-span-2">{field("medium", "Medium (optional), e.g. “Watercolour on paper”", <input {...common("medium")} />)}</div>
      <div className="sm:col-span-2">{field("description", "Short description, in your own voice", <textarea rows={3} {...common("description")} />)}</div>
      <div className="sm:col-span-2">{field("note", "The idea or feeling behind it (optional)", <textarea rows={3} {...common("note")} />)}</div>
      {values.category === "Writing" && (
        <div className="sm:col-span-2">{field("body", "The writing itself (poems keep their line breaks)", <textarea rows={7} {...common("body")} />)}</div>
      )}
    </div>
  );
}
