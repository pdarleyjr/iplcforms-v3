globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const POST = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime.env;
    const configStr = await env.CACHE_KV.get("integration:nextcloud:config");
    const password = await env.CACHE_KV.get("integration:nextcloud:password");
    if (!configStr || !password) {
      return new Response(JSON.stringify({
        error: "Nextcloud integration not configured"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const config = JSON.parse(configStr);
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({
        error: "Invalid request body"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { formTitle, submissionId, data, format = "json" } = body;
    if (!formTitle || !submissionId || !data) {
      return new Response(JSON.stringify({
        error: "Missing required export data"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let content;
    let filename;
    let contentType;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    if (format === "csv") {
      const headers = Object.keys(data);
      const values = headers.map((key) => {
        const value = data[key];
        if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      content = headers.join(",") + "\n" + values.join(",");
      filename = `${formTitle.replace(/[^a-z0-9]/gi, "_")}_${submissionId}_${timestamp}.csv`;
      contentType = "text/csv";
    } else {
      const exportData = {
        formTitle,
        submissionId,
        submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
        data
      };
      content = JSON.stringify(exportData, null, 2);
      filename = `${formTitle.replace(/[^a-z0-9]/gi, "_")}_${submissionId}_${timestamp}.json`;
      contentType = "application/json";
    }
    const webdavUrl = `${config.url}/remote.php/dav/files/${config.username}${config.path}/${filename}`;
    const dirPath = config.path.split("/").filter((p) => p);
    let currentPath = "";
    for (const dir of dirPath) {
      currentPath += `/${dir}`;
      const mkcolUrl = `${config.url}/remote.php/dav/files/${config.username}${currentPath}/`;
      await fetch(mkcolUrl, {
        method: "MKCOL",
        headers: {
          "Authorization": `Basic ${btoa(`${config.username}:${password}`)}`
        }
      }).catch(() => {
      });
    }
    const uploadResponse = await fetch(webdavUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${btoa(`${config.username}:${password}`)}`,
        "Content-Type": contentType,
        "Content-Length": new Blob([content]).size.toString()
      },
      body: content
    });
    if (!uploadResponse.ok && uploadResponse.status !== 201 && uploadResponse.status !== 204) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
    }
    const shareUrl = `${config.url}/ocs/v2.php/apps/files_sharing/api/v1/shares`;
    const shareResponse = await fetch(shareUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${config.username}:${password}`)}`,
        "OCS-APIRequest": "true",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        path: `${config.path}/${filename}`,
        shareType: "3",
        // Public link
        permissions: "1"
        // Read only
      })
    });
    let shareLink = null;
    if (shareResponse.ok) {
      const shareData = await shareResponse.text();
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
      message: "Form data exported to Nextcloud successfully!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error exporting to Nextcloud:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Failed to export to Nextcloud"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function exportToNextcloud(env, formTitle, submissionId, data) {
  const configStr = await env.CACHE_KV.get("integration:nextcloud:config");
  if (!configStr) {
    return null;
  }
  const exportData = {
    formTitle,
    submissionId,
    data,
    format: "json"
  };
  const response = await fetch("/api/export/nextcloud", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(exportData)
  });
  if (!response.ok) {
    console.error("Failed to export to Nextcloud:", await response.text());
    return null;
  }
  return await response.json();
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  exportToNextcloud
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=nextcloud.astro.mjs.map
