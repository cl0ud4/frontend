import React, { useState } from "react";
import './Paging.css';
import Pagination from "react-js-pagination";

const Paging = ({check, totalPage}) => {

  const [page, setPage] = useState(1);

  const handlePageChange = (page) => {
    setPage(page);
    check(page);
  };

  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={10}
      totalItemsCount={totalPage}
      pageRangeDisplayed={5}
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={handlePageChange}
    />
  );
};

export default Paging;