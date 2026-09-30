// Nexora SalonOS — Phase 3.4 Central Category & Template Resolver
// Single source of truth resolving category -> templates -> themes -> default services & content.

import { CategoryDefinition, CategoryId, TemplateDefinition, SectionType, DefaultServiceSeed, DefaultPackageSeed } from '../types/categoryEngine';
import { CATEGORIES_REGISTRY } from '../config/categoriesRegistry';
import { TEMPLATES_REGISTRY } from '../config/templatesRegistry';
import { ThemePreset } from '../types';
import { PLATFORM_CONFIG } from '../config/platformConfig';

export interface ResolvedTemplateData {
  category: CategoryDefinition;
  template: TemplateDefinition;
  themePreset: ThemePreset;
  themeTokens: typeof PLATFORM_CONFIG.themes[ThemePreset];
  sections: SectionType[];
  defaultServices: DefaultServiceSeed[];
  defaultPackages: DefaultPackageSeed[];
}

/**
 * 1. Resolves all available templates for a specific category id.
 * Fails safely by returning an empty array if category is unknown.
 */
export function getTemplatesForCategory(categoryId: string): TemplateDefinition[] {
  return TEMPLATES_REGISTRY.filter((t) => t.category === categoryId);
}

/**
 * 2. Resolves a category definition by ID.
 * Fails safely by returning null if not found.
 */
export function getCategoryDefinition(categoryId: string): CategoryDefinition | null {
  return CATEGORIES_REGISTRY[categoryId as CategoryId] || null;
}

/**
 * 3. Resolves a template definition by ID.
 */
export function getTemplateDefinition(templateId: string): TemplateDefinition | null {
  return TEMPLATES_REGISTRY.find((t) => t.templateId === templateId) || null;
}

/**
 * 4. Resolves the full template, theme tokens, default services, and sections in a single unified call.
 * Gracefully falls back to barber defaults if category or template is unknown.
 */
export function resolveTemplateData(
  categoryId: string,
  templateId?: string
): ResolvedTemplateData | null {
  const category = getCategoryDefinition(categoryId);
  if (!category) {
    return null; // Safe failure for unknown category
  }

  const categoryTemplates = getTemplatesForCategory(categoryId);
  const template =
    (templateId ? getTemplateDefinition(templateId) : null) ||
    categoryTemplates[0] ||
    TEMPLATES_REGISTRY[0];

  const themePreset: ThemePreset = template ? template.theme : category.defaultTheme;
  const themeTokens = PLATFORM_CONFIG.themes[themePreset] || PLATFORM_CONFIG.themes.luxury;

  return {
    category,
    template,
    themePreset,
    themeTokens,
    sections: template.sections || category.homepageSections,
    defaultServices: category.defaultServices,
    defaultPackages: category.defaultPackages
  };
}

/**
 * 5. Returns all registered category IDs
 */
export function getAllCategoryIds(): CategoryId[] {
  return Object.keys(CATEGORIES_REGISTRY) as CategoryId[];
}
