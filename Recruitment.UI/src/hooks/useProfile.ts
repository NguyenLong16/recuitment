import { useCallback, useEffect, useState } from "react"
import { UserProfileResponse } from "../types/profile"
import ProfileService from "../services/profileService"
import { message } from "antd"
import { useAppDispatch } from "./hook"
import { fetchNotification } from "../redux/slices/notificationSlice"

const useProfile = (userId: number) => {
    const dispatch = useAppDispatch()
    const [profile, setProfile] = useState<UserProfileResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [followLoading, setFollowLoading] = useState(false)

    const fetchProfile = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await ProfileService.getProfile(userId);
            setProfile(response.data);
        } catch (error: any) {
            setError(error?.response?.data?.message || 'Không thể tải thông tin cá nhân của bạn')
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            fetchProfile()
        }
    }, [userId, fetchProfile])

    const followHR = async () => {
        if (!profile) {
            return
        }

        setFollowLoading(true)
        try {
            await ProfileService.followHR(profile.id)
            setProfile(prev => prev ? { ...prev, isFollowing: true, followerCount: prev.followerCount + 1 } : null)
            message.success('Bạn đã theo dõi nhà tuyển dụng này!')
            // Refresh notifications để HR thấy thông báo mới
            dispatch(fetchNotification())
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Lỗi không thể theo dõi');
        } finally {
            setFollowLoading(false)
        }
    }

    const unfollowHR = async () => {
        if (!profile) return
        setFollowLoading(true)
        try {
            await ProfileService.unfollowHR(profile.id)
            setProfile(prev => prev ? { ...prev, isFollowing: false, followerCount: prev.followerCount - 1 } : null);
            message.success('Bạn đã bỏ theo dõi nhà tuyển dụng này!')
            // Refresh notifications để HR thấy thông báo unfollow
            dispatch(fetchNotification())
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Lỗi không thể bỏ theo dõi')
        } finally {
            setFollowLoading(false)
        }
    }
    return { profile, loading, error, followLoading, followHR, unfollowHR, refetch: fetchProfile };
}


export default useProfile
