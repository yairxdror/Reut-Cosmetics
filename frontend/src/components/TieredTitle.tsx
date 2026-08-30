"use client";

import { useLanguage } from "@/context/LanguageContext";
import Editable from "@/components/Editable";
import type { EditableTextKey } from "@/lib/editableContent";

// Renders a heading in the same small-word-over-large-word style as the
// services section's "עולם האיפור" (servicesTitleKicker/servicesTitleMain):
// the first word small, the rest of the phrase large below it. Unlike that
// pair, this stays a single editable field — the split is purely visual,
// recomputed from the one resolved string, so admin editing is unchanged
// (one popover, one he/en pair) even though the heading now renders as two
// styled tiers.
export default function TieredTitle({
  as: Tag = "h2",
  contentKey,
  className,
}: {
  as?: "h2" | "h3";
  contentKey: EditableTextKey;
  className?: string;
}) {
  const { t } = useLanguage();
  const text = t(contentKey);
  const spaceIndex = text.indexOf(" ");
  const kicker = spaceIndex === -1 ? "" : text.slice(0, spaceIndex);
  const main = spaceIndex === -1 ? text : text.slice(spaceIndex + 1);

  return (
    <Tag className={className}>
      <Editable contentKey={contentKey}>
        {kicker && <span className="services-title-kicker">{kicker}</span>}
        <span className="services-title-main">{main}</span>
      </Editable>
    </Tag>
  );
}
