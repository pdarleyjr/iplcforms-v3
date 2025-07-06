import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Lock, Save, AlertCircle } from 'lucide-react';
import { ROLES, RESOURCES, PERMISSIONS } from '../../lib/utils/rbac';

interface PermissionData {
  role: string;
  permissions: {
    [resource: string]: string[];
  };
}

export function PermissionMatrix() {
  const [permissionData, setPermissionData] = useState<PermissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modifiedPermissions, setModifiedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/permissions', {
        headers: {
          'X-Customer-ID': localStorage.getItem('customerId') || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }

      const data = await response.json() as { permissions: PermissionData[] };
      setPermissionData(data.permissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (role: string, resource: string, permission: string): boolean => {
    const roleData = permissionData.find(p => p.role === role);
    return roleData?.permissions[resource]?.includes(permission) || false;
  };

  const togglePermission = (role: string, resource: string, permission: string) => {
    const updatedData = permissionData.map(roleData => {
      if (roleData.role === role) {
        const resourcePermissions = roleData.permissions[resource] || [];
        const hasPermission = resourcePermissions.includes(permission);
        
        return {
          ...roleData,
          permissions: {
            ...roleData.permissions,
            [resource]: hasPermission
              ? resourcePermissions.filter(p => p !== permission)
              : [...resourcePermissions, permission]
          }
        };
      }
      return roleData;
    });

    setPermissionData(updatedData);
    setModifiedPermissions(new Set([...modifiedPermissions, `${role}-${resource}-${permission}`]));
  };

  const savePermissions = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/admin/permissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Customer-ID': localStorage.getItem('customerId') || ''
        },
        body: JSON.stringify({ permissions: permissionData })
      });

      if (!response.ok) {
        throw new Error('Failed to save permissions');
      }

      setModifiedPermissions(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Permission Matrix
        </CardTitle>
        <CardDescription>
          Configure permissions for each role across different resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background">Resource</TableHead>
                {Object.keys(PERMISSIONS).map(permission => (
                  <TableHead key={permission} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-medium uppercase">
                        {permission}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(ROLES).map(role => (
                <React.Fragment key={role}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={Object.keys(PERMISSIONS).length + 1}>
                      <div className="flex items-center gap-2">
                        <Badge variant={role === 'admin' ? 'destructive' : 'default'}>
                          {role.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {role === 'admin' && '(Has all permissions)'}
                          {role === 'patient' && '(Limited to own data)'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {Object.keys(RESOURCES).map(resource => (
                    <TableRow key={`${role}-${resource}`}>
                      <TableCell className="sticky left-0 bg-background font-medium">
                        {resource.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </TableCell>
                      {Object.keys(PERMISSIONS).map(permission => {
                        const isAllowed = hasPermission(role, resource, permission);
                        const isModified = modifiedPermissions.has(`${role}-${resource}-${permission}`);
                        const isDisabled = role === 'admin' || 
                          (role === 'patient' && !['own_submissions', 'own_profile'].includes(resource));
                        
                        return (
                          <TableCell key={permission} className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={isAllowed}
                                disabled={isDisabled}
                                onCheckedChange={() => togglePermission(role, resource, permission)}
                                className={isModified ? 'border-blue-500' : ''}
                              />
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {modifiedPermissions.size > 0 && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={savePermissions}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes ({modifiedPermissions.size})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}