async function test() {
  console.log("Sending to API...");
  try {
    const res = await fetch('https://creatorchain.site/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'opportunity_approved',
            payload: {
                to: 'lookmaxing00@gmail.com',
                project_name: 'Syndicate',
                title: 'Test Approval from API'
            }
        })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch(e) {
    console.error(e);
  }
}
test();
