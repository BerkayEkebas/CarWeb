const axios = require('axios');
const cheerio = require('cheerio');

const AJAX_URL = 'https://www.ssancar.com/ajax/ajax_car_list.php';
const PAGE_SIZE = 15;

const buildParams = (weekNo, page) => ({
  weekNo,
  maker: '',
  model: '',
  fuel: '',
  color: '',
  yearFrom: '2010',
  yearTo: '2026',
  priceFrom: '0',
  priceTo: '100000',
  kmFrom: '0',
  kmTo: '500000',
  gearbox: '',
  list: PAGE_SIZE,
  no: '',
  sorts: '',
  pages: page,
});

function parseCars(html) {
  const $ = cheerio.load(html);
  const cars = [];

  $('li').each((_, el) => {
    const link = $(el).find('a').attr('href') || '';
    const stockNo = $(el).find('.tit .num').first().text().trim();
    const name = $(el).find('.tit .name').text().trim();

    const spans = $(el).find('.detail li span').map((_, s) => $(s).text().trim()).get();
    const year = spans[0] || '';
    const transmission = spans[1]?.trim() || '';
    const fuel = spans[2] || '';
    const cc = spans[3] || '';
    const km = spans[4] || '';
    const grade = spans[5] || '';
    const color = spans[6] || '';

    const priceText = $(el).find('.money .num').text().trim();
    const price = parseInt(priceText.replace(/,/g, ''), 10) || 0;
    const imgSrc = $(el).find('.img_area img').attr('src') || '';

    if (stockNo && name) {
      cars.push({
        stockNo: parseInt(stockNo, 10) || stockNo,
        name,
        year: parseInt(year, 10) || year,
        transmission,
        fuel,
        cc,
        km: parseInt(km.replace(/,/g, ''), 10) || 0,
        grade,
        color,
        priceUSD: price,
        link: link.startsWith('http') ? link : `https://www.ssancar.com${link}`,
        image: imgSrc,
      });
    }
  });

  return cars;
}

async function fetchPage(weekNo, page) {
  const params = new URLSearchParams(buildParams(weekNo, page));

  const response = await axios.post(AJAX_URL, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://www.ssancar.com/bbs/board.php?bo_table=list',
      'Origin': 'https://www.ssancar.com',
    },
  });

  return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
}

async function scrapeWeek(weekNo) {
  const allCars = [];
  let page = 1;

  console.log(`Scraping weekNo=${weekNo}...`);

  while (true) {
    try {
      const html = await fetchPage(weekNo, page);

      if (!html || html.trim().length < 50) break;

      const cars = parseCars(html);
      if (cars.length === 0) break;

      allCars.push(...cars);
      console.log(`  Page ${page}: ${cars.length} cars (total: ${allCars.length})`);

      await new Promise(r => setTimeout(r, 500));
      page++;
    } catch (err) {
      console.error(`  Page ${page} error:`, err.message);
      break;
    }
  }

  console.log(`Scrape done: ${allCars.length} cars for week ${weekNo}`);
  return allCars;
}

const BOARD_URL = 'https://www.ssancar.com/bbs/board.php?bo_table=list';

async function getCurrentWeekNo() {
  const response = await axios.get(BOARD_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
    },
  });
  const $ = cheerio.load(response.data);
  const weekNo = parseInt($('#week_no').val(), 10);
  if (!weekNo) throw new Error('Could not find current week_no on ssancar.com');
  return weekNo;
}

module.exports = { scrapeWeek, getCurrentWeekNo };
