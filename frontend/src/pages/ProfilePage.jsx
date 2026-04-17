import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCamera,
  FiCalendar,
  FiLock,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSave,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const initials = useMemo(() => {
    const source = (profile?.name || user?.name || '').trim();
    if (!source) return 'U';
    const parts = source.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [profile?.name, user?.name]);

  const hasProfileChanges = useMemo(() => {
    if (!profile) return false;
    return (
      (profileForm.name || '').trim() !== (profile.name || '').trim() ||
      (profileForm.phone || '').trim() !== (profile.phone || '').trim() ||
      (profileForm.bio || '').trim() !== (profile.bio || '').trim()
    );
  }, [profile, profileForm.bio, profileForm.name, profileForm.phone]);

  const joinedDate = useMemo(() => {
    if (!profile?.created_at) return 'Recently joined';
    return new Date(profile.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [profile?.created_at]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/users/profile');
        const loaded = data.user;
        setProfile(loaded);
        setProfileForm({
          name: loaded?.name || '',
          phone: loaded?.phone || '',
          bio: loaded?.bio || '',
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load your profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const mergeUserState = (nextUser) => {
    setProfile(nextUser);
    updateUser({
      ...user,
      id: nextUser.id,
      name: nextUser.name,
      email: nextUser.email,
      role: nextUser.role,
      phone: nextUser.phone,
      bio: nextUser.bio,
      avatar_url: nextUser.avatar_url,
      created_at: nextUser.created_at,
    });
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetProfile = () => {
    if (!profile) return;
    setProfileForm({
      name: profile.name || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setAvatarFile(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please select a JPG, PNG, or WEBP image');
      e.target.value = '';
      setAvatarFile(null);
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast.error('Profile picture must be 2MB or smaller');
      e.target.value = '';
      setAvatarFile(null);
      return;
    }

    setAvatarFile(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSavingProfile(true);
    const toastId = toast.loading('Saving profile...');
    try {
      const payload = {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        bio: profileForm.bio.trim(),
      };
      const { data } = await axiosClient.put('/users/profile', payload);
      mergeUserState(data.user);
      toast.success('Profile updated successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile', { id: toastId });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Please select an image first');
      return;
    }

    setSavingAvatar(true);
    const toastId = toast.loading('Uploading profile picture...');
    try {
      const payload = new FormData();
      payload.append('avatar', avatarFile);
      if (token) {
        payload.append('token', token);
      }

      const { data } = await axiosClient.put('/users/profile/avatar', payload, {
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
            'x-access-token': token,
          }
          : undefined,
      });
      mergeUserState(data.user);
      setAvatarFile(null);
      toast.success('Profile picture updated', { id: toastId });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 400 && message) {
        toast.error(message, { id: toastId });
      } else {
        toast.error(message || 'Could not update profile picture', { id: toastId });
      }
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!profile?.avatar_url) {
      toast.error('No profile picture to remove');
      return;
    }

    setRemovingAvatar(true);
    const toastId = toast.loading('Removing profile picture...');
    try {
      const { data } = await axiosClient.delete('/users/profile/avatar');
      mergeUserState(data.user);
      setAvatarFile(null);
      toast.success('Profile picture removed', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove profile picture', { id: toastId });
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSavingPassword(true);
    const toastId = toast.loading('Changing password...');
    try {
      await axiosClient.put('/users/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Password changed successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password', { id: toastId });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
        >
          <FiArrowLeft />
          Back to dashboard
        </button>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#101010] dark:via-[#151515] dark:to-[#101010] border border-slate-700/60 mb-6 p-6 sm:p-8">
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile avatar"
                  className="w-16 h-16 rounded-2xl object-cover border border-white/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center text-xl font-semibold">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-slate-200 text-sm uppercase tracking-[0.2em] mb-1">Your Profile</p>
                <h1 className="text-2xl sm:text-3xl font-semibold text-white">{profile?.name || 'User'}</h1>
                <p className="text-slate-300 text-sm mt-1">Manage your identity, photo, and account security from one place.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <p className="text-slate-300">Role</p>
                <p className="text-white font-semibold capitalize">{profile?.role || 'buyer'}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <p className="text-slate-300">Email</p>
                <p className="text-white font-semibold truncate">{profile?.email || '-'}</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <p className="text-slate-300 inline-flex items-center gap-1"><FiCalendar /> Joined</p>
                <p className="text-white font-semibold">{joinedDate}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
          <section className="rounded-3xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 h-fit">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Profile Picture</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs px-3 py-1 font-medium">
                <FiCheckCircle /> Live
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile avatar"
                  className="w-20 h-20 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xl font-semibold">
                  {initials}
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{profile?.email}</p>
                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 capitalize">Role: {profile?.role || 'buyer'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload new picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-700 dark:text-slate-300 rounded-xl text-sm file:mr-3 file:border-0 file:bg-blue-50 file:text-blue-700 file:px-3 file:py-1.5 file:rounded-lg"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Use JPG/PNG/WEBP and keep size under 2MB.</p>
              {avatarFile && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Selected: {avatarFile.name}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              <button
                type="button"
                onClick={handleAvatarUpload}
                disabled={savingAvatar || removingAvatar}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                <FiCamera className="text-base" />
                {savingAvatar ? 'Uploading...' : 'Update Picture'}
              </button>
              <button
                type="button"
                onClick={handleAvatarRemove}
                disabled={removingAvatar || savingAvatar || !profile?.avatar_url}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                <FiTrash2 className="text-base" />
                {removingAvatar ? 'Removing...' : 'Remove Picture'}
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Profile Details</h2>
                {hasProfileChanges && (
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                    Unsaved changes
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="text-slate-400" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileInputChange}
                      className="w-full pl-12 pr-5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-slate-400" />
                    </span>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-300 rounded-xl text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiPhone className="text-slate-400" />
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileInputChange}
                      placeholder="Optional"
                      className="w-full pl-12 pr-5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileInputChange}
                    rows={4}
                    placeholder="Tell us a bit about you"
                    className="w-full px-5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResetProfile}
                  disabled={savingProfile || !hasProfileChanges}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-60 mr-2"
                >
                  <FiRefreshCw className="text-base" />
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={savingProfile || !hasProfileChanges}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  <FiSave className="text-base" />
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Change Password</h2>

              <form onSubmit={handlePasswordSave} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-slate-400" />
                    </span>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-12 pr-5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-slate-400" />
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-12 pr-5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-slate-400" />
                    </span>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={passwordForm.confirmNewPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-12 pr-5 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  <FiLock className="text-base" />
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  Use at least 6 characters and avoid reusing your previous password.
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;