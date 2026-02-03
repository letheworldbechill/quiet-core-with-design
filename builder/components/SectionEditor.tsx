import { useState, useMemo } from "react";
import type {
  Section,
  Slot,
  DeclarationType,
  GridPattern,
  SlotType,
  PageLayout,
} from "../../design-system";
import { validateSection } from "../../design-system";
import type { Translations } from "../i18n";

type SectionEditorProps = {
  layout: PageLayout;
  onChange: (layout: PageLayout) => void;
  t: Translations;
};

const DECLARATION_GRIDS: Record<DeclarationType, { grids: GridPattern[]; slots: SlotType[] }> = {
  a: { grids: ["a"], slots: ["primary", "secondary"] },
  b: { grids: ["b", "b-mirror"], slots: ["primary", "secondary", "meta"] },
  c: { grids: ["b", "b-mirror"], slots: ["secondary", "list", "quote", "meta"] },
  d: { grids: ["a"], slots: ["primary"] },
  e: { grids: ["a"], slots: ["secondary", "meta"] },
};

function createDefaultSlot(type: SlotType): Slot {
  return { type, content: "" };
}

function createDefaultSection(): Section {
  return {
    decl: "a",
    grid: "a",
    slots: [createDefaultSlot("primary")],
  };
}

export function SectionEditor({ layout, onChange, t }: SectionEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const SLOT_INFO = useMemo(() => ({
    primary: t.slots.primary,
    secondary: t.slots.secondary,
    meta: t.slots.meta,
    list: t.slots.list,
    quote: t.slots.quote,
  }), [t]);

  const DECLARATION_INFO = useMemo(() => ({
    a: { name: t.declarations.a.name, desc: t.declarations.a.desc, ...DECLARATION_GRIDS.a },
    b: { name: t.declarations.b.name, desc: t.declarations.b.desc, ...DECLARATION_GRIDS.b },
    c: { name: t.declarations.c.name, desc: t.declarations.c.desc, ...DECLARATION_GRIDS.c },
    d: { name: t.declarations.d.name, desc: t.declarations.d.desc, ...DECLARATION_GRIDS.d },
    e: { name: t.declarations.e.name, desc: t.declarations.e.desc, ...DECLARATION_GRIDS.e },
  }), [t]);

  const addSection = () => {
    onChange({
      sections: [...layout.sections, createDefaultSection()],
    });
    setExpandedIndex(layout.sections.length);
  };

  const removeSection = (index: number) => {
    if (layout.sections.length <= 1) return;
    onChange({
      sections: layout.sections.filter((_, i) => i !== index),
    });
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = layout.sections.map((s, i) => {
      if (i !== index) return s;
      const updated = { ...s, ...updates };

      // Auto-adjust grid if not allowed for declaration
      const grids = DECLARATION_GRIDS[updated.decl];
      if (!grids.grids.includes(updated.grid)) {
        updated.grid = grids.grids[0];
      }

      // Filter out invalid slots
      updated.slots = updated.slots.filter((slot) => grids.slots.includes(slot.type));
      if (updated.slots.length === 0) {
        updated.slots = [createDefaultSlot(grids.slots[0])];
      }

      return updated;
    });
    onChange({ sections: newSections });
  };

  const addSlot = (sectionIndex: number, type: SlotType) => {
    const section = layout.sections[sectionIndex];
    updateSection(sectionIndex, {
      slots: [...section.slots, createDefaultSlot(type)],
    });
  };

  const updateSlot = (sectionIndex: number, slotIndex: number, content: string) => {
    const section = layout.sections[sectionIndex];
    const newSlots = section.slots.map((s, i) =>
      i === slotIndex ? { ...s, content } : s
    );
    updateSection(sectionIndex, { slots: newSlots });
  };

  const removeSlot = (sectionIndex: number, slotIndex: number) => {
    const section = layout.sections[sectionIndex];
    if (section.slots.length <= 1) return;
    updateSection(sectionIndex, {
      slots: section.slots.filter((_, i) => i !== slotIndex),
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= layout.sections.length) return;

    const newSections = [...layout.sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onChange({ sections: newSections });
    setExpandedIndex(newIndex);
  };

  return (
    <div className="section-editor">
      <div className="section-list">
        {layout.sections.map((section, index) => {
          const info = DECLARATION_INFO[section.decl];
          const validation = validateSection(section);
          const isExpanded = expandedIndex === index;
          const canUseD = layout.sections.length >= 5;

          return (
            <div
              key={index}
              className={`section-item ${isExpanded ? "expanded" : ""} ${!validation.valid ? "has-error" : ""}`}
            >
              <div
                className="section-header"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <span className="section-type">{section.decl.toUpperCase()}</span>
                <span className="section-name">{info.name}</span>
                <span className="section-grid">Grid: {section.grid}</span>
                <div className="section-actions">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveSection(index, "up"); }}
                    disabled={index === 0}
                    title={t.common.moveUp}
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveSection(index, "down"); }}
                    disabled={index === layout.sections.length - 1}
                    title={t.common.moveDown}
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSection(index); }}
                    disabled={layout.sections.length <= 1}
                    title={t.common.delete}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="section-body">
                  {!validation.valid && (
                    <div className="validation-errors">
                      {validation.errors.map((err, i) => (
                        <p key={i} className="error-text">{err}</p>
                      ))}
                    </div>
                  )}

                  <div className="section-settings">
                    <div className="form-group">
                      <label>{t.design.sectionType}</label>
                      <select
                        value={section.decl}
                        onChange={(e) => updateSection(index, { decl: e.target.value as DeclarationType })}
                      >
                        {(Object.keys(DECLARATION_INFO) as DeclarationType[]).map((d) => (
                          <option
                            key={d}
                            value={d}
                            disabled={d === "d" && !canUseD}
                          >
                            {d.toUpperCase()} - {DECLARATION_INFO[d].name}
                            {d === "d" && !canUseD ? ` (≥5 ${t.common.sectionsRequired})` : ""}
                          </option>
                        ))}
                      </select>
                      <small>{info.desc}</small>
                    </div>

                    <div className="form-group">
                      <label>{t.design.grid}</label>
                      <select
                        value={section.grid}
                        onChange={(e) => updateSection(index, { grid: e.target.value as GridPattern })}
                      >
                        {info.grids.map((g) => (
                          <option key={g} value={g}>
                            {g === "a" ? t.design.gridCentered : g === "b" ? t.design.gridTwoCol : t.design.gridTwoColMirror}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="slots-section">
                    <label>{t.design.contents}</label>
                    {section.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="slot-item">
                        <div className="slot-header">
                          <span className="slot-type">{SLOT_INFO[slot.type]}</span>
                          <button
                            onClick={() => removeSlot(index, slotIndex)}
                            disabled={section.slots.length <= 1}
                          >
                            ✕
                          </button>
                        </div>
                        <textarea
                          value={slot.content}
                          onChange={(e) => updateSlot(index, slotIndex, e.target.value)}
                          placeholder={slot.type === "list" ? t.common.listPlaceholder : t.common.enterContent}
                          rows={slot.type === "list" ? 2 : 3}
                        />
                      </div>
                    ))}

                    <div className="add-slot">
                      <span>{t.design.addSlot}</span>
                      {info.slots.map((slotType) => (
                        <button
                          key={slotType}
                          onClick={() => addSlot(index, slotType)}
                          className="btn-small"
                        >
                          + {slotType}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn btn-secondary" onClick={addSection}>
        {t.design.addSection}
      </button>
    </div>
  );
}
