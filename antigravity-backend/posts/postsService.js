
const supabase = require('../utils/supabaseClient');

const postsService = {
    async create(postData) {
        const { author_id, caption, media_url, type, shoot_type, brand_tag, photographer_tag, visibility } = postData;
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                author_id,
                caption,
                media_url,
                type: type || 'image',
                shoot_type,
                brand_tag,
                photographer_tag,
                visibility: visibility || 'public'
            }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(postId, authorId) {
        const { error } = await supabase
            .from('posts')
            .delete()
            .match({ id: postId, author_id: authorId });
        if (error) throw error;
        return true;
    }
};

module.exports = postsService;
