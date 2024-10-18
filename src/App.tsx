import React, { useEffect, useState, useMemo } from "react";

// Define a type for the user data
interface User {
  id: number;
  firstName: string;
}

const ListComponent: React.FC = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/users");
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        setUsersData(result.users);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get the current items per page
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return usersData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, usersData]);

  // Change Page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Pagination
  const pageNumbers = useMemo(() => {
    const totalPages = Math.ceil(usersData.length / itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [usersData.length, itemsPerPage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>List Component</h1>
      <ul style={{ listStyle: "none" }}>
        {currentItems.map(({ id, firstName }) => (
          <li key={id}>{firstName}</li>
        ))}
      </ul>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <ListComponent />
    </div>
  );
};

export default App;
