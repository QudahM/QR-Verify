export const checkUrlWithSafeBrowsing = async (url: string): Promise<{
  status: 'safe' | 'malicious' | 'unknown';
  message: string;
}> => {
  const apiKey = import.meta.env.VITE_GOOGLE_SAFE_BROWSING_KEY;
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const payload = {
    client: {
      clientId: "your-app-name",
      clientVersion: "1.0",
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }],
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data && data.matches && data.matches.length > 0) {
      return {
        status: "malicious",
        message: "This URL has been flagged as unsafe by Google Safe Browsing.",
      };
    } else {
      return {
        status: "safe",
        message: "This URL appears to be safe according to Google Safe Browsing.",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: "unknown",
      message: "Error checking URL with Safe Browsing. Please try again.",
    };
  }
};
