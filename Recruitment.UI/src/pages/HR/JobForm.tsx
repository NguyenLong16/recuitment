// src/pages/HR/JobForm.tsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message, Card, Spin, Alert, Upload, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
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

    // State riêng của form
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [jobData, setJobData] = useState<JobResponse | null>(null);
    const [mappingWarnings, setMappingWarnings] = useState<string[]>([]);

    // Upload state: Lưu file gốc (không upload ngay)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

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
                companyName: job.companyName || '',
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
                companyName: values.companyName || '',
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
            <Card>
                <div className="flex justify-center py-10">
                    <Spin size="large" tip={masterLoading ? "Đang tải dữ liệu danh mục..." : "Đang tải thông tin job..."} />
                </div>
            </Card>
        );
    }

    return (
        <Card title={isEditMode ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"} className="shadow-md">
            {/* Warnings */}
            {mappingWarnings.length > 0 && (
                <Alert
                    message="Cảnh báo tải dữ liệu"
                    description={
                        <ul className="list-disc ml-4">
                            {mappingWarnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    }
                    type="warning"
                    showIcon
                    closable
                    className="mb-4"
                />
            )}

            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ jobType: [JobType.FullTime] }}>
                <Form.Item name="title" label="Tiêu đề công việc" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                    <Input placeholder="Ví dụ: Senior React Developer" />
                </Form.Item>

                {/* THÊM: Form.Item cho companyName */}
                <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}>
                    <Input placeholder="Tên công ty tuyển dụng" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="categoryId" label="Ngành nghề" rules={[{ required: true, message: 'Chọn ngành nghề' }]}>
                        <Select placeholder="Chọn ngành nghề" disabled={categories.length === 0}>
                            {categories.map(c => (
                                <Option key={c.id} value={c.id}>{c.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="locationId" label="Địa điểm" rules={[{ required: true, message: 'Chọn địa điểm' }]}>
                        <Select placeholder="Chọn địa điểm" disabled={locations.length === 0}>
                            {locations.map(l => (
                                <Option key={l.id} value={l.id}>{l.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="salaryMin" label="Lương tối thiểu (VND)">
                        <InputNumber
                            className="w-full"
                            min={0}
                            formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                            parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as 0}
                            placeholder="0"
                        />
                    </Form.Item>
                    <Form.Item name="salaryMax" label="Lương tối đa (VND)">
                        <InputNumber
                            className="w-full"
                            min={0}
                            formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                            parser={(value) => (value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0) as 0}
                            placeholder="0"
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="jobType"
                        label="Loại hình công việc"
                        rules={[{ required: true, message: 'Chọn ít nhất 1 loại hình' }]}
                    >
                        <Select mode="multiple" placeholder="Chọn loại hình công việc" allowClear>
                            <Option value={JobType.FullTime}>Toàn thời gian</Option>
                            <Option value={JobType.PartTime}>Bán thời gian</Option>
                            <Option value={JobType.Internship}>Thực tập</Option>
                            <Option value={JobType.Contract}>Hợp đồng</Option>
                            <Option value={JobType.Remote}>Làm việc từ xa</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="deadline"
                        label="Hạn nộp hồ sơ"
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
                            format="DD/MM/YYYY"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="skillIds"
                    label="Kỹ năng yêu cầu"
                    rules={[{ required: true, message: 'Chọn ít nhất 1 kỹ năng' }]}
                >
                    <Select mode="multiple" placeholder="Chọn kỹ năng" disabled={skills.length === 0}>
                        {skills.map(s => (
                            <Option key={s.id} value={s.id}>{s.skillName || 'Unknown'}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* THÊM: Hidden field cho imageUrl cũ (edit mode) */}
                <Form.Item name="imageUrl" style={{ display: 'none' }}>
                    <Input type="hidden" />
                </Form.Item>

                {/* Upload ảnh: BỎ name="imageFile" (không cần, vì gộp) */}
                <Form.Item label="Ảnh minh họa job" rules={[{ required: false }]}>
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>
                            Click hoặc kéo thả ảnh (upload khi submit)
                        </Button>
                    </Upload>
                    <div className="text-gray-500 text-sm mt-1">Hỗ trợ JPG/PNG/GIF, max 5MB. Ảnh sẽ upload khi lưu form.</div>
                </Form.Item>

                <Form.Item name="description" label="Mô tả công việc" rules={[{ required: true, message: 'Nhập mô tả' }]}>
                    <Input.TextArea rows={4} placeholder="Mô tả chi tiết công việc..." />
                </Form.Item>

                <Form.Item name="requirement" label="Yêu cầu ứng viên" rules={[{ required: true, message: 'Nhập yêu cầu' }]}>
                    <Input.TextArea rows={4} placeholder="Yêu cầu kinh nghiệm, kỹ năng..." />
                </Form.Item>

                <Form.Item name="benefit" label="Quyền lợi" rules={[{ required: true, message: 'Nhập quyền lợi' }]}>
                    <Input.TextArea rows={4} placeholder="Phúc lợi, lương thưởng..." />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={() => navigate('/hr/jobs-management')}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isEditMode ? 'Cập nhật' : 'Đăng tin'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default JobForm;