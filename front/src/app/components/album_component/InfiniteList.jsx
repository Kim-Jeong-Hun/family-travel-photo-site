/*
<InfiniteList의 역할>
-
*/

"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ContentContainer from "./ContentContainer";

// 데이터를 가져올 axios 함수 (QueryFn용)
// pageParam : 다음 페이지를 불러올 때 기준이 될 값
// 
const fetchAlbumIndividual = async ({ pageParam }) => {
  const token = localStorage.getItem("accessToken");

  const { data } = await axios.get(
    "https://family-travel-photo-site.onrender.com/album/individual",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        cursor: pageParam
      },
    },
  );
  
  return data;
};

function InfiniteList() {

  return (
    <div>
      <ContentContainer />
      <div ref={ref}></div>
    </div>
  );
}

export default InfiniteList;
