export const fetchPostsAPI = async (offset: number, limit: number) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${offset}&_limit=${limit}`);
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return {
    data,
    meta: { pagination: { total: 100, limit, offset } }
  };
};
