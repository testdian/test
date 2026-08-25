import { useCallback, useEffect, useState } from 'react';

import {
  defaultDemoData,
  DEMO_STORAGE_KEY,
  normalizeFormTemplate,
  type DemoData,
} from '../data/demo-data';

function loadDemoData(): DemoData {
  if (typeof window === 'undefined') return defaultDemoData();
  try {
    const defaults = defaultDemoData();
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as DemoData;
    return {
      ...defaults,
      ...parsed,
      formSubmissions: (parsed.formSubmissions || defaults.formSubmissions).map(
        sub => {
          const fallback = defaults.formSubmissions.find(
            item => item.id === sub.id,
          );
          return {
            ...sub,
            task_id: sub.task_id ?? fallback?.task_id,
            task_name: sub.task_name ?? fallback?.task_name,
            dimension_scores: sub.dimension_scores?.length
              ? sub.dimension_scores
              : fallback?.dimension_scores,
            summary: sub.summary ?? fallback?.summary,
            recommendations: sub.recommendations?.length
              ? sub.recommendations
              : fallback?.recommendations,
            model_version: sub.model_version ?? fallback?.model_version,
            generated_at: sub.generated_at ?? fallback?.generated_at,
            status: sub.status ?? fallback?.status,
            valid_until: sub.valid_until || fallback?.valid_until,
          };
        },
      ),
      researchSubmissions: (() => {
        const items =
          parsed.researchSubmissions || defaults.researchSubmissions;
        const existingIds = new Set(items.map(item => item.id));
        const missing = defaults.researchSubmissions.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...items, ...missing] : items;
      })(),
      demoSuppliers: (() => {
        const suppliers = (parsed.demoSuppliers || defaults.demoSuppliers).map(
          supplier => {
            const fallback = defaults.demoSuppliers.find(
              item => item.id === supplier.id,
            );
            return {
              ...supplier,
              category: fallback?.category ?? supplier.category,
            };
          },
        );
        const existingIds = new Set(suppliers.map(item => item.id));
        const missing = defaults.demoSuppliers.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...suppliers, ...missing] : suppliers;
      })(),
      formTemplates: (() => {
        const seeds = defaults.formTemplates.map(normalizeFormTemplate);
        const seedIds = new Set(seeds.map(item => item.id));
        const custom = (parsed.formTemplates || [])
          .filter(item => !seedIds.has(item.id))
          .map(normalizeFormTemplate);
        return [...seeds, ...custom];
      })(),
      reductionTargets: (() => {
        const items = (
          parsed.reductionTargets || defaults.reductionTargets
        ).map(item => {
          const fallback = defaults.reductionTargets.find(
            seed => seed.id === item.id,
          );
          return {
            ...item,
            status:
              item.status === 'pending'
                ? 'draft'
                : item.status === 'rejected'
                ? 'draft'
                : item.status,
            categories: item.categories?.length
              ? item.categories
              : fallback?.categories,
            org_carbon: item.org_carbon ?? fallback?.org_carbon,
            product_carbon: item.product_carbon ?? fallback?.product_carbon,
          };
        });
        const existingIds = new Set(items.map(item => item.id));
        const missing = defaults.reductionTargets.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...items, ...missing] : items;
      })(),
      reductionPlans: (() => {
        const items = (parsed.reductionPlans || defaults.reductionPlans).map(
          item => {
            const fallback = defaults.reductionPlans.find(
              seed => seed.id === item.id,
            );
            return {
              ...item,
              status:
                item.status === 'draft' ? ('to_fill' as const) : item.status,
              reduction_month:
                item.reduction_month ?? fallback?.reduction_month,
              reduce_this_month:
                item.reduce_this_month ?? fallback?.reduce_this_month,
              actual_emission:
                item.actual_emission ?? fallback?.actual_emission,
              scope1_actual_emission:
                item.scope1_actual_emission ??
                fallback?.scope1_actual_emission ??
                (item.reduction_category === 'org'
                  ? item.actual_emission
                  : undefined),
              scope1_monthly_reduction:
                item.scope1_monthly_reduction ??
                fallback?.scope1_monthly_reduction ??
                (item.reduction_category === 'org'
                  ? item.monthly_reduction
                  : undefined),
              scope2_actual_emission:
                item.scope2_actual_emission ?? fallback?.scope2_actual_emission,
              scope2_monthly_reduction:
                item.scope2_monthly_reduction ??
                fallback?.scope2_monthly_reduction,
              actual_product_footprint:
                item.actual_product_footprint ??
                fallback?.actual_product_footprint ??
                (item.reduction_category === 'product'
                  ? item.actual_emission
                  : undefined),
              product_monthly_reduction:
                item.product_monthly_reduction ??
                fallback?.product_monthly_reduction ??
                (item.reduction_category === 'product'
                  ? item.monthly_reduction
                  : undefined),
              reduction_category:
                item.reduction_category ?? fallback?.reduction_category,
              monthly_reduction:
                item.monthly_reduction ?? fallback?.monthly_reduction,
            };
          },
        );
        const existingIds = new Set(items.map(item => item.id));
        const missing = defaults.reductionPlans.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...items, ...missing] : items;
      })(),
      progressReports: (() => {
        const items = parsed.progressReports || defaults.progressReports;
        const existingIds = new Set(items.map(item => item.id));
        const missing = defaults.progressReports.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...items, ...missing] : items;
      })(),
      questionnaires: (() => {
        const items = (parsed.questionnaires || defaults.questionnaires).map(
          item => {
            const fallback = defaults.questionnaires.find(
              seed => seed.id === item.id,
            );
            return {
              ...item,
              template_id: item.template_id ?? fallback?.template_id ?? null,
              template_name:
                item.template_name ?? fallback?.template_name ?? null,
              form_fields: item.form_fields?.length
                ? item.form_fields
                : fallback?.form_fields || [],
              supplier_status: {
                ...fallback?.supplier_status,
                ...item.supplier_status,
              },
              supplier_answers: {
                ...fallback?.supplier_answers,
                ...item.supplier_answers,
              },
            };
          },
        );
        const existingIds = new Set(items.map(item => item.id));
        const missing = defaults.questionnaires.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...items, ...missing] : items;
      })(),
      certificates: (() => {
        const items = (parsed.certificates || defaults.certificates).map(
          cert => {
            const fallback = defaults.certificates.find(
              item => item.id === cert.id,
            );
            return {
              ...cert,
              attachments: cert.attachments?.length
                ? cert.attachments
                : fallback?.attachments || [],
              versions: (cert.versions || []).map(version => {
                const fallbackVersion = fallback?.versions.find(
                  v => v.version === version.version,
                );
                return {
                  ...version,
                  attachments: version.attachments?.length
                    ? version.attachments
                    : fallbackVersion?.attachments || cert.attachments || [],
                };
              }),
            };
          },
        );
        const existingIds = new Set(items.map(item => item.id));
        const missing = defaults.certificates.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...items, ...missing] : items;
      })(),
      trainings: (() => {
        const items = (parsed.trainings || defaults.trainings).map(item => {
          const fallback = defaults.trainings.find(seed => seed.id === item.id);
          return {
            ...item,
            updated_by: item.updated_by ?? fallback?.updated_by,
          };
        });
        const existingIds = new Set(items.map(item => item.id));
        const missing = defaults.trainings.filter(
          item => !existingIds.has(item.id),
        );
        return missing.length ? [...items, ...missing] : items;
      })(),
      nextId: { ...defaults.nextId, ...(parsed.nextId || {}) },
    };
  } catch {
    return defaultDemoData();
  }
}

export function useDemoStore() {
  const [data, setData] = useState<DemoData>(defaultDemoData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(loadDemoData());
    setReady(true);
  }, []);

  const save = useCallback((next: DemoData) => {
    setData(next);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const update = useCallback((fn: (d: DemoData) => DemoData) => {
    setData(prev => {
      const next = fn(prev);
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { data, save, update, ready };
}
