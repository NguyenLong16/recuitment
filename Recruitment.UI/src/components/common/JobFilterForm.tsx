import { Form, Input, Select, InputNumber, Button, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { JobFilterRequest } from '../../types/job';

interface JobFilterFormProps {
    filters: JobFilterRequest;
    onFilterChange: (filters: Partial<JobFilterRequest>) => void;
    onReset: () => void;
    locations:  { id: number; name: string }[];
    categories: { id: number; name: string }[];
    skills:     { id: number; skillName: string }[];
    layout?: 'horizontal' | 'vertical';
}

// ── Formatter/parser dùng chung cho InputNumber ────────────────────────────────
const numFormatter = (value: number | undefined) =>
    `${value ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const numParser = (value: string | undefined): number =>
    Number(value?.replace(/,/g, '') ?? 0);

// ── Label wrapper dùng chung ───────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs sm:text-sm font-medium text-gray-700">{children}</span>
);

export const JobFilterForm: React.FC<JobFilterFormProps> = ({
    filters,
    onFilterChange,
    onReset,
    locations,
    categories,
    skills,
    layout = 'horizontal',
}) => {
    const [form] = Form.useForm();

    const handleSearch = () => onFilterChange(form.getFieldsValue());
    const handleReset  = () => { form.resetFields(); onReset(); };

    // ── VERTICAL layout (dùng trong sidebar) ──────────────────────────────────
    // sm : side-by-side 2 cột cho lương, còn lại 1 cột full
    // md : tất cả 1 cột (sidebar đã hẹp)
    // lg : giữ nguyên 1 cột dọc
    if (layout === 'vertical') {
        return (
            <Form form={form} layout="vertical" initialValues={filters} className="space-y-0">

                {/* Từ khóa */}
                <Form.Item name="searchTerm" label={<Label>Từ khóa</Label>} className="!mb-3">
                    <Input
                        placeholder="Tìm theo tiêu đề..."
                        allowClear
                        size="middle"
                        className="text-sm"
                    />
                </Form.Item>

                {/* Công ty + Nhà tuyển dụng — sm: 2 cột, md+: 1 cột */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-x-3">
                    <Form.Item name="companyName" label={<Label>Công ty</Label>} className="!mb-3">
                        <Input placeholder="Tên công ty..." allowClear size="middle" className="text-sm" />
                    </Form.Item>
                    <Form.Item name="employerName" label={<Label>Nhà tuyển dụng</Label>} className="!mb-3">
                        <Input placeholder="Tên nhà tuyển dụng..." allowClear size="middle" className="text-sm" />
                    </Form.Item>
                </div>

                {/* Địa điểm */}
                <Form.Item name="locationId" label={<Label>Địa điểm</Label>} className="!mb-3">
                    <Select
                        placeholder="Chọn địa điểm"
                        allowClear
                        size="middle"
                        className="text-sm"
                        options={locations.map(l => ({ value: l.id, label: l.name }))}
                    />
                </Form.Item>

                {/* Danh mục */}
                <Form.Item name="categoryId" label={<Label>Danh mục</Label>} className="!mb-3">
                    <Select
                        placeholder="Chọn danh mục"
                        allowClear
                        size="middle"
                        className="text-sm"
                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                    />
                </Form.Item>

                {/* Kỹ năng */}
                <Form.Item name="skillId" label={<Label>Kỹ năng</Label>} className="!mb-3">
                    <Select
                        mode="multiple"
                        placeholder="Chọn kỹ năng"
                        allowClear
                        size="middle"
                        maxTagCount="responsive"
                        className="text-sm"
                        options={skills.map(s => ({ value: s.id, label: s.skillName }))}
                    />
                </Form.Item>

                {/* Lương — luôn 2 cột */}
                <div className="grid grid-cols-2 gap-3">
                    <Form.Item name="minSalary" label={<Label>Lương min</Label>} className="!mb-3">
                        <InputNumber
                            className="!w-full text-sm"
                            placeholder="VNĐ"
                            size="middle"
                            formatter={numFormatter}
                            parser={numParser}
                        />
                    </Form.Item>
                    <Form.Item name="maxSalary" label={<Label>Lương max</Label>} className="!mb-3">
                        <InputNumber
                            className="!w-full text-sm"
                            placeholder="VNĐ"
                            size="middle"
                            formatter={numFormatter}
                            parser={numParser}
                        />
                    </Form.Item>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        className="flex-1 !bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg !font-medium !shadow-sm"
                        size="middle"
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleReset}
                        className="!rounded-lg"
                        size="middle"
                    >
                        Xóa
                    </Button>
                </div>
            </Form>
        );
    }

    // ── HORIZONTAL layout (trang toàn chiều rộng) ──────────────────────────────
    // sm  : 1 cột (xs=24)
    // md  : 2 cột (md=12) hoặc 3 cột (md=8)
    // lg  : 3-4 cột tùy field (lg=8 / lg=12)
    return (
        <Form form={form} layout="vertical" initialValues={filters}>
            <Row gutter={[12, 4]}>

                {/* Từ khóa — rộng hơn trên lg */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="searchTerm" label={<Label>Từ khóa</Label>} className="!mb-3">
                        <Input placeholder="Tìm theo tiêu đề..." allowClear size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="companyName" label={<Label>Công ty</Label>} className="!mb-3">
                        <Input placeholder="Tên công ty..." allowClear size="middle" />
                    </Form.Item>
                </Col>

                {/* Nhà tuyển dụng — ẩn trên sm để bớt rối */}
                <Col xs={0} sm={0} md={8} lg={6}>
                    <Form.Item name="employerName" label={<Label>Nhà tuyển dụng</Label>} className="!mb-3">
                        <Input placeholder="Tên nhà tuyển dụng..." allowClear size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="locationId" label={<Label>Địa điểm</Label>} className="!mb-3">
                        <Select
                            placeholder="Chọn địa điểm"
                            allowClear
                            size="middle"
                            options={locations.map(l => ({ value: l.id, label: l.name }))}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="categoryId" label={<Label>Danh mục</Label>} className="!mb-3">
                        <Select
                            placeholder="Chọn danh mục"
                            allowClear
                            size="middle"
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                        />
                    </Form.Item>
                </Col>

                {/* Kỹ năng — ẩn trên sm */}
                <Col xs={0} sm={0} md={8} lg={6}>
                    <Form.Item name="skillId" label={<Label>Kỹ năng</Label>} className="!mb-3">
                        <Select
                            mode="multiple"
                            placeholder="Chọn kỹ năng"
                            allowClear
                            size="middle"
                            maxTagCount="responsive"
                            options={skills.map(s => ({ value: s.id, label: s.skillName }))}
                        />
                    </Form.Item>
                </Col>

                {/* Lương — 2 cột ghép sm */}
                <Col xs={12} sm={6} md={4} lg={4}>
                    <Form.Item name="minSalary" label={<Label>Lương min</Label>} className="!mb-3">
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="VNĐ"
                            size="middle"
                            formatter={numFormatter}
                            parser={numParser}
                        />
                    </Form.Item>
                </Col>

                <Col xs={12} sm={6} md={4} lg={4}>
                    <Form.Item name="maxSalary" label={<Label>Lương max</Label>} className="!mb-3">
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="VNĐ"
                            size="middle"
                            formatter={numFormatter}
                            parser={numParser}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Buttons */}
            <Row gutter={8}>
                <Col>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        size="middle"
                        className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg !font-medium"
                    >
                        Tìm kiếm
                    </Button>
                </Col>
                <Col>
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleReset}
                        size="middle"
                        className="!rounded-lg"
                    >
                        <span className="hidden sm:inline">Xóa bộ lọc</span>
                        <span className="sm:hidden">Xóa</span>
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};