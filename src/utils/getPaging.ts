import qs from "qs";
import Contents from "../models/contents.js";

/**
 * 페이징 처리해주는 함수
 * @param query - req.query
 * @param filter - mongodb query
 * @param Model - mongodb Model
 * @returns Promise<number[]>
 */
export async function getPaging(query: string, filter = {}, Model = Contents) {
  console.log({ Model });
  const { page, size } = qs.parse(query);
  const currentPage = parseInt(page.toString()) || 1; // 현재 페이지, default: 1
  const listSize = parseInt(size.toString()) || 10; //한 페이지당 보여줄 게시글 수, default: 10
  const totalContents = await Model.countDocuments(filter); //총 컨텐츠 갯수
  return [currentPage, listSize, totalContents];
}
