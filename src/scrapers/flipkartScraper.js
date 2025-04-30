import puppeteer from "puppeteer";

async function searchFlipkart(keyword) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(
      `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}`,{ waitUntil: 'networkidle0' }
    );

    await page.waitForSelector("div[data-id]",{ timeout: 10000 });

    const products = await page.evaluate(() => {
      const items = document.querySelectorAll("div[data-id],div._1YokD2, div._2kHMtA");
      return Array.from(items)
        .slice(0, 5)
        .map((item) => {
          //  product name
          const titleElement = item.querySelector("div.KzDlHZ");

          //  product price
          const priceElement = item.querySelector("div.Nx9bqj._4b5DiR");
          const priceText = priceElement.textContent;
          const price = priceText.split("").slice(1).join("");

          const currencyElement = priceElement.textContent.split("")[0];

          // product image
          const imageElement = item.querySelector("img");

          // product URL
          const productUrlElement = item.querySelector("a.CGtC98");

          return {
            name: titleElement.textContent,
            price: price,
            currency: currencyElement,
            imageUrl: imageElement ? imageElement.src : "N/A",
            productUrl: productUrlElement.href,
            source: "Flipkart.com",
          };
        });
    });
    // console.log({ products });

    return products;
  } catch (error) {
    console.error("Error scraping Flipkart:", error);
    throw new Error("Failed to scrape Flipkart products");
  } finally {
    await browser.close();
  }
}

export default searchFlipkart;
