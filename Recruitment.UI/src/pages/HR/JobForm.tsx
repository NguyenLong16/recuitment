// src/pages/HR/JobForm.tsx
import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message, Card, Spin, Alert, Upload, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined, ArrowLeftOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload/interface';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { JobType, JobResponse, JobFormValues } from '../../types/job';
import JobService from '../../services/jobService';
import { useJobMasterData } from '../../hooks/useJobMasterData';

const { Option } = Select;

const JobForm = () => {
    const [form] = Form.useForm<JobFormValues>();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // Sử dụng custom hook cho master data
    const { locations, categories, skills, loading: masterLoading, error: masterError } = useJobMasterData();

    // State riêng của formlh
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [_, setJobData] = useState<JobResponse | null>(null);
    const [mappingWarnings, setMappingWarnings] = useState<string[]>([]);

    // Upload state: Lưu file gốc (không upload ngay)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Thêm warning nếu có lỗi fetch master data
    useEffect(() => {
        if (masterError) {
            setMappingWarnings(prev => [...prev, masterError]);
        }
    }, [masterError]);

    // useEffect 2: Fetch Job Detail (edit mode)
    useEffect(() => {
        if (!isEditMode || locations.length === 0 || categories.length === 0 || skills.length === 0) {
            return;
        }

        if (isNaN(Number(id))) {
            message.error('ID job không hợp lệ');
            navigate('/hr/jobs-management');
            return;
        }

        console.log('Master ready, fetching job detail...');
        fetchJobDetail(Number(id));
    }, [id, locations.length, categories.length, skills.length]);

    const fetchJobDetail = async (jobId: number) => {
        setFetchLoading(true);
        setMappingWarnings([]);
        try {
            console.log(`Fetching job detail for ID: ${jobId}`);
            const res = await JobService.getJobById(jobId);
            const job: JobResponse = res.data;

            if (!job) {
                message.error('Không tìm thấy job');
                navigate('/hr/jobs-management');
                return;
            }

            console.log('Raw job response:', job);
            setJobData(job);
            if (job.companyName && job.companyName.trim() === '') {
                // Fallback: Nếu empty, có thể fetch employer company riêng (nếu API có /User/{id}/company)
                console.warn('CompanyName empty, check employer companyId');
                // Optional: Gọi API get employer info nếu cần
            }

            // Pre-load image nếu có (Cloudinary URL đã full HTTPS, không cần base)
            if (job.imageUrl) {
                setFileList([{
                    uid: '-1',
                    name: 'Ảnh hiện tại',
                    status: 'done',
                    url: job.imageUrl,  // Full URL từ Cloudinary
                }]);
            }

            // Mapping helpers
            const normalizeName = (name: string | undefined | null) => (name || '').trim().toLowerCase();

            // Địa điểm
            let locationId: number | undefined;
            if (job.locationId && typeof job.locationId === 'number') {
                locationId = job.locationId;
            } else {
                const locationName = job.locationName ?? '';
                locationId = locations.find(l => normalizeName(l.name) === normalizeName(locationName))?.id;
            }

            // Ngành nghề
            let categoryId: number | undefined;
            if (job.categoryId && typeof job.categoryId === 'number') {
                categoryId = job.categoryId;
            } else {
                const categoryName = job.categoryName ?? '';
                categoryId = categories.find(c => normalizeName(c.name) === normalizeName(categoryName))?.id;
            }

            // Kỹ năng
            const skillIds: number[] = [];
            const skillMatches: string[] = [];
            const skillNames = job.skillNames;
            if (job.skillIds && Array.isArray(job.skillIds)) {
                skillIds.push(...job.skillIds);
            } else if (Array.isArray(skillNames)) {
                skillNames.forEach((skillName: string) => {
                    if (!skillName) return;
                    const matchedSkill = skills.find(s =>
                        normalizeName(s.skillName) === normalizeName(skillName)
                    );
                    if (matchedSkill) {
                        skillIds.push(matchedSkill.id);
                    } else {
                        skillMatches.push(skillName);
                    }
                });
            }

            // JobType parsing
            let jobTypeArray: number[] = [JobType.FullTime];
            const jobType = job.jobType;
            if (typeof jobType === 'number') {
                jobTypeArray = [jobType];
            } else if (Array.isArray(jobType)) {
                jobTypeArray = jobType;
            } else if (typeof jobType === 'string') {
                const typeMap: { [key: string]: number } = {
                    'FullTime': JobType.FullTime,
                    'PartTime': JobType.PartTime,
                    'Remote': JobType.Remote,
                    'Internship': JobType.Internship
                };
                jobTypeArray = [typeMap[jobType] || JobType.FullTime];
            }

            // Salary parse
            const parseSalary = (raw: unknown): number | undefined => {
                if (typeof raw === 'number') return raw;
                if (typeof raw === 'string') {
                    const parsed = parseFloat(raw.replace(/[^\d.-]/g, ''));
                    return isNaN(parsed) ? undefined : parsed;
                }
                return undefined;
            };
            const salaryMin = parseSalary(job.salaryMin);
            const salaryMax = parseSalary(job.salaryMax);

            const deadlineParsed = job.deadline ? dayjs(job.deadline) : dayjs().add(30, 'day');

            // Warnings
            const warnings: string[] = [];
            if (!locationId) warnings.push(`Không tìm địa điểm: "${job.locationName ?? 'undefined'}"`);
            if (!categoryId) warnings.push(`Không tìm ngành nghề: "${job.categoryName ?? 'undefined'}"`);
            if (skillIds.length === 0 && (Array.isArray(skillNames) ? skillNames.length : 0) > 0) {
                warnings.push(`Không match kỹ năng: ${skillMatches.join(', ')}`);
            }
            setMappingWarnings(warnings);

            if (warnings.length > 0) {
                console.warn('Mapping warnings:', warnings);
                message.warning('Một số dữ liệu không load đầy đủ. Vui lòng chọn thủ công.');
            }

            // Set form values
            form.setFieldsValue({
                title: job.title || '',
                imageUrl: job.imageUrl || '',  // THÊM: Set URL cũ (hidden field)
                description: job.description || '',
                requirement: job.requirement || '',
                benefit: job.benefit || '',
                salaryMin,
                salaryMax,
                categoryId,
                locationId,
                jobType: jobTypeArray,
                deadline: deadlineParsed,
                skillIds,
            });

            console.log('Mapped data:', { categoryId, locationId, skillIds: skillIds.length });

        } catch (error: unknown) {
            console.error('Fetch job error:', error);
            const err = error as { response?: { data?: { message?: string }; status?: number } };
            const errorMsg = err.response?.data?.message || 'Lỗi tải thông tin job';
            message.error(errorMsg);
            if (err.response?.status === 403 || err.response?.status === 404) {
                navigate('/hr/jobs-management');
            }
            setMappingWarnings(prev => [...prev, errorMsg]);
        } finally {
            setFetchLoading(false);
        }
    };

    // Upload props: Sử dụng beforeUpload để validate và lưu file (không upload ngay)
    const uploadProps: UploadProps = {
        name: 'ImageFile',
        multiple: false,
        listType: 'picture',
        fileList,
        beforeUpload: (file: RcFile) => {
            // Client validate
            if (file.size! > 5 * 1024 * 1024) {
                message.error('File quá lớn (max 5MB)');
                return false;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                message.error('Chỉ hỗ trợ JPG, PNG, GIF');
                return false;
            }
            // Lưu file gốc để gửi sau
            setSelectedFile(file as File);
            return false;  // Không upload ngay (gộp vào submit)
        },
        onChange: ({ fileList: newFileList }) => {
            setFileList(newFileList);
            if (newFileList.length > 0 && newFileList[0].originFileObj) {
                setSelectedFile(newFileList[0].originFileObj as File);
            } else {
                setSelectedFile(null);
            }
        },
        onRemove: () => false, // Disable default remove, will use custom Popconfirm
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: true,
            removeIcon: (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa ảnh này không?"
                    onConfirm={() => {
                        setFileList([]);
                        setSelectedFile(null);
                        if (isEditMode) {
                            form.setFieldsValue({ imageUrl: undefined });
                        }
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <DeleteOutlined style={{ color: 'red' }} />
                </Popconfirm>
            ),
        },
    };

    const onFinish = async (values: JobFormValues) => {
        setLoading(true);
        try {
            const deadlineValue = values.deadline;
            if (deadlineValue && dayjs(deadlineValue).isBefore(dayjs(), 'day')) {
                message.error('Deadline phải sau hôm nay!');
                setLoading(false);
                return;
            }

            const jobTypeValue: number = Array.isArray(values.jobType) && values.jobType.length > 0
                ? values.jobType[0]
                : (typeof values.jobType === 'number' ? values.jobType : JobType.FullTime);

            // Build payload object (fields)
            const payload: any = {
                ...values,
                jobType: jobTypeValue,
                deadline: deadlineValue
                    ? dayjs(deadlineValue).toISOString()  // SỬA: Full ISO cho backend
                    : dayjs().add(30, 'day').toISOString(),
                salaryMin: values.salaryMin || 0,
                salaryMax: values.salaryMax || 0,
            };

            // THÊM: Add file nếu có (mới chọn hoặc giữ cũ)
            if (selectedFile) {
                payload.ImageFile = selectedFile;  // File mới → Backend upload
            } else if (isEditMode && values.imageUrl) {
                payload.imageUrl = values.imageUrl;  // Giữ URL cũ nếu không thay
            } else {
                payload.imageUrl = null;  // Xóa nếu không có
            }

            // BỎ: currentImageFile logic cũ (không cần)

            console.log('Submit payload with file:', payload);

            if (isEditMode) {
                await JobService.updateJob(Number(id), payload);
                message.success('Cập nhật thành công!');
            } else {
                await JobService.createJob(payload);
                message.success('Đăng tin thành công!');
            }
            navigate('/hr/jobs-management');
        } catch (error: unknown) {
            console.error('Submit error:', error);
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    // Reset form cho create mode
    useEffect(() => {
        if (!isEditMode) {
            form.resetFields();
            form.setFieldsValue({
                jobType: [JobType.FullTime],
                deadline: dayjs().add(30, 'day'),
            });
            setFileList([]);
            setSelectedFile(null);
        }
    }, [isEditMode, form]);

    // Spinner cho fetch job (edit mode) hoặc master data
    if (masterLoading || (isEditMode && fetchLoading)) {
        return (
            <div className="flex justify-center items-center py-20 bg-gray-50 min-h-[50vh] rounded-2xl border border-gray-100">
                <div className="text-center">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-500 font-medium">{masterLoading ? "Đang tải dữ liệu danh mục..." : "Đang tải thông tin job..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto bg-gray-50 min-h-screen">
            
            {/* Header / Nút Back */}
            <div className="mb-6">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate("/hr/jobs-management")}
                    className="hover:bg-gray-200 mb-4"
                >
                    Quay lại
                </Button>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center shadow-md">
                        {isEditMode ? <EditOutlined className="text-white text-xl" /> : <FileAddOutlined className="text-white text-xl" />}
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 m-0 tracking-tight">
                            {isEditMode ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
                        </h1>
                        <p className="text-gray-500 m-0 mt-1">
                            {isEditMode ? "Cập nhật lại thông tin bài viết" : "Điền thông tin để đăng tuyển ứng viên"}
                        </p>
                    </div>
                </div>
            </div>

            <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden" bodyStyle={{ padding: '24px' }}>
                {/* Warnings */}
                {mappingWarnings.length > 0 && (
                    <Alert
                        message="Cảnh báo tải dữ liệu"
                        description={
                            <ul className="list-disc ml-4 text-sm mt-1">
                                {mappingWarnings.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        }
                        type="warning"
                        showIcon
                        closable
                        className="mb-8 rounded-xl border-orange-200 bg-orange-50"
                    />
                )}

                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={onFinish} 
                    initialValues={{ jobType: [JobType.FullTime] }}
                    className="job-form-responsive"
                >
                    <div className="bg-white rounded-xl mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Thông tin chung</h3>
                        
                        <Form.Item name="title" label={<span className="font-medium text-gray-700">Tiêu đề công việc</span>} rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                            <Input placeholder="Ví dụ: Senior React Developer" size="large" className="rounded-lg" />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
                            <Form.Item name="categoryId" label={<span className="font-medium text-gray-700">Ngành nghề</span>} rules={[{ required: true, message: 'Chọn ngành nghề' }]}>
                                <Select placeholder="Chọn ngành nghề" disabled={categories.length === 0} size="large" className="rounded-lg">
                                    {categories.map(c => (
                                        <Option key={c.id} value={c.id}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="locationId" label={<span className="font-medium text-gray-700">Địa điểm</span>} rules={[{ required: true, message: 'Chọn địa điểm' }]}>
                                <Select placeholder="Chọn địa điểm" disabled={locations.length === 0} size="large" className="rounded-lg">
                                    {locations.map(l => (
                                        <Option key={l.id} value={l.id}>{l.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-6">
                            <Form.Item name="salaryMin" label={<span className="font-medium text-gray-700">Lương tối thiểu (VND)</span>}>
                                <InputNumber
                                    className="w-full"
                                    size="large"
                                    min={0}
                                    formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                    parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as 0}
                                    placeholder="0"
                                />
                            </Form.Item>
                            <Form.Item name="salaryMax" label={<span className="font-medium text-gray-700">Lương tối đa (VND)</span>}>
                                <InputNumber
                                    className="w-full"
                                    size="large"
                                    min={0}
                                    formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                                    parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as 0}
                                    placeholder="0"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
                            <Form.Item
                                name="jobType"
                                label={<span className="font-medium text-gray-700">Loại hình công việc</span>}
                                rules={[{ required: true, message: 'Chọn ít nhất 1 loại hình' }]}
                            >
                                <Select mode="multiple" placeholder="Chọn loại hình công việc" allowClear size="large">
                                    <Option value={JobType.FullTime}>Toàn thời gian</Option>
                                    <Option value={JobType.PartTime}>Bán thời gian</Option>
                                    <Option value={JobType.Internship}>Thực tập</Option>
                                    <Option value={JobType.Contract}>Hợp đồng</Option>
                                    <Option value={JobType.Remote}>Làm việc từ xa</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="deadline"
                                label={<span className="font-medium text-gray-700">Hạn nộp hồ sơ</span>}
                                rules={[
                                    { required: true, message: 'Chọn hạn nộp' },
                                    {
                                        validator: (_, value) => {
                                            if (value && dayjs(value).isBefore(dayjs(), 'day')) {
                                                return Promise.reject('Deadline phải sau hôm nay!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <DatePicker
                                    className="w-full"
                                    size="large"
                                    format="DD/MM/YYYY"
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="skillIds"
                            label={<span className="font-medium text-gray-700">Kỹ năng yêu cầu</span>}
                            rules={[{ required: true, message: 'Chọn ít nhất 1 kỹ năng' }]}
                        >
                            <Select mode="multiple" placeholder="Chọn kỹ năng" disabled={skills.length === 0} size="large">
                                {skills.map(s => (
                                    <Option key={s.id} value={s.id}>{s.skillName || 'Unknown'}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Hidden field cho imageUrl cũ */}
                        <Form.Item name="imageUrl" style={{ display: 'none' }}>
                            <Input type="hidden" />
                        </Form.Item>

                        <Form.Item label={<span className="font-medium text-gray-700">Ảnh minh họa job</span>} rules={[{ required: false }]}>
                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center hover:bg-gray-100 transition-colors">
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />} size="large" className="rounded-lg shadow-sm w-full sm:w-auto">
                                        Chọn ảnh (Max 5MB)
                                    </Button>
                                </Upload>
                                <div className="text-gray-400 text-xs sm:text-sm mt-3">Hỗ trợ định dạng JPG Hình chuẩn, PNG hoặc GIF. <br className="sm:hidden" />Ảnh sẽ được tự động upload khi lưu.</div>
                            </div>
                        </Form.Item>
                    </div>

                    <div className="bg-white rounded-xl mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 mt-8">Nội dung chi tiết</h3>
                        
                        <Form.Item name="description" label={<span className="font-medium text-gray-700">Mô tả công việc</span>} rules={[{ required: true, message: 'Nhập mô tả' }]}>
                            <Input.TextArea rows={5} placeholder="Mô tả chi tiết công việc, nhiệm vụ chính..." className="rounded-lg" />
                        </Form.Item>

                        <Form.Item name="requirement" label={<span className="font-medium text-gray-700">Yêu cầu ứng viên</span>} rules={[{ required: true, message: 'Nhập yêu cầu' }]}>
                            <Input.TextArea rows={5} placeholder="Yêu cầu kinh nghiệm, kỹ năng, thái độ..." className="rounded-lg" />
                        </Form.Item>

                        <Form.Item name="benefit" label={<span className="font-medium text-gray-700">Quyền lợi</span>} rules={[{ required: true, message: 'Nhập quyền lợi' }]}>
                            <Input.TextArea rows={5} placeholder="Phúc lợi, lương thưởng, môi trường làm việc..." className="rounded-lg" />
                        </Form.Item>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                        <Button size="large" onClick={() => navigate('/hr/jobs-management')} className="rounded-xl w-full sm:w-auto order-2 sm:order-1 font-medium">Hủy</Button>
                        <Button type="primary" size="large" htmlType="submit" loading={loading} className="rounded-xl w-full sm:w-auto order-1 sm:order-2 bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md">
                            {isEditMode ? 'Cập nhật tin tuyển dụng' : 'Đăng tin ngay'}
                        </Button>
                    </div>
                </Form>
            </Card>

            <style>{`
                .job-form-responsive .ant-form-item-label > label {
                    font-size: 14px;
                }
                @media (max-width: 640px) {
                    .job-form-responsive .ant-form-item {
                        margin-bottom: 20px;
                    }
                    .job-form-responsive .ant-form-item-label {
                        padding-bottom: 4px;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobForm;