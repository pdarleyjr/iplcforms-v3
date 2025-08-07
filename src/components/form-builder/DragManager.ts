import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import type {
  CollisionDetection,
  UniqueIdentifier,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  Active,
  Over,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToWindowEdges, restrictToVerticalAxis, restrictToHorizontalAxis } from '@dnd-kit/modifiers';

/**
 * Custom collision detection with fallback strategy
 * Primary: closestCenter for precise positioning
 * Fallback: pointerWithin → rectIntersection for edge cases
 */
export const customCollisionDetection: CollisionDetection = (args) => {
  // First try closestCenter for most accurate results
  const closestCenterCollisions = closestCenter(args);
  
  if (closestCenterCollisions.length > 0) {
    return closestCenterCollisions;
  }
  
  // Fallback to pointerWithin for touch/pointer interactions
  const pointerWithinCollisions = pointerWithin(args);
  
  if (pointerWithinCollisions.length > 0) {
    return pointerWithinCollisions;
  }
  
  // Final fallback to rectIntersection for overlapping elements
  return rectIntersection(args);
};

/**
 * Sensor configuration for cross-platform drag support
 * Includes optimizations for touch devices and keyboard navigation
 */
export const useDragSensors = () => {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance to prevent accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // Delay for touch to prevent scroll interference
        tolerance: 5, // Tolerance for touch movement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
};

/**
 * Configuration for different drag contexts
 */
export const DragContextConfig = {
  // Form builder configuration
  formBuilder: {
    collisionDetection: customCollisionDetection,
    modifiers: [restrictToWindowEdges],
    autoScroll: {
      threshold: {
        x: 0.2,
        y: 0.2,
      },
      acceleration: 10,
    },
  },
  
  // Vertical list configuration
  verticalList: {
    collisionDetection: closestCenter,
    modifiers: [restrictToVerticalAxis, restrictToWindowEdges],
    strategy: verticalListSortingStrategy,
  },
  
  // Horizontal list configuration
  horizontalList: {
    collisionDetection: closestCenter,
    modifiers: [restrictToHorizontalAxis, restrictToWindowEdges],
    strategy: horizontalListSortingStrategy,
  },
};

/**
 * Utility function to handle array reordering
 */
export const reorderArray = <T extends { id: string | number; order?: number }>(
  items: T[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier
): T[] => {
  const oldIndex = items.findIndex((item) => item.id === activeId);
  const newIndex = items.findIndex((item) => item.id === overId);
  
  if (oldIndex === -1 || newIndex === -1) {
    return items;
  }
  
  const reorderedItems = arrayMove(items, oldIndex, newIndex);
  
  // Update order property if it exists
  return reorderedItems.map((item, index) => ({
    ...item,
    order: index,
  }));
};

/**
 * Utility function to generate unique IDs for drag items
 */
export const generateDragId = (prefix: string = 'drag'): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Type guard to check if an element is draggable
 */
export const isDraggable = (element: Active | Over | null): element is Active | Over => {
  return element !== null && element.id !== undefined;
};

/**
 * Helper to extract data from drag events
 */
export const getDragData = <T = any>(event: DragStartEvent | DragEndEvent | DragOverEvent): T | null => {
  if (!event.active.data.current) {
    return null;
  }
  return event.active.data.current as T;
};

/**
 * Configuration for nested sortable contexts
 * Ensures unique IDs per context to prevent conflicts
 */
export class NestedSortableManager {
  private contexts: Map<string, Set<UniqueIdentifier>> = new Map();
  
  /**
   * Register a sortable context with its items
   */
  registerContext(contextId: string, itemIds: UniqueIdentifier[]): void {
    this.contexts.set(contextId, new Set(itemIds));
  }
  
  /**
   * Get unique item IDs for a context
   */
  getContextItems(contextId: string): UniqueIdentifier[] {
    const items = this.contexts.get(contextId);
    return items ? Array.from(items) : [];
  }
  
  /**
   * Ensure item IDs are unique across all contexts
   */
  ensureUniqueIds(contextId: string, itemIds: UniqueIdentifier[]): UniqueIdentifier[] {
    const allOtherIds = new Set<UniqueIdentifier>();
    
    // Collect IDs from all other contexts
    this.contexts.forEach((ids, id) => {
      if (id !== contextId) {
        ids.forEach(itemId => allOtherIds.add(itemId));
      }
    });
    
    // Generate new IDs for any conflicts
    return itemIds.map(id => {
      if (allOtherIds.has(id)) {
        return generateDragId(`${contextId}_${id}`);
      }
      return id;
    });
  }
  
  /**
   * Clear a context
   */
  clearContext(contextId: string): void {
    this.contexts.delete(contextId);
  }
  
  /**
   * Clear all contexts
   */
  clearAll(): void {
    this.contexts.clear();
  }
}

/**
 * Export a singleton instance for managing nested contexts
 */
export const nestedSortableManager = new NestedSortableManager();

/**
 * Custom hook for managing drag state
 */
export interface DragState<T = any> {
  isDragging: boolean;
  draggedItem: T | null;
  dragOverId: UniqueIdentifier | null;
}

export const createDragStateManager = <T = any>() => {
  let state: DragState<T> = {
    isDragging: false,
    draggedItem: null,
    dragOverId: null,
  };
  
  const listeners = new Set<(state: DragState<T>) => void>();
  
  const setState = (updates: Partial<DragState<T>>) => {
    state = { ...state, ...updates };
    listeners.forEach(listener => listener(state));
  };
  
  return {
    getState: () => state,
    setState,
    subscribe: (listener: (state: DragState<T>) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    handleDragStart: (event: DragStartEvent, item: T) => {
      setState({
        isDragging: true,
        draggedItem: item,
        dragOverId: null,
      });
    },
    handleDragOver: (event: DragOverEvent) => {
      setState({
        dragOverId: event.over?.id || null,
      });
    },
    handleDragEnd: () => {
      setState({
        isDragging: false,
        draggedItem: null,
        dragOverId: null,
      });
    },
  };
};