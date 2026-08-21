import { useCallback, useEffect, useState } from 'react';

export type UserRole = 'admin' | 'supplierA' | 'supplierB' | 'supplierC';

/** 与 demo-data.demoSuppliers 主键一致：A=1, B=2, C=3 */
export const ROLE_INFO: Record<UserRole, { label: string; supplierId: number }> =
  {
    admin: { label: 'test-admin', supplierId: 0 },
    supplierA: { label: 'test-A', supplierId: 1 },
    supplierB: { label: 'test-B', supplierId: 2 },
    supplierC: { label: 'test-C', supplierId: 3 },
  };

export const CARBON_USER_ROLE_STORAGE_KEY = 'carbon_user_role';
export const CARBON_USER_ROLE_CHANGED_EVENT = 'carbon-user-role-changed';

export function readStoredUserRole(): UserRole {
  if (typeof window === 'undefined') return 'admin';
  const savedRole = localStorage.getItem(
    CARBON_USER_ROLE_STORAGE_KEY,
  ) as UserRole;
  return savedRole && ROLE_INFO[savedRole] ? savedRole : 'admin';
}

export function writeStoredUserRole(role: UserRole) {
  localStorage.setItem(CARBON_USER_ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new CustomEvent(CARBON_USER_ROLE_CHANGED_EVENT));
}

export function useUserRole() {
  const [role, setRoleState] = useState<UserRole>(() => readStoredUserRole());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRoleState(readStoredUserRole());
    setIsLoaded(true);

    const onRoleChanged = () => {
      setRoleState(readStoredUserRole());
    };
    window.addEventListener(CARBON_USER_ROLE_CHANGED_EVENT, onRoleChanged);
    return () => {
      window.removeEventListener(CARBON_USER_ROLE_CHANGED_EVENT, onRoleChanged);
    };
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    writeStoredUserRole(newRole);
    setRoleState(newRole);
  }, []);

  return {
    role,
    setRole,
    isLoaded,
    isAdmin: role === 'admin',
    supplierId: ROLE_INFO[role].supplierId,
    roleLabel: ROLE_INFO[role].label,
  };
}

export function getCurrentSupplierId(): number {
  return ROLE_INFO[readStoredUserRole()].supplierId;
}
