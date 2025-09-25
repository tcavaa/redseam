import apiClient from './client';

export async function fetchProducts({ page = 1, priceFrom, priceTo, sort } = {}, options = {}) {
  const params = {};
  if (page) params.page = page;
  if (priceFrom != null) params['filter[price_from]'] = priceFrom;
  if (priceTo != null) params['filter[price_to]'] = priceTo;
  if (sort) params.sort = sort; // e.g., 'price' or '-price', 'created_at' or '-created_at'

  const config = { params };
  if (options && options.signal) config.signal = options.signal;
  const { data } = await apiClient.get('/products', config);
  return data;
}

export async function fetchProductById(id, options = {}) {
  const config = {};
  if (options && options.signal) config.signal = options.signal;
  const { data } = await apiClient.get(`/products/${id}`, config);
  return data;
}


