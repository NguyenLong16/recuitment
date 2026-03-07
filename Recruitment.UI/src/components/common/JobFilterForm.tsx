import { Form, Input, Select, InputNumber, Button, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { JobFilterRequest } from '../../types/job';
interface JobFilterFormProps {
    filters: JobFilterRequest;
    onFilterChange: (filters: Partial<JobFilterRequest>) => void;
    onReset: () => void;
    locations: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    skills: { id: number; skillName: string }[];
    layout?: 'horizontal' | 'vertical';
}

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
    const handleSearch = () => {
        const values = form.getFieldsValue();
        onFilterChange(values);
    };
    const handleReset = () => {
        form.resetFields();
        onReset();
    };

    // Layout dọc cho sidebar
    if (layout === 'vertical') {
        return (
            <Form form={form} layout="vertical" initialValues={filters} className="space-y-1">
                <Form.Item name="searchTerm" label={<span className="text-sm font-medium text-gray-700">Từ khóa</span>} className="!mb-3">
                    <Input placeholder="Tìm theo tiêu đề..." allowClear size="middle" />
                </Form.Item>

                <Form.Item name="companyName" label={<span className="text-sm font-medium text-gray-700">Công ty</span>} className="!mb-3">
                    <Input placeholder="Tên công ty..." allowClear size="middle" />
                </Form.Item>

                <Form.Item name="employerName" label={<span className="text-sm font-medium text-gray-700">Nhà tuyển dụng</span>} className="!mb-3">
                    <Input placeholder="Tên nhà tuyển dụng..." allowClear size="middle" />
                </Form.Item>

                <Form.Item name="locationId" label={<span className="text-sm font-medium text-gray-700">Địa điểm</span>} className="!mb-3">
                    <Select
                        placeholder="Chọn địa điểm"
                        allowClear
                        size="middle"
                        options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                    />
                </Form.Item>

                <Form.Item name="categoryId" label={<span className="text-sm font-medium text-gray-700">Danh mục</span>} className="!mb-3">
                    <Select
                        placeholder="Chọn danh mục"
                        allowClear
                        size="middle"
                        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    />
                </Form.Item>

                <Form.Item name="skillId" label={<span className="text-sm font-medium text-gray-700">Kỹ năng</span>} className="!mb-3">
                    <Select
                        mode="multiple"
                        placeholder="Chọn kỹ năng"
                        allowClear
                        size="middle"
                        options={skills.map(skill => ({ value: skill.id, label: skill.skillName }))}
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-3">
                    <Form.Item name="minSalary" label={<span className="text-sm font-medium text-gray-700">Lương min</span>} className="!mb-3">
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="VNĐ"
                            size="middle"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item name="maxSalary" label={<span className="text-sm font-medium text-gray-700">Lương max</span>} className="!mb-3">
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="VNĐ"
                            size="middle"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
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
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleReset}
                        className="!rounded-lg"
                    >
                        Xóa
                    </Button>
                </div>
            </Form>
        );
    }

    // Layout ngang mặc định (giữ nguyên)
    return (
        <Form form={form} layout="vertical" initialValues={filters}>
            <Row gutter={[16, 16]}>
                {/* Tìm kiếm theo tiêu đề */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="searchTerm" label="Từ khóa">
                        <Input placeholder="Tìm theo tiêu đề..." allowClear />
                    </Form.Item>
                </Col>
                {/* Lọc theo công ty */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="companyName" label="Công ty">
                        <Input placeholder="Tên công ty..." allowClear />
                    </Form.Item>
                </Col>
                {/* Lọc theo tác giả */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="employerName" label="Nhà tuyển dụng">
                        <Input placeholder="Tên nhà tuyển dụng..." allowClear />
                    </Form.Item>
                </Col>
                {/* Lọc theo địa điểm */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="locationId" label="Địa điểm">
                        <Select
                            placeholder="Chọn địa điểm"
                            allowClear
                            options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                        />
                    </Form.Item>
                </Col>
                {/* Lọc theo danh mục */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="categoryId" label="Danh mục">
                        <Select
                            placeholder="Chọn danh mục"
                            allowClear
                            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                        />
                    </Form.Item>
                </Col>
                {/* Lọc theo kỹ năng (multi-select) */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="skillId" label="Kỹ năng">
                        <Select
                            mode="multiple"
                            placeholder="Chọn kỹ năng"
                            allowClear
                            options={skills.map(skill => ({ value: skill.id, label: skill.skillName }))}
                        />
                    </Form.Item>
                </Col>
                {/* Lọc theo lương */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="minSalary" label="Lương tối thiểu">
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="VNĐ"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item name="maxSalary" label="Lương tối đa">
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="VNĐ"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Col>
            </Row>
            {/* Buttons */}
            <Row gutter={16}>
                <Col>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                        Tìm kiếm
                    </Button>
                </Col>
                <Col>
                    <Button icon={<ClearOutlined />} onClick={handleReset}>
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};