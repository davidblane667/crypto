const API_KEY =
  "57a038e44f2a3acddee72f7f699524ec0bbef7fd95caebf368e641b6c24d5384";

const tickersHandlers = new Map();

export const loadtickersHandlers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys()
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then(r => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      )

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach(fn => fn(newPrice))
      })
    })
};

export const loadCoinlist = () =>
  fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  ).then(f => f.json());

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
};


setInterval(loadtickersHandlers, 5000);
