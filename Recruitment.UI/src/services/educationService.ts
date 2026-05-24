import axiosClient from "./axiosClient";
import { EducationDto, EducationRequest } from "../types/profile";

const EducationService = {
    getMyEducations: () =>
        axiosClient.get<EducationDto[]>("/Education"),

    add: (data: EducationRequest) =>
        axiosClient.post<EducationDto>("/Education", data),

    update: (id: number, data: EducationRequest) =>
        axiosClient.put<EducationDto>(`/Education/${id}`, data),

    delete: (id: number) =>
        axiosClient.delete(`/Education/${id}`),
};

export default EducationService;
