import type { ValidationResult } from "../hooks";

type ValidationDisplayProps = {
  validation: ValidationResult;
  showWarnings?: boolean;
};

export function ValidationDisplay({ validation, showWarnings = true }: ValidationDisplayProps) {
  if (validation.isValid && validation.warnings.length === 0) {
    return null;
  }

  return (
    <div className="validation-display">
      {validation.errors.length > 0 && (
        <div className="validation-section errors">
          <h4>❌ Fehler ({validation.errors.length})</h4>
          <ul>
            {validation.errors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {showWarnings && validation.warnings.length > 0 && (
        <div className="validation-section warnings">
          <h4>⚠️ Hinweise ({validation.warnings.length})</h4>
          <ul>
            {validation.warnings.map((warning, i) => (
              <li key={i}>{warning.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
