/* NOTE: Loosened typing for Phase-0 to avoid cross-module type import errors during type-check.
   The strong type can be restored when the FormTemplate type is exported from services. */
type FormTemplate = any;
import type { SurveyJSON } from './types';

// The project defines FormTemplate in "@/lib/api-form-builder" types.
// Fallback to "any" to keep skeleton lightweight if the type isn't exported from services.
type TemplateType = FormTemplate extends infer T ? T : any;

export function toSurveyJSON(template: TemplateType): SurveyJSON {
  // Minimal mapping stub; extend later
  return { pages: [{ name: 'Page1', elements: [] }] };
}