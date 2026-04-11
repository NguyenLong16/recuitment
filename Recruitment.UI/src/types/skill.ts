// Types cho Skill
export interface Skill {
    id: number;
    skillName: string;
}

// Request types
export interface CreateSkillRequest {
    name: string;
}

export interface UpdateSkillRequest {
    name: string;
}