import { useEffect, useState } from "react";
import {
    Button,
    Card,
    message,
    Modal,
    Select,
    Tag,
    Typography,
    Spin,
} from "antd";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { UserSkillResponse } from "../../../types/profile";
import { Skill } from "../../../types/skill";
import UserSkillService from "../../../services/userSkillService";
import SkillService from "../../../services/skillService";

const { Text } = Typography;
const PRIMARY_COLOR = "#00B14F";

interface SkillsSectionProps {
    initialSkills: UserSkillResponse[];
    readonly?: boolean;
}

const SkillsSection = ({ initialSkills, readonly = false }: SkillsSectionProps) => {
    const [skills, setSkills] = useState<UserSkillResponse[]>(initialSkills);
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);
    const [removing, setRemoving] = useState<number | null>(null);

    // Sync khi props thay đổi (profile reload)
    useEffect(() => {
        setSkills(initialSkills);
    }, [initialSkills]);

    const openModal = async () => {
        if (allSkills.length === 0) {
            try {
                const res = await SkillService.getAll();
                setAllSkills(res.data);
            } catch {
                message.error("Không thể tải danh sách kỹ năng");
            }
        }
        setSelectedSkillId(null);
        setModalOpen(true);
    };

    const handleAdd = async () => {
        if (!selectedSkillId) {
            message.warning("Vui lòng chọn một kỹ năng");
            return;
        }
        setAdding(true);
        try {
            await UserSkillService.addSkill(selectedSkillId);
            const res = await UserSkillService.getMySkills();
            setSkills(res.data);
            setModalOpen(false);
            message.success("Thêm kỹ năng thành công");
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Thêm kỹ năng thất bại");
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (skillId: number) => {
        setRemoving(skillId);
        try {
            await UserSkillService.removeSkill(skillId);
            setSkills((prev) => prev.filter((s) => s.skillId !== skillId));
            message.success("Đã xóa kỹ năng");
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Xóa kỹ năng thất bại");
        } finally {
            setRemoving(null);
        }
    };

    // Lọc bỏ những kỹ năng đã có
    const mySkillIds = new Set(skills.map((s) => s.skillId));
    const availableSkills = allSkills.filter((s) => !mySkillIds.has(s.id));

    return (
        <>
            <Card
                title={
                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">🛠️</span>
                        <span>Kỹ năng của tôi</span>
                    </span>
                }
                extra={
                    !readonly && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={openModal}
                            className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg font-medium"
                        >
                            Thêm kỹ năng
                        </Button>
                    )
                }
                className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300"
            >
                {skills.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Text type="secondary" className="text-sm">
                            {readonly
                                ? "Chưa có kỹ năng nào"
                                : 'Chưa có kỹ năng nào. Nhấn "Thêm kỹ năng" để bắt đầu.'}
                        </Text>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <Tag
                                key={skill.skillId}
                                color={PRIMARY_COLOR}
                                className="!px-3 !py-1 text-sm font-medium rounded-full flex items-center gap-1"
                                closable={!readonly}
                                closeIcon={
                                    removing === skill.skillId ? (
                                        <Spin size="small" />
                                    ) : (
                                        <CloseCircleOutlined />
                                    )
                                }
                                onClose={() => !readonly && handleRemove(skill.skillId)}
                            >
                                {skill.skillName}
                            </Tag>
                        ))}
                    </div>
                )}
            </Card>

            {/* Modal thêm kỹ năng */}
            <Modal
                title="Thêm kỹ năng"
                open={modalOpen}
                onOk={handleAdd}
                onCancel={() => setModalOpen(false)}
                confirmLoading={adding}
                okText="Thêm"
                cancelText="Hủy"
                okButtonProps={{
                    style: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
                }}
                width={420}
            >
                <div className="py-2">
                    <Text type="secondary" className="block mb-3 text-sm">
                        Chọn kỹ năng bạn muốn thêm vào hồ sơ:
                    </Text>
                    <Select
                        showSearch
                        placeholder="Tìm kiếm kỹ năng..."
                        optionFilterProp="label"
                        className="w-full"
                        size="large"
                        value={selectedSkillId}
                        onChange={(val) => setSelectedSkillId(val)}
                        options={availableSkills.map((s) => ({
                            value: s.id,
                            label: s.skillName,
                        }))}
                        notFoundContent={
                            <Text type="secondary" className="text-sm">
                                Không tìm thấy kỹ năng phù hợp
                            </Text>
                        }
                    />
                </div>
            </Modal>
        </>
    );
};

export default SkillsSection;
