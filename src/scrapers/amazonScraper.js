import puppeteer from "puppeteer";

async function searchAmazon(keyword, source) {
  console.log({ source });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`);

    await page.waitForSelector('[data-component-type="s-search-result"]');

    const products = await page.evaluate((source) => {
      const items = document.querySelectorAll(
        '[data-component-type="s-search-result"]'
      );
      console.log({ items });

      return Array.from(items)
        .slice(0, 5)
        .map((item) => {
          // product name
          const titleElement = item.querySelector(".a-size-medium");

          // product price
          const priceElement = item.querySelector(".a-price-whole");
          const price = priceElement
            ? parseFloat(priceElement.textContent.trim().replace(/,/g, ""))
            : 0;
          // product symbol
          const currencyElement = item.querySelector(".a-price-symbol");

          //  product image
          const imageElement = item.querySelector("img.s-image");

          //  product URL
          const productUrlElement = item.querySelector("a.a-link-normal");
          console.log({ source });

          return {
            name: titleElement?.textContent?.trim() || "N/A",
            price: price,
            currency: currencyElement?.textContent || "₹",
            imageUrl: imageElement?.src || "N/A",
            productUrl: productUrlElement?.href || "N/A",
            source: source,
          };
        });
    }, source);
    // console.log({ products });

    return products;
  } catch (error) {
    console.error("Error scraping Amazon:", error);
    throw new Error("Failed to scrape Amazon products");
  } finally {
    await browser.close();
  }
}

export default searchAmazon;
