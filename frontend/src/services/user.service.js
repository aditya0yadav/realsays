import api from './api';

const userService = {
    /**
     * Get user profile info
     */
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    /**
     * Get consolidated user profile summary
     */
    getProfileSummary: async () => {
        const response = await api.get('/user/summary');
        return response.data;
    },

    /**
     * Update user avatar
     * @param {File} file - The image file to upload
     */
    updateAvatar: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default userService;
