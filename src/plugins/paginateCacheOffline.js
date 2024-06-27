import { cache } from 'src/plugins/utils';

export default async function paginateCacheOffline(fountain, search = null, page = 1, perPage = 10) {
  let data = null;

  if (typeof fountain === 'string') {
    data = await cache.get.item(`${fountain}::offline`) || { data: [] };
  }
    

  if (typeof fountain === 'object') data = fountain;

  if (!data.data.length === 0) return data;

  const filteredData = data.data.filter(item => {
    return Object.values(item).some(value => {
      if (value) {
        search = search ? search.toLowerCase() : null;
        if (search) {
          return String(value).toLowerCase().includes(search);
        } else {
          return true;
        }
      }
    });
  });

  const totalPages = Math.ceil(filteredData.length / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const response = {
    data: currentPageData,
    meta: {
      page: {
        total: filteredData.length,
        perPage: perPage,
        currentPage: page,
        lastPage: totalPages
      }
    }
  };

  return response;
}