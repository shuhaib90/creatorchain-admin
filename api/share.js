import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.redirect('/');
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mwefmtmcljdsptcgowmb.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_SdGsB-hhvxF2-rq_fBiM0A_y3_mQn2n';

  try {
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/listings?id=eq.${id}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const item = response.data[0];

    if (!item) {
      return res.redirect('/');
    }

    const title = `${item.project} - ${item.title}`;
    const description = item.description || 'Web3 Opportunity at CreatorChain';
    const image = item.share_image || item.logo || 'https://mwefmtmcljdsptcgowmb.supabase.co/storage/v1/object/public/logos/default_banner.png';

    // Serve HTML with Meta Tags for X/Twitter
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Standard Meta Tags -->
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://creatorchain-job-board.vercel.app/api/share?id=${id}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://creatorchain-job-board.vercel.app/api/share?id=${id}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">

    <!-- Auto-Redirect Browser to Site -->
    <script>
      window.location.href = "/?id=${id}";
    </script>
</head>
<body>
    <p>Redirecting to CreatorChain...</p>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.redirect('/');
  }
}
