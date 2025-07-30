import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { APIDocumentation } from '@/components/admin/api-documentation';

interface DashboardTabsProps {
  formTemplates: number;
  subscriptions: number;
  customers: number;
  customerSubscriptions: number;
  recentActivity: Array<{
    action: string;
    user: string;
    time: string;
    type: string;
  }>;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  formTemplates = 12,
  subscriptions = 45,
  customers = 38,
  customerSubscriptions = 156,
  recentActivity = [
    {
      action: "New assessment created",
      user: "Dr. Smith",
      time: "2 minutes ago",
      type: "assessment"
    },
    {
      action: "Session completed",
      user: "Jane Doe",
      time: "15 minutes ago",
      type: "session"
    },
    {
      action: "Report generated",
      user: "Dr. Johnson",
      time: "1 hour ago",
      type: "report"
    }
  ]
}) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
        <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
        <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
        <TabsTrigger value="clinical" className="text-sm">Clinical</TabsTrigger>
        <TabsTrigger value="api" className="text-sm">API</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Clinical Workflow Status</span>
              </CardTitle>
              <CardDescription>
                Current status of clinical operations and assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Active Assessments</span>
                    <span className="font-medium">{formTemplates} forms</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Compliance Rate</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className={`rounded-full p-1 mt-0.5 ${
                    activity.type === 'assessment' ? 'bg-blue-100' :
                    activity.type === 'session' ? 'bg-green-100' :
                    activity.type === 'report' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'assessment' ? 'bg-blue-600' :
                      activity.type === 'session' ? 'bg-green-600' :
                      activity.type === 'report' ? 'bg-purple-600' : 'bg-orange-600'
                    }`}></div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-slate-500">{activity.user}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Platform Subscriptions</CardTitle>
              <CardDescription>Clinical subscription analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Subscriptions</span>
                  <span className="font-bold">{subscriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Active Customers</span>
                  <span className="font-bold">{customers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Customer Subscriptions</span>
                  <span className="font-bold">{customerSubscriptions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    All systems operational
                  </AlertDescription>
                </Alert>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">API Response Time</span>
                    <span className="text-green-600 font-medium">145ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Database Connection</span>
                    <span className="text-green-600 font-medium">Healthy</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Clinical Tab */}
      <TabsContent value="clinical" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Clinical Compliance Monitoring</span>
            </CardTitle>
            <CardDescription>
              HIPAA, ASHA, and AOTA compliance tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">100%</div>
                <div className="text-sm text-green-600">HIPAA Compliance</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">100%</div>
                <div className="text-sm text-blue-600">ASHA Standards</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">100%</div>
                <div className="text-sm text-purple-600">AOTA Guidelines</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* API Tab */}
      <TabsContent value="api" className="space-y-6">
        <div>
          <APIDocumentation />
        </div>
      </TabsContent>
    </Tabs>
  );
};