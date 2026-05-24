import axiosClient from "./axiosClient";
import { ExperienceDto, ExperienceRequest } from "../types/profile";

const ExperienceService = {
    getMyExperiences: () =>
        axiosClient.get<ExperienceDto[]>("/Experience"),

    add: (data: ExperienceRequest) =>
        axiosClient.post<ExperienceDto>("/Experience", data),

    update: (id: number, data: ExperienceRequest) =>
        axiosClient.put<ExperienceDto>(`/Experience/${id}`, data),

    delete: (id: number) =>
        axiosClient.delete(`/Experience/${id}`),
};

export default ExperienceService;
