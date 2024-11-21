const puppeteer = require('puppeteer');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');

class DOMExtractionService {
  constructor() {
    this.cache = new Map();
  }

  generateCacheKey(url) {
    return crypto.createHash('md5').update(url).digest('hex');
  }

  async extract(url) {
    const cacheKey = this.generateCacheKey(url);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      const result = await page.evaluate(() => {
        const extractStyles = (element) => {
          const styles = window.getComputedStyle(element);
          return Object.fromEntries(
            Array.from(styles).map(key => [key, styles.getPropertyValue(key)])
          );
        };

        const extractElement = (element, path = '') => {
          const elementPath = path ? `${path}>${element.tagName}` : element.tagName;
          
          return {
            id: element.id || elementPath.toLowerCase(),
            tag: element.tagName.toLowerCase(),
            className: Array.from(element.classList),
            attributes: Array.from(element.attributes)
              .reduce((acc, attr) => ({
                ...acc,
                [attr.name]: attr.value
              }), {}),
            styles: extractStyles(element),
            children: Array.from(element.children).map(child => 
              extractElement(child, elementPath)
            ),
            parent: path || null,
            selectable: true,
            editable: true
          };
        };

        const extractAssets = () => ({
          images: Array.from(document.images).map(img => img.src),
          fonts: Array.from(document.styleSheets)
            .flatMap(sheet => {
              try {
                return Array.from(sheet.cssRules)
                  .filter(rule => rule instanceof CSSFontFaceRule)
                  .map(rule => rule.style.getPropertyValue('src'));
              } catch (e) {
                return [];
              }
            }),
          scripts: Array.from(document.scripts)
            .map(script => script.src)
            .filter(Boolean)
        });

        return {
          structure: extractElement(document.body),
          assets: extractAssets()
        };
      });

      const stylesheets = await page.evaluate(() =>
        Array.from(document.styleSheets)
          .map(sheet => sheet.href)
          .filter(Boolean)
      );

      const styles = {};
      for (const href of stylesheets) {
        try {
          const response = await fetch(href);
          const css = await response.text();
          const dom = new JSDOM('');
          const style = dom.window.document.createElement('style');
          style.textContent = css;
          dom.window.document.head.appendChild(style);
          
          Array.from(style.sheet.cssRules).forEach(rule => {
            if (rule.style) {
              styles[rule.selectorText] = Object.fromEntries(
                Array.from(rule.style).map(prop => [
                  prop,
                  rule.style.getPropertyValue(prop)
                ])
              );
            }
          });
        } catch (error) {
          console.error(`Failed to fetch stylesheet: ${href}`, error);
        }
      }

      const extractionResult = { ...result, styles };
      this.cache.set(cacheKey, extractionResult);
      await browser.close();
      return extractionResult;

    } catch (error) {
      console.error('DOM extraction failed:', error);
      throw new Error('Failed to extract DOM structure');
    }
  }

  clearCache() {
    this.cache.clear();
  }

  async validateURL(url) {
    try {
      const urlObj = new URL(url);
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      await browser.close();
      return true;
    } catch (error) {
      console.error('URL validation failed:', error);
      return false;
    }
  }
}

module.exports = new DOMExtractionService();