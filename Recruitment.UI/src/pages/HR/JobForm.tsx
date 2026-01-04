// src/pages/HR/JobForm.tsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message, Card, Spin, Alert, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload/interface';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { JobType, JobResponse, Location, Category, Skill, JobFormValues } from '../../types/job';
import JobService from '../../services/jobService';

const { Option } = Select;

const JobForm = () => {
    const [form] = Form.useForm<JobFormValues>();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // State với proper types
    const [locations, setLocations] = useState<Location[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [jobData, setJobData] = useState<JobResponse | null>(null);
    const [mappingWarnings, setMappingWarnings] = useState<string[]>([]);

    // Upload state
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    // useEffect 1: Fetch Master Data
    useEffect(() => {
        const fetchMasterData = async () => {
            setLoading(true);
            try {
                console.log('Fetching master data...');

                const locRes = await JobService.getLocation().catch(err => {
                    console.error('Location API error:', err);
                    return { data: [] };
                });
                const catRes = await JobService.getCategory().catch(err => {
                    console.error('Category API error:', err);
                    return { data: [] };
                });
                const skillRes = await JobService.getSkills().catch(err => {
                    console.error('Skills API error:', err);
                    return { data: [] };
                });

                const locs: Location[] = Array.isArray(locRes.data) ? locRes.data : [];
                const cats: Category[] = Array.isArray(catRes.data) ? catRes.data : [];
                const sks: Skill[] = Array.isArray(skillRes.data) ? skillRes.data : [];

                setLocations(locs);
                setCategories(cats);
                setSkills(sks);

                console.log('Master data loaded:', {
                    locations: locs.length,
                    categories: cats.length,
                    skills: sks.length,
                });

                if (locs.length === 0 || cats.length === 0 || sks.length === 0) {
                    message.warning('Dữ liệu danh mục rỗng, kiểm tra API!');
                }
            } catch (error) {
                console.error('Master data error:', error);
                message.error('Không thể tải dữ liệu danh mục.');
                setMappingWarnings(prev => [...prev, 'Lỗi tải master data']);
            } finally {
                setLoading(false);
            }
        };

        fetchMasterData();
    }, []);

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

            // Pre-load image nếu có
            if (job.imageFile) {
                const API_BASE = 'https://localhost:7016';
                const imagePreviewUrl = job.imageFile.startsWith('http')
                    ? job.imageFile
                    : `${API_BASE}${job.imageFile}`;

                setFileList([{
                    uid: '-1',
                    name: 'Ảnh hiện tại',
                    status: 'done',
                    url: imagePreviewUrl,
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
                        normalizeName(s.skillName || s.name) === normalizeName(skillName)
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
                imageFile: job.imageFile || '',
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

    // Upload props
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        listType: 'picture',
        fileList,
        customRequest: async ({ file, onSuccess, onError, onProgress }) => {
            const formFile = file as RcFile;

            // Client validate
            if (formFile.size > 5 * 1024 * 1024) {
                message.error('File quá lớn (max 5MB)');
                onError?.(new Error('Size too large'));
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(formFile.type)) {
                message.error('Chỉ hỗ trợ JPG, PNG, GIF');
                onError?.(new Error('Type not allowed'));
                return;
            }

            setUploading(true);
            try {
                onProgress?.({ percent: 0 });

                const res = await JobService.uploadJobImage(formFile);
                console.log('Upload response:', res.data);

                // API trả về relative path, cần ghép với base URL 
                const relativePath = res.data.url;
                const API_BASE = 'https://localhost:7016'; // Base URL của backend (không có /api)
                const fullImageUrl = relativePath.startsWith('http')
                    ? relativePath
                    : `${API_BASE}${relativePath}`;

                onProgress?.({ percent: 100 });
                onSuccess?.('ok');

                // Update fileList với full URL để preview
                const newFileList: UploadFile[] = [{
                    uid: Date.now().toString(),
                    name: formFile.name,
                    status: 'done',
                    url: fullImageUrl,
                }];
                setFileList(newFileList);

                // Set relative path vào form (để gửi lên backend)
                form.setFieldsValue({ imageFile: relativePath });

                message.success('Upload thành công!');
                console.log('Image URL:', fullImageUrl);
            } catch (error: unknown) {
                onProgress?.({ percent: 0 });
                onError?.(error as Error);
                const err = error as { response?: { data?: { message?: string } } };
                message.error(err.response?.data?.message || 'Upload thất bại');
            } finally {
                setUploading(false);
            }
        },
        onRemove: () => {
            const confirm = window.confirm('Xóa ảnh này?');
            if (confirm) {
                setFileList([]);
                form.setFieldsValue({ imageFile: undefined });
            }
            return confirm;
        },
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
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

            // Lấy imageFile trực tiếp từ form để đảm bảo có giá trị
            const currentImageFile = form.getFieldValue('imageFile');
            console.log('Current imageFile value:', currentImageFile);

            const payload = {
                ...values,
                jobType: jobTypeValue,
                companyName: values.companyName || '',
                imageFile: currentImageFile || values.imageFile || '', // Đảm bảo gửi imageFile
                deadline: deadlineValue
                    ? deadlineValue.format('YYYY-MM-DD')
                    : dayjs().add(30, 'day').format('YYYY-MM-DD'),
                salaryMin: values.salaryMin || 0,
                salaryMax: values.salaryMax || 0,
            };

            console.log('Submit payload:', payload);

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
        }
    }, [isEditMode, form]);

    // Spinner chỉ cho fetch job (edit mode)
    if (isEditMode && fetchLoading) {
        return (
            <Card>
                <div className="flex justify-center py-10">
                    <Spin size="large" tip="Đang tải thông tin job..." />
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
                            <Option value={JobType.Remote}>Làm việc từ xa</Option>
                            <Option value={JobType.Internship}>Thực tập</Option>
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
                            <Option key={s.id} value={s.id}>{s.skillName || s.name || 'Unknown'}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Upload ảnh */}
                <Form.Item
                    name="imageFile"
                    label="Ảnh minh họa job"
                    rules={[{ required: false }]}
                >
                    <Upload {...uploadProps} showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}>
                        <Button icon={<UploadOutlined />} loading={uploading}>
                            Click hoặc kéo thả ảnh
                        </Button>
                        <div className="text-gray-500 text-sm mt-1">Hỗ trợ JPG/PNG/GIF, max 5MB</div>
                    </Upload>
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