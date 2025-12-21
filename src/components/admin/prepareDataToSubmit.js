// Trong MovieManagement.jsx hoặc file logic của bạn
import { formatDateForInput } from "@/utils/helper";

const prepareDataToSubmit = (formData) => {
  return {
    ...formData,
    // 1. Đảm bảo các trường số học là kiểu Number
    duration_minutes: Number(formData.duration_minutes) || 0,
    director_id: Number(formData.director_id) || 0,
    
    // 2. Sử dụng helper của bạn để format ngày đúng chuẩn YYYY-MM-DD
    release_date: formatDateForInput(formData.release_date),
    
    // 3. Đảm bảo mảng ID là mảng số
    genre_ids: Array.isArray(formData.genre_ids) 
      ? formData.genre_ids.map(id => Number(id)) 
      : [],
    actor_ids: Array.isArray(formData.actor_ids) 
      ? formData.actor_ids.map(id => Number(id)) 
      : [],
      
    // 4. Các trường chuỗi
    title: formData.title?.trim(),
    writer: formData.writer?.trim(),
    description: formData.description?.trim(),
    trailer_url: formData.trailer_url?.trim(),
    status: formData.status,
    poster_urls: Array.isArray(formData.poster_urls) ? formData.poster_urls : []
  };
};

export default prepareDataToSubmit;