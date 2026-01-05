const PISTON_API = "https://emkc.org/api/v2/piston/execute";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" }, // ✅ FIXED
};

/**
 * Execute code using Piston API
 */
export async function executeCode(language, code) {
  try {
    const config = LANGUAGE_VERSIONS[language];

    if (!config) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(PISTON_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        stdin: "", // ✅ REQUIRED
        files: [
          {
            name: getFileName(language), // ✅ FIXED
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text(); // ✅ REAL ERROR
      return {
        success: false,
        error: `HTTP ${response.status}: ${text}`,
      };
    }

    const data = await response.json();

    const stdout = data.run?.stdout || "";
    const stderr = data.run?.stderr || "";

    if (stderr) {
      return {
        success: false,
        output: stdout,
        error: stderr,
      };
    }

    return {
      success: true,
      output: stdout || "No output",
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

function getFileName(language) {
  switch (language) {
    case "javascript":
      return "main.js";
    case "python":
      return "main.py";
    case "java":
      return "Main.java"; // ✅ CRITICAL
    case "cpp":
      return "main.cpp";
    default:
      return "main.txt";
  }
}
