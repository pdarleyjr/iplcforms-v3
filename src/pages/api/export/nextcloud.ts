import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    // Get Nextcloud configuration
    const configStr = await env.CACHE_KV.get('integration:nextcloud:config');
    const password = await env.CACHE_KV.get('integration:nextcloud:password');
    
    if (!configStr || !password) {
      return new Response(JSON.stringify({ 
        error: 'Nextcloud integration not configured' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const config = JSON.parse(configStr);
    
    // Get export data from request
    const { formTitle, submissionId, data, format = 'json' } = await request.json();
    
    if (!formTitle || !submissionId || !data) {
      return new Response(JSON.stringify({ 
        error: 'Missing required export data' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Prepare the export content
    let content: string;
    let filename: string;
    let contentType: string;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (format === 'csv') {
      // Convert to CSV format
      const headers = Object.keys(data);
      const values = headers.map(key => {
        const value = data[key];
        // Escape CSV values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      
      content = headers.join(',') + '\n' + values.join(',');
      filename = `${formTitle.replace(/[^a-z0-9]/gi, '_')}_${submissionId}_${timestamp}.csv`;
      contentType = 'text/csv';
    } else {
      // JSON format (default)
      const exportData = {
        formTitle,
        submissionId,
        submittedAt: new Date().toISOString(),
        data
      };
      
      content = JSON.stringify(exportData, null, 2);
      filename = `${formTitle.replace(/[^a-z0-9]/gi, '_')}_${submissionId}_${timestamp}.json`;
      contentType = 'application/json';
    }
    
    // Construct WebDAV URL
    const webdavUrl = `${config.url}/remote.php/dav/files/${config.username}${config.path}/${filename}`;
    
    // Create directories if needed (MKCOL request)
    const dirPath = config.path.split('/').filter((p: string) => p);
    let currentPath = '';
    
    for (const dir of dirPath) {
      currentPath += `/${dir}`;
      const mkcolUrl = `${config.url}/remote.php/dav/files/${config.username}${currentPath}/`;
      
      await fetch(mkcolUrl, {
        method: 'MKCOL',
        headers: {
          'Authorization': `Basic ${btoa(`${config.username}:${password}`)}`
        }
      }).catch(() => {
        // Directory might already exist, ignore error
      });
    }
    
    // Upload file via WebDAV PUT
    const uploadResponse = await fetch(webdavUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${btoa(`${config.username}:${password}`)}`,
        'Content-Type': contentType,
        'Content-Length': new Blob([content]).size.toString()
      },
      body: content
    });
    
    if (!uploadResponse.ok && uploadResponse.status !== 201 && uploadResponse.status !== 204) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
    }
    
    // Generate shareable link (optional, depends on Nextcloud settings)
    const shareUrl = `${config.url}/ocs/v2.php/apps/files_sharing/api/v1/shares`;
    const shareResponse = await fetch(shareUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${config.username}:${password}`)}`,
        'OCS-APIRequest': 'true',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        path: `${config.path}/${filename}`,
        shareType: '3', // Public link
        permissions: '1' // Read only
      })
    });
    
    let shareLink = null;
    if (shareResponse.ok) {
      const shareData = await shareResponse.text();
      // Parse share link from response (simplified - in production you'd parse XML properly)
      const urlMatch = shareData.match(/<url>([^<]+)<\/url>/);
      if (urlMatch) {
        shareLink = urlMatch[1];
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      filename,
      path: `${config.path}/${filename}`,
      shareLink,
      message: 'Form data exported to Nextcloud successfully!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error exporting to Nextcloud:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to export to Nextcloud' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Helper function to export form submission to Nextcloud
export async function exportToNextcloud(env: any, formTitle: string, submissionId: string, data: any) {
  const configStr = await env.CACHE_KV.get('integration:nextcloud:config');
  if (!configStr) {
    return null; // Integration not configured
  }
  
  const exportData = {
    formTitle,
    submissionId,
    data,
    format: 'json'
  };
  
  // Call the export endpoint internally
  const response = await fetch('/api/export/nextcloud', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(exportData)
  });
  
  if (!response.ok) {
    console.error('Failed to export to Nextcloud:', await response.text());
    return null;
  }
  
  return await response.json();
}