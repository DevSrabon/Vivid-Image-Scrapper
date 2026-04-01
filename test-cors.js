const urls = [
  "https://corsproxy.io/?" + encodeURIComponent("https://www.bing.com/images/search?q=cats"),
  "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent("https://www.bing.com/images/search?q=cats"),
];

async function test() {
  for (let url of urls) {
    try {
      console.log("Testing:", url);
      const res = await fetch(url);
      console.log(res.status);
      if (res.ok) {
        const text = await res.text();
        console.log("Length:", text.length);
        if (text.includes('m="')) {
          console.log("Found Bing images data.");
        } else {
          console.log("No Bing Images data in HTML.");
        }
      }
    } catch (e) {
      console.error("Error:", e.message);
    }
  }
}
test();
