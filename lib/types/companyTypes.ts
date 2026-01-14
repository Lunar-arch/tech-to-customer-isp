/* File: companyTypes.ts
Overview: Type definitions for company-related operations
Types:
  CompanyDTO: Canonical company shape exposed via API
  CreateCompanyInput: Input for creating a new company
  CreateCompanySuccess: Success response for company creation
  GetCompanyInput: Input for fetching company details
  GetCompanySuccess: Success response with company data
  UpdateCompanySettingsInput: Input for updating company settings
  UpdateCompanySettingsSuccess: Success response for settings update
*/

import { DispatchTimeSettings } from './jobTypes';

/**
 * Canonical company shape exposed via API
 */
export type CompanyDTO = {
  id: string;
  name: string;
  createdAt: string;  // ISO 8601

  // Company settings
  dispatchSettings: DispatchTimeSettings;
};

/**
 * Create company (signup)
 */
export type CreateCompanyInput = {
  name: string;
  adminEmail: string;     // First admin user for this company
  adminPassword: string;  // Will be hashed internally
  dispatchSettings?: DispatchTimeSettings;  // Optional; defaults applied internally
};

export type CreateCompanySuccess = {
  companyId: string;
  adminUserId: string;  // The first admin user that was created
  company?: CompanyDTO; // Optional: return full company for convenience
};

/**
 * Get company
 */
export type GetCompanyInput = {
  companyId: string;
};

export type GetCompanySuccess = {
  company: CompanyDTO;
};

/**
 * Update company settings
 */
export type UpdateCompanySettingsInput = {
  companyId: string;
  dispatchSettings: Partial<DispatchTimeSettings>;  // Only update provided fields
};

export type UpdateCompanySettingsSuccess = {
  success: true;
  company?: CompanyDTO;  // Optional: return updated company
};
