export interface Annotation { id: string; page: number; rect: [number, number, number, number]; note?: string; color?: string; }
export interface AnnotationState { byId: Record<string, Annotation>; order: string[]; }
export function addAnnotation(state: AnnotationState, a: Annotation): AnnotationState {
  return { byId: { ...state.byId, [a.id]: a }, order: [...state.order, a.id] };
}
export function updateAnnotation(state: AnnotationState, a: Partial<Annotation> & { id: string }): AnnotationState {
  const ex = state.byId[a.id]; if (!ex) return state;
  const next = { ...ex, ...a };
  return { byId: { ...state.byId, [a.id]: next }, order: state.order };
}
export function removeAnnotation(state: AnnotationState, id: string): AnnotationState {
  const { [id]: _, ...rest } = state.byId;
  return { byId: rest, order: state.order.filter(x => x !== id) };
}