import { useCallback, useEffect, useState } from "react"
import { UpdateProfileRequest, UserProfileResponse } from "../types/profile"
import ProfileService from "../services/profileService"
import { message } from "antd"
const useMyProfile = () => {
    const [profile, setProfile] = useState<UserProfileResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fetchProfile = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await ProfileService.getMyProfile();
            setProfile(response.data);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Không thể tải thông tin cá nhân')
        } finally {
            setLoading(false)
        }
    }, [])
    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])
    const updateProfile = async (data: UpdateProfileRequest): Promise<boolean> => {
        setUpdating(true)
        try {
            const response = await ProfileService.updateProfile(data);
            setProfile(response.data);
            message.success('Cập nhật thông tin thành công!')
            return true
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Cập nhật thất bại')
            return false
        } finally {
            setUpdating(false)
        }
    }
    return {
        profile,
        loading,
        updating,
        error,
        updateProfile,
        refetch: fetchProfile
    }
}
export default useMyProfile