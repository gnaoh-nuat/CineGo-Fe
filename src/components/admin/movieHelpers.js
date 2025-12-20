export function getStatusInfo(status) {
  switch (status) {
    case "NOW_PLAYING":
      return { label: "Đang chiếu", color: "success" };
    case "COMING_SOON":
      return { label: "Sắp chiếu", color: "warning" };
    default:
      return { label: "Ngừng chiếu", color: "gray" };
  }
}

export function sortMoviesByStatus(movies) {
  if (!Array.isArray(movies)) return [];
  const priority = {
    NOW_PLAYING: 0,
    COMING_SOON: 1,
  };
  // Create a shallow copy and sort by priority, then by id to keep order stable
  return [...movies].sort((a, b) => {
    const pa = priority[a?.status] ?? 2;
    const pb = priority[b?.status] ?? 2;
    if (pa !== pb) return pa - pb;
    // fallback: preserve insertion order by comparing ids if available
    const aid = a?.id ?? 0;
    const bid = b?.id ?? 0;
    return aid - bid;
  });
}

export function paginate(items, page = 1, size = 10) {
  const totalItems = Array.isArray(items) ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * size;
  const end = start + size;
  const pageItems = Array.isArray(items) ? items.slice(start, end) : [];
  return {
    items: pageItems,
    page: currentPage,
    size,
    totalPages,
    totalItems,
  };
}
