import React, { useState, useEffect } from "react";
import axios from "axios";

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_supply: number;
  image: string;
}

const CryptoTracker: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50;

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 200,
            page: 1,
          },
        }
      );
      setCryptoData(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch cryptocurrency data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const filteredData = cryptoData.filter((coin) => {
    return (
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="crypto-container">
      <h1>Top CryptoCurrencies</h1>
      <hr className="responsive-hr" />
      <input
        type="text"
        placeholder="Search for a cryptocurrency..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Current Price</th>
                  <th>Market Cap</th>
                  <th>Total Supply</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((coin, index) => (
                    <tr key={coin.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <img
                          src={coin.image}
                          alt={coin.name}
                          width="30"
                          height="30"
                        />
                      </td>
                      <td>
                        <a
                          href={`https://www.coingecko.com/en/coins/${coin.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "blue" }}
                        >
                          {coin.name}
                        </a>
                      </td>

                      <td>{coin.symbol.toUpperCase()}</td>
                      <td>${coin.current_price.toLocaleString()}</td>
                      <td>${coin.market_cap.toLocaleString()}</td>
                      <td>{coin.total_supply.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No cryptocurrencies found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage * itemsPerPage >= filteredData.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CryptoTracker;
