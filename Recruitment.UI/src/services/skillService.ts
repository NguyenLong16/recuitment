import axiosClient from "./axiosClient";
import { Skill, CreateSkillRequest, UpdateSkillRequest } from "../types/skill";

const SkillService = {
    // GET: Lấy danh sách tất cả kỹ năng (Admin)
    getAllSkills: () => {
        return axiosClient.get<Skill[]>('/Skill/admin');
    },

    // POST: Thêm mới kỹ năng (Admin)
    createSkill: (data: CreateSkillRequest) => {
        return axiosClient.post<Skill>('/Skill/admin', data);
    },

    // PUT: Cập nhật kỹ năng (Admin)
    updateSkill: (id: number, data: UpdateSkillRequest) => {
        return axiosClient.put<Skill>(`/Skill/admin/${id}`, data);
    },

    // DELETE: Xoá kỹ năng theo ID (Admin)
    deleteSkill: (id: number) => {
        return axiosClient.delete(`/Skill/admin/${id}`);
    },
};

export default SkillService;
