import { supabase } from '../supabase';

export const castingService = {
    async getCastings() {
        try {
            const { data, error } = await supabase
                .from('job_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map the Supabase columns to the frontend expected format
            const formatted = data.map(job => ({
                id: job.id,
                title: job.title,
                brand: job.company_name,
                location: job.location,
                budget: job.budget,
                deadline: job.shoot_date,
                type: 'Casting Call',
                description: job.description,
                requirements: []
            }));

            return { success: true, data: formatted };
        } catch (error: any) {
            console.error('Error fetching jobs:', error);
            return { success: false, error: error.message };
        }
    },

    async postCasting(castingData: any) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const { data, error } = await supabase
                .from('job_posts')
                .insert([{
                    author_id: session.user.id,
                    company_name: castingData.companyName,
                    title: castingData.roleTitle,
                    talent_category: castingData.talentCategory,
                    location: castingData.location,
                    shoot_date: castingData.shootDate,
                    budget: castingData.budget,
                    description: castingData.description,
                    contact_email: castingData.contactEmail
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            console.error('Error posting job:', error);
            return { success: false, error: error.message };
        }
    },

    async applyToCasting(castingId: string, pitch: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const { data, error } = await supabase
                .from('job_applications')
                .insert([{
                    job_id: castingId,
                    applicant_id: session.user.id,
                    pitch: pitch
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            console.error('Error applying to job:', error);
            return { success: false, error: error.message };
        }
    }
};
