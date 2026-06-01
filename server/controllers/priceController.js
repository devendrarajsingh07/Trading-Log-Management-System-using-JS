const getLivePrice = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({ message: "Symbol is required" });
    }

    const apiKey = process.env.ALPHA_VANTAGE_KEY;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const quote = data["Global Quote"];

    if (!quote || !quote["05. price"]) {
      return res.status(404).json({
        message: "Live price not found for this symbol",
      });
    }

    return res.json({
      symbol,
      price: Number(quote["05. price"]),
      volume: quote["06. volume"],
      lastTradingDay: quote["07. latest trading day"],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch live price",
      error: error.message,
    });
  }
};

module.exports = { getLivePrice };