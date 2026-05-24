import axiosClient from "./axiosClient";
import { UserSkillResponse, JobSuggestionResponse } from "../types/profile";

const UserSkillService = {
    /** Lấy danh sách kỹ năng của ứng viên đang đăng nhập */
    getMySkills: () => {
        return axiosClient.get<UserSkillResponse[]>("/UserSkill");
    },

    /** Thêm kỹ năng vào hồ sơ */
    addSkill: (skillId: number) => {
        return axiosClient.post(`/UserSkill/${skillId}`);
    },

    /** Xóa kỹ năng khỏi hồ sơ */
    removeSkill: (skillId: number) => {
        return axiosClient.delete(`/UserSkill/${skillId}`);
    },

    /** Lấy danh sách công việc gợi ý theo kỹ năng */
    getJobSuggestions: () => {
        return axiosClient.get<JobSuggestionResponse[]>("/UserSkill/suggestions");
    },
};

export default UserSkillService;
