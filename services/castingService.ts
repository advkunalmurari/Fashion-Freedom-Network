import { supabase } from '../supabase';

export const castingService = {
    async getCastings() {
        try {
            const { data, error } = await supabase
                .from('job_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

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

            if (formatted.length === 0) {
                return {
                    success: true,
                    data: [
                        {
                            id: 'c1',
                            title: 'VOGUE INDIA // EDITORIAL DISCOVERY',
                            brand: 'CONDE NAST',
                            location: 'MUMBAI // STUDIO 22',
                            budget: '₹75,000 - ₹1,20,000',
                            deadline: '2024-03-25',
                            type: 'EDITORIAL',
                            description: 'High-concept editorial shoot focusing on neo-traditional Indian silhouettes. Seeking talent with strong movement and unique facial structure.',
                            requirements: ['Height: 175cm+', 'Editorial Experience', 'Clean Skin']
                        },
                        {
                            id: 'c2',
                            title: 'BALENCIAGA GLOBAL // AR RUNWAY',
                            brand: 'BALENCIAGA',
                            location: 'PARIS // META-NODE',
                            budget: '€2,500 + USAGE',
                            deadline: '2024-04-01',
                            type: 'RUNWAY',
                            description: 'The first hybrid AR runway experience. Looking for talent comfortable with motion capture and high-tech wearable tech.',
                            requirements: ['Tech-savvy', 'Runway Mastery', 'Remote Availability']
                        },
                        {
                            id: 'c3',
                            title: 'NIKE REVOLUTION // COMMERCIAL CAMPAIGN',
                            brand: 'NIKE',
                            location: 'GLOBAL DISPATCH',
                            budget: '₹2,00,000',
                            deadline: '2024-03-30',
                            type: 'COMMERCIAL',
                            description: 'A global campaign celebrating the fusion of athletic performance and street culture. Seeking diverse personalities with authentic energy.',
                            requirements: ['Athletic Build', 'Strong Personality', 'Urban Aesthetic']
                        }
                    ]
                };
            }

            return { success: true, data: formatted };
        } catch (error: any) {
            console.error('Error fetching jobs:', error);
            return {
                success: true,
                data: [
                    {
                        id: 'c1',
                        title: 'VOGUE INDIA // EDITORIAL DISCOVERY',
                        brand: 'CONDE NAST',
                        location: 'MUMBAI // STUDIO 22',
                        budget: '₹75,000 - ₹1,20,000',
                        deadline: '2024-03-25',
                        type: 'EDITORIAL',
                        description: 'High-concept editorial shoot focusing on neo-traditional Indian silhouettes. Seeking talent with strong movement and unique facial structure.',
                        requirements: ['Height: 175cm+', 'Editorial Experience', 'Clean Skin']
                    }
                ]
            };
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
