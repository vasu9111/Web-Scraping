import puppeteer from "puppeteer";

async function searchAmazon(keyword) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`);

    await page.waitForSelector('[data-component-type="s-search-result"]');

    const products = await page.evaluate(() => {
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

          // product symbol
          const currencyElement = item.querySelector(".a-price-symbol");

          //  product image
          const imageElement = item.querySelector("img.s-image");

          //  product URL
          const productUrlElement = item.querySelector("a.a-link-normal");

          // return {
          //   name: titleElement.textContent.trim(),
          //   price: priceElement ? priceElement.textContent.trim() : "N/A",
          //   currency: currencyElement.textContent,
          //   imageUrl: imageElement ? imageElement.src : "N/A",
          //   productUrl: productUrlElement.href,
          //   source: "Amazon.in",
          // };
          return {
            name: titleElement?.textContent?.trim() || "N/A",
            price: priceElement?.textContent?.trim() || "N/A",
            currency: currencyElement?.textContent || "₹",
            imageUrl: imageElement?.src || "N/A",
            productUrl: productUrlElement?.href || "N/A",
            source: "Amazon.in",
          };
        });
    });
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




