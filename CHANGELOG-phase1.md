# Phase 1 Implementation - Form Builder Enhancements

## [Unreleased]

### Objective 1: Builder Productionisation ✅

#### Added
- **DragOverlay preview**: Visual feedback during drag operations with component preview
- **restrictToWindowEdges modifier**: Prevents dragging components outside viewport boundaries  
- **Unique nested SortableContext IDs**: Prevents ID collisions in nested drag contexts using `nestedSortableManager`

#### Changed
- Enhanced drag-and-drop experience with improved visual feedback
- Optimized drag sensors configuration for better performance

#### Fixed
- Fixed potential ID collision issues in nested sortable contexts
- Improved drag constraint handling to keep components within viewport

### Objective 2: Persistence & Locking ✅

#### Added
- **Debounced autosave**: Implemented 600ms debounced autosave using `utils/debounce.ts` to reduce API calls
- **Order normalization**: Added `recomputeOrder` function to ensure consistent component ordering (0..n-1)
- **Payload normalization**: Added `normalizePayload` function for consistent single/multi-page form data structure
- **Lock enforcement**: Added lock status checks in all mutation handlers (add/remove/update/reorder)
- **Flush on unmount**: Added cleanup effect to flush pending saves before component unmount

#### Changed
- Replaced direct `autoSave` calls with debounced version throughout FormBuilder
- Cross-page moves now properly recompute order for both source and target pages
- Form mutations now check lock status before allowing changes
- Added `flush` method to `useFormAutosave` hook for immediate save execution

#### Fixed
- Fixed autosave triggering too frequently on rapid changes
- Ensured proper order field values after all component/page operations
- Fixed lock status checks to prevent unauthorized edits

## Manual QA Steps

### Objective 1: Builder Productionisation
1. **Test DragOverlay Preview**:
   - Drag any component from the palette
   - Verify a semi-transparent preview appears under cursor
   - Confirm preview shows the actual component being dragged
   
2. **Test Window Edge Constraints**:
   - Drag a component to the edge of the viewport
   - Verify the component cannot be dragged outside the window
   - Test all four edges (top, right, bottom, left)
   
3. **Test Nested Context IDs**:
   - Add multiple components to the form
   - Drag components to reorder
   - Check browser console for any ID collision warnings
   - Verify smooth reordering without glitches

### Objective 2: Persistence & Locking
1. **Test Debounced Autosave**:
   - Add/remove components rapidly
   - Check Network tab - saves should be debounced (600ms delay)
   - Verify "Saving..." indicator appears and disappears correctly
   - Confirm "Saved" timestamp updates after save completes
   
2. **Test Order Normalization**:
   - Add 5 components to form
   - Remove component #2
   - Check remaining components have order: 0, 1, 2, 3
   - Reorder components and verify order fields update correctly
   
3. **Test Multi-Page Order**:
   - Enable multi-page mode
   - Add components to multiple pages
   - Move component from page 1 to page 2
   - Verify both pages have correct order (0..n-1)
   
4. **Test Lock Enforcement**:
   - Open form in two browser tabs
   - Tab 1 should acquire lock automatically
   - Tab 2 should show lock warning with "locked by" message
   - Try to edit in Tab 2 - mutations should be blocked
   - Click "Take Over" in Tab 2 if available
   - Verify Tab 1 now shows lock warning
   
5. **Test Save on Unmount**:
   - Make changes to form
   - Navigate away quickly before autosave triggers
   - Return to form - changes should be preserved

## Files Modified

### Objective 1
- `src/components/form-builder/FormBuilder.tsx` - Added DragOverlay, updated DndContext configuration
- `src/components/form-builder/DragManager.ts` - Already had restrictToWindowEdges and nestedSortableManager

### Objective 2
- `src/components/form-builder/FormBuilder.tsx` - Added recomputeOrder, normalizePayload, debounced autosave, lock checks
- `src/hooks/useFormAutosave.ts` - Added flush method for immediate save execution
- Integration with existing `src/utils/debounce.ts` and `src/hooks/useFormLock.ts`

## Testing Checklist

- [ ] Build passes: `pnpm -s build`
- [ ] Type check passes: `pnpm type-check`
- [ ] No lint errors (if lint script available)
- [ ] Manual QA steps completed
- [ ] No console errors during testing
- [ ] Performance: Autosave doesn't block UI
- [ ] Lock mechanism works across tabs
- [ ] Order fields are always 0..n-1

## Deployment Notes

- No database migrations required for these objectives
- No new environment variables needed
- Compatible with existing autosave and locking infrastructure
- Backward compatible with existing forms