import axiosClient from "./axiosClient";
import { Location, CreateLocationRequest, UpdateLocationRequest } from "../types/Location";

const LocationService = {
    // GET: Lấy danh sách tất cả địa điểm (Admin)
    getAllLocations: () => {
        return axiosClient.get<Location[]>('/Location/admin');
    },

    // POST: Thêm mới địa điểm (Admin)
    createLocation: (data: CreateLocationRequest) => {
        return axiosClient.post<Location>('/Location/admin', data);
    },

    // PUT: Cập nhật địa điểm (Admin)
    updateLocation: (id: number, data: UpdateLocationRequest) => {
        return axiosClient.put<Location>(`/Location/admin/${id}`, data);
    },

    // DELETE: Xoá địa điểm theo ID (Admin)
    deleteLocation: (id: number) => {
        return axiosClient.delete(`/Location/admin/${id}`);
    },
};

export default LocationService;
