export const filterResources = (
  resources,
  mainCategory,
  selectedSubCategories,
  searchInput,
  startDate,
  endDate
) => {
  return resources.filter((resource) => {
    // Check if the resource matches the main category
    const matchesCategory =
      resource.categories &&
      resource.categories.includes(mainCategory);

    // Check if the resource matches the selected subcategories
    const matchesSubCategory =
      selectedSubCategories.length === 0 || // No subcategories selected
      selectedSubCategories.every(
        (subCategory) => resource.types && resource.types.includes(subCategory)
      );

    // Check if the resource matches the search input (name or organization)
    const matchesSearchInput =
      searchInput === "" ||
      (resource.name &&
        resource.name.toLowerCase().includes(searchInput.toLowerCase())) ||
      (resource.organization_name &&
        resource.organization_name.toLowerCase().includes(searchInput.toLowerCase()));

    // Check if the resource matches the date range
    const matchesDateRange =
      !startDate ||
      !endDate ||
      (!resource.start_date && !resource.end_date) || // If no start/end dates
      (new Date(resource.start_date) <= endDate &&
        (!resource.end_date || new Date(resource.end_date) >= startDate)); // Check overlaps

    // Final match: All conditions must be true
    return (
      matchesCategory &&
      matchesSubCategory &&
      matchesSearchInput &&
      matchesDateRange
    );
  });
};
