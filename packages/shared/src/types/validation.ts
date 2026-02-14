/**
 * Consistent validation error shape used across UI and API
 */
export interface ValidationErrorShape {
  /**
   * Field-level errors keyed by field name
   * Example: { "email": "Invalid email format", "name": "Required" }
   */
  fieldErrors: Record<string, string>;

  /**
   * Row-level errors (for table editing scenarios)
   * Example: ["Row 3: Duplicate email detected"]
   */
  rowErrors: string[];

  /**
   * Global errors that don't belong to specific fields
   * Example: ["Total ownership percentage exceeds 100%"]
   */
  globalErrors: string[];
}

/**
 * Helper to create an empty validation error shape
 */
export function createEmptyValidationError(): ValidationErrorShape {
  return {
    fieldErrors: {},
    rowErrors: [],
    globalErrors: [],
  };
}

/**
 * Check if validation error shape has any errors
 */
export function hasValidationErrors(errors: ValidationErrorShape): boolean {
  return (
    Object.keys(errors.fieldErrors).length > 0 ||
    errors.rowErrors.length > 0 ||
    errors.globalErrors.length > 0
  );
}
