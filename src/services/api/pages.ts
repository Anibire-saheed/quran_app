import { quranApi } from './axios';

export const fetchPages = async (mushaf?: number) => {
  const { data } = await quranApi.get('/pages', {
    params: { mushaf }
  });
  return data.pages;
};

export const lookupPages = async (params: {
  mushaf?: number;
  chapter_number?: number;
  juz_number?: number;
  page_number?: number;
  manzil_number?: number;
  rub_el_hizb_number?: number;
  hizb_number?: number;
  ruku_number?: number;
  from?: string;
  to?: string;
}) => {
  const { data } = await quranApi.get('/pages/lookup', { params });
  return data;
};

export const fetchPageDetail = async (pageNumber: number, mushaf?: number) => {
  const { data } = await quranApi.get(`/pages/${pageNumber}`, {
    params: { mushaf }
  });
  return data.page;
};
