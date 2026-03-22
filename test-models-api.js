const token = process.env.GITHUB_TOKEN; // run with GITHUB_TOKEN=...
fetch("https://models.inference.ai.azure.com/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4o",
    messages: [{role: "user", content: "hello"}]
  })
}).then(res => res.json()).then(console.log).catch(console.error);
